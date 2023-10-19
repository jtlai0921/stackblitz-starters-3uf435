/**
 * 檢核欄位
 * PART_BOX: word => 處理文字相關
 */
import { Injectable } from '@angular/core';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { Config } from '../../../../assets/configuration/config';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class CheckService {


    constructor(
        private _langTransService: LangTransService,
        private storage: LocalStorageService
    ) {
    }

    // == 密碼的檢核規則 == //
    // 第1及2個字元：是否允許小寫字母及強制至少n個小寫字元。
    // 第3及4個字元：是否允許大寫字母及強制至少n個大寫字元。
    // 第5及6個字元：是否允許數字及強制至少n個數字。
    // 第7及8個字元：是否允許特殊字元及強制至少n個特殊字元。
    // 第9及10個字元：密碼最小長度。00-99，最小長度大於最大長度時，取小者
    // 第11及12個字元：密碼最大長度。00-99，最小長度大於最大長度時，取大者
    // 第13個字元：密碼可允許重複字元數。
    // 第14個字元：密碼可允許連續字元數。
    // 第15個字元：新舊密碼是否可相同。
    // 第16個字元：新密碼是否可與身分統編或使用者代號相同。
    // （0：不允許，1：允許）
    // ex. : 'PIN_POLICY_STR': '1010100006129910'
    public getPasswordCheckRule() {

        let passwordCheckRuleObj = {
            passwordMaxLength: 0,
            passwordPlacehodler: "",
            allowLowercase: false,
            minLowercaseCount: 0,
            allowUppercase: false,
            minUppercaseCount: 0,
            allowNumber: false,
            minNumberCount: 0,
            allowSymbol: false,
            minSymbolCount: 0,
            minLength: 0,
            maxLength: 0,
            maxDuplicateCount: 0,
            maxContinueCount: 0,
            allowNewpwdIdSame: false,
            allowNewOldPwdSame: false
        }

        const rule = Config.PIN_POLICY_STR;
        passwordCheckRuleObj.allowLowercase = this.substring(rule, 0, 1) == '1';
        passwordCheckRuleObj.minLowercaseCount = parseInt(this.substring(rule, 1, 1));
        passwordCheckRuleObj.allowUppercase = this.substring(rule, 2, 1) == '1';
        passwordCheckRuleObj.minUppercaseCount = parseInt(this.substring(rule, 3, 1));
        passwordCheckRuleObj.allowNumber = this.substring(rule, 4, 1) == '1';
        passwordCheckRuleObj.minNumberCount = parseInt(this.substring(rule, 5, 1));
        passwordCheckRuleObj.allowSymbol = this.substring(rule, 6, 1) == '1';
        passwordCheckRuleObj.minSymbolCount = parseInt(this.substring(rule, 7, 1));
        passwordCheckRuleObj.allowNewpwdIdSame = this.substring(rule, 14, 1) == '1';
        passwordCheckRuleObj.allowNewOldPwdSame = this.substring(rule, 15, 1) == '1';
        const lengthLimit1 = parseInt(this.substring(rule, 8, 2));
        const lengthLimit2 = parseInt(this.substring(rule, 10, 2));
        if (lengthLimit1 != null && lengthLimit2 != null) {
            passwordCheckRuleObj.minLength = Math.min(lengthLimit1, lengthLimit2);
            passwordCheckRuleObj.maxLength = Math.max(lengthLimit1, lengthLimit2);
        } else {
            passwordCheckRuleObj.minLength = lengthLimit1;
            passwordCheckRuleObj.maxLength = lengthLimit2;
        }
        passwordCheckRuleObj.maxDuplicateCount = parseInt(this.substring(rule, 12, 1));
        passwordCheckRuleObj.maxContinueCount = parseInt(this.substring(rule, 13, 1));

        passwordCheckRuleObj.passwordMaxLength = passwordCheckRuleObj.maxLength > 0 ? passwordCheckRuleObj.maxLength : -1;
        if (passwordCheckRuleObj.minLength > 0 && passwordCheckRuleObj.maxLength > 0) {
            passwordCheckRuleObj.passwordPlacehodler = passwordCheckRuleObj.minLength + "-" + passwordCheckRuleObj.maxLength + this._langTransService.instant("LOGINOUT.HOW_EN_NUM"); // 碼英數字
        }
        else if (passwordCheckRuleObj.minLength > 0) {
            passwordCheckRuleObj.passwordPlacehodler = this._langTransService.instant("LOGINOUT.LEAST") + passwordCheckRuleObj.minLength + this._langTransService.instant("LOGINOUT.HOW_EN_NUM"); // 最少 碼英數字
        }
        else if (passwordCheckRuleObj.maxLength > 0) {
            passwordCheckRuleObj.passwordPlacehodler = this._langTransService.instant("LOGINOUT.MOST") + passwordCheckRuleObj.maxLength + this._langTransService.instant("LOGINOUT.HOW_EN_NUM"); // 最多 碼英數字
        }

        // console.log("是否允許小寫 = " + passwordCheckRuleObj.allowLowercase);
        // console.log("最少小寫字數 = " + passwordCheckRuleObj.minLowercaseCount);

        return passwordCheckRuleObj; // 密碼input的placeHolder
    }

    /**
     * 密碼檢核
     * @param password => 密碼
     * @param type => 密碼類型：ex. old/ new/ confirm
     * @param EnableCondition => true/false 是否要啟用密碼檢核的設定檔(false:只檢核是否為空)
     */
    public verifyPassword(password, type? , EnableCondition = false) {

        // Password string
        const passwordString = password == null ? "" : password.toString();

        // Length
        if (passwordString.length == 0) {
            if (type == 'old') {
                return { isValid: false, errorMessage: "LOGINOUT.ENTER_OLDPASSWORD" }; // 請輸入原密碼
            } else if (type == 'new') {
                return { isValid: false, errorMessage: "LOGINOUT.ENTER_NEWPASSWORD" }; // 請輸入新密碼
            } else if (type == 'confirm') {
                return { isValid: false, errorMessage: "LOGINOUT.ENTER_CONFIRMPASSWORD" }; // 請輸入確認新密碼
            } {
                return { isValid: false, errorMessage: "LOGINOUT.ENTER_PASSWORD" }; // 請輸入密碼
            }
        }

        if(!EnableCondition)
        {
            // EnableCondition=false:只檢核是否為空
            return { isValid: true };
        }

        // console.error(password, newPassword)
        const passwordCheckRuleObj = this.getPasswordCheckRule();

        //2018/12/13 請Jeff記得此判斷是需跟 passwordCheckRuleObj 連動
        if(passwordString.length>=4){   // 驗證密碼不得包含4位以上連續數字或是英文字
            for(let i = 3;i<passwordString.length;i++){
              if(passwordString.charCodeAt(i-3)+1 == passwordString.charCodeAt(i-2) && passwordString.charCodeAt(i-2)+1 == passwordString.charCodeAt(i-1) && passwordString.charCodeAt(i-1)+1 == passwordString.charCodeAt(i)){
                return { isValid: false, errorMessage: "LOGINOUT.NO_CONTINUOUS_LETTER_4" };
              }
              if(passwordString.charCodeAt(i-3)-1 == passwordString.charCodeAt(i-2) && passwordString.charCodeAt(i-2)-1 == passwordString.charCodeAt(i-1) && passwordString.charCodeAt(i-1)-1 == passwordString.charCodeAt(i)){
                return { isValid: false, errorMessage: "LOGINOUT.NO_CONTINUOUS_LETTER_4" };
              }
            }
        }
        
        // Lowercase
        const lowercaseCount = passwordString.replace(/[^a-z]/g, "").length;
        if (passwordCheckRuleObj.allowLowercase == true && passwordCheckRuleObj.minLowercaseCount > 0 && lowercaseCount < passwordCheckRuleObj.minLowercaseCount) {
            return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_LEAST_NEED') + passwordCheckRuleObj.minLowercaseCount + this._langTransService.instant('LOGINOUT.LOWER_CASE_LETTER') }; // 密碼中最少須包含 個小寫字元！
        }
        if (passwordCheckRuleObj.allowLowercase == false && lowercaseCount > 0) {
            return { isValid: false, errorMessage: "LOGINOUT.PASSWORD_NO_LOWER_CASE" }; // 密碼中不可包含小寫字元！
        }

        // Uppercase
        const uppercaseCount = passwordString.replace(/[^A-Z]/g, "").length;
        if (passwordCheckRuleObj.allowUppercase == true && passwordCheckRuleObj.minUppercaseCount > 0 && uppercaseCount < passwordCheckRuleObj.minUppercaseCount) {
            return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_LEAST_NEED') + passwordCheckRuleObj.minLowercaseCount + this._langTransService.instant('LOGINOUT.UPPER_CASE_LETTER') }; // 密碼中最少須包含 個大寫字元！
        }
        if (passwordCheckRuleObj.allowUppercase == false && uppercaseCount > 0) {
            return { isValid: false, errorMessage: "LOGINOUT.PASSWORD_NO_UPPER_CASE" }; // 密碼中不可包含大寫字元！
        }

        // Number
        const numberCount = passwordString.replace(/[^0-9]/g, "").length;
        if (passwordCheckRuleObj.allowNumber == true && passwordCheckRuleObj.minNumberCount > 0 && numberCount < passwordCheckRuleObj.minNumberCount) {
            return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_LEAST_NEED') + passwordCheckRuleObj.minNumberCount + this._langTransService.instant('LOGINOUT.HOW_NUM') }; // 密碼中最少須包含 個數字！
        }
        if (passwordCheckRuleObj.allowNumber == false && numberCount > 0) {
            return { isValid: false, errorMessage: "LOGINOUT.PASSWORD_NO_NUM" }; // 密碼中不可包含數字！
        }

        // Symbol
        const symbolCount = passwordString.replace(/[a-zA-Z0-9]/g, "").length;
        if (passwordCheckRuleObj.allowSymbol == true && passwordCheckRuleObj.minSymbolCount > 0 && symbolCount < passwordCheckRuleObj.minSymbolCount) {
            return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_LEAST_NEED') + passwordCheckRuleObj.minSymbolCount + this._langTransService.instant('LOGINOUT.HOW_SPECIAL_LETTER') }; // 密碼中最少須包含 個特殊字元！
        }
        if (passwordCheckRuleObj.allowSymbol == false && symbolCount > 0) {
            return { isValid: false, errorMessage: "LOGINOUT.PASSWORD_NO_SPECIAL_LETTER" }; // 密碼中不可包含特殊字元！
        }
        
        //2018/12/13 請Jeff記得此判斷是需跟 passwordCheckRuleObj 連動
        //驗證舊密碼至少一個小寫字母
        if(!passwordString.match(/^[a-zA-Z0-9]*[a-z]{1}[a-zA-Z0-9]*$/)){  
            return { isValid: false, errorMessage: "LOGINOUT.PASSWORD_ATLEAST_1_LOWER_CASE" };
        }

        // Min length
        if (passwordCheckRuleObj.minLength > 0 && passwordString.length < passwordCheckRuleObj.minLength) {
            return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_LENGTH_ERROR_LEAST') + passwordCheckRuleObj.minLength + this._langTransService.instant('LOGINOUT.HOW_LETTER') }; // 密碼長度有誤，最少 個字元！
        }

        // Max length
        if (passwordCheckRuleObj.maxLength > 0 && passwordString.length > passwordCheckRuleObj.maxLength) {
            return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_LENGTH_ERROR_MOST') + passwordCheckRuleObj.maxLength + this._langTransService.instant('LOGINOUT.HOW_LETTER') }; // 密碼長度有誤，最多 個字元！
        }

        // Duplicate character
        if (passwordCheckRuleObj.maxDuplicateCount > 0) {
            var duplicateCounter = 0;
            var perviusCharacter = null;
            for (const character of passwordString) {
                if (character != perviusCharacter) {
                    duplicateCounter = 0;
                    perviusCharacter = character;
                } else {
                    duplicateCounter = duplicateCounter + 1;
                    if (duplicateCounter > passwordCheckRuleObj.maxDuplicateCount) {
                        return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_ALLOW') + passwordCheckRuleObj.maxDuplicateCount + this._langTransService.instant('LOGINOUT.REPEAT_LETTER') }; // 密碼可允許 個重複字元數！
                    }
                }
            }
        }

        // Continue number
        if (passwordCheckRuleObj.maxContinueCount) {
            var continueCounter = 0;
            var nextNumber = -1;
            for (const character of passwordString) {
                const charactetToNumber = parseInt(character);
                if (charactetToNumber == null || charactetToNumber != nextNumber) {
                    continueCounter = 0;
                }
                else {
                    continueCounter = continueCounter + 1;
                    if (continueCounter > passwordCheckRuleObj.maxContinueCount) {
                        return { isValid: false, errorMessage: this._langTransService.instant('LOGINOUT.PASSWORD_ALLOW') + passwordCheckRuleObj.maxDuplicateCount + this._langTransService.instant('LOGINOUT.CONTINUOUS_LETTER') }; // 密碼可允許 個連續字元數！
                    }
                }
                nextNumber = charactetToNumber == null ? -1 : charactetToNumber + 1;
            }
        }


        // Valid
        return { isValid: true };
    }




    private substring(str: string, start: number, length: number) {
        if (str == null) {
            return null;
        }
        if (str.length < start + length - 1) {
            return null;
        }
        return str.substring(start, start + length);
    }


}
