/**
 * 檢核欄位
 * PART_BOX: word => 處理文字相關
 */
import { Injectable, NgZone } from '@angular/core';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { Config } from '../../../../assets/configuration/config';
import { IDGateService } from '../cordova/IdGete.service';
import { LocalStorageService } from './localStorage.service';
import { PopupService } from './popup.service';
import { QuickLoginService } from '../customize/quickLogin.service';
import { HiBiometricAuthService } from '../cordova/HiBiometricAuth.service';
import { DoLoginService } from '../customize/doLogin.service';
import { Agree_FingerFace_Version_KEY, Agree_PattenLock_Version_KEY } from '../../../../assets/configuration/quickLoginConfiguration';

declare var window;
@Injectable()
export class PatternLockService {

    static order: string = "order";
    static quick: string = "quick";
    constructor(
        private langTransService: LangTransService,
        private popup: PopupService,
        private idGate: IDGateService,
        private quickLoginService: QuickLoginService,
        private hiBiometricAuth: HiBiometricAuthService,
        private doLogin: DoLoginService,
        private zone: NgZone,
        private storage: LocalStorageService
    ) {

    }

    private isAllowPatternLock;
    private isAllowIdentify;
    private patternLockCode = "";
    private identifyType;
    private TermsType;
    private event;
    private errEvent;
    private customerId
    private userId
    private country
    private keyType;

    setUser(customerId, userId, country) {
        this.customerId = customerId;
        this.userId = userId;
        this.country = country;
    }
    //檢查快登
    checkQuickLogin(event, type: String, errEvent?) {
        return new Promise((resolve, reject) => {
            var result = false;

            //確認錯誤次數
            var quickLoginErrorCount = this.getQuickLoginErrorCount()
            if (quickLoginErrorCount >= 5) {
                resolve(false);
                return;
            }

            var defaultLogin
            var loginPattenLock
            var loginFinger
            var loginFace
            var loginPattenLockNumber
            this.event = event;
            this.errEvent = errEvent;
            //判定 快登類型
            this.keyType = type;
            if (type == PatternLockService.order) {
                defaultLogin = "defaultOrderLogin"
                loginPattenLock = "orderLoginPattenLock"
                loginFinger = "orderLoginFinger"
                loginFace = "orderLoginFace"
                loginPattenLockNumber = "orderLoginPattenLockNumber"
            } else if (type == PatternLockService.quick) {
                defaultLogin = "defaultQuickLogin"
                loginPattenLock = "quickLoginPattenLock"
                loginFinger = "quickLoginFinger"
                loginFace = "quickLoginFace"
                loginPattenLockNumber = "quickLoginPattenLockNumber"
            } else {
                resolve(false);
                return;
            }

            
            console.log(this.customerId, this.userId, this.country)
            var customerId = this.customerId ? this.customerId : this.storage.get("loginUserCompany");
            var userId = this.userId ? this.userId : this.storage.get("loginUserAccount");
            var country = this.country ? this.country : this.storage.get("loginUserCountry");
            
            //檢查該使用者是否有快登設定值
            if (!this.quickLoginService.checkAutoUser(customerId, userId, country)) {
                resolve(false);
                return;
            }

            //取出快登設定值
            var nowQuickType = undefined;
            var config = this.quickLoginService.getUserConfigurations(customerId, userId, country);
            if (config != null && config != undefined) {
                if (config[defaultLogin] != null && config[defaultLogin] != undefined) {
                    console.log('OrderLogin', config);
                    nowQuickType = config[defaultLogin]
                    this.isAllowPatternLock = config[loginPattenLock]
                    this.isAllowIdentify = config[loginFinger] || config[loginFace];
                    this.patternLockCode = config[loginPattenLockNumber]
                }
            }

            //檢查是否有 PersoFile
            this.idGate.hasPersoFile().then(
                (res) => {
                    if (!res) {
                        resolve(false);
                        return;
                    }
                    //檢查快登設定值
                    if (nowQuickType == "orderLoginPattenLock" || nowQuickType == "quickLoginPattenLock") {
                        this.loginPattrenLock();
                        result = true;
                    } else if (nowQuickType == "orderLoginFinger" || nowQuickType == "orderLoginFace"
                        || nowQuickType == "quickLoginFinger" || nowQuickType == "quickLoginFace") {
                        this.loginIdentify();
                        result = true;
                    }
                    resolve(result);
                }
                , (err) => {
                    resolve(false);
                })
        })

    }


    //啟動生物辨識
    loginIdentify() {
        var element = document.getElementById("login_button");
        if (element != undefined) {
            element.focus();
        }
        if (!this.checkQuickLoginTerms("F")) {
            this.TermsType = "F";
            this.showTerms("F");
            return;
        }
        console.log("啟動生物辨識");
        var title = this.keyType == PatternLockService.order?
        this.langTransService.instant("LOGINOUT.QUICK_ORDER_TITLE") :
        this.langTransService.instant("LOGINOUT.QUICK_LOGIN_TITLE");

        this.hiBiometricAuth.startIdentify(title).then(
            (res) => {
                var code = res["dev_type"]
                var userAgent = navigator.userAgent || navigator.vendor || window.opera
                if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    this.identifyType = "1";
                } else if (code == "F") {
                    this.identifyType = "2";
                } else if (code == "T") {
                    this.identifyType = "3";
                }
                this.quickOrder(this.identifyType)
            }, (err) => {
                var quickLoginError = this.getQuickLoginErrorCount();
                quickLoginError += 1;
                this.setQuickLoginErrorCount(quickLoginError);
                console.log("Quick Error Count ", quickLoginError);
                console.log("Quick Error ", err);
                if (err.ret_code == 13 || err.ret_code == 12) {
                    //系統鎖死生物辨識
                    this.isAllowIdentify = false;
                    if (quickLoginError <= 4 && this.isAllowPatternLock) {
                        this.popup.setConfirm({
                            content: "LOGINOUT.QUICK_LOGIN_LOCK_TO_PATTERN", // 已鎖死 啟用圖形鎖
                            cancelTxt: 'BTN.NO', // 否
                            checkTxt: 'BTN.YES', // 是
                            event: () => {
                                this.loginPattrenLock();
                            },
                            errEvent: () => {
                                this.storage.set("isAllowQuick", false);
                                if (typeof (this.errEvent) == "function") {
                                    this.errEvent();
                                }
                            }
                        })
                    } else {
                        this.popup.setConfirm({
                            content: "LOGINOUT.QUICK_LOGIN_LOCK", // 已鎖死 請用密碼
                            event: () => {
                                this.storage.set("isAllowQuick", false);
                                if (typeof (this.errEvent) == "function") {
                                    this.errEvent();
                                }
                            }
                        })
                    }
                    return;
                }

                if (quickLoginError > 4 && this.isAllowIdentify) {
                    this.popup.setConfirm({
                        content: "LOGINOUT.QUICK_LOGIN_ERRORMSG", // 驗證失敗次數過多，請以帳號密碼登入
                        event: () => {
                            this.storage.set("isAllowQuick", false);
                            if (typeof (this.errEvent) == "function") {
                                this.errEvent();
                            }
                        }
                    })
                }
                else if (quickLoginError == 1 && this.isAllowPatternLock) {
                    this.popup.setConfirm({
                        content: 'LOGINOUT.CHANGETO_PATTERN_LOCK', // 是否要切換至圖形解鎖
                        cancelTxt: 'BTN.NO', // 否
                        checkTxt: 'BTN.YES', // 是
                        event: () => {
                            this.isAllowIdentify = false;
                            this.loginPattrenLock();
                        },
                        errEvent: () => {
                            this.loginIdentify();
                        }
                    });
                } else {
                    this.loginIdentify();
                }
            });
    }
    //啟動圖形鎖
    loginPattrenLock() {
        var element = document.getElementById("login_button");
        if (element != undefined) {
            element.focus();
        }

        if (!this.checkQuickLoginTerms("P")) {
            this.TermsType = "P";
            this.showTerms("P");
            return;
        }

        console.log("啟動圖形鎖");
        this.popup.setPatternLock({
            title: "LOGINOUT.ENTER_PATTERN_LOCK",
            event: (pattern) => {
                this.checkPatternLock(pattern);
            },
            cancel: () => {
                this.storage.set("isAllowQuick", false);
                var quickLoginError = this.getQuickLoginErrorCount();
                quickLoginError += 1;
                this.setQuickLoginErrorCount(quickLoginError);
                if (typeof (this.errEvent) == "function") {
                    this.errEvent();
                }
            }
        })

    }

    //圖形鎖初始化
    checkPatternLock(pattern) {
        var success = () => {
            console.log("圖形鎖成功");
            this.popup.setPatternLock({ reset: true });
            this.quickOrder("4");
        }
        var error = () => {
            console.log("圖形鎖錯誤");
            this.popup.setPatternLock({ error: true });
            var quickLoginError = this.getQuickLoginErrorCount();
            quickLoginError += 1;
            this.setQuickLoginErrorCount(quickLoginError);
            //若輸入錯誤跳錯誤訊息
            this.zone.run(() => {
                this.popup.setConfirm({
                    content: "LOGINOUT.INPUT_ERROR", //輸入錯誤
                    event:()=>{ this.popup.setPatternLock({ reset: true }); }
                })
            });
            console.log("Quick Error Count ", quickLoginError);
            if (quickLoginError > 4) {
                this.zone.run(() => {
                    this.popup.setConfirm({
                        content: "LOGINOUT.QUICK_LOGIN_ERRORMSG", // 驗證失敗次數過多，請以帳號密碼登入
                        checkTxt: 'BTN.YES', // 是
                        event: () => {
                            this.hiddenPatter();
                            this.storage.set("isAllowQuick", false);
                            if (typeof (this.errEvent) == "function") {
                                this.errEvent();
                            }
                        }
                    });
                });
            } else if (quickLoginError == 3 && this.isAllowIdentify) {
                this.zone.run(() => {
                    this.popup.setConfirm({
                        // 錯誤次數已達 次   是否要切換生物辨識（若錯誤次數達5次，則請使用帳號密碼登入）
                        content: this.langTransService.instant('LOGINOUT.ERROR_NUM_REACHED') + quickLoginError + this.langTransService.instant('LOGINOUT.TIMES')
                            + '<br>' + this.langTransService.instant('LOGINOUT.CHANGETO_PATTERN_LOCK_MSG'),
                        cancelTxt: 'BTN.NO', // 否
                        checkTxt: 'BTN.YES', // 是
                        event: () => {
                            this.hiddenPatter();
                            this.loginIdentify();
                        }
                    });
                })
            }
        }
        if (pattern.length < 6) {
            this.zone.run(() => {
                this.popup.setConfirm({
                    content: "QUICKLOGIN.PATTERN_LENGTH", //不可少於六碼
                    event: () => {
                        this.popup.setPatternLock({ reset: true });
                    }
                });
            })
            return;
        }
        this.doLogin.QuickLoginEncrypt(pattern).then(
            (res) => {
                if (res == this.patternLockCode) {
                    success();
                } else {
                    error();
                }
            }, (err) => {
                this.popup.setPatternLock({ reset: true });
            })
    }

    showTerms(type) {
        this.popup.setQuickLoginTerms({
            "type": type,
            "event": () => { this.agreeTerm() },
            "cancel": () => { this.NotAgreeTerm() }
        })
    }

    agreeTerm() {
        var customerId = this.customerId ? this.customerId : this.storage.get("loginUserCompany");
        var userId = this.userId ? this.userId : this.storage.get("loginUserAccount");
        var country = this.country ? this.country : this.storage.get("loginUserCountry");
        if (this.TermsType == "P") {
            this.quickLoginService.setConfigurationsByKey(Agree_PattenLock_Version_KEY, Config[Agree_PattenLock_Version_KEY],
                customerId, userId, country);
            this.loginPattrenLock()
        } else {
            this.quickLoginService.setConfigurationsByKey(Agree_FingerFace_Version_KEY, Config[Agree_FingerFace_Version_KEY],
                customerId, userId, country);
            this.loginIdentify();
        }
    }
    NotAgreeTerm() {
        var customerId = this.customerId ? this.customerId : this.storage.get("loginUserCompany");
        var userId = this.userId ? this.userId : this.storage.get("loginUserAccount");
        var country = this.country ? this.country : this.storage.get("loginUserCountry");
        var config = this.quickLoginService.getUserConfigurations(customerId, userId, country);

        config["defaultQuickLogin"] = undefined;
        config["quickLoginPattenLock"] = false;
        config["quickLoginFinger"] = false;
        config["quickLoginFace"] = false;
        config["quickLoginPattenLockNumber"] = null;

        config["defaultOrderLogin"] = undefined;
        config["orderLoginPattenLock"] = false;
        config["orderLoginFinger"] = false;
        config["orderLoginFace"] = false;
        config["orderLoginPattenLockNumber"] = null;
        this.quickLoginService.updateUserConfigurations(customerId, userId, country, config);
        this.hiddenPatter();

        if (typeof (this.errEvent) == "function") {
            this.errEvent();
        }
    }

    hiddenPatter() {
        //this.quickLoginError = 0;
        this.popup.setPatternLock({ reset: true, Isopen: false });
    }
    quickOrder(type) {
        this.zone.run(() => {
            this.hiddenPatter();
            if (this.event != undefined) {
                this.event(type)
            }
        })
    }
    checkQuickLoginTerms(code) {
        var customerId = this.customerId ? this.customerId : this.storage.get("loginUserCompany");
        var userId = this.userId ? this.userId : this.storage.get("loginUserAccount");
        var country = this.country ? this.country : this.storage.get("loginUserCountry");
        var config = this.quickLoginService.getUserConfigurations(customerId, userId, country);

        if (code == "P") {
            return this.quickLoginService.checkVersion(Config[Agree_PattenLock_Version_KEY], config[Agree_PattenLock_Version_KEY]);
        } else {
            return this.quickLoginService.checkVersion(Config[Agree_FingerFace_Version_KEY], config[Agree_FingerFace_Version_KEY]);
        }
    }

    public static QuickLoginErrorKey = "QuickLoginErrorKey"
    public getQuickLoginErrorCount() {
        var result = this.storage.get(PatternLockService.QuickLoginErrorKey)
        if (!result) {
            return 0;
        }
        return +result;
    }

    public setQuickLoginErrorCount(count) {
        this.storage.set(PatternLockService.QuickLoginErrorKey, count);
    }

}
