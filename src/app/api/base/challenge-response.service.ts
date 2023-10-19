/**
 * Challenge Response 訊息傳輸處理
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { environment } from 'environments/environment';

// -- Config -- //
import { SESSION_STORAGE_NAME_LIST } from '@conf/security/storage-name';
// -- Options -- //
// -- storage Library -- //
import { SessionStorageService } from '@lib/storage/session-storage.service';
// -- Other Library -- //
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FormateService } from '@template/formate/formate.service';

@Injectable({
    // 全ＡＰＰ只有一個
    providedIn: 'root'
})
export class ChallengeResponseService {
    private isNeedHandshake: boolean;  // 判斷是否需要handshake
    private isDoingHandshake: boolean;  // 判斷是否已在執行handshake
    private _crName = SESSION_STORAGE_NAME_LIST.CHALLENGE;
    // 依照各種設定檔，定義CR要使用的資料
    private _crTokenNameList = {
        send_auth1: environment.AUTH_TOKEN_KEY,
        send_auth2: environment.AUTHORIZATION_KEY,
        save_auth1: SESSION_STORAGE_NAME_LIST.CHALLENGE_AUTH_1,
        save_auth2: SESSION_STORAGE_NAME_LIST.CHALLENGE_AUTH_2
    };
    // private reqUrl: string;
    // private retry: number;

    constructor(
        private _logger: Logger,
        private errorHandler: HandleErrorService,
        private _formateService: FormateService,
        private sessionStorage: SessionStorageService
    ) {
        this._init();
    }


    /**
     * 檢核challenge response是否正常
     * 若沒有做 會完成challenge response
     * @param serviceId api編號
     */
    async checkAllow(serviceId: string): Promise<any> {
        if (!environment.CHALLENGE_RESPONSE_FLAG) {
            this._logger.step('TelegramBase', 'Challenge Response close', serviceId);
            return Promise.resolve(true);
        }
        try {
            const need_do_flag = await this.waitHandshake(serviceId);
            if (!need_do_flag) {
                this._logger.step('TelegramBase', 'Challenge Response was finish', serviceId);
                return Promise.resolve(true);
            } else {
                // repeat to do challenge response
                this._logger.step('Telegram', 'Challenge Response do start', serviceId);
                const crData = await this.doChallenge(serviceId);
                this._logger.step('TelegramBase', 'Challenge Response finish', serviceId, crData);
                return Promise.resolve(true);
            }
        } catch (errorInCheckCR) {
            this._logger.step('TelegramBase', 'Challenge Response error', serviceId);
            let challenge_error = this.errorHandler.returnError(errorInCheckCR, 'CHALLENGE_RESPONSE_ERROR');
            return Promise.reject(challenge_error);
        }

    }

    /**
     * encode request
     * @param set_data 
     */
    async encodeReq(set_data: object): Promise<any> {
        let output: any = set_data;
        if (!environment.CHALLENGE_RESPONSE_FLAG) {
            this._logger.step('TelegramBase', 'CR E2EE request close');
            return Promise.resolve(output);
        }
        try {
            // [TODO] call plugin!!!! simu do in lib
            this._logger.step('TelegramBase', 'CR E2EE request', output);
            return Promise.resolve(output);
        } catch (errorInCheckCR) {
            this._logger.step('TelegramBase', 'CR E2EE request error');
            let challenge_error = this.errorHandler.returnError(errorInCheckCR, 'CHALLENGE_RESPONSE_REQ_ENCODE_ERROR');
            return Promise.reject(challenge_error);
        }
    }

    /**
     * decode response
     * @param set_data 
     */
    async decodeRes(set_data): Promise<any> {
        let output: any = set_data;
        if (!environment.CHALLENGE_RESPONSE_FLAG) {
            this._logger.step('TelegramBase', 'CR E2EE response close');
            return Promise.resolve(output);
        }
        try {
            // [TODO] call plugin!!!! simu do in lib
            this._logger.step('TelegramBase', 'CR E2EE response', output);
            return Promise.resolve(output);
        } catch (errorInCheckCR) {
            this._logger.step('TelegramBase', 'CR E2EE response error');
            let challenge_error = this.errorHandler.returnError(errorInCheckCR, 'CHALLENGE_RESPONSE_RES_DECODE_ERROR');
            return Promise.reject(challenge_error);
        }
    }

    /**
     * 取得challenge response token data
     */
    getToken() {
        let cr_data = this.sessionStorage.getObj(this._crName);
        let output: any = {};
        output[this._crTokenNameList.send_auth1] = this._formateService.checkObjectList(cr_data, this._crTokenNameList.save_auth1);
        output[this._crTokenNameList.send_auth2] = this._formateService.checkObjectList(cr_data, this._crTokenNameList.save_auth2);

        return output;
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 啟動事件
     */
    private _init() {
        this.isDoingHandshake = false;
        this.isNeedHandshake = (!this.checkAuthData()); // true表示必須重做
        // this.reqUrl = '';
        // this.retry = 0;
    }


    /**
     * 設定需要重新handshake
     */
    private reset() {
        this.isNeedHandshake = true;
        this.isDoingHandshake = false;
        this.sessionStorage.remove(this._crName);
        // this.handshakeTelegram.reset();
    }

    /**
     * 設定challenge response server back token
     * @param data 
     */
    private setToken(data: any) {
        let output: any = {};
        output[this._crTokenNameList.save_auth1] = this._formateService.checkObjectList(data, this._crTokenNameList.send_auth1);
        output[this._crTokenNameList.save_auth2] = this._formateService.checkObjectList(data, this._crTokenNameList.send_auth2);
        this.sessionStorage.setObj(this._crName, output);
    }

    /**
     * 檢核challenge response data狀態
     * @returns 是否有設定 true 有設定, false 無設定
     */
    private checkAuthData(): boolean {
        let output = false;
        if (!environment.CHALLENGE_RESPONSE_FLAG) {
            // 關閉就不用做了
            output = true;
            return output;
        }
        const crData = this.sessionStorage.getObj(this._crName);
        const auth1 = this._formateService.checkObjectList(crData, this._crTokenNameList.save_auth1);
        const auth2 = this._formateService.checkObjectList(crData, this._crTokenNameList.save_auth2);
        if (auth1 && auth2) {
            output = true;
        }
        return output;
    }

    /**
     * Challenge Response 獨佔處理
     * （禁止同時發送）
     * @param serviceId
     * @returns boolean: true 需要做cr, false 不用做
     */
    private waitHandshake(serviceId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.isNeedHandshake) {
                resolve(false);
            } else if (this.isNeedHandshake && !this.isDoingHandshake) {
                this._logger.step('TelegramBase', 'waitHandshake start lock', serviceId);
                // this.isDoingHandshake = true;
                resolve(true);
            } else {
                this._logger.step('TelegramBase', 'waitHandshake start wait', serviceId);
                let listem_times = 0;
                let listenEvent = setInterval(() => {
                    listem_times++;
                    if (!this.isNeedHandshake && !this.isDoingHandshake) {
                        this._logger.step('TelegramBase', 'waitHandshake end wait', serviceId);
                        clearInterval(listenEvent);
                        resolve(false);
                    } else if (this.isNeedHandshake && !this.isDoingHandshake) {
                        this._logger.step('TelegramBase', 'waitHandshake start stop', serviceId);
                        resolve(true);
                    } else {
                        this._logger.step('TelegramBase', 'waitHandshake still wait', serviceId, listem_times);
                    }
                }, 1000);
            }
        });
    }

    /**
     * 執行 challenge response
     * 儲存控制
     * @param serviceId 
     */
    private async doChallenge(serviceId: string): Promise<any> {
        try {
            this.isDoingHandshake = true; // lock
            const crData = await this.sendChallenge(serviceId);
            this.isDoingHandshake = false; // unlock
            this.setToken(crData); // save auth data
            return Promise.resolve(crData);
        } catch (errorChallenge) {
            this.isDoingHandshake = false;
            return Promise.reject(errorChallenge);
        }
    }

    /**
     * 請求進行 challenge response
     * @param serviceId 
     */
    private async sendChallenge(serviceId: string): Promise<any> {
        try {

            

            let set_data: any = {};
            return Promise.resolve(set_data);
        } catch (errorSendChallenge) {
            this._logger.step('TelegramBase', 'Challenge Response error', serviceId);
            let challenge_error = this.errorHandler.returnError(errorSendChallenge, 'CHALLENGE_RESPONSE_CHANGE_ERROR');
            return Promise.reject(challenge_error);
        }
        // return new Promise((resolve, reject) => {
        //     let set_data: any = {};
        //     resolve(set_data);
        // });

        // // device
        // const started = Date.now();
        // logger.debug('==============start==============:' + started);
        // /**
        //  * 1.取得裝置資訊
        //  */
        // logger.debug('1.start:');
        // return this.deviceInfo.devicesInfo()
        //     /**
        //       * 2.初始化裝置資訊
        //       */
        //     .then((devicesInfo) => {
        //         devicesInfo.uuid = devicesInfo.udid;
        //         devicesInfo.appinfo.version = devicesInfo.appinfo.version + '.' + devicesInfo.appinfo.subVersion;
        //         logger.debug('2.devicesInfo:' + JSON.stringify(devicesInfo));
        //         return this.crypto.InitPhoneData(devicesInfo)
        //             .catch((err) => {
        //                 // logger.error(err);
        //                 let error = new HandleErrorOptions('裝置資訊初始化失敗');
        //                 error.resultCode = err.error;
        //                 error.resultData = err;
        //                 return Promise.reject(error);
        //             });
        //     }
        //     )
        //     /**
        //       * 3.取得裝置資訊for register電文
        //       */
        //     .then((InitPhoneRes) => {
        //         logger.debug('3.InitPhoneRes:' + JSON.stringify(InitPhoneRes));
        //         if (!!InitPhoneRes) {
        //             return this.deviceInfo.devicesInfoForRegister()
        //                 .catch((err) => {
        //                     logger.error(err);
        //                     let error = new HandleErrorOptions('裝置資訊取得失敗');
        //                     error.resultCode = err.error;
        //                     error.resultData = err;
        //                     return Promise.reject(error);
        //                 });
        //         } else {
        //             // TODO 異常處理
        //             logger.error('TODO 異常處理:InitPhoneRes is null');
        //             let error = new HandleErrorOptions('裝置資訊初始化取得失敗');
        //             error.resultCode = '';
        //             error.resultData = InitPhoneRes;
        //             return Promise.reject(error);
        //         }
        //     }
        //     )
        //     /**
        //       * 4.上傳裝置資訊,建立行動裝置session
        //       * success:回傳challenge(para1,para2)
        //       */
        //     .then((devicesInfoForRegister) => {
        //         logger.debug('4.deviceinfo:' + JSON.stringify(devicesInfoForRegister));
        //         // regist
        //         return this.registerApi.send('Register', devicesInfoForRegister)
        //             .catch((err) => {
        //                 logger.error('registerApi error');
        //                 let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERR_401)');
        //                 error.resultCode = 'ERR_401';
        //                 error.resultData = err;
        //                 return Promise.reject(error);
        //             });
        //     }
        //     )
        //     /**
        //       * 5.產生a.由challenge(para1,para2)產生的驗證資料
        //       *      b.特徵值(para3)  android only
        //       */
        //     .then((RegisterRes) => {
        //         // logger.debug('5.RegisterRes :'+RegisterRes);
        //         logger.debug('5.RegisterRes :' + JSON.stringify(RegisterRes));
        //         if (RegisterRes.result === 0) {
        //             return this.crypto.Handshake(RegisterRes.data)
        //                 .catch((err) => {
        //                     logger.error('registerApi error');
        //                     let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERR_502)');
        //                     error.resultCode = 'ERR_502';
        //                     error.resultData = err;
        //                     return Promise.reject(error);
        //                 });
        //         } else {
        //             let error_code = (!!RegisterRes.result) ? RegisterRes.result : 'ERR_501';
        //             let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。' + error_code);
        //             error.resultCode = error_code;
        //             logger.error('handshake error', error);
        //             return Promise.reject(error);
        //         }
        //     }
        //     )
        //     /**
        //       * 6.上傳驗證資料與特徵值(para3)
        //       *   success:回傳公鑰 public key
        //       */
        //     .then((CryptoHandshakeRes) => {
        //         // logger.debug('6.CryptoHandshakeRes 1:'+CryptoHandshakeRes);
        //         logger.debug('6.CryptoHandshakeRes 2:' + JSON.stringify(CryptoHandshakeRes));
        //         let sendObj = JSON.parse(CryptoHandshakeRes.value);
        //         // logger.debug('6.CryptoHandshakeRes 3:'+JSON.stringify(sendObj) );
        //         return this.handshakeApi.send('Handshake', sendObj)
        //             .catch((err) => {
        //                 logger.error('registerApi error');
        //                 let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERR_601)');
        //                 error.resultCode = 'ERR_601';
        //                 error.resultData = err;
        //                 return Promise.reject(error);
        //             });
        //     }
        //     )
        //     /**
        //       * 7.以公鑰產生session key
        //       */
        //     .then((HandshakeRes) => {
        //         // logger.debug('7.HandshakeRes :'+HandshakeRes);
        //         logger.debug('7.HandshakeRes :' + JSON.stringify(HandshakeRes));
        //         if (HandshakeRes.result == 0) {
        //             return this.crypto.ExchangeKey(HandshakeRes.data.para_key);
        //         } else {
        //             let error_code = (!!HandshakeRes.result) ? HandshakeRes.result : 'ERR_701';
        //             let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。' + error_code);
        //             error.resultCode = error_code;
        //             error.resultData = HandshakeRes;
        //             logger.error('handshake error', error);
        //             return Promise.reject(error);
        //         }
        //     }
        //     )
        //     /**
        //       * 8.上傳session key
        //       *   success:回傳版本資訊
        //       */
        //     .then((ExchangeKeyRes) => {
        //         // logger.debug('8.ExchangeKeyRes 1:'+ExchangeKeyRes);
        //         logger.debug('8.ExchangeKeyRes 2:' + JSON.stringify(ExchangeKeyRes));
        //         let sendObjx = {};
        //         sendObjx['para1'] = ExchangeKeyRes.value;
        //         let sendObj = JSON.parse(JSON.stringify(sendObjx));
        //         // logger.debug('8.ExchangeKeyRes 3:'+JSON.stringify(sendObj) );
        //         return this.exchangekeyApi.send('Exchangekey', sendObj);
        //     }
        //     )
        //     /**
        //       * 9.版本資訊 decrypt
        //       */
        //     .then((ExchangeKeyRes) => {
        //         // {"error":"OK","data":"Pd0uxlEgTU3XBksXnzFw7IlbWY62VsZEXQKl/0TXveBTUlyJN9oCBpopAqD+Gyuw","result":0}
        //         // logger.debug('9.ExchangeKeyRes :'+ExchangeKeyRes);
        //         logger.debug('9.ExchangeKeyRes :' + JSON.stringify(ExchangeKeyRes));
        //         if (ExchangeKeyRes.data !== undefined) {
        //             // logger.debug("9.ExchangeKeyRes.data != undefined");
        //             return this.crypto.AES_Decrypt('session', ExchangeKeyRes.data).then(val => {
        //                 let output: any = {
        //                     'AES_Decrypt': val, 'ExchangeKeyRes': ExchangeKeyRes
        //                 };
        //                 return Promise.resolve(output);
        //                 // return { 'AES_Decrypt': val, 'ExchangeKeyRes': ExchangeKeyRes };
        //             });
        //         } else {
        //             let error_code = (!!ExchangeKeyRes.result) ? ExchangeKeyRes.result : 'ERR_901';
        //             let error = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。' + error_code);
        //             error.resultCode = ExchangeKeyRes.result;
        //             error.resultData = ExchangeKeyRes;
        //             logger.error('handshake error', error);
        //             return Promise.reject(error);
        //         }
        //     }
        //     )
        //     /**
        //       * 10.handshake作業完成
        //       */
        //     .then((ExchangekeyAES_Decrypt) => {
        //         // logger.debug('10.FinishRes :'+ExchangekeyAES_Decrypt);
        //         logger.debug('10.FinishRes :', JSON.stringify(ExchangekeyAES_Decrypt));
        //         // 儲存handshake第三道電文結果到session
        //         this.session.set('directUpdateInformation', ExchangekeyAES_Decrypt.AES_Decrypt.value);
        //         let FinalRes = ExchangekeyAES_Decrypt.ExchangeKeyRes;
        //         FinalRes.data = JSON.parse(ExchangekeyAES_Decrypt.AES_Decrypt.value);
        //         // logger.debug("10.FinalRes:"+JSON.stringify(FinalRes));
        //         const ended = Date.now();
        //         const elapsed = ended - started;
        //         this.isNeedHandshake = false;
        //         sessionStorage.temp_hitrust_auth = this.handshakeTelegram.temp_hitrust_auth;
        //         sessionStorage.temp_auth_token = this.handshakeTelegram.temp_auth_token;
        //         logger.debug('==============finish==============:' + ended + ' ,cost:' + elapsed + 'ms');
        //         return Promise.resolve(FinalRes);
        //     }
        //     )
        //     .catch(err => {
        //         // TODO 異常處理
        //         // 回覆錯誤訊息
        //         let error_data = this.modifyError(err);
        //         // 清除handshake header
        //         this.reset();
        //         return Promise.reject(error_data);
        //     });
    }


}