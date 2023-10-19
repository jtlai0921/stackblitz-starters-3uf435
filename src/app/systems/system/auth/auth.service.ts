/**
 * 使用者系統狀態
 * 1. 儲存登入資料
 * 2. 清除登入資料
 * 3. 登入timer計時器
 * 4. 通訊timer計時器
 * 5. 使用者登入資訊的取得-身分、權限、個資
 */

import { Injectable } from '@angular/core';

// -- Options -- //
import { AuthUserInfoOption } from './auth-userinfo-option';

// -- library -- //
import { CheckService } from '@template/check/check.service';
import { FieldUtil } from '@util/formate/modify/field-util';
import { ObjectCheckUtil } from '@util/check/object-check-util';

@Injectable({
    // 全ＡＰＰ只有一個
    providedIn: 'root'
  })
export class AuthService {
    private userInfo: AuthUserInfoOption;

    constructor(
        private _checkService: CheckService,
    ) {
        this.userInfo = new AuthUserInfoOption();
    }

    /**
     * 登出清除暫存
     */
    logoutClearAuthData() {
        this.clearUserInfo();
    }

    // --------------------------------------------------------------------------------------------
    //     ________        __    ________          __          
    //     /  _____/  _____/  |_  \______ \ _____ _/  |______   
    //    /   \  ____/ __ \   __\  |    |  \\__  \\   __\__  \  
    //    \    \_\  \  ___/|  |    |    `   \/ __ \|  |  / __ \_
    //     \______  /\___  >__|   /_______  (____  /__| (____  /
    //            \/     \/               \/     \/          \/
    // --------------------------------------------------------------------------------------------

    /**
     * 取得使用者資料
     * @param fieldName 資料名稱(AuthUserInfoOption裡宣告)
     * @param rtBoolean 是否回傳boolean
     */
    private getUserInfoData(fieldName: string, rtBoolean?: boolean) {
        let usinfo = this.getUserInfo();
        let value: any;
        if (rtBoolean) {
            let field_data = ObjectCheckUtil.checkObjectList(usinfo, fieldName);
            value = (field_data == 'Y') ? true : false;
        } else {
            let field_data = FieldUtil.checkField(usinfo, fieldName);
            value = field_data;
        }
        return value;
    }

    /**
     * 取得身分證資料
     */
    getCustId(): string {
        return this.getUserInfoData('custId');
    }

    /**
     * 取得使用者代號資料
     */
    getUserId(): string {
        return this.getUserInfoData('userId');
    }

    /**
     * 取得name資料
     */
    getUserName(): string {
        return this.getUserInfoData('userName');
    }

    /**
     * 取得email資料
     */
    getEmail(): string {
        return this.getUserInfoData('email');
    }

    /**
     * 取得phone資料
     */
    getPhone(): string {
        return this.getUserInfoData('phone');
    }

    /**
     * 取得phone_otp資料
     */
    getPhoneOtp(): string {
        return this.getUserInfoData('phoneOTP');
    }

    /**
     * 取得role資料
     */
    getRole(): string {
        return this.getUserInfoData('role');
    }

    /**
     * 取得idType資料
     */
    getIdType(): string {
        return this.getUserInfoData('idType');
    }

    /**
     * 取得accessToken資料
     */
    getAccessToken(): string {
        return this.getUserInfoData('accessToken');
    }

    /**
     * 取得refreshToken資料
     */
    getRefreshToken(): string {
        return this.getUserInfoData('refreshToken');
    }

    /**
     * 取得timeOut資料
     */
    getTimeOut(): string {
        return this.getUserInfoData('timeOut');
    }

    // --------------------------------------------------------------------------------------------
    //     _____ _               _    ______               _   
    //     / ____| |             | |  |  ____|             | |  
    //    | |    | |__   ___  ___| | _| |____   _____ _ __ | |_ 
    //    | |    | '_ \ / _ \/ __| |/ /  __\ \ / / _ \ '_ \| __|
    //    | |____| | | |  __/ (__|   <| |___\ V /  __/ | | | |_ 
    //     \_____|_| |_|\___|\___|_|\_\______\_/ \___|_| |_|\__
    // --------------------------------------------------------------------------------------------

    /**
     * 登入狀態檢查
     */
    checkIsLoggedIn(): boolean {
        let output = false;
        let data = this.getUserInfoData('role');
        if (this._checkService.checkEmpty(data, true)) {
            output = true;
        }
        return output;
    }

    /**
     * 權限判斷
     * @param check_type
     *      fundAllow
     *      transferAllow
     */
    checkAllowAuth(check_type: string): boolean {
        let output = false;

        switch (check_type) {
            case 'isCardUser':
                output = this._checkAuthIsCardUser();
                break;
            case 'isMobilebank':
                output = this._checkAuthIsMobileBank();
                break;
            case 'nameFlag':
                output = this._checkAuthNameFlag();
                break;
            case 'nonFlag':
                output = this._checkAuthNonFlag();
                break;
            case 'fundAllow':
                output = this._checkAuthFund();
                break;
            case 'transferAllow':
                output = this._checkAuthTransfer();
                break;
            case 'isLoginCheckStrReset':
                output = this._checkAuthIsLoginCheckStrReset();
                break;
            case 'id4Num':
                output = this._checkAuthId4Num();
                break;
            case 'otp':
                output = this._checkAuthOtp();
                break;
            case 'fastPay':
                output = this._checkAuthFastPay();
                break;
            case 'fastPayNon':
                output = this._checkAuthFastPayNon();
                break;
            case 'deviceBind':
                output = this._checkAuthDeviceBind();
                break;
        }

        return output;
    }

    // --------------------------------------------------------------------------------------------
    //     _____                 ______               _   
    //     / ____|               |  ____|             | |  
    //    | (___   __ ___   _____| |____   _____ _ __ | |_ 
    //     \___ \ / _` \ \ / / _ \  __\ \ / / _ \ '_ \| __|
    //     ____) | (_| |\ V /  __/ |___\ V /  __/ | | | |_ 
    //    |_____/ \__,_| \_/ \___|______\_/ \___|_| |_|\__
    // --------------------------------------------------------------------------------------------

    /**
     * 設定登入後資訊
     * @param setObj response
     */
    setUserInfo(setObj: object) {
        this.userInfo = {...this.userInfo, ...setObj};
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private clearUserInfo() {
        this.userInfo = new AuthUserInfoOption();
    }

    /**
     * 取得userInfo
     * [禁止開放其他功能直接取用]
     */
    private getUserInfo(): AuthUserInfoOption {
        const returnObj = this.userInfo;
        return returnObj;
    }

    /**
     * 是否為信用卡用戶
     */
    private _checkAuthIsCardUser(): boolean {
        let output = this.getUserInfoData('isCardUser', true);
        return output;
    }

    /**
     * 行動銀行開通狀態
     */
    private _checkAuthIsMobileBank(): boolean {
        let output = this.getUserInfoData('isMobilebank', true);
        return output;
    }

    /**
     * 同戶名註記
     */
    private _checkAuthNameFlag(): boolean {
        let output = this.getUserInfoData('nameFlag', true);
        return output;
    }

    /**
     * 非約定註記
     */
    private _checkAuthNonFlag(): boolean {
        let output = this.getUserInfoData('nonFlag', true);
        return output;
    }

    /**
     * 基金權限判斷
     */
    private _checkAuthFund(): boolean {
        let output = this.getUserInfoData('fundAllow', true);
        return output;
    }

    /**
     * 轉帳權限判斷
     */
    private _checkAuthTransfer(): boolean {
        let output = this.getUserInfoData('transferAllow', true);
        return output;
    }

    /**
     * 強制重設密碼判斷
     */
    private _checkAuthIsLoginCheckStrReset(): boolean {
        let output = this.getUserInfoData('isLoginCheckStrReset', true);
        return output;
    }

    /**
     * 是否有身分證後四碼驗證
     */
    private _checkAuthId4Num(): boolean {
        let output = this.getUserInfoData('security.id4Num', true);
        return output;
    }

    /**
     * 是否有OTP驗證
     */
    private _checkAuthOtp(): boolean {
        let output = this.getUserInfoData('security.otp', true);
        return output;
    }

    /**
     * 是否有快速交易
     */
    private _checkAuthFastPay(): boolean {
        let output = this.getUserInfoData('security.fastPay', true);
        return output;
    }

    /**
     * 是否有快速交易-非約
     */
    private _checkAuthFastPayNon(): boolean {
        let output = this.getUserInfoData('security.fastPayNon', true);
        return output;
    }

    /**
     * 是否有綁定裝置
     */
    private _checkAuthDeviceBind(): boolean {
        let output = this.getUserInfoData('security.deviceBind', true);
        return output;
    }

    // /**
    //  * 取得生物辨識登入資訊
    //  */
    // getBioUserInfo(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         const tempRem = this.localStorageService.getObj('Remember');
    //         const tempFtData = this.localStorageService.getObj('Compare');
    //         let output: any = {
    //             status: false,
    //             msg: '',
    //             have_login: false,
    //             login: {
    //                 custId: '',
    //                 userId: ''
    //             },
    //             have_bio: false,
    //             bio: {
    //                 custId: '',
    //                 userId: ''
    //             },
    //             error_data: {}
    //         };
    //         if (!tempRem || !tempRem.userData || !tempRem.userData.custId || !tempRem.userData.userId) {
    //             output.status = true;
    //             resolve(output);
    //             return false;
    //         }

    //         // this.security.fastAESDecode([tempRem.userData.custId, tempRem.userData.userId]).then(
    //         //     (res_Dncode) => {
    //         //         output.have_login = true;
    //         //         output.login.custId = res_Dncode.custId;
    //         //         output.login.userId = res_Dncode.userId;
    //         //         if (!tempFtData || !tempFtData.comparecustId || !tempFtData.compareuserId) {
    //         //             output.status = true;
    //         //             resolve(output);
    //         //             return false;
    //         //         }
    //         //         this.security.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
    //         //             (resBioDncode) => {
    //         //                 output.have_bio = true;
    //         //                 output.bio.custId = resBioDncode.custId;
    //         //                 output.bio.userId = resBioDncode.userId;
    //         //                 output.status = true;
    //         //                 resolve(output);
    //         //             },
    //         //             (errorBioDncode) => {
    //         //                 output.msg = 'Decode bio data error';
    //         //                 output.error_data = errorBioDncode;
    //         //                 reject(output);
    //         //             }
    //         //         );
    //         //     },
    //         //     (error_Dncode) => {
    //         //         output.msg = 'Decode login data error';
    //         //         output.error_data = error_Dncode;
    //         //         reject(output);
    //         //     }
    //         // );
    //     });

    // }



    // /**
    //  * 檢查生物辨識狀態
    //  */
    // checkBiometric() {
    //     let output = false;
    //     // login已將舊pay_setting轉置完成
    //     const tempRem = this.localStorageService.getObj('Remember');
    //     const tempFtData = this.localStorageService.getObj('Compare');
    //     this._logger.step('Security', 'checkBio', tempRem, tempFtData);
    //     if (tempRem && tempFtData && tempRem.ftlogin.pay_setting === '1' && (
    //         tempFtData.comparecustId === tempRem.userData.custId &&
    //         tempFtData.compareuserId === tempRem.userData.userId
    //     )
    //     ) {
    //         output = true;
    //     }
    //     return output;
    // }

    // /**
    //  * 數位信封
    //  * @param signText 密碼
    //  */
    // digitalEnvelop(signText): Promise<any> {
    //     // return new Promise((resolve, reject) => {
    //     // return this.getServerCert()
    //     //     .then(nbCert => this.tcbb.doCGUMethod('CertEncrypt', nbCert, signText))
    //     //     // .then((res_CertEncrypt) => {
    //     //     //   logger.debug('res_CertEncrypt', res_CertEncrypt);
    //     //     //   return res_CertEncrypt;
    //     //     // })
    //     //     .catch((err) => {
    //     //         return Promise.reject(err);
    //     //     });
    //     return Promise.resolve(signText);
    // }

}
