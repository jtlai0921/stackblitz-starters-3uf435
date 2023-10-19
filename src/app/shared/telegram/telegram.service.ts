/**
 *　API模組
 */
import { Injectable,Injector } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Request_template } from './request_param'
import { SystemApiService } from './sys_api.service'
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { Config } from '../../../assets/configuration/config';
import { DeviceService } from '../service/cordova/device.service';
import { SecurytyService } from '../service/global/security.service';
import { DateTimeService } from '../service/global/daettime.service';
import { GetWayUrlService } from '../service/global/getwayUrl.service';
import { GetSessionKeyService } from '../service/global/getSessionKey.service';
import { PopupService } from '../service/global/popup.service';
import { networkStateService } from '../service/cordova/networkState.service';
import { TimerService } from '../service/global/timer.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';

// 錯誤代碼
import { ErrorCode } from '../../../assets/configuration/error_code';
import { decode } from '@angular/router/src/url_tree';
@Injectable()
export class TelegramService {
    private Offline = Config.OFFLINE;
    private Native = Config.NATIVE_OPEN;
    /**
     * POP 需要客製化的電文編號
     */
    private CustomTxnIdList =
    [
        'CCMPTX000005Rs',   // doLogin
        'CCMPTX000006Rs',   // doActivate
        'CCMPTX000007Rs',   // doRegisterDevice
        'CCMPTX000015Rs',   // doAuthorize
        'CCMPTX000186Rs',   // userParaInq
        'CCMPTX000044Rs',   // doLogout
        'CCMPTX000199Rs',   // PendingAuthInq
        'CCMPTX000201Rs',   // AcctSummPlusInq
        'CCMPTX000187Rs',   // AcctOverviewInq
        'CCMPTX000188Rs',   // LoanSummInq
        'CCMPTX000210Rs',   // ArgeementAdd
        'CCMPTX000216Rs',   // E2EEParaInq
    ]

    /**
     * HeaderRq version 需要打22的電文編號
     */
    private VersionDiffList2 =
    [
        'CCMPTX000005Rq',   // doLogin
        'CCMPTX000009Rq',   // doChangePassword
        'CCMPTX000015Rq',   // doAuthorize
        'CCMPTX000195Rq',   // FundXferAdd
    ]


    public static reqCount = 0;
    constructor(
        private sysApi: SystemApiService,
        private router: Router,
        private security: SecurytyService,
        private dateformat: DateTimeService,
        private device: DeviceService,
        private getUrl: GetWayUrlService,
        private sessionkey: GetSessionKeyService,
        private langTransService: LangTransService,
        private pop: PopupService,
        private storage: LocalStorageService,
        private network: networkStateService,
        private timer : TimerService
    ) {
        
     }

    /**
     * Get api Requst
     * @param key 電文編號
     */
    public GetRequstParam(key: string) {
        if (Request_template.hasOwnProperty(key)) {
            const BodyRq = Request_template[key];
            if (BodyRq.hasOwnProperty('TxnId')) {
                BodyRq['TxnId'] = key;
            }
            return BodyRq;

        } else {
            return key;
        }
    }
    /**
     * Get api Respone
     * @param param 查詢參數
     */
    public GetRespone(param: object) {

        console.log('GetRequstParam', param);
        return new Promise((resolve, reject) => {

            //加入驗證網路是否通
            if (!this.network.IsConnect()) {
                this.pop.setConfirm({ content : this.langTransService.instant('BTN.NET_ERROR') })
                reject({ HeaderRs: { Result: 'NET_ERROR' } });
                return;
            }

            //檢查是否完成start流程
            var StartError = this.storage.get(Config.StartErrorKey);
            var StartFinish = this.storage.get(Config.StartFinish);
            if ((StartError == "true"|| StartError == true)
                && StartFinish != "") {
                this.pop.setLoading(false);
                this.pop.setConfirm({
                    content: "STARTAPP.RELOAD", // 重啟啟動流程
                    event: () => {
                        this.router.navigate(['/start']);
                    }
                });
                return;
            }

            const BodyRq = param;
            if (!this.Offline) {
                this.getApiResponse(BodyRq).then(
                    (Api_res) => {
                        console.log('GetWaUrl Telegame' + param['TxnId'] + ' Success', Api_res);
                        resolve(this.ReplaceSpecName(Api_res));
                    }, (Api_error) => {
                        console.log('GetWaUrl Telegame' + param['TxnId'] + ' Error', Api_error);
                        reject(Api_error);
                    }
                );
            } else {
                //離線模式 抓虛擬電文
                const filename = BodyRq['TxnId'];
                this.getSimulate(BodyRq).then(
                    (res) => {
                        resolve(this.ReplaceSpecName(res));
                    }, (error) => {
                        reject(error);
                    }
                );
            }
        });
    }

    /**
     * 取得虛擬電文api
     * @param param 查詢參數
     */
    private getSimulate(param: object) {
        return new Promise((resolve, reject) => {
            const BodyRq = param;
            const filename = 'assets/simulate/' + BodyRq['TxnId'].replace('Rq', 'Rs') + '.json';
            this.sysApi.Get(filename, {}).then(
                (res) => {
                    let ResultCode = res['HeaderRs']['Result']; 
                    //取得目前的電文編號
                    let TxnId = res['HeaderRs']['TxnId'];
                    if (res['HeaderRs']['Result'] === 4001) {
                        let resStr = res['BodyRs']['Data'];
                        resolve(resStr);
                    } else {
                        
                        //26:不合法的連線 28:連線逾時 重新取key 重打API
                        if (res['HeaderRs']['Result'] === 26 || res['HeaderRs']['Result'] === 28) {
                            this.sessionkey.RegetKey().then(
                                (regetKey) => {
                                    this.getApiResponse(param).then(
                                        (_res) => {
                                            resolve(this.ReplaceSpecName(_res));
                                        }, (_error) => {
                                            reject(_error);
                                        }
                                    );
                                },
                                (reget_fail) => {
                                    reject(reget_fail);
                                }
                            );                                                        
                            reject(res);
                            // 中斷後續處理，不顯示錯誤提示
                            return;
                        }
                        //如果是138 此帳號已被其他裝置登入，則要強制走登出流程
                        else if(ResultCode === 138)
                        {
                            this.storage.set("Timeout",138);
                            this.timer.timeOut();
                            reject(res);
                            // 中斷後續處理，不顯示錯誤提示
                            return;
                        }
                        // 42: 尚未登入/登入狀態已失效 || (已登入狀態 + 35: 未註冊之非信任裝置)
                        else if (res['HeaderRs']['Result'] == 42 || (this.storage.get("isLogin") && res['HeaderRs']['Result'] == 35)) {
                            this.timer.timeOut();
                            this.pop.setLoading(false);
                        } 
                        //如果是true，代表不在白名單中，可以統一處理POP
                        if(!this.CustomTxnIdList.some(s => s.includes(TxnId)) && ResultCode != 13)
                        {
                            this.pop.setConfirm({ content: this.langTransService.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')' });
                        }
                        reject(res);
                    }
                },
                (error: Response) => {
                   this.pop.setLoading(false);
                   if(error instanceof SyntaxError){
                    reject({'HeaderRs':{Result:''}});
                   }else{
                    reject(error.json());
                   }
      
                }
            );
        });
    }
    /**
     * 真實電文api
     * @param param 查詢參數
     */
    private getApiResponse(param: object) {
        return new Promise((resolve, reject) => {

            const BodyRq = param;
            const BodyStr = JSON.stringify(BodyRq);// this.security.Base64Encode(JSON.stringify(BodyRq));
            let timeFormat = this.dateformat.datetimeFormat(Date.now(), 'yyyyMMddhhmmssSSS');
            //組裝Request Body
            let apiRequest = {
                "HeaderRq": {
                    "Type": 0,
                    "AppId": "MPASS",
                    "Manufacturer": this.device.getDeviceInfo('manufacturer'),
                    "Model": this.device.getDeviceInfo('model'),
                    "DeviceId": this.device.getDeviceInfo('uuid'),
                    "TxnId": param['TxnId'],
                    "Language": 0,
                    "Timestamp": timeFormat,
                    "RqUID": timeFormat,
                    "Version": "2"
                },
                "BodyRq": {
                    "DataType": 0,
                    "Data": BodyStr
                }
            };


            // HeaderRq Version參數值改為22
            if(this.VersionDiffList2.includes(apiRequest['HeaderRq']['TxnId']))
            {
                apiRequest['HeaderRq']['Version'] = "22";
            }


            // BodyRq-Data參數執行加密演算
            this.sessionkey.getKey().then(
                (skey: string) => {
                    this.security.ciperEncode(apiRequest.BodyRq.Data, skey).then(
                        (DataEncode: string) => {
                            apiRequest.BodyRq.Data = DataEncode;
                            //getWayUrl後打API
                            this.getUrl.getUrl().then(
                                (url: string) => {
                                    //Get Response 
                                    console.log('[sysApi POST] Prepare Post:', url, apiRequest);
                                    TelegramService.reqCount ++;
                                    this.sysApi.Post(url, apiRequest).then(
                                        (res) => {
                                            TelegramService.reqCount --;
                                            console.log('[sysApi POST] Post Success:', res);
                                            let ResultCode = res['HeaderRs']['Result'];

                                             //取得目前的電文編號
                                            let TxnId = res['HeaderRs']['TxnId'];
                                            console.log('leo  ' + this.CustomTxnIdList.some(s => s.includes(TxnId)));

                                            if (ResultCode === 4001 || ResultCode === 140) {

                                                let resStr = res['BodyRs']['Data'];
                                                this.security.ciperDecode(resStr, skey).then(
                                                    (decode: string) => {
                                                        let resObj = JSON.parse(decode);
                                                        resolve(this.ReplaceSpecName(resObj));
                                                    }, (decode_error) => {
                                                        console.log('decode error', decode_error);
                                                        resolve(decode_error);
                                                    }
                                                );
                                            } else {
                                                console.log('Response Error：' + this.ErrorStatus(res['HeaderRs']['Result']));
                                                console.log(this.ErrorStatus(res['HeaderRs']['Result']));
                                                //26:不合法的連線 28:連線逾時 重新取key 重打API
                                                if (res['HeaderRs']['Result'] === 26 || res['HeaderRs']['Result'] === 28) {
                                                    this.sessionkey.RegetKey().then(
                                                        (regetKey) => {
                                                            this.getApiResponse(param).then(
                                                                (_res) => {
                                                                    resolve(this.ReplaceSpecName(_res));
                                                                }, (_error) => {
                                                                    reject(_error);
                                                                }
                                                            );
                                                        },
                                                        (reget_fail) => {
                                                            reject(reget_fail);
                                                        }
                                                    );                                                        
                                                    reject(res);
                                                    // 中斷後續處理，不顯示錯誤提示
                                                    return;
                                                }
                                                //如果是138 此帳號已被其他裝置登入，則要強制走登出流程
                                                else if(ResultCode === 138)
                                                {
                                                    this.storage.set("Timeout",138);
                                                    this.timer.timeOut();
                                                    reject(res);
                                                    // 中斷後續處理，不顯示錯誤提示
                                                    return;
                                                }
                                                // 42: 尚未登入/登入狀態已失效 || (已登入狀態 + 35: 未註冊之非信任裝置)
                                                else if (ResultCode === 42 || (this.storage.get("isLogin") && ResultCode === 35)) {
                                                    this.timer.timeOut();
                                                    reject(res);
                                                    // 中斷後續處理，不顯示錯誤提示
                                                    return;
                                                } 
                                                //如果是true，代表不在白名單中，可以統一處理POP
                                                if(!this.CustomTxnIdList.some(s => s.includes(TxnId)) && ResultCode != 13)
                                                {
                                                    this.pop.setConfirm({ content: this.langTransService.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')' });                                                    
                                                }                                             
                                                reject(res);
                                            }
                                        },
                                        (error) => {
                                            TelegramService.reqCount --;
                                            this.pop.setLoading(false);
                                            console.log('[sysApi POST] Fail', error);
                                            if(error['HeaderRs']['Result'] === "TIMEOUT")
                                            {
                                                this.pop.setConfirm({ content: this.langTransService.instant("ERROR.ERROR_TIMEOUT") + "(TIMEOUT)"});
                                    
                                            }
                                            reject(error);
                                        }
                                    );
                                }, (error) => {
                                    this.pop.setLoading(false);
                                    //get Url Fail!
                                    reject(error);
                                }
                            );
                        },
                        (encode_fail) => {
                            this.pop.setLoading(false);
                            reject(encode_fail);
                        }
                    );
                }, (getkey_fail) => {
                    this.pop.setLoading(false);
                    reject(getkey_fail);
                }
            );
        });
    }


    /**
     * 錯誤代碼資訊
     * @param key key
     */
    private ErrorStatus(code: string) {
        console.log('[ErrorStatus' + code + ']：' + ErrorCode[code]);
    }

     /**
     * 全站邏輯，api responese 取代 中國信託商銀 
     */
    private ReplaceSpecName(res) {
       if(typeof res == 'object'){
          var format = JSON.stringify(res);
          format = format.replace(/中國信託商銀/g, '');
          return JSON.parse(format);
       }else if(typeof res == 'string'){
           return res;
       }else{
           return res;
       }
    }
}
