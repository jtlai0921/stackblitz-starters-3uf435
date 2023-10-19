/**
 * 裝置資料
 */
import { Injectable, NgZone } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';
import { PopupService } from '../global/popup.service';
import { IDGateService } from '../cordova/IdGete.service';
import { LayoutService } from '../global/layout.service';
import { PINBlockService } from '../cordova/pinBlock.service';
import { WbcService } from '../cordova/wbc.service';
import { HexadecimalService } from '../global/hexadecimal.service';
import { GetSessionKeyService } from '../global/getSessionKey.service';
import { FunctionListService } from './functionList.service';
import { QuickLoginService } from './quickLogin.service';
import { UserParaInqService } from './userParaInq.service';
import { KEY_USER_PARA, KEY_LANGUAGE_PARA, KEY_CURRENCY_PARA, KEY_DEFAULT_LOGIN_PAGE_PARA } from '../../../../assets/configuration/userParaKey';
import { getDefaultLoginPage } from '../../../../assets/configuration/defaultLoginPage';
import { TimerService } from '../global/timer.service';
import { DoLogoutService } from '../../../shared/service/customize/do-logout.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { SecurytyService } from '../global/security.service';
import { E2eeParaInqService } from './e2eeParaInq.service';
import { Config } from '../../../../assets/configuration/config';
/**
 * [API] 登入
 */
@Injectable()
export class DoLoginService {

    constructor(
        private zone: NgZone,
        public telegram: TelegramService,
        public router: Router,
        public routeAct: ActivatedRoute,
        public storage: LocalStorageService,
        public popup: PopupService,
        public idGate: IDGateService,
        public layout: LayoutService,
        public pinBlock: PINBlockService,
        public wbc: WbcService,
        public hex: HexadecimalService,
        public sessionkey: GetSessionKeyService,
        public functionList: FunctionListService,
        public paraInq: UserParaInqService,
        public quicklogin: QuickLoginService,
        public doLogoutService: DoLogoutService,
        public timer: TimerService,
        public security: SecurytyService,
        public langTransService: LangTransService,
        public e2ee: E2eeParaInqService
    ) {
        this.routeAct.queryParams.subscribe(params => {
            this.entryType = params.type;
        });
    }

    account;
    companyId;
    country;
    isLogin = false;
    entryType; // 入口點 判斷是登入流程還是變更密碼流程
    /**
     * 執行登入
     * * @param CompanyId 公司 
     * * @param Account 帳號
     * * @param Password 密碼
     * * @param AuthType 登入類型
     * * @param LoginRemember 是否記住
     * * @param Country 國家
     */
    public doLogin(CompanyId: string, Account: string, Password: string, AuthType: string, LoginRemember: boolean, Country: String) {
        return new Promise((doLoginCallback) => {
            this.sessionkey.RegetKey().then(
                (session_res) => {
                    console.log("[API] reget sessionKey before doLogin success", session_res);
                    //取得並設定參數
                    const requset = this.telegram.GetRequstParam('CCMPTX000005Rq');
                    this.account = Account.toString();
                    this.country = Country.toString();
                    this.companyId = CompanyId.toString();
                    requset['SystemId'] = "SPETrust";
                    requset['Country'] = Country.toString();
                    requset['UserId'] = Account.toString();
                    requset['CompanyId'] = CompanyId.toString();
                    requset['Password'] = Password.toString();
                    requset['AuthType'] = +AuthType;

                    var keyIndex = this.storage.get("keyIndex");
                    console.log("login index", keyIndex)
                    const success = (res) => {
                        // 登入電文回應後，回調通知login頁面，用於清除密碼欄位值
                        doLoginCallback(res);
                        
                        if (LoginRemember) {
                            this.storage.set("CompanyID", CompanyId);
                            this.storage.set("UserAccount", Account);
                            this.storage.set("UserCountry", Country);
                            
                        }
                        this.doResult(res);
                    };
                    const error = (err) => {
                        // 登入電文回應後，回調通知login頁面，用於清除密碼欄位值
                        doLoginCallback(err);

                        this.errorBackLogin('ERROR.ERROR_' + err.HeaderRs.Result, "(" + err.HeaderRs.Result + ")")
                    };
                    if (AuthType == "0") {
                        //正常登入
                        // 控制開啟Loading畫面
                        this.popup.setLoading(true);
                        this.passwordEncrypt(Password).then(
                            (encrypting_success) => {
                                console.log('password-encryption all promises success', encrypting_success);
                                encrypting_success.forEach(data => {
                                    if (data.hasOwnProperty("pinBlock"))
                                        requset['Password'] = data['pinBlock'];
                                    if (data.hasOwnProperty("e2ee"))
                                        requset['PasswordE2EE'] = data['e2ee'];
                                });
                                this.sendApi(requset, success, error);
                            },
                            (encrypting_error) => {
                                console.log('password-encryption any promises error:', encrypting_error);
                                // 控制關閉Loading畫面
                                this.popup.setLoading(false);
                                // 顯示錯誤訊息
                                this.showMsg("LOGINOUT.ERROR_ENCRYPT_PWD_FAILED", "");
                            }
                        );
                    } else {
                        //快速登入
                        var hexString = this.hex.utf8ToHex(Password);
                        this.wbc.encrypt(hexString, keyIndex).then((wbc_res) => {
                            requset['Password'] = this.hex.hextoBase64(wbc_res);
                            //requset['Password'] = wbc_res;
                            this.zone.run(() => {
                                this.sendApi(requset, success, error)
                            })
                        }, (wbc_err) => {
                            console.log("wbc_err", wbc_err);
                            this.showMsg("BTN.ERROR", ""); // 錯誤
                        })
                    }
                },
                (session_err) => {
                    if(session_err.ResultMsg){
                        this.showMsg(session_err.ResultMsg,"");
                    }
                    else if(session_err.HeaderRs && session_err.HeaderRs.Result){
                        this.showMsg('ERROR.ERROR_' + session_err.HeaderRs.Result,"");
                    }else {
                        this.showMsg('ERROR.ERROR_reject',"");
                    }

                    console.log("[API] reget sessionKey before doLogin failed", session_err);
                }
            );
        });
    }

    /**
     * 根據回傳值處理下一步
     * * @param res 結果
     */
    public doResult(res) {
        console.log(res["Result"].toString());
        switch (res["Result"].toString()) {
            case "4001":
                if (!res["isCheckPersoFile"]) {
                    console.log("check Perso file");
                    this.checkPersoFile(res)
                    return;
                }
                //成功
                // 快登錯誤次數歸0
                this.storage.set("QuickLoginErrorKey",0)
                this.storage.set("isLogin", true);
                this.storage.set("userName", res["UserName"].toString().trim());
                this.storage.set("loginUserCompany", this.companyId);
                this.storage.set("loginUserAccount", this.account);
                this.storage.set("loginUserCountry", this.country);
                this.storage.set("idUser", res["IdUser"]);
                this.storage.set("functionList", res["FunctionList"]);
                this.storage.set("isAllowQuick", true);
                this.storage.set("loginUserCustomerName", res.CustomerName);
                this.sessionkey.setKeyIndex(res["KeyIndex"]);
                this.sessionkey.setKey(res["SessionKey"]);
                this.functionList.setFunctionList(res["FunctionList"]);
                this.quicklogin.setLoginUser();
                this.layout.updateFooterSource();
                this.layout.setFooterStatus(true);

                //const success = (res)=>{this.router.navigate(["/do_register_device"])};
                //this.persoFile.setPersoFile(this.account,this.account,this.companyId,"1000000750","517B8FB7A41104ED6930DFFCE660F578DE47D00D52FBCF63B0E0762328BEF87B55F5846CD3714CF316F1E2A2C4CF20FC03FCEC6B3F99064FA37950394D23E93C6615AC1E248DFE64736F140B7D6130F6E2C62D9961F69FE7BD491494AEDBA95B")
                console.log("Login Success");
                //add Timer
                this.timer.timerStart();
                this.popup.setLoading(true);
                this.zone.run(() => {
                    setTimeout(() => {
                        // 登入成功後，查詢使用者遠端中台之參數設定
                        let idUser = this.storage.get("idUser");
                        
                        // STEP-02 換頁至預設登入頁
                        const navigateDefalutLoginPage = () => {
                            // Dismiss loading page
                            // this.popup.setLoading(false);

                            // Display message and navigate next page
                            var page = "";
                            var message = "";
                            var parameter: any;
                            if (this.entryType == 'userSet') {
                                // 變更成功
                                page = "/user-setting";
                                message = "LOGINOUT.CHANGE_SUCC";
                            } else if (this.entryType == "otpPage") {
                                page = "/otp";
                                let CompanyID = this.storage.get('CompanyID');
                                let UserAccount = this.storage.get('UserAccount');
                                parameter = "{CompanyID:'" + CompanyID + "',UserAccount:'" + UserAccount + "'}";
                            } else if (typeof this.entryType == 'string' && this.entryType.startsWith("financePage")) {
                                var parameter_ = this.entryType.split(';')[1]; 
                                page = "/finance";
                                parameter = {type: parameter_ ,to:'goCustomCur'};
                            } else {
                                
                                var defaultLoginPage = this.getDefaultLogin();
                                let url = this.layout.getLogInRedirect();
                                //驗證是否有預設router
                                page = defaultLoginPage.router;
                                if (url) {
                                    page = url
                                }
                                url = "";
                                parameter = defaultLoginPage.parameter;
                                
                            }



                            // Navigate to next page
                            if (parameter != undefined) {
                                var queryParams_
                                if(typeof parameter =='string'){
                                     queryParams_ = { 'type': parameter } 
                                }else{
                                     queryParams_ = parameter
                                }
                                this.router.navigate([page], { queryParams: queryParams_});
                            } else {
                                this.router.navigate([page]);
                            }
                        }

                        // STEP-01 取得使用者遠端中台之各參數設定
                        this.paraInq.userParaInq(KEY_USER_PARA.APP_USING + '*' + idUser).then(
                            (res: Array<any>) => {
                                console.log('[userPara]', res);
                                let defaultCurr = true;
                                let defaultPage = true;
                                // 讀取使用者各項目設定值
                                res.forEach(para => {
                                    if (!para.hasOwnProperty("Id")) {
                                        // effect as continue
                                        return;
                                    };

                                    // 預設登入頁
                                    if (para['Id'].toString().includes(KEY_USER_PARA.DEFAULT_LOGIN_PAGE)) {
                                        defaultPage = false;
                                        this.storage.set(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE, para['Value']);
                                    }
                                    // 使用語系
                                    if (para['Id'].toString().includes(KEY_USER_PARA.LANGUAGE)) {
                                        this.storage.set(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE, para['Value']);
                                    }
                                    // 預設幣別
                                    if (para['Id'].toString().includes(KEY_USER_PARA.CURRENCY)) {
                                        defaultCurr = false;
                                        this.storage.set(KEY_CURRENCY_PARA.SELECTED_CURRENCY, para['Value']);
                                    }
                                });

                                // 無對應使用者設定時，設定參數預設值
                                if (defaultCurr)
                                    this.storage.set(KEY_CURRENCY_PARA.SELECTED_CURRENCY, "TWD");
                                // 無對應使用者設定時，設定參數預設值
                                if (defaultPage)
                                    this.storage.set(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE, "HOME");

                                // Debug
                                console.log("[User Language]", this.storage.get(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE));
                                console.log("[User Currency]", this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY));
                                console.log("[User Default Login Page]", this.storage.get(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE));

                                navigateDefalutLoginPage();
                            },
                            (err) => {
                                // 查詢中台使用者設定參數失敗時，各參數給入預設值
                                // 預設幣別
                                this.storage.set(KEY_CURRENCY_PARA.SELECTED_CURRENCY, "TWD");
                                // Debug
                                console.log("[User Language]", this.storage.get(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE));
                                console.log("[User Currency]", this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY));
                                console.log("[User Default Login Page]", this.storage.get(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE));

                                navigateDefalutLoginPage();
                            }
                        );
                    }, 1000);
                })
                break;
            case "140":
                res["Result"] = 4001
                let contentTxt = this.langTransService.instant("ERROR.ERROR_140") + "(140)"; 
                this.popup.setConfirm({
                    content: contentTxt,
                    event: () => {
                        this.doResult(res)
                    }
                })
                break;
            case "33":
                console.log("帳號未啟用");
                //帳號未啟用
                this.router.navigate(["/do_activite"]);
                break;
            case "34":
                console.log("須變更密碼");
                //必須變更密碼
                this.popup.setConfirm({
                    content: 'LOGINOUT.CHANGE_PASSWORD', // 請變更密碼
                    event:()=>{
                        this.router.navigate(["/do_change_password"], { queryParams: { 'type': 'LoginChange' } });
                    }
                });
                break;
            case "35":
                console.log("非信任裝置");
                //非信任裝置
                this.doRegisterDevice();
                break;
            case "38":
                console.log("裝置註冊確認");
                //裝置註冊確認
                this.router.navigate(["/do_register_device"]);
                break;
        }
    }


    public getDefaultLogin(){
        // 成功登入
        var defaultLoginPage = getDefaultLoginPage(this.storage.get(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE));
        if(!this.checkDefaultLoginPage(defaultLoginPage)){
            if(this.functionList.checkHasFunctionGroup(FunctionListService.HomeGroupKey)){
                defaultLoginPage = getDefaultLoginPage("HOME");
                this.storage.set(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE, "HOME");
            }else{
                defaultLoginPage = getDefaultLoginPage("BULLENTIN");
                this.storage.set(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE, "BULLENTIN");
            }
        }
        return defaultLoginPage;
    }

    /*檢查權限*/
    public checkDefaultLoginPage(defaultLoginPage){
        if(defaultLoginPage.permission !=undefined){
            if(!this.functionList.checkHasFunction(defaultLoginPage.permission)){
                return false;
            }
        }
        if(defaultLoginPage.permissionGroup !=undefined){
            if(!this.functionList.checkHasFunctionGroup(defaultLoginPage.permissionGroup)){
                return false;
            }
        }

        //GROUP: 存款明細:ACT_QUERY_DEPOSITDETAIL  首頁:HOME   票據查詢:ACT_QUERY_BILLCOLLECTION 
        // 授權待授權:  AUTH NONAUTH   權限:TXN_AUTH
        // 存款概要:ACT_QUERY_DEPOSITSUMMARY 權限:ACCT_SUMM
        // 放款概要:ACT_QUERY_LOANSUMMARY 權限:LOAN_DET_INQ
        // 約定轉帳:ACT_TRANS_AGREEACCOUNT 權限:ATM_TXN     通知訊息


        return true
    }
    private checlPersoFileError(data) {
        this.popup.setLoading(true);
        this.sessionkey.setKeyIndex(data["KeyIndex"]);
        this.sessionkey.setKey(data["SessionKey"]);
        setTimeout(() => {
            this.logout();
        }, 200);
        this.showMsg("LOGINOUT.PERSO_FILE_ERROR", "");
    }

    private checkPersoFile(data) {
        data["isCheckPersoFile"] = true;
        this.idGate.hasPersoFile().then((resHas) => {
            if (resHas) {
                this.idGate.checkSumPersoFile().then((resCheck) => {
                    if (resCheck) {
                        this.doResult(data);
                    } else {
                        this.checlPersoFileError(data)
                    }
                }, (errCheck) => {
                    this.checlPersoFileError(data)
                })
            } else {
                this.checlPersoFileError(data)
            }
        }, (errHas) => {
            this.checlPersoFileError(data)
        })

    }

    private logout() {
        this.doLogoutService.Action_Logout().then((res) => { this.popup.setLoading(false); }, (error) => { this.popup.setLoading(false); });
    }

    /**
     * 帳號啟用
     * * @param code 啟用碼
     */
    public doActivate(code: string) {
        //取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000006Rq');
        requset['ActivateCode'] = code;
        const error = (err) => { this.errorBackLogin("ERROR.ERROR_" + err.HeaderRs.Result, "(" + err.HeaderRs.Result + ")") };
        this.sendApi(requset, null, error);
    }
    /**
     * 註冊設備
     */
    public doRegisterDevice() {
        this.popup.setConfirm({
            content: 'LOGINOUT.DEVICE_NOT_TRUST', // 當前裝置為非信任裝置，是否註冊裝置?
            cancelTxt: 'BTN.CANCEL',
            event: () => {
                console.log("取得 InitValue");
                this.idGate.getInitValue().then((initValue) => {
                    console.log("裝置註冊中");
                    //取得並設定參數
                    var initialData = initValue;
                    var pushToken = this.storage.get('pushtoken');
                    const requset = this.telegram.GetRequstParam('CCMPTX000007Rq');
                    requset['InitialData'] = initialData;
                    requset['PushToken'] = pushToken;

                    const success = (res) => { this.router.navigate(["/do_register_device"]) };
                    const error = (err) => { this.errorBackLogin("ERROR.ERROR_" + err.HeaderRs.Result, "(" + err.HeaderRs.Result + ")") };
                    this.sendApi(requset, success, error);
                }, (err) => {
                    console.log("Initial Data Error");
                    this.errorBackLogin("LOGINOUT.REGISTER_DEVICE_ERROR", ""); // 註冊裝置失敗!
                })
            }, errEvent: () => {
                console.log("Cancel Register Device");
                this.router.navigate(['/login'],{queryParams:{'type':'error'}});
                // this.errorBackLogin("LOGINOUT.CANCEL_REGISTER_DEVICE",""); // 取消註冊裝置
            }
        });

    }
    /**
    * 確認設備註冊
    */
    public doRegisterConfirm(code) {
        //取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000008Rq');
        requset['AuthenticationCode'] = code;
        const success = (api_res) => {

            //由裝置註冊頁登入的話需要從電文取得UserName
            this.storage.set('userName', api_res["UserName"]);

            this.idGate.setPersoFiles(api_res["PersoFile"]
                , api_res["CustSeq"]).then((res) => {
                    this.doResult(api_res);
                }, (err) => {
                    //設定PersoFile plugin錯誤
                });
        };
        const error = (err) => {
            this.popup.setLoading(false);
            if (this.chcekError(err['HeaderRs'])) {
                return;
            }
            this.showMsg("LOGINOUT.REGISTER_DEVICE_ERROR", "(" + err.HeaderRs.Result + ")");
        };
        this.sendApi(requset, success, error);
    }
    /**
     * 變更密碼
     * @param type 判斷是登入流程還是變更密碼流程
     */
    public doChangePassword(orgPassword, newPassword , type) {
        // 控制開啟Loading畫面
        this.popup.setLoading(true);
        // 取得加密演算用參數
        let keyIndex = this.storage.get("keyIndex");
        let country = this.storage.get("Area");
        //取得並設定參數
        const request = this.telegram.GetRequstParam('CCMPTX000009Rq');
        // 生成密碼欄位密文
        Promise.all([
            // PINBlock + WBC (舊密碼)
            new Promise((resolve, reject) => {
                this.encryptByDeprecated(orgPassword, keyIndex).then(
                    (org_cipher) => { 
                        // 回傳密碼密文
                        resolve({ orgPinBlock: org_cipher }); 
                    },
                    (org_error) => { 
                        reject(org_error); 
                    }
                );
            }), 
            // PINBlock + WBC (新密碼)
            new Promise((resolve, reject) => {
                this.encryptByDeprecated(newPassword, keyIndex).then(
                    (new_cipher) => { 
                        // 回傳密碼密文
                        resolve({ newPinBlock: new_cipher }); 
                    },
                    (new_error) => { 
                        reject(new_error); 
                    }
                );
            }), 
            // E2EE + WBC (舊密碼 + 新密碼)
            new Promise((resolve, reject) => {
                console.log('[DoLoginService] doChangePassword E2EE country =', this.country);
                // E2EE加密演算處理
                this.e2ee.encryptChangePin(country, orgPassword, newPassword).then(
                    (e2ee_res) => {
                        console.log('[DoLoginService] doChangePassword E2EE success', e2ee_res);
                        let plainText = this.hex.utf8ToHex(e2ee_res);
                        // WBC加密演算處理
                        this.wbc.encrypt(plainText, keyIndex).then(
                            (wbc_res) => {
                                console.log('[DoLoginService] doChangePassword E2EE WBC success');
                                // 回傳密碼密文
                                resolve({ e2ee: this.hex.hextoBase64(wbc_res) });
                            },
                            (wbc_err) => {
                                console.log('[DoLoginService] doChangePassword E2EE WBC error', wbc_err);
                                reject("E2EE WBC-Encrypting failed");
                            }
                        );
                    },
                    (e2ee_err) => {
                        console.log('[DoLoginService] doChangePassword E2EE error', e2ee_err);
                        reject("E2EE-Encrypting failed");
                    }
                );
            })
        ]).then(
            (encrypting_success) => {
                console.log('[DoLoginService] doChangePassword all promises success', encrypting_success);
                encrypting_success.forEach(data => {
                    // 舊制原密碼密文
                    if (data.hasOwnProperty("orgPinBlock"))
                        request['OrgPassword'] = data['orgPinBlock'];
                    // 舊制新密碼密文
                    if (data.hasOwnProperty("newPinBlock"))
                        request['NewPassword'] = data['newPinBlock'];
                    // 新制變更密碼密文
                    if (data.hasOwnProperty("e2ee"))
                        request['PasswordE2EE'] = data['e2ee'];
                });
                /*
                 * 2019/04/15 ArnoChang
                 * 修正此段程式碼將動搖到此Service原有sendApi設計
                 * 故電文發送沿用舊有程式碼
                 * error: 不做任何處理，錯誤訊息由底層統一顯示
                 * success: 
                 *  type == LoginChange
                 *      為登入時要求變更密碼並自動導頁變更密碼功能
                 *      成功時使用sendApi方法裡，預設之登入流程後續處理
                 *  type == userSet
                 *      為登入後使用者自行操作變更密碼功能
                 *      成功時使用以下定義傳入之後續處理方法
                 */
                const error = (err) => { };
                var success = (response) => {
                   //更新keyIndex
                   this.sessionkey.setKeyIndex(response["KeyIndex"]);
                   //更新SessionKey
                   this.sessionkey.setKey(response["SessionKey"]);
                   //更新idUser
                   this.storage.set("idUser", response["IdUser"]);
                   //變更密碼成功
                   this.popup.setConfirm({
                       content:"LOGINOUT.PASSWORD_CHANGE_SUCCESS"
                   })
                   this.router.navigate(["/user-setting-change"])
                }
                if (type != 'userSet') {
                    success = null;
                }
                this.sendApi(request, success, error);
            },
            (encrypting_error) => {
                console.log('[DoLoginService] doChangePassword any promises error:', encrypting_error);
                // 控制關閉Loading畫面
                this.popup.setLoading(false);
                // 顯示錯誤訊息
                this.showMsg("LOGINOUT.ERROR_ENCRYPT_PWD_FAILED", "");
            }
        );
    }

    /**
     * 送出api
     * @param type 判斷是登入流程還是變更密碼流程
     */
    private sendApi(requset, success, error) {
        this.popup.setLoading(true);
        //送出api
        this.telegram.GetRespone(requset).then(
            (res) => {
                this.popup.setLoading(false);
                if(success != null){
                    success(res);
                }
                else {
                    this.doResult(res);
                }
            }
            , (err) => {
                this.popup.setLoading(false);
                if (this.chcekError(err['HeaderRs'])) {
                    if (success != null) {
                        success(err['HeaderRs']);
                    } else {
                        this.doResult(err['HeaderRs']);
                    }
                    return;
                }
                if (error != null) {
                    error(err);
                } else {
                    console.log("error", err);
                }
            }
        );
    }

    /**
     * 密碼加密
     * * @param password 密碼
     */
    public passwordEncrypt(password) {
        let keyIndex = this.storage.get("keyIndex");
        /*
         * 2019/04/25 ArnoChang
         * 固定密碼加密流程調整：
         * 新增End-to-End Encryption演算處理
         * 保留PIN Block處理用於緩衝過渡期
         * 兩者不相互影響，由獨立之電文欄位上傳
         */
        return Promise.all([
            // PINBlock + WBC
            new Promise((resolve, reject) => {
                this.encryptByDeprecated(password, keyIndex).then(
                    (cipher) => { 
                        // 回傳密碼密文
                        resolve({ pinBlock: cipher }); 
                    },
                    (error) => { 
                        reject(error); 
                    }
                );
            }), 
            // E2EE + WBC
            new Promise((resolve, reject) => {
                console.log('[DoLoginService] passwordEncrypt E2EE country =', this.country);
                // E2EE加密演算處理
                this.e2ee.encryptPin(this.country, password).then(
                    (e2ee_res) => {
                        console.log('[DoLoginService] passwordEncrypt E2EE success', e2ee_res);
                        let plainText = this.hex.utf8ToHex(e2ee_res);
                        // WBC加密演算處理
                        this.wbc.encrypt(plainText, keyIndex).then(
                            (wbc_res) => {
                                console.log('[DoLoginService] passwordEncrypt E2EE WBC success');
                                // 回傳密碼密文
                                resolve({ e2ee: this.hex.hextoBase64(wbc_res) });
                            },
                            (wbc_err) => {
                                console.log('[DoLoginService] passwordEncrypt E2EE WBC error', wbc_err);
                                reject("E2EE WBC-Encrypting failed");
                            }
                        );
                    },
                    (e2ee_err) => {
                        console.log('[DoLoginService] passwordEncrypt E2EE error', e2ee_err);
                        reject("E2EE-Encrypting failed");
                    }
                );
            })
        ]);
    }

    /**
     * 舊制加密演算處理：PINBlock + WBC
     * @param password 密文明文字串
     * @param keyIndex WBC金鑰序列碼
     */
    private encryptByDeprecated(password, keyIndex) {
        return new Promise((resolve, reject) => {
            // 啟用舊版加密
            if (Config.pinBlockEncryption) {
                // PINBlock處理
                this.pinBlock.pin_block(password).then(
                    (pinBlock_res) => {
                        console.log('[DoLoginService] encryptByDeprecated PINBlock success', pinBlock_res);
                        // WBC加密演算處理
                        this.wbc.encrypt(pinBlock_res, keyIndex).then(
                            (wbc_res) => {
                                console.log('[DoLoginService] encryptByDeprecated PINBlock WBC success');
                                // 回傳密碼密文
                                resolve(this.hex.hextoBase64(wbc_res));
                            }, 
                            (wbc_err) => {
                                console.log('[DoLoginService] encryptByDeprecated PINBlock WBC error', wbc_err);
                                reject("PINBlock WBC-Encrypting failed");
                            }
                        );
                    }, 
                    (pinBlock_err) => {
                        console.log('[DoLoginService] encryptByDeprecated PINBlock error', pinBlock_err);
                        reject("PINBlock-Encrypting failed");
                    }
                );
            } 
            // 不啟用舊版加密
            else {
                // 回傳空值
                resolve("");
            }
        });
    }

    /**
     * 快燈加密
     * * @param password 密碼
     */
    public QuickLoginEncrypt(password) {
        return new Promise((resolve, reject) => {
            this.pinBlock.pin_block(password).then((res_pinblock) => {
                var aesEncode = this.security.aesEncode(res_pinblock.toString());
                resolve(aesEncode);
            }, (error) => {
                console.log("pin_block_res", error);
                this.showMsg("BTN.ERROR", "");  // 錯誤
            })
        });

    }



    /**
     * 檢查error code 是否有需要作一動
     * * @param body Api回復的body
     */
    private chcekError(body) {
        if (typeof body == 'undefined' || typeof body['Result'] == 'undefined') {
            return false;
        }
        var code = +body['Result'];
        if (code == 33 || code == 34 || code == 35 || code == 38 || code == 140) {
            return true;
        }
        return false;
    }

    private errorBackLogin(msg, errorMsg) {
        this.showMsg(msg, errorMsg);
        this.router.navigate(["/login"], { queryParams: { 'type': 'error' } });
    }

    private showMsg(msg, errorMsg) {
        var msgValue = this.langTransService.instant(msg) + errorMsg;
        this.popup.setConfirm({
            content: msgValue,
            event: () => { }
        });
    }

    public getAccount() {
        if (!this.isLogin) {
            return undefined;
        }
        return this.account;
    }
    public getCountry() {
        if (!this.isLogin) {
            return undefined;
        }
        return this.country;
    }
    public getCompanyId() {
        if (!this.isLogin) {
            return undefined;
        }
        return this.companyId;
    }
}
