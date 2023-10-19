/**
 * 啟動流程
 * 1.  取得UDID
 * 2.  檢查網路->無網路提示->關閉APP
 * 3.  檢查版本: 啟動才檢查(api)
 * 3.1 store 強制、柔性 => 檢查->app更新提示(Native)->前往Store->閉閉APP
 * 3.2 同步資料 強制、柔性 => DirectUpdate檢查->更新->RedirectToUpdate
 * 4.  JB/Root檢查
 * 5.  首次啟用檢查
 * 5.1 Android 防毒提示
 * 5.2 上銀APP使用權限說明 => 引導去同意條款功能page (強制) 影響後續流程導頁
 * 6.  提醒(整合4,5)
 * 7.  檢查scheme: 影響後續流程導頁
 * 8.  導頁
 * 
 * [非同步流程]
 * A. 發電文取得系統參數
 * B. 發電文取得裝置綁定資訊
 * C. push註冊
 * D. 重要公告
 */
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Logger } from '@systems/system/logger/logger.service';

// -- Storage -- //
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { SystemParameterService } from '@systems/system/system-parameter/system-parameter.service';
import { AuthService } from '@systems/system/auth/auth.service';

// -- Error Ctrl -- //
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { AlertService } from '@template/msg/alert/alert.service';
import { ConfirmService } from '@template/msg/confirm/confirm.service';

// -- Other Library -- //
import { TranslateService } from '@ngx-translate/core'; // i18n
// step 1 library
import { DeviceService } from '@lib/device/device.service';
// step 2 library
import { CheckNetworkService } from '@lib/network/check-network.service';
// step 3: library
import { CheckVersionService } from './check-version.service';
import { FormateService } from '@template/formate/formate.service';
// step 4: library
// import { TrustedDeviceService } from '@lib/plugins/trusted-device.service';

import { UrlSchemeHandlerService } from './url-scheme-handler.service';
// import { StartAppService } from '@lib/plugins/start-app/start-app.service';
// import { ExitAppService } from '@lib/plugins/exit-app.service';
// import { CertService } from '@lib/plugins/tcbb/cert.service';
// import { ConfirmOptions } from '@template/msg/confirm/confirm-options';
// import { PushService } from '@lib/plugins/push.service';
// import { Shortcut3dtouchService } from '@lib/plugins/shortcut3dtouch.service';
// import { TrustcertsService } from '@lib/plugins/trustcerts.service';
// import { ShortcutService } from '@lib/plugins/shortcut.service';

@Injectable({
    // 全ＡＰＰ只有一個
    providedIn: 'root'
})
export class InitService {
    // appMode = {isA11y: false};
    // isa11y = false;
    // logintopage = 'a11yhomekey';
    // doAlert: any;
    // doConfirm: any;
    constructor(
        private _logger: Logger,
        private errorHandler: HandleErrorService,
        // private exitApp: ExitAppService,
        private confirm: ConfirmService,
        private systemParameter: SystemParameterService,
        private localStorage: LocalStorageService,
        private alert: AlertService,
        // private trustedDevice: TrustedDeviceService,
        // private startApp: StartAppService,
        private auth: AuthService,
        private device: DeviceService,
        // private cert: CertService,
        private session: SessionStorageService,
        private urlSchemeHandler: UrlSchemeHandlerService,
        // private push: PushService,
        // private shortcut3dtouch: Shortcut3dtouchService,
        // private trustcerts: TrustcertsService,
        // private showcurt: ShortcutService,
        private translate: TranslateService,
        private checkNetworkService: CheckNetworkService,
        protected _formateService: FormateService,
        private checkVersionService: CheckVersionService
    ) {
        // // 20200601 無障礙非約
        // let appMode = this.localStorage.getObj('appMode');
        // if (appMode) {
        //   this.appMode = appMode;
        // }

        // this.isa11y = this.appMode.isA11y;
        // if (this.isa11y) {
        //   this.doAlert = this.a11yAlert;
        //   this.doConfirm = this.a11yConfirm;
        // }else{
        //   this.doAlert = this.alert;
        //   this.doConfirm = this.confirm;
        // }
    }

    async init(): Promise<any> {
        // 啟動流程
        try {
            // 1.取得UDID
            this._logger.step('Init', 'Step 1.: get UDID');
            const checkUDID = await this.getUUID();
            this._logger.error("UUID", checkUDID);
            // 2.檢查網路
            this._logger.step('Init', 'Step 2.: check Network');
            const checkNetwork = await this.checkNetwork();

            // 3.檢查版本
            this._logger.step('Init', 'Step 3.: check Version');
            const versionData = await this.checkVersionService.checkVersion();

            // 3.1檢查->app更新提示(Native)->前往Store->閉閉APP
            this._logger.step('Init', 'Step 3.1: check Store Update');
            // const checkStoreUpdate = await this.checkVersionService.remindUpdate(versionData);

            // 3.2.DirectUpdate檢查->更新->RedirectToUpdate
            this._logger.step('Init', 'Step 3.2: check Direct Update');
            // const checkDirectUpdate = await this.checkVersionService.checkDirectUpdate(versionData);

            // 4.JB/Root檢查
            this._logger.step('Init', 'Step 4.: check JB/Root');
            const showAlertMsg = await this.checkTrustDevice();

            // 5.首次啟用檢查->上銀APP使用權限說明->防毒提示
            this._logger.step('Init', 'Step 5.: check FirstStart');
            const showAntivirus = await this.checkFirstStart();
            this._logger.error("showAlertMsg", showAlertMsg);
            this._logger.error("showAntivirus", showAntivirus);

            // 6.顯示整合提醒(整合4,5)
            this._logger.step('Init', 'Step 6.: show Alert');
            await this.showAlert(showAlertMsg, showAntivirus);

            // A.發電文取得系統參數
            this._logger.step('Init', 'Step A.: get SystemParameter');
            this.getSystemParameter();
            // const systemParameter = await this.getSystemParameter();
            // this.saveSystemParameter(systemParameter);

            // B.發電文取得裝置綁定資訊
            this._logger.step('Init', 'Step B.: get DeviceBindInfo');
            this.getDeviceBindInfo();

            // C.push註冊
            this._logger.step('Init', 'Step C.: push init');
            this.pushInit();

            // D.重要公告
            this._logger.step('Init', 'Step D.: get Announce');
            this.getAnnounce();
            // const announceData = await this.getAnnounce();
            // await this.showAnnounce(announceData);

            // 7.檢查scheme->導頁
            this._logger.step('Init', 'Step 7.: check Scheme');
            this.checkScheme();

            return Promise.resolve();
        } catch (exceptionObj) {
            this._logger.step('Init', 'Error Final End', exceptionObj);
            this.errorHandler.handleError(exceptionObj);
            return Promise.reject(exceptionObj);
        }
    }

    // init1() {
    //     // 若已初始化不需再次初始化
    //     if (this.session.get('init') === 'Y') {

    //         // this.device.initUdid().then(() => {
    //         if (this.auth.checkIsLoggedIn()) {
    //             const deadline = environment.AUTOLOGOUT_TIME; // 600
    //             const warningTime = environment.WARNING_BEFORE_LOGOUT_TIME; // 60
    //             const nowTime = Date.now(); // 現在時間
    //             const telegramResTime = this.localStorage.get('telegramResTime'); // 電文最後response時間
    //             const betweenTime = Math.round((nowTime - telegramResTime) / 1000);
    //             const remainingTime = deadline - betweenTime;  // 剩餘時間
    //             // logger.debug('nowTime:', nowTime);
    //             // logger.debug('telegramResTime:', telegramResTime);
    //             // logger.debug('betweenTime:', betweenTime);
    //             // logger.debug('remainingTime:', remainingTime);
    //             // logger.log('betweenTime:', '(', nowTime, '-', telegramResTime, ')/1000 =', betweenTime);
    //             // logger.log('remainingTime:', deadline, '-', betweenTime, '=', remainingTime);
    //             if (!environment.ONLINE && !telegramResTime && telegramResTime != '0') {
    //                 return false; // simulation重整頁面處理(避免重登)
    //             }
    //             if (remainingTime <= 0) {
    //                 // 已超過時間登出提示，發登出電文(>=600)
    //                 this.alert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => this.auth.logout());
    //             } else if (remainingTime <= warningTime) {
    //                 // 已到了要提示登出的時間(>=540)
    //                 this.auth.ctrlWarningIdle(remainingTime);
    //             }
    //         }
    //         // });
    //         return;
    //     }

    //     let settingInfo = {
    //         id: 'qrcodeShowPay',
    //         shortLabel: '出示付款碼',
    //         longLabel: '出示付款碼',
    //         intent: {
    //             action: 'android.intent.action.RUN',
    //             flags: 67108865,
    //             data: 'iTCBMobileBank://qrcodeShowPayFromHome'
    //         }
    //     };
    //     // this.showcurt.setDynamic([settingInfo]);

    //     // this.device.initUdid()
    //     //   // 1. 檢查網路
    //     //   .then(() => this.checkNetwork())
    //     //   // 1-1. only 測試環境使用
    //     //   .then(() => this.trustUnsecureCerts())
    //     //   // 2-1. 發電文F1000103取得系統參數
    //     //   .then(() => this.getSystemParameter())
    //     //   // 2-2. 儲存系統參數
    //     //   .then(dataF1000103 => this.saveSystemParameter(dataF1000103))
    //     //   // 3 檢查VerReming=1->app更新提示(Native)->前往Store->閉閉APP
    //     //   .then(() => this.remindStoreUpdate())
    //     //   // 4.DirectUpdate檢查->更新->RedirectToUpdate
    //     //   .then(() => this.checkDirectUpdate())
    //     //   // 5.首次啟用檢查->合庫APP使用權限說明->防毒提示(F1000103)
    //     //   .then(() => this.checkFirstStart())
    //     //   // 6.JB/Root檢查
    //     //   .then(showAntivirus => this.checkTrustDevice(showAntivirus))
    //     //   // 6-1 顯示整合提示(防毒+JB/Root)
    //     //   .then(showAlertMsg => this.showAlert(showAlertMsg))
    //     //   // 7.FB000601重要公告->!!ErrorCode&&ErrorCode!=11402->顯示錯誤->關閉APP
    //     //   .then(() => this.getAnnounce())
    //     //   // 8.new.no->localStorage沒有||不一樣 ->顯示公告
    //     //   .then(dataFB000601 => this.showAnnounce(dataFB000601))
    //     //   // 9.push init
    //     //   .then(() => this.pushInit())
    //     //   // 10.檢查scheme->導頁
    //     //   .then(() => this.checkScheme())
    //     //   // 異常處理
    //     //   .catch(err => {
    //     //     this.errorHandler.handleError(err).then(() => {
    //     //       // this.exitApp.exit();
    //     //     });
    //     //   });
    // }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 取得UUID
     * 1.1 getUUID
     */
    private async getUUID(): Promise<any> {
        try {
            this._logger.step('Init', 'Step 1.1: getUUID start');
            const uuid = this.device.initUuid();
            this._logger.step('Init', 'Step 1: getUUID success');
            return Promise.resolve(uuid);
        } catch (err) {
            this._logger.step('Init', 'Step 1: getUUID error end', err);
            return Promise.reject(err);
        }
    }

    /**
     * 檢查網路狀態
     * 2.1 Client Network Check
     */
    private async checkNetwork(): Promise<any> {
        try {
            // check device network
            this._logger.step('Init', 'Step 2.1: check client');
            const check_client = await this.checkNetworkService.checkClient();
            this._logger.step('Init', 'Step 2: checkNetwork success');
            return Promise.resolve(true);
        } catch (errorNetwork) {
            this._logger.step('Init', 'Step 2: checkNetwork error end', errorNetwork);
            return Promise.reject(errorNetwork);
        }
    }

    /**
     * JB/Root檢查
     */
    private async checkTrustDevice(): Promise<any> {
        // const JB_CHECK_FLAG = this.systemParameter.get('JB_CHECK_FLAG');
        // const VIRUS_CHECK_FLAG = this.systemParameter.get('VIRUS_CHECK_FLAG');

        let alertText = 'ERROR.TRUSTED_DEVICE.INIT';
        this.translate.get(alertText).subscribe((val) => {
            alertText = val;
        });
        // 整合提示(防毒+JB/Root)
        // JB訊息檢查到破解都會顯示，防毒第一次開啟顯示
        // if (JB_CHECK_FLAG === 'Y') {
            // return this.trustedDevice.detection()
            //   .then((trusted) => {
            //     if (trusted === false) {
            //       this.session.set('device_trust', 'N'); // 設定session
            //       alertText = 'ERROR.TRUSTED_DEVICE.INIT';
            //       // this.alert.show(alertText).then(() => {});
            //       this.translate.get(alertText).subscribe((val) => {
            //         alertText = val;
            //       });
            //     } else {
            //       this.session.set('device_trust', 'Y');
            //     }
            //     // 組顯示字串
            //     if (VIRUS_CHECK_FLAG === 'Y' && !!showAntivirus && !!alertText) {
            //       alertText = showAntivirus + '\n' + alertText;
            //     } else {
            //       alertText = showAntivirus + alertText;
            //     }
            //     this.localStorage.set('first_use', 'used');
            //     return alertText;
            //   })
            //   .catch((err) => {
            //     this.session.set('device_trust', 'Y'); // 報錯視同無JB/Root
            //     const error = new HandleErrorOptions('JB/Root檢查失敗', 'ERROR.TITLE');
            //     return Promise.reject(error);
            //   });
        // }
        return Promise.resolve(alertText);
    }

    /**
     * 首次啟用檢查->Android防毒提示
     */
    private async checkFirstStart(): Promise<any> {
        // TODO
        // logger.debug('checkFirstStart');
        if (this.localStorage.get('first_use') === null) {
            // return this.cert.initTable()// initTable
            //   .then(() => this.device.devicesInfo())
            //   .then((deviceInfo) => {
            //     if (deviceInfo.platform.toLowerCase() === 'android') {
            //       return '為了提升交易安全，系統建議您於智慧型裝置安裝防毒軟體。';
            //     } else {  // iOS不顯示防毒軟體的提示;
            //       return '';
            //     }
            //   });
            this.localStorage.set('first_use', 'used');
            let alertText = 'ERROR.TRUSTED_DEVICE.ANTIVIRUS';
            this.translate.get(alertText).subscribe((val) => {
                alertText = val;
            });
            return Promise.resolve(alertText);
        }
        return Promise.resolve('');
    }

    /**
     * 顯示整合提示(防毒+JB/Root)
     */
    private async showAlert(showAlertMsg, showAntivirus): Promise<any> {
        if (!showAlertMsg && !showAntivirus) {
            return Promise.resolve();
        }

        let content = '';
        if (!!showAlertMsg && !!showAntivirus) {
            content = showAntivirus + '\n' + showAlertMsg;
        } else {
            content = showAntivirus + showAlertMsg;
        }

        return this.alert.show(content).then(() => {
            return Promise.resolve();
        });
    }

    private checkScheme() {
        // logger.debug('checkScheme');
        this.session.set('init', 'Y');
        // check if app was opened by custom url scheme
        const lastUrl: string = (window as any).handleOpenURL_LastURL || ''; // 測試此行mark
        // const lastUrl: string = "iTCBLaunchFromATM://?CardBillRs=PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iQmlnNSI/Pg0KPENhcmRCaWxsc1JzPg0KCTxBY2N0SWRGcm9tPjk5OTc4NzE1MjMyNDcwMTA8L0FjY3RJZEZyb20%2BDQoJPEFjY3RJZFRvPjk5OTg3MTMzMjEzMjM8L0FjY3RJZFRvPg0KCTxCYW5rSWRGcm9tPjAwNjwvQmFua0lkRnJvbT4NCgk8Q2hhbm5lbEZlZT4wPC9DaGFubmVsRmVlPg0KCTxDdXJBbXQ%2BMTA5OTwvQ3VyQW10Pg0KCTxEdWVEdD4yMDEzMDUwNzwvRHVlRHQ%2BDQoJPE1BQz48L01BQz4NCgk8TVNHPqXmqfamqKVcPC9NU0c%2BDQoJPE9OTz4xMDMwMjE0MDAzOTM8L09OTz4NCgk8UEFZTk8%2BMDA2MjcwNDU3OTk1MzAxPC9QQVlOTz4NCgk8UGF5RHQ%2BOTk5OTEyMzE8L1BheUR0Pg0KCTxQYXlUeG5GZWU%2BMDwvUGF5VHhuRmVlPg0KCTxQYXlUeXBlPjU5OTk5PC9QYXlUeXBlPg0KCTxSQz4wMDA8L1JDPg0KCTxSc1VSTD5pVENCTGF1bmNoRnJvbUFUTTovLzwvUnNVUkw%2BDQoJPFNhbGVJbmZvPiAgICAgICAgICAgICAgIC48L1NhbGVJbmZvPg0KCTxTZW5kU2VxTm8%2BMTAzMDIxNDAwMzkzPC9TZW5kU2VxTm8%2BDQoJPFRybkR0PjIwMTQwMjE0PC9Ucm5EdD4NCgk8VHJuVGltZT4xMDQ0MTQ8L1RyblRpbWU%2BDQoJPFR4VHlwZT4yNTYwPC9UeFR5cGU%2BDQoJPFR4blNlcU5vPjMwMTI3MDc8L1R4blNlcU5vPg0KPC9DYXJkQmlsbHNScz4NCg==";
        if (lastUrl && lastUrl !== '') {
            delete (window as any).handleOpenURL_LastURL;
            this.urlSchemeHandler.executeScheme(lastUrl);
        } else {
            const url = window.sessionStorage.getItem('UrlScheme');
            if (url) {
                this.urlSchemeHandler.executeScheme(url);
                delete sessionStorage['UrlScheme'];
            }
        }
    }

    /**
     * 發電文取得系統參數
     */
    private getSystemParameter(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.systemParameter.getData()
                .then(resObj => {
                    resolve();
                })
                .catch(err => {
                    resolve();
                });
        });
    }


    /**
     * 發電文取得裝置綁定資訊
     */
    private getDeviceBindInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            // const form = new F1000103ReqBody();
            // this.F1000103.send(form)
            //   .then(f1000103res => {
            //     resolve(f1000103res.body);
            //   })
            //   .catch(err => {
            //     let error_data: HandleErrorOptions;
            //     if (err instanceof HandleErrorOptions) {
            //       error_data = err;
            //     } else {
            //       error_data = new HandleErrorOptions('目前無法與伺服器取得連線，請稍後再試！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。(ERM002)', 'ERROR.TITLE');
            //     }
            //     reject(error_data);
            //   });
            this.getData()
                .then(res => {
                    
                    resolve();
                })
                .catch(err => {
                    resolve();
                });
        });
    }

    /**
     * push init
     */
    private pushInit() {
        // logger.debug('pushInit');
        return new Promise((resolve, reject) => {
        //   this.push.init()
        //     .then(res => {
        //       logger.log('push init res:' + JSON.stringify(res));
        //       resolve();
        //     })
        //     .catch(err => {
        //       logger.log('push init err:' + JSON.stringify(err));
        //       resolve();
        //     });
        resolve();
        });
    }

    /**
     * 重要公告->!!ErrorCode&&ErrorCode!=11402->顯示錯誤->關閉APP
     */
    private async getAnnounce() {
        return new Promise((resolve, reject) => {
            // const form = new FB000601ReqBody();
            // this.FB000601.send(form)
            //   .then(fb000601res => {
            //     resolve(fb000601res.body);
            //   })
            //   .catch(err => {
            //     if (err.resultCode != '11402') {
            //       reject(err);
            //     }
            //     resolve();
            //   });
            this.getData()
                .then(res => {
                    this.showAnnounce(res);
                    resolve();
                })
                .catch(err => {
                    resolve();
                });
        });
    }

    async getData(): Promise<any> {
        return this.specxxxxx().then(
          (res) => {
            return Promise.resolve(res);
          },
          (err) => {
            return Promise.reject(err);
          }
        );
        
      }
    
      specxxxxx(): Promise<any> {
        let rowData = {
            
        };
        return Promise.resolve(rowData);
      }

    /**
     * new.no->localStorage沒有||不一樣  ->顯示公告
     * dontShowAgain 好像沒啥用處
     */
    private showAnnounce(announceData) {
        // if (!!dataFB000601 &&
        //     (this.localStorage.get('newsNo') === null
        //         || this.localStorage.get('newsNo') != dataFB000601.newsNo)
        // ) {
        //     if (!!dataFB000601.newsNo && (!!dataFB000601.newsSubject || !!dataFB000601.newsBody)) {
        //         const confirmOpt = new ConfirmOptions();
        //         confirmOpt.btnYesTitle = '不要再提醒';
        //         confirmOpt.btnNoTitle = '關閉';
        //         confirmOpt.title = dataFB000601.newsSubject;
        //         return this.confirm.show(dataFB000601.newsBody, confirmOpt)
        //             .then(() => {
        //                 this.localStorage.set('newsNo', dataFB000601.newsNo);
        //             })
        //             .catch(() => {
        //                 return Promise.resolve();
        //             });
        //     }
        // }
        return Promise.resolve();
    }

    // /**
    //  * only 測試環境使用
    //  */
    // private trustUnsecureCerts(): Promise<any> {
    //   logger.debug('trustUnsecureCerts');
    //   // return this.trustcerts.trustUnsecureCerts()
    //   //   .then(() => {
    //   //     return Promise.resolve();
    //   //   })
    //   //   .catch(() => {
    //   //     return Promise.resolve();
    //   //   });
    //   return Promise.resolve();
    // }

}
