import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DoLoginService } from '../../shared/service/customize/doLogin.service';
import { LayoutService } from '../../shared/service/global/layout.service';
import { CheckService } from '../../shared/service/global/check.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { networkStateService } from '../../shared/service/cordova/networkState.service';

@Component({
  selector: 'app-password_change',
  templateUrl: './password_change.component.html',
  styleUrls: ['./password_change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  type = "";
  oldPassword: string = undefined;
  newPassword: string = undefined;
  newConfirmPassword: string = undefined;
  oldPasswordErrorMsg = "";
  newPasswordErrorMsg = "";
  newConfirmPasswordErrorMsg = "";
  UserId;
  pwdRule;
  isValid = {
    old: false,
    new: false,
    confirm: false,
    newOld: false,
    newConfirm: false
  }
  networkStatus = this.network.IsConnect(); // 網路連線狀態

  constructor(
    private router: Router,
    public routeAct: ActivatedRoute,
    public doLogin: DoLoginService,
    public popup: PopupService,
    public layout: LayoutService,
    private storage: LocalStorageService,
    private network: networkStateService,
    public _checkService: CheckService
  ) {
    this.type = this.routeAct.snapshot.queryParams['type'];


    //非從使用者設定進入
    if (this.type != 'userSet') {
      this.layout.setHeaderStatus({
        status: true,
        title: 'LOGINOUT.TITLE', // 登入
        backEvent: false,
        //將左上角及右上角ICON拿掉
        topDisapear: true
      });
    } else {
      this.layout.setHeaderStatus({
        status: true,
        title: 'LOGINOUT.TITLE', // 密碼變更
        backEvent: () => {
          this.router.navigate(['/user-setting-change']);
        }
      });
    }
  }

  ngOnInit() {
    if (!this.networkStatus) {
      this.popup.setConfirm({
        content: 'OTP.CHECK_NETWORK', // 請確認網路連線以取得最新資訊！
      });
    }
    this.UserId = this.storage.get("UserAccount");
    this.pwdRule = this._checkService.getPasswordCheckRule();
  }

  ngAfterViewInit() {
  }








  checkPasswordChange() {
    this.isValidOld()
    this.isValidNew()
    this.isValidConfirm()
    this.isValidNewOld()
    this.isValidNewConfirm()
    this.isValidNewUserId();
  }

  checkPassword() {
    var isValid =
      this.isValidOld()
      && this.isValidNew()
      && this.isValidConfirm()
      && this.isValidNewOld()
      && this.isValidNewConfirm()
      && this.isValidNewUserId();
    return isValid;
  }


  isValidUndefined() {
    var isValid = true;
    if (this.oldPassword == undefined) {
      this.oldPasswordErrorMsg = "LOGINOUT.ENTER_OLDPASSWORD";
      isValid = false;
    }
    if (this.newPassword == undefined) {
      this.newPasswordErrorMsg = "LOGINOUT.ENTER_NEWPASSWORD";
      isValid = false;
    }
    if (this.newConfirmPassword == undefined) {
      this.newConfirmPasswordErrorMsg = "LOGINOUT.ENTER_CONFIRMPASSWORD";
      isValid = false;
    }
    return isValid;
  }

  /**
   * 舊密碼是否符合密碼規則
   */
  isValidOld() {
    this.oldPasswordErrorMsg = "";
    
    /* 2019/3/25 變更密碼頁：原密碼欄位，調整為僅檢核是否有填。
    if (this.oldPassword != undefined) {
      let errorOldObj = this._checkService.verifyPassword(this.oldPassword, 'old',true);
      this.oldPasswordErrorMsg = errorOldObj.errorMessage;
      return errorOldObj.isValid
    }*/

    if (this.oldPassword != undefined && this.oldPassword.length == 0) {
      this.oldPasswordErrorMsg = "LOGINOUT.ENTER_OLDPASSWORD";
          return false; // 請輸入原密碼
    }
   return true;
  }
  /**
     * 新密碼是否符合密碼規則
     */
  isValidNew() {
    this.newPasswordErrorMsg = "";
    if (this.newPassword != undefined) {
      let errorNewObj = this._checkService.verifyPassword(this.newPassword, 'new',true);
      this.newPasswordErrorMsg = errorNewObj.errorMessage;
      return errorNewObj.isValid
    }
    return true;
  }
  /**
     * 確認新密碼是否符合密碼規則
     */
  isValidConfirm() {
    if (this.newConfirmPassword != undefined) {
      let errorConfirmObj = this._checkService.verifyPassword(this.newConfirmPassword, 'confirm',true);
      this.newConfirmPasswordErrorMsg = errorConfirmObj.errorMessage;
      return errorConfirmObj.isValid
    }
    return true;

  }
  /**
     * 新舊密碼是否重複
     */
  isValidNewOld() {
    if (this.oldPassword == undefined || this.newPassword == undefined) {
      //未輸入不檢查
      return true;
    }
    if (this.oldPassword.length == 0 || this.newPassword.length == 0) {
      //長度為0不檢查
      return true;
    }

    if (!this.pwdRule.allowNewOldPwdSame && this.oldPassword == this.newPassword) {
      this.newPasswordErrorMsg = 'LOGINOUT.NEWOLD_NOTSAAME'; // 新舊密碼不可相同
      return false;
    }
    return true;
  }
  /**
     * 新密碼確認是否一致
     */
  isValidNewConfirm() {
    if (this.newConfirmPassword == undefined || this.newPassword == undefined) {
      //未輸入不檢查
      return true;
    }
    if (this.newConfirmPassword.length == 0 || this.newPassword.length == 0) {
      //長度為0不檢查
      return true;
    }

    if (this.newConfirmPassword != this.newPassword) {
      this.newConfirmPasswordErrorMsg = 'LOGINOUT.NEW_NOTSAAME'; // 新密碼不一致
      return false;
    }
    return true;
  }
  /**
     * 新密碼不可與使用者ID相同
     */
  isValidNewUserId() {
    if (this.newPassword == undefined) {
      return true;
    }
    if (this.newPassword.length == 0) {
      return true;
    }
    if (!this.pwdRule.allowNewpwdIdSame && this.UserId == this.newPassword) {
      this.newPasswordErrorMsg = 'LOGINOUT.NEWID_NOTSAAME'; // 新密碼不可與身分統編或使用者代號相同
      return false;
    }
    return true;
  }

  /**
   * 確定變更 按鈕事件
   */
  change() {
    if (this.isValidUndefined() && this.checkPassword()) {
      console.log("密碼變更中");
      this.doLogin.doChangePassword(this.oldPassword, this.newPassword ,this.type);
    } else {
      this.popup.setConfirm({
        content: 'BTN.FILL_FIELD' // 請確實填寫欄位
      });
    }
  }

  onPreClick() {
    this.router.navigate(['/user-setting-change']);
  }


  //第一次登入變更密碼之後要把左上及右上ICON用回來
  ngOnDestroy(){
    this.layout.setHeaderStatus({
      topDisapear: false
    })
  }
}