import { Injectable } from '@angular/core';
import { AuthService } from '@systems/system/auth/auth.service';
import { AppCtrlService } from '@systems/system/app-ctrl/app-ctrl.service';
import { ConfirmService } from '@template/msg/confirm/confirm.service';
import { AlertService } from '@template/msg/alert/alert.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
// import { SystemParameterService } from '@systems/system/system-parameter/system-parameter.service';
// import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
// import { CertService } from '@lib/plugins/tcbb/cert.service';
// import { CertificateService } from '@pages/security/shared/service/certificate.service';
import { StringCheckUtil } from '@util/check/string-check-util';
import { FormateService } from '@template/formate/formate.service';
import { logger } from '@util/log-util';
// import { PushService } from '@lib/plugins/push.service';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { HandleErrorOptions } from '@systems/handle-error/handlerror-options';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
// import { SecurityService } from '@pages/security/shared/service/security.service';
import { environment } from '@environments/environment';
import { Logger } from '@systems/system/logger/logger.service';
import { SPEC02010101ApiService } from '@api/spec02/spec02010101/spec02010101-api.service';

@Injectable()
export class LoginService {
    
    constructor(
        private auth: AuthService,
        private appCtrl: AppCtrlService,
        private navgator: NavgatorService,
        private alert: AlertService,
        private confirm: ConfirmService,
        // private tcbb: TcbbService,
        // private systemparameter: SystemParameterService,
        // private cert: CertService,
        // private certUpdate: CertificateService,
        private _formateService: FormateService,
        // private push: PushService,
        private errorHandler: HandleErrorService,
        private headerCtrl: HeaderCtrlService,
        private _localStorage: LocalStorageService,
        // private securityService: SecurityService
        private _logger: Logger,
        private spec02010101: SPEC02010101ApiService
    ) {
        
    }


    /**
     * 一般登入
     * @param obj 使用者輸入資料
     */
    login(obj): Promise<any> {
        return this.spec02010101.login(obj).then(
            (res) => {
                this.auth.setUserInfo(res.data);
                return Promise.resolve(res);
            },
            (err) => {
                this._logger.error("login service err", err);
                return Promise.reject(err);
            }
        );
        // // 無障礙登入轉導頁參數
        // if (!!this.systemparameter.get('logintopage')) {
        // this.logintopage = this.systemparameter.get('logintopage');
        // } else {
        //   this.logintopage = 'a11yhomekey';
        // }

        // const res = await this.auth.digitalEnvelop(obj.pwd);
        // const form = new F1000101ReqBody();
        // form.userId = obj.userId.toUpperCase();
        // form.custId = obj.custId;
        // form.password = res.value;
        // if (obj.pwd.length < 8) {
        //     form.lessPwdLength = 'Y';
        // }
        // // 取cn
        // const res_cn = await this.tcbb.setF1000102Data({ nbCert: this.auth.nbCert }, obj.custId, obj.userId);
        // logger.debug('res_cn', res_cn);
        // logger.debug(JSON.stringify(res_cn));
        // if (res_cn.cn.indexOf(obj.custId) <= -1) {
        //     res_cn.cn = '';
        //     res_cn.sn = '';
        // }
        // let reqHeader = {
        //     header: { cn: res_cn.cn }
        // };
        // const f1000101res = await this.F1000101.send(form, reqHeader);
        // // 儲存資料
        // this.auth.setUserInfo(f1000101res.body, obj.userId);
        // this.auth.setCn(res_cn.cn, res_cn.sn);
        // this.auth.initTimer();
        // if (form.lessPwdLength === 'Y') {
        //   // 若啟用無障礙，套用無障礙樣式
        // //   await ((!!this.isa11y) ? this.a11yalert.show('POPUP.LOGIN.PWD_TOO_SHORT')
        // //   : this.alert.show('POPUP.LOGIN.PWD_TOO_SHORT'));
        // }
        // return f1000101res.body;
    }

    /**
     * 登入後程序
     * @param data101 登入成功資料
     */
    doAfterLogin(data101, loginForm) {
        logger.debug('loginProcess', data101);
        this.appCtrl.changeToLogin();
        this.appCtrl.redirectAfterLogin();
        // this.pushSetPushGuid(data101);
        // this.checkDeviceAllow().then(
        //     () => { // checkDeviceAllow start

        //         if (data101.validateResult !== '') {
        //             if (data101.isMobileFlag === '0') {
        //                 const content = '親愛的客戶您好：\n'
        //                     + '您尚未開通本行行動網銀服務，若欲使用本項服務，請於閱讀下列注意事項後，點擊同意並開通按鈕，即可以網路銀行連線代號及密碼登入使用行動網銀查詢功能。\n\n'
        //                     + '注意事項：\n'
        //                     + '1.完成開通作業後，即可以網路銀行連線代號及密碼登入使用行動網銀查詢功能，若需使用交易（轉帳、繳費稅等）或設定（常用帳號設定等）功能，請先洽本行營業單位申請行動網銀憑證並開啟相關交易功能才可使用。\n'
        //                     + '2.網路銀行及行動網銀登入密碼錯誤連續達5次將暫停連線查詢服務，需回本行營業單位辦理密碼重設後才可繼續使用。';
        //                 // 若啟用無障礙，套用無障礙樣式
        //                 ((!!this.isa11y) ? this.a11yconfirm : this.confirm)
        //                     .show(content, {
        //                         title: '開通行動網銀',
        //                         btnYesTitle: '同意並開通',
        //                         btnNoTitle: '取消'
        //                     }).then(() => {
        //                         // 同意開通並導頁至ssl密碼變更
        //                         this.enableMobileBank(loginForm).then(
        //                             res => {
        //                                 // 開通成功導向SSL密碼變更
        //                                 this.cleanRedirect();
        //                                 // 若啟用無障礙，轉跳至無障礙變更SSL密碼功能
        //                                 if (!!this.isa11y) {
        //                                     this.navgator.push('a11ychangesslpwdkey');
        //                                 } else {
        //                                     this.navgator.push('sslChg');
        //                                 }
        //                             }
        //                         ).catch(err => {
        //                             // 若啟用無障礙，套用無障礙樣式，且轉跳至無障礙登出畫面
        //                             if (!!this.isa11y) {
        //                                 this.a11yalert.show('開通失敗').then(() => this.auth.a11ylogout());
        //                             } else {
        //                                 this.alert.show('開通失敗').then(() => this.auth.logout());
        //                             }
        //                         });
        //                     }).catch(() => {
        //                         // 取消則登出
        //                         if (!!this.isa11y) {
        //                             // 若啟用無障礙，轉跳至無障礙登出
        //                             this.auth.a11ylogout();
        //                         } else {
        //                             this.auth.logout();
        //                         }
        //                     });
        //             } else {
        //                 if (data101.validateResult === '0' && StringCheckUtil.containStr(data101.warnMsg, '4307')) {
        //                     // 數3帳戶強制變更密碼
        //                     this.alert.show('POPUP.LOGIN.FIRST_LOGIN').then(() => {
        //                         if (!!this.isa11y) {
        //                             this.auth.a11ylogout();
        //                         } else {
        //                             this.auth.logout();
        //                         }
        //                         let url = 'https://actlink.tcb-bank.com.tw/linepay/v1.0.0/digitalDep/toOTP?t=' + data101.daToken;
        //                         if (!environment.PRODUCTION) {
        //                             url = 'https://actlink.tcb-test.com.tw/openAPI/v1.0.0/digitalDep/toOTP?t=' + data101.daToken;
        //                         }
        //                         this.navgator.push(url);
        //                     });
        //                 } else if (data101.validateResult === '0') {
        //                     this.headerCtrl.setCheckFinishStatus(true);
        //                     this.checkBoundID(data101);
        //                 } else {
        //                     // 驗證失敗-需由Failure element取得錯誤代碼及訊息
        //                     logger.debug('login fail:' + JSON.stringify(data101));
        //                     // 若啟用無障礙，套用無障礙樣式
        //                     if (!!this.isa11y) {
        //                         this.a11yalert.show('連線密碼錯誤');
        //                     } else {
        //                         this.alert.show('連線密碼錯誤');
        //                     }
        //                 }
        //             }
        //         } else {
        //         }
        //     }); // checkDeviceAllow end
    }

    // /**
    //  * 檢查裝置支援資訊
    //  */
    // checkDeviceAllow(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         let check_allow = this.securityService.checkAllowDevice();
    //         let allow = check_allow.allow;
    //         if (!allow && check_allow.have_bio) {
    //             this.alert.show(check_allow.error.content, {
    //                 title: check_allow.error.title
    //             }).then(
    //                 () => {
    //                     resolve();
    //                 }
    //             );
    //         } else {
    //             resolve();
    //         }
    //     });
    // }

    // /***
    //  * 檢查BoundID
    //  * 1：未申請
    //  * 2：已申請且裝置未認證，認證密碼有效
    //  * 3：已申請且裝置未認證，認證密碼逾期
    //  * 4：已申請且裝置已認證
    //  * 5：歸戶身分證已申請5組，但此裝置為第6組
    //  */
    // checkBoundID(data101) {
    //     switch (data101.BoundID) {
    //         case '2':
    //             // 連結⾸首次登入裝置認證畫⾯面
    //             this.cleanRedirect();
    //             this.navgator.push('device-bind-start');
    //             break;

    //         case '3':
    //             // 顯⽰示立即啟⽤用/稍後啟⽤用對話⽅方塊(100):
    //             // 您已申請裝置認 證作業，認證密碼已逾時失效。您是否要直接申請裝置認證作業?按下立即申請，連結 裝置綁定服務。
    //             // 按下稍後申請，接續其他登入⾝身份狀狀態偵測處理理程序。若若所有偵測皆已 完成，則連結⾏行行動網銀畫⾯面。
    //             this.confirm.show('您已申請裝置認證作業，認證密碼已逾時失效。您是否要直接申請裝置認證作業?', { btnYesTitle: '立即啟用', btnNoTitle: '稍後啟用' }).then(
    //                 (res) => {
    //                     this.cleanRedirect();
    //                     this.navgator.push('device-bind-start', {});
    //                 },
    //                 (error) => {
    //                     if (this.isa11y == false) {
    //                         this.auth.redirectAfterLogin();
    //                     } else {
    //                         this.auth.a11yredirectAfterLogin(this.logintopage);
    //                     }
    //                 }
    //             );
    //             break;
    //         case '1':
    //         case '4':
    //         case '5':
    //         default:
    //             // 若啟用無障礙，不檢核憑證
    //             if (!this.isa11y) {
    //                 this.checkSSLID(data101);
    //             } else {
    //                 this.auth.a11yredirectAfterLogin(this.logintopage);
    //             }
    //             break;
    //         //  case '5':
    //         // 先保留留在記憶體，⾏動網銀畫⾯面點選裝置綁定服務時，再取出使⽤。
    //         // if (this.isa11y == false) {
    //         //     this.auth.redirectAfterLogin();
    //         // } else {
    //         //    this.auth.a11yredirectAfterLogin(this.logintopage);
    //         // }
    //         // break;
    //     }
    // }

    spec02010101x(reqData, option?): Promise<any> {
        // if (reqData.custId == 'A123456789') {
        //     if (reqData.pswd !== '123456') {
        //         return Promise.reject();
        //     }
        // } else {
        //     return Promise.reject();
        // }

        let rowData = {
            "userName": "凱爾文",
            "email": "41874@scsb.com.tw",
            "phone" : "0911222333",
            "phone_otp" : "0955666777",
            "role": "INDIVIDUAL",
            "isCardUser": "false",
            "isMobilebank": "true",
            "nameFlag": "true",
            "nonFlag": "true",
            "fundAllow": "false",
            "transferAllow": "Y",
            "isCardReset": "false",
            "id4Num": "true",
            "otp": "true",
            "fast_pay": "true",
            "fast_pay_non": "true"
        };

        return Promise.resolve(rowData);
    }

}
