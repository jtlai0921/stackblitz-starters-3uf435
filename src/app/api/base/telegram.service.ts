/**
 * API Send: API的請求處理
 * 專門處理連線事項
 * api等畫面控制處理請在api-base.service.ts處理
 * 
 * [步驟]
 * 1. 通訊檢核
 * 1.1 Client Network Check
 * 1.2 Server Allow Check (verifyServer)
 * 
 * 2. Challange Response
 * 2.1 check is on Challange Response
 * 2.2 modify request object (with http header and data token modify)
 * (step 2 exception):
 * 2.E.1 do Challange Response (if not have, lock and do Challange Response!!)
 * 
 * 3. 傳送資料準備
 * 
 * 4. 資料傳送
 * 4.1 encode request
 * 4.2 post data (or simulation)
 * 4.3 decode response
 * 4.4 set response
 * (step 4 exception): 
 * 4.E.1. check is maintain time
 * 4.E.2. check post is not timeout!!!!!!!!!!!
 * 
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { environment } from 'environments/environment';
// -- angular lib -- //
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

// -- Request Options -- //
import { TelegramOption } from '@api/base/options/telegram-option';
import { ApiRequestOption } from './options/api-request-option';
// -- Reponse Options -- //
import { ApiResponseOption } from './options/api-response-option';
// -- connect Library -- //
import { CheckMaintainService } from '@lib/network/check-maintain.service';
import { CheckNetworkService } from '@lib/network/check-network.service';
import { ChallengeResponseService } from './challenge-response.service';
// import { HTTP_SERVER_STOP_LIST, HTTP_SERVER_TIMEOUT_LIST } from '@conf/http-status';
// -- Other Library -- //
import { FormateService } from '@template/formate/formate.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { SimulationService } from '@simulation/simulation.service';
import { LanguageChangeService } from '@systems/system/language/language-change.service';
import { DeviceService } from '@lib/device/device.service';
import { AuthService } from '@systems/system/auth/auth.service';

@Injectable({
    // 全ＡＰＰ只有一個
    providedIn: 'root'
})
export class TelegramService {
    constructor(
        private _logger: Logger,
        private httpClient: HttpClient,
        private checkMaintainService: CheckMaintainService,
        private checkNetworkService: CheckNetworkService,
        private crService: ChallengeResponseService,
        protected errorHandler: HandleErrorService,
        private _formateService: FormateService,
        private _simulation: SimulationService,
        private auth: AuthService,
        // data
        private _language: LanguageChangeService,
        private _deviceInfo: DeviceService
    ) {

    }

    /**
     * 發送api (主要功能請求api)
     * @param serviceId 
     * @param data 
     * @param options 
     */
    async send(serviceId: string, data: ApiRequestOption, options: TelegramOption): Promise<any> {
        try {
            this._logger.step('TelegramBase', 'TelegramService start(id,req,option)', serviceId
                , this._formateService.transClone(data), this._formateService.transClone(options));
            // 暫存
            data.setTelegramObj({
                'serviceId': serviceId,
                'options': options
            });

            // [STEP 1] check network, 停機公告 => error will output to catch
            this._logger.step('TelegramBase', 'Step 1: do checkNetwork', serviceId);
            const check_network = await this.checkNetwork(serviceId);
            // [STEP 2] do chellenge response encode, 停機公告 => error will output to catch
            this._logger.step('TelegramBase', 'Step 2: do checkChallengeResponse', serviceId);
            const check_cr_allow = await this.checkChallengeResponse(data);
            // [STEP 3] post data modify
            this._logger.step('TelegramBase', 'Step 3: modify data', serviceId);
            const reqData = await this.modifyReqData(data);

            // [STEP 4] post data (encode > post > decode), 停機公告 => error will output to catch
            this._logger.step('TelegramBase', 'Step 4: do sendApi', serviceId);
            const resData = await this.sendApi(reqData);
            // [STEP 5] set response obje: when all step resolve
            this._logger.step('TelegramBase', 'TelegramService', 'Send End', this._formateService.transClone(resData));
            let resObj: ApiResponseOption = this.modifyResponse(resData);
            return Promise.resolve(resObj);
        } catch (exceptionObj) {
            this._logger.step('Telegram', 'TelegramService', 'Error Final End', this._formateService.transClone(exceptionObj));
            const errorException = this.errorHandler.getHandleErrorOption(exceptionObj);
            return Promise.reject(errorException);
        }
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * Step 1: 通訊檢核
     * 1.1 Client Network Check
     * 1.2 Server Allow Check (verifyServer)
     */
    private async checkNetwork(serviceId: string): Promise<any> {
        // this._logger.step('TelegramBase', 'Step 1: checkNetwork start', serviceId);
        try {
            // check device network
            this._logger.step('TelegramBase', 'Step 1.1: check client', serviceId);
            const check_client = await this.checkNetworkService.checkClient();
            this._logger.step('TelegramBase', 'Step 1.2: check server', serviceId);
            const check_server = await this.checkNetworkService.checkServer()
                .catch((postError) => {
                    // 伺服器連線error 檢核停機狀態
                    this._logger.step('TelegramBase', 'Step 1.3: check server maintain', serviceId);
                    return this.checkMaintain(postError, serviceId);
                });
            // when client and server all resolve!!!
            this._logger.step('TelegramBase', 'Step 1: checkNetwork success', serviceId);
            return Promise.resolve();
        } catch (errorNetwork) {
            this._logger.step('TelegramBase', 'Step 1: checkNetwork error end', errorNetwork);
            return Promise.reject(errorNetwork);
        }
    }

    /**
     * Step 2: 傳送資料準備
     * 2.1 check is on Challange Response (if not have, lock and do Challange Response!!)
     * 2.2 modify request object (with http header and data token modify)
     * (step 2 exception):
     * 2.E.1 do Challange Response (if not have, lock and do Challange Response!!)
     */
    private async checkChallengeResponse(reqObj: ApiRequestOption): Promise<any> {
        let serviceId = reqObj.getServiceId();
        this._logger.step('TelegramBase', 'Step 2: checkChallengeResponse start', serviceId);
        if (!environment.CHALLENGE_RESPONSE_FLAG) {
            this._logger.step('TelegramBase', 'Step 2: checkChallengeResponse success(close)', serviceId);
            return Promise.resolve();
        }
        try {
            // check device network
            this._logger.step('TelegramBase', 'Step 2.1: check handshake', serviceId);
            const allow_check = this.crService.checkAllow(serviceId)
                .catch((postError) => {
                    // 伺服器連線error 檢核停機狀態
                    this._logger.step('TelegramBase', 'Step 2.2: check server maintain', serviceId);
                    return this.checkMaintain(postError, serviceId);
                });
            // if (!allow_check) {

            // }
            // when all resolve!!!
            this._logger.step('TelegramBase', 'Step 2: checkChallengeResponse success', serviceId);
            return Promise.resolve();
        } catch (errorCR) {
            this._logger.step('TelegramBase', 'Step 2: checkChallengeResponse error end', errorCR);
            return Promise.reject(errorCR);
        }
    }


    /**
     * Step 3: 請求資料
     * 3.1 encode request
     * 3.2 post data (or simulation)
     * 3.3 decode response
     * 3.4 set response
     * 
     * (step 3 exception): 
     * 3.E.1. check is maintain time
     * 3.E.2. check post is not timeout!!!!!!!!!!!
     * @param serviceId 
     * @param reqObj 
     */
    private async modifyReqData(reqObj: ApiRequestOption): Promise<any> {
        try {
            let serviceId = reqObj.getServiceId();
            this._logger.step('TelegramBase', 'Step 3: modifyReqData start', serviceId);
            // const old_req = this._formateService.transClone(reqObj.getRequest());
            // this._logger.step('TelegramBase', 'Step 3: old req=>', old_req);
            let set_obj = {
                "requestId": "",
                "requestTime": "",
                "accessToken": "",
                "userId": "",
                "userName": "",
                "role": "",
                "userIp": "",
                "channel": "",
                "lang": "",
                "deviceId": "",
                "deviceOs": "",
                "deviceOsVer": "",
                "appMainVer": "",
                "appSubVer": ""
            };
            // 安控part
            // [TODO] 待確認request規格

            // 使用者資訊
            const auth_info = await this.getReqAuth();
            set_obj.accessToken = auth_info.accessToken;
            set_obj.userId = auth_info.userId;
            set_obj.userName = auth_info.userName;
            set_obj.role = auth_info.role;
            // 裝置&app資訊
            const device_info = await this.getReqDevice();
            set_obj.deviceId = device_info.deviceId;
            set_obj.deviceOs = device_info.deviceOs;
            set_obj.deviceOsVer = device_info.deviceOsVer;
            set_obj.appMainVer = device_info.appMainVer;
            set_obj.appSubVer = device_info.appSubVer;
            // 其他資訊
            set_obj.channel = 'MB'; // 固定（通路）
            // 自語系設定檔取得
            const lang_data = this._language.getNowLanguage();
            set_obj.lang = this._formateService.checkObjectList(lang_data, 'data.apiLang');
            // ip adress
            const ip_adree = await this.getReqUserIp();
            set_obj.userIp = ip_adree;
            // request unick number
            set_obj.requestId = this.getReqNumber(set_obj);
            // request time: yyyy-mm-dd HH:ii:ss
            set_obj.requestTime = this._formateService.transDate('NOW_TIME');
            reqObj.modifyReqBody(set_obj); // 設定進入req obj
            // this._logger.step('TelegramBase', 'Step 3: modify req=>', this._formateService.transClone(reqObj.getRequest()));
            return Promise.resolve(reqObj);
        } catch (errorInData) {
            this._logger.step('TelegramBase', 'Step 3: modifyReqData error end', errorInData);
            // return Promise.reject(errorInData);
            return this.errorHandler.returnError(errorInData, 'REQUEST_TOKEN_SET_ERROR');
        }
    }

    /**
     * Step 4: 請求資料
     * 4.1 encode request
     * 4.2 post data (or simulation)
     * 4.3 decode response
     * 4.4 set response
     * 
     * (step 3 exception): 
     * 4.E.1. check is maintain time
     * 4.E.2. check post is not timeout!!!!!!!!!!!
     * @param serviceId 
     * @param reqObj 
     */
    private async sendApi(reqObj: ApiRequestOption): Promise<any> {
        try {
            let serviceId = reqObj.getServiceId();
            this._logger.step('TelegramBase', 'Step 4: sendApi start', serviceId);
            const set_req = reqObj.getRequest();
            this._logger.step('Telegram', 'Step 4.1: Req Data=>', set_req);
            const encodeReq = await this.crService.encodeReq(set_req);
            this._logger.step('Telegram', 'Step 4.2: Post Data=>', encodeReq);
            const postRes = await this.post(encodeReq, reqObj)
                .catch((postError) => {
                    // 伺服器連線error 檢核停機狀態
                    this._logger.step('TelegramBase', 'Step 4.2: check server maintain', serviceId);
                    return this.checkMaintain(postError, serviceId);
                });
            this._logger.step('Telegram', 'Step 4.3: Res Data Decode=>', postRes);
            const decodeRes = await this.crService.decodeRes(postRes);

            return Promise.resolve(decodeRes);
        } catch (errorInSend) {
            this._logger.step('TelegramBase', 'Step 4: sendApi error end', errorInSend);
            return this.errorHandler.returnError(errorInSend, 'API_SEND_ERROR');
        }
    }

    /**
     * Step 4.2 傳送資料
     * @param reqObj 
     */
    private async post(encodeReq, reqObj: ApiRequestOption): Promise<any> {
        try {
            let serviceId = reqObj.getServiceId();
            this._logger.step('TelegramBase', 'Step 4.2: post start', serviceId);
            let reqOptions = this.getReqConnectOption();

            const domain_url = environment.SERVER_URL;
            const api_url = environment.API_URL;
            let set_url = [domain_url, api_url];
            // gayway沒有的暫時性處理
            set_url.push(serviceId.toLocaleUpperCase());

            let reqUrl = this._formateService.mappingUrl(set_url);
            this._logger.step('TelegramBase', 'Step 4.2: post url', reqUrl, reqOptions);

            let timeout_data = environment.HTTP_TIMEOUT;
            // [TODO] timeout必須審視！！！！！
            if (environment.ONLINE) {
                return this.httpClient.post(
                    reqUrl,
                    encodeReq,
                    reqOptions
                ).pipe(timeout(timeout_data)).toPromise();
                // [TODO] 
                // 處理http status
                // HTTP_SERVER_STOP_LIST
            } else {
                return this.simulation(reqObj);
            }
        } catch (errorInPost) {
            this._logger.step('TelegramBase', 'Step 4.2: post error end', errorInPost);
            return this.errorHandler.returnError(errorInPost, 'API_POST_ERROR');
        }
    }

    /**
     * 停機公告檢核
     */
    private checkMaintain(err, serviceId): Promise<any> {
        this._logger.step('Telegram', 'checkMaintain', serviceId, this._formateService.transClone(err));
        return this.checkMaintainService.checkIsMaintain('server', err).then(
            (checkIsMaintain_S) => {
                // is not maintain
                this._logger.step('Telegram', 'Not Maintain', checkIsMaintain_S);
                // this._logger.log('Not Maintain', this._formateService.transClone(checkIsMaintain_S));
                return this.errorHandler.returnError(checkIsMaintain_S, 'SERVER_MAINTAIN');
            },
            (checkIsMaintain_E) => {
                // is maintain
                this._logger.step('Telegram', 'Is Maintain', checkIsMaintain_E);
                // this._logger.log('Is Maintain', this._formateService.transClone(checkIsMaintain_E));
                return this.errorHandler.returnError(checkIsMaintain_E, 'SERVER_MAINTAIN');
            });
    }

    /**
     * 產生request唯一序號
     * [TODO]
     */
    private getReqNumber(set_obj: object): string {
        let output = '';

        function s4() {
            // len: 4
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        // random str len: 16
        output = s4() + s4() + s4() + s4();
        const now_time = new Date().getTime().toString();
        output += now_time; // len: 13
        // all len: 
        // this._logger.log(output.length);
        return output;
    }

    /**
     * 取得ip位置
     * [TODO]
     */
    private getReqUserIp(): Promise<string> {
        this._logger.step('TelegramBase', 'Step 3: get Ip adress');
        if (environment.ONLINE) {
            // [TODO] 不可對外連線取得，待中台確認是否要此欄位
            // cordova-plugin-networkinterface
            // cordova-plugin-android-wifi-manager
            // 每次載入還是變相載入
            return Promise.resolve('');
        } else {
            // [Development]:
            return Promise.resolve('127.0.0.1');
        }
    }

    /**
     * 取得裝置資訊
     * [TODO]
     */
    private getReqDevice(): Promise<any> {
        this._logger.step('TelegramBase', 'Step 3: get device');
        let output = {
            "deviceId": "",
            "deviceOs": "",
            "deviceOsVer": "",
            "appMainVer": "",
            "appSubVer": ""
        };

        // 去 deviceService 取東西([TODO])

        output.deviceId = ''; // 自device取得
        output.deviceOs = ''; // 自device取得
        output.deviceOsVer = ''; // 自device取得
        output.appMainVer = ''; // 自device取得
        output.appSubVer = ''; // 自device取得

        return Promise.resolve(output);
    }

    /**
     * 取得auth資料
     * [TODO]
     */
    private getReqAuth(): Promise<any> {
        this._logger.step('TelegramBase', 'Step 3: get auth');
        let output = {
            "accessToken": "",
            "userId": "",
            "userName": "",
            "role": ""
        };
        output.accessToken = this.auth.getAccessToken(); // 自auth取得
        output.userId = this.auth.getUserId(); // 自auth取得
        if (!!environment['OPEN_LOGIN']) {
            output.userId = 'A120552926';
        }
        output.userName = this.auth.getUserName(); // 自auth取得
        output.role = this.auth.getRole(); // 自auth取得
        return Promise.resolve(output);
    }

    /**
     * 取得HTTP Request Header object
     */
    private getReqConnectOption() {
        let header_data = new HttpHeaders();
        header_data.set('Content-type', 'application/json; charset=UTF-8');
        const ch_header_data = this.crService.getToken();
        let tmp_index: any;
        for (tmp_index in ch_header_data) {
            if (!ch_header_data.hasOwnProperty(tmp_index)) {
                continue;
            }
            header_data.set(tmp_index, ch_header_data[tmp_index]);
        }
        let output = {
            headers: header_data
        };
        return output;
    }


    /**
     * 回傳物件資料格式整理
     * @param jsonObj Server回傳內容
     */
    private modifyResponse(jsonObj: object): ApiResponseOption {
        let resObj = new ApiResponseOption(jsonObj);
        return resObj;
    }

    /**
     * 模擬程式載入
     * @param reqObj 
     */
    private simulation(reqObj: ApiRequestOption): Promise<any> {
        let serviceId = reqObj.getServiceId();
        return this._simulation.getResponse(serviceId, reqObj);
    }
}





    // /**
    //  * 發送Http Request
    //  * 依設定直接發送或取得模擬資料
    //  * @param serviceId 電文ID
    //  * @param data 上行資料
    //  * @param options 選
    //  */
    // send(serviceId: string, data?: any, options?: TelegramOption): Promise<T> {
    //     return this.handshake.send(serviceId, data, header).then((res) => {
    //       this._logger.step('Telegram', 'handshake send end', serviceId, this._formateService.transClone(res));
    //       this._logger.step('Telegram', 'handshake send str', JSON.stringify(res));
    //       this.loading.hide(serviceId);
    //       this.cahceRes(serviceId, data, res, options);
    //       return res;
    //     });
    // }

    // /**
    //  * 暫存回傳資料
    //  * @param serviceId serviceId
    //  * @param data 上行data
    //  * @param res 回傳res
    //  * @param options TelegramOption
    //  */
    // private cahceRes(serviceId: string, data: any, res: any, options: TelegramOption) {
    //   if (!!options && !!options.useCache) {
    //     this.cache.save(serviceId + ':' + JSON.stringify(data), this._formateService.transClone(res), options.cacheOpt);
    //   }
    // }

    // /**
    //  * 發送AJAX請求(for Simulation)
    //  * @param apiUrl API名稱
    //  * @param data 上傳資料
    //  */
    // private post(serviceId: string, body: object = {}, header?: ReqHeaderOption): Promise<any> {
    //   // devicesInfo['serviceId'] = serviceId;
    //   const devicesInfo = {
    //     'udid': 'device.uuid',
    //     'appuid': 'device.appinfo.identifier',
    //     'model': 'device.model',
    //     'platform': 'android',
    //     'osversion': '9.8.7',
    //     'appversion': '3.14',
    //     'appinfo': { 'version': '' },
    //     'name': 'simulation',
    //     'manufacturer': 'device.manufacturer',
    //     'hack': false,
    //     'pushon': true,
    //     'tokenid': '123'
    //   };
    //   devicesInfo['serviceId'] = serviceId;
    //   // logger.debug('devicesInfo:' + JSON.stringify(devicesInfo));
    //   // let headerobj = JsonConvertUtil.setTelegramHeader(devicesInfo);
    //   // headerobj = { ...headerobj, ...header };
    //   // // logger.debug('headerobj:' + JSON.stringify(headerobj));
    //   // const jsonObj = JsonConvertUtil.converToXmlJson(serviceId, body, headerobj);
    //   // this._logger.step('Telegram', 'post start (simulation)', JSON.stringify(jsonObj));
    //   // return this.http.post(
    //   //   `${environment.SERVER_URL}/${serviceId}`,
    //   //   JSON.stringify(jsonObj)
    //   // ).pipe(timeout(environment.HTTP_TIMEOUT)).toPromise();
    //   return Promise.resolve();
    // }



    // send(data: Request, option?: TelegramOption): Promise<any> {
    //     return this.telegram.send(this.serviceId, data, option)
    //         .then((returnDataDecryptRes) => {
    //             // logger.debug('ok1:', returnDataDecryptRes);
    //             logger.debug('ok2:', JSON.stringify(returnDataDecryptRes));
    //             const tempData: any = returnDataDecryptRes;  // HSMerr {'error': 'HSM error', 'result': '-401'};
    //             // logger.debug('ok22:', JSON.stringify(tempData));
    //             let tempWord = '';
    //             if (typeof tempData.value !== 'undefined') {
    //                 tempWord = tempData.value;
    //                 tempWord = tempWord.replace(/[\n\t\r]/g, ''); // 去除\n \t
    //             } else if (!!tempData.error) {
    //                 const err = new HandleErrorOptions(tempData.error, 'ERROR.TITLE');
    //                 err.resultCode = tempData.result;
    //                 return Promise.reject(err);
    //                 // return this.errorHandler.handleError(err).then(() => {
    //                 //   // 將錯誤回傳給API Service
    //                 //   return Promise.reject(err);
    //                 // });
    //                 // return Promise.reject(err);
    //             }
    //             const prePaJsonObj = (typeof tempData.value !== 'undefined') ? JSON.parse(tempWord) : tempData;
    //             // 打開ok3註解可以顯示下行電文內容
    //             // 然後把正式環境電文內容貼到模擬電文的body裡面
    //             // logger.debug('ok3:' + JSON.stringify(prePaJsonObj));
    //             let paJsonObj: object;
    //             try {
    //                 paJsonObj = JsonConvertUtil.converFromXmlJson(prePaJsonObj); // 重新整理res
    //             } catch (error) {
    //                 let err = new HandleErrorOptions();
    //                 err = { ...err, ...(SystemError.DATA_FORMAT_ERROR) };
    //                 return Promise.reject(err);
    //             }
    //             // logger.debug('ok4:', paJsonObj );
    //             // logger.debug('ok5:', JSON.stringify(paJsonObj) );
    //             // logger.debug('typeof prePaJsonObj.MNBResponse.result:' + typeof prePaJsonObj.MNBResponse.result);
    //             // logger.debug('typeof prePaJsonObj.MNBResponse.failure:' + typeof prePaJsonObj.MNBResponse.failure);
    //             if (!!prePaJsonObj.MNBResponse && typeof prePaJsonObj.MNBResponse.result === 'object') {
    //                 // logger.debug('success');
    //                 return Promise.resolve(paJsonObj);
    //             } else if (!!prePaJsonObj.MNBResponse && typeof prePaJsonObj.MNBResponse.failure === 'object') {
    //                 // logger.debug('failure');
    //                 // TODO 回覆格式轉換為 HendleErrorOption
    //                 let err = new HandleErrorOptions(paJsonObj['body'].respCodeMsg, 'ERROR.TITLE');
    //                 err.resultCode = paJsonObj['body'].respCode;
    //                 err.resultData = paJsonObj;
    //                 return Promise.reject(err);
    //             } else if (!!prePaJsonObj.debugMessage && typeof prePaJsonObj.debugMessage !== 'undefined') {
    //                 // logger.debug('debugMessage');
    //                 // TODO 回覆格式轉換為 HendleErrorOption
    //                 let err = new HandleErrorOptions(paJsonObj['body'].respCodeMsg, 'ERROR.TITLE');
    //                 err.resultCode = paJsonObj['body'].respCode;
    //                 err.resultData = paJsonObj;
    //                 return Promise.reject(err);
    //             } else if (!!prePaJsonObj.fatalError && typeof prePaJsonObj.fatalError !== 'undefined') {
    //                 // logger.debug('fatalError');
    //                 // TODO 回覆格式轉換為 HendleErrorOption
    //                 let err = new HandleErrorOptions(paJsonObj['body'].respCodeMsg, 'ERROR.TITLE');
    //                 err.resultCode = paJsonObj['body'].respCode;
    //                 err.resultData = paJsonObj;
    //                 return Promise.reject(err);
    //             }
    //         })
    //         .catch(error => {
    //             logger.error('err: in apibase', JSON.parse(JSON.stringify(error)));
    //             let err;
    //             if (!!error && error.name === 'TimeoutError') {
    //                 // 回覆格式轉換為 HendleErrorOption
    //                 err = new HandleErrorOptions('ERROR.CONNECTION_TIMEOUT', 'ERROR.TITLE');
    //             } else if (!!error && !!error.body && !!error.body.respCodeMsg) {
    //                 // for 快速登入特殊錯誤訊息
    //                 if (error.body.respCode === 'ERRBI_0001') {
    //                     err = error;
    //                 } else if (error.body.respCode === 'ERRBI_0005') {
    //                     err = error;
    //                 } else {
    //                     err = new HandleErrorOptions(error.body.respCodeMsg, 'ERROR.TITLE');
    //                     err.resultCode = error.body.respCode;
    //                     err.resultData = error;
    //                 }
    //             } else if (!!error && error.content === 'ERROR.NO_NETWORK') {
    //                 // err = error;
    //                 err = new HandleErrorOptions('ERROR.NO_NETWORK', 'ERROR.TITLE');
    //             } else if (!!error && error.name === 'HttpErrorResponse') {
    //                 // err = new HandleErrorOptions('ERROR.NO_SERVICE', 'ERROR.TITLE');
    //                 let er_status = FieldUtil.checkField(error, 'status');
    //                 let error_list = HTTP_SERVER_STOP_LIST;
    //                 let timeout_error_list = HTTP_SERVER_TIMEOUT_LIST;
    //                 let error_code = er_status.toString();
    //                 if (error_list.indexOf(error_code) > -1) {
    //                     // 親愛的客戶您好，目前系統維護中，請稍後再試。造成您的不便，敬請見諒。
    //                     err = new HandleErrorOptions('ERROR.NO_SERVICE', 'ERROR.TITLE');
    //                     err.resultCode = error_code;
    //                     err.resultData = error;
    //                 } else if (timeout_error_list.indexOf(error_code) > -1) {
    //                     err = new HandleErrorOptions('ERROR.CONNECTION_TIMEOUT', 'ERROR.TITLE');
    //                     err.resultCode = error_code;
    //                     err.resultData = error;
    //                 } else {
    //                     // err = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(' + er_status + ')', 'ERROR.TITLE');
    //                     err = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。', 'ERROR.TITLE');
    //                     err.resultCode = er_status;
    //                     err.resultData = error;
    //                 }
    //             } else if (!err) {
    //                 err = error;
    //             }
    //             // 調整將錯誤統一回傳給Service處理
    //             return Promise.reject(err);
    //             // if (error.body.hasOwnProperty('certCheck') && error.body.certCheck === 'ERROR') {
    //             //   return Promise.reject(err);
    //             // } else {
    //             //   return this.errorHandler.handleError(err).then(() => {
    //             //     // 將錯誤回傳給API Service
    //             //     return Promise.reject(err);
    //             //   });
    //             // }

    //             // console.error(err);
    //             // // TODO 回覆格式轉換為 HendleErrorOption
    //             // const error = new HandleErrorOptions(err.body.respCodeMsg || 'ERROR.DATA_FORMAT_ERROR', 'ERROR.TITLE');
    //             // logger.debug(JSON.stringify(error));
    //             // return Promise.reject(error);
    //         });
    // }