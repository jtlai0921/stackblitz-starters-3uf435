
import { Component } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { CheckService } from '../../../shared/service/global/check.service';

declare var $;

@Component({
  selector: 'app-pop-input',
  templateUrl: './pop-input.component.html',
  styleUrls: ['./pop-input.component.css']
})
export class PopInputComponent {
  private _subscribe;
  public Isopen = false;
  private title = '';
  private placeholder = '';
  private cancelTxt = '';
  private checkTxt = '';
  private event: any;
  private errEvent: any;
  private OKBTN;
  private _value = '';
  public inPassword = false;
  public keyboardPassword = false;
  public passwordErrorMsg = "";
  public isPasswordError = false;

  /**
   * [輸入框內容檢核事件]
   * 型態: function
   * 內容: 定義檢核規格與對應之錯誤訊息顯示
   * 回傳值: true/false(檢核函式必須return boolean值)
   */
  private checkEvent: any;
  
  constructor(
    private _langTransService: LangTransService,
    private pop: PopupService,
    private _CheckService : CheckService
  ) {
    console.log('PopConfirmComponent constructor');
    this._subscribe = this.pop.inputSetting.subscribe(
      (setting: object) => {
        this.Isopen = setting["isOpen"] == undefined ? true : setting["isOpen"];
        this.title = setting['title'] || '';
        this.placeholder = this._langTransService.instant(setting['placeholder'] || '');
        this.event = setting['event'];
        this.checkTxt = this._langTransService.instant(setting['checkTxt'] || '');
        this.cancelTxt = setting['cancelTxt'] || '';
        this.errEvent = setting['errEvent'];
        this.inPassword = setting['inPassword'];
        if(setting.hasOwnProperty('default')){
          this._value = setting['default'];
        }
        this.checkEvent = setting['checkEvent'];
      }
    );
    this.OKBTN = this._langTransService.instant('BTN.DETERMINE');
  }

  //密碼驗證
  checkPassword(){
    let result = this._CheckService.verifyPassword(this._value);
    this.passwordErrorMsg = result.errorMessage;
    this.isPasswordError = !result.isValid;
  }

  Cancel() {
    this.Isopen = false;
    if (typeof this.errEvent == 'function') {
      this.errEvent(false);
    }
	//重設錯誤訊息
    this.passwordErrorMsg = "";
    this.isPasswordError = false;
  }

  Submit() {
    if(this.inPassword){
      this._value = $('#password')[0].value;
    }

    // 根據外部要求檢核輸入內容值
    if (typeof this.checkEvent == 'function') {
      let result = this.checkEvent(this._value);
      if (!result) {
        // 檢核錯誤時，中斷後續處理流程並維持popup開啟狀態
        return;
      }
    } 

    this.Isopen = false;
    
    if (typeof this.event == 'function') {
      this.event(this._value);
    }
	//重設錯誤訊息
    this.passwordErrorMsg = "";
    this.isPasswordError = false;
  }
  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }
  createKeyboard(){
    this.pop.setKeyboard(true);
  }
}




