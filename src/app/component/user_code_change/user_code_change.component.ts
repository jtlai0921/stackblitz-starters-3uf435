import { Component, OnInit, Input } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { UserIDModService } from '../../shared/service/customize/UserIDMod.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { Router } from '../../../../node_modules/@angular/router';
import { networkStateService } from '../../shared/service/cordova/networkState.service';
import { LangTransService } from 'src/app/shared/pipe/langTransPipe/lang-trans.service';

@Component({
  selector: 'app-agreed_account',
  templateUrl: './user_code_change.component.html',
  styleUrls: ['./user_code_change.component.css']
})
export class UserCodeChangeComponent implements OnInit {

  oldUserId; // 原使用者代號
  error_new; // 錯誤文字
  error_confirm; // 錯誤文字
  _newuserid = '';
  _confirmid = '';
  isValid = {
    new: false,
    confirm: false
  }
  newuserid: string;
  confirmid: string;
  networkStatus = this.network.IsConnect(); // 網路連線狀態

  constructor(
    private layout: LayoutService,
    public storage: LocalStorageService,
    private network: networkStateService,
    public router: Router,
    public popup: PopupService,
    private _userIDModService: UserIDModService,
    private langTransService: LangTransService
  ) {
    
    this.layout.setHeaderStatus({
      status: true,
      title: 'USERCODECHANGE.TITLE', // 使用者代號變更
      backEvent: () => {
        this.router.navigate(['/user-setting-change']);
      }
    })
  }

  ngOnInit() {
    if (!this.networkStatus) {
      this.popup.setConfirm({
        content: 'OTP.CHECK_NETWORK', // 請確認網路連線以取得最新資訊！
      });
    }
    this.oldUserId = this.storage.get('loginUserAccount');
  }

  /**
   * 使用者代號檢核
   */
  checkCode(_newId, _confirmId, type) {
    let newId = _newId.toString();
    let confirmId = _confirmId.toString();
    let errorObj = {
      errorMsg: '',
      errorType: type,
      errorStatus: false
    }

    if (newId.length == 0 && type == 'new') {
      errorObj.errorMsg = 'USERCODECHANGE.NEW_USERID_NOBLANK'; // 新使用者代號不可為空
      errorObj.errorType = 'new';
      errorObj.errorStatus = true;
      return errorObj;
    }

    if (confirmId.length == 0 && type == 'confirm') {
      errorObj.errorMsg = 'USERCODECHANGE.CONFIRM_NEW_USERID_NOBLANK'; // 確認新使用者代號不可為空
      errorObj.errorType = 'confirm';
      errorObj.errorStatus = true;
      return errorObj;
    }

    if (this.oldUserId === newId && type == 'new') {
      errorObj.errorMsg = 'USERCODECHANGE.OLD_NEW_REPEAT'; // 新舊使用者代號重複
      errorObj.errorType = 'new';
      errorObj.errorStatus = true;
      return errorObj;
    }
    if (!newId.match(/^[a-zA-Z0-9]*$/)) {
      console.log("start2")
      errorObj.errorMsg = 'USERCODECHANGE.NEW_USERID_SIGN'; // 請確認使用者代號只能為英文或數字
      errorObj.errorType = 'new';
      errorObj.errorStatus = true;
      return errorObj;
    }
    if (!confirmId.match(/^[a-zA-Z0-9]*$/)) {
      errorObj.errorMsg = 'USERCODECHANGE.NEW_USERID_SIGN'; // 請確認使用者代號只能為英文或數字
      errorObj.errorType = 'confirm';
      errorObj.errorStatus = true;
      return errorObj;
    }

    if ((newId.length < 6 || newId.length > 12) && type == 'new') {
      errorObj.errorMsg = 'USERCODECHANGE.NEW_USERID_LENGTH'; // 請確認使用者代號長度
      errorObj.errorType = 'new';
      errorObj.errorStatus = true;
      return errorObj;
    }

    if ((confirmId.length < 6 || confirmId.length > 12) && type == 'confirm') {
      errorObj.errorMsg = 'USERCODECHANGE.NEW_USERID_LENGTH'; // 請確認使用者代號長度
      errorObj.errorType = 'confirm';
      errorObj.errorStatus = true;
      return errorObj;
    }

    if (newId !== confirmId && (newId.length != 0 && confirmId.length != 0)) {
      errorObj.errorMsg = 'USERCODECHANGE.NEW_USERID_NOTSAME'; // 新使用者代號和確認新使用者代號不一致
      errorObj.errorType = 'new_confirm';
      errorObj.errorStatus = true;
      return errorObj;
    }

    return errorObj;

  }
  /**
   * 確認變更 按鈕事件
   */
  change() {
    if (this.isValid.new && this.isValid.confirm) {
      this._userIDModService.getUserIDMod(this._confirmid).then(
        (succ) => {
          this.popup.setConfirm({
            content: 'LOGINOUT.CHANGE_SUCC' // 變更成功
          });

        },
        (error) => {
          this.popup.setConfirm({
            content: this.langTransService.instant('DEPOSITSUMMARY.POP_ERROR_OTHER') + '(' + error['HeaderRs']['Result'] + ')', // 無法取得資料，請聯絡客服！
        });
        }
      )
    } else {
      this.popup.setConfirm({
        content: 'BTN.FILL_FIELD' // 請確實填寫欄位
      });
    }
  }
  newuseridCheck() {   //Foucus Leave時才進行使用者代號檢核
    this.isValid.new = false;
    this._newuserid = this.newuserid;
    let errorObj = this.checkCode(this._newuserid, this._confirmid, 'new');
    if (errorObj.errorType == 'new') {
      this.error_new = errorObj.errorMsg;
      if (this.error_new == "") {
        this.isValid.new = true;
      } else {
        this.isValid.new = false;
      }
    } else {
      this.error_new = '';
      this.isValid.new = true;
    }
    if (errorObj.errorType == 'new_confirm') {
      this.error_confirm = errorObj.errorMsg;
      if (this.error_confirm == "") {
        this.isValid.confirm = true;
      } else {
        this.isValid.confirm = false;
      }
    }
    if (!errorObj.errorStatus && errorObj.errorType == 'new') {
      this.error_new = '';
      this.isValid.new = true;
    }
    // 確認新使用者代號和確認新使用者代號是否一致
    if (this.newuserid == this.confirmid && (this.newuserid.length != 0 && this.confirmid.length != 0)) {
      console.log("if == true");
      this.error_confirm = "";
      this.isValid.confirm = true;
    }
  }
  comfirmidCheck() {   //Foucus Leave時才進行使用者代號檢核
    this.isValid.confirm = false;
    this._confirmid = this.confirmid;
    let errorObj = this.checkCode(this._newuserid, this._confirmid, 'confirm');
    if (errorObj.errorType == 'confirm') {
      this.error_confirm = errorObj.errorMsg;
      if (this.error_confirm == "") {
        this.isValid.confirm = true;
      } else {
        this.isValid.confirm = false;
      }
    } else {
      this.error_confirm = '';
      this.isValid.confirm = true;
    }
    if (errorObj.errorType == 'new_confirm') {
      this.error_confirm = errorObj.errorMsg;
      if (this.error_confirm == "") {
        this.isValid.confirm = true;
      } else {
        this.isValid.confirm = false;
      }
    }
    if (!errorObj.errorStatus && errorObj.errorType == 'confirm') {
      this.error_confirm = '';
      this.isValid.confirm = true;
    }
  }

  onPreviousClick() {
    this.router.navigate(['/user-setting-change']);
  }
}
