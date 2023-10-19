/**
 * header功能選單
 */
import { Component, NgZone, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { environment } from '@environments/environment';
import { Logger } from '@systems/system/logger/logger.service';
import { Subscription } from 'rxjs';
// == library == //
import { FormateService } from '@template/formate/formate.service';
import { LogoutService } from '@pages/login/shared/logout.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { AppCtrlService } from '@systems/system/app-ctrl/app-ctrl.service';
// import { ExitAppService } from '@lib/plugins/exit-app.service';
// import { QrcodeService } from '@lib/plugins/qrcode.service';

// == show == //
import { ConfirmService } from '@template/msg/confirm/confirm.service';

// == data == //
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { HeaderOptions } from '@systems/route/layout/header/header-options';
import { PersonalInfo } from '@systems/route/layout/header/personal-info';
// import { OverAmountOptions } from '@shared/layout/over-amount-style/over-amount-options';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit {
  options: HeaderOptions;
  title: string;
  leftIcon: string;
  leftBtnClass: string;
  leftBtnText: string;
  rightBtnText: string;
  rightBtnClass: string;
  rightIcon: string;
  headerType: string; // header 類型
  is_login = false;
  // ==== 其他顯示資料 object ==== //
  // amountOption: OverAmountOptions;
  // personalInfo: PersonalInfo;

  // ==== subscript object ==== //
  private subscriptionLeftBtnClickChange: any;
  private subscriptionRightBtnClickChange: any;
  private subscriptOption: any;
  private subscriptUpdateOption: any;
  private subscriptPersonalInfo: any;
  // subscriptCloseMenu: any;
  // private subscriptDisableNativeReturn: any;
  private subscriptSwipeLeft: Subscription;
  private subscriptSwipeRight: Subscription;
  private subscriptionLogin: any;
  private subscriptionLogout: any;

  // ==== 其他資料設定 object ==== //
  private disableNativeReturn = false;
  private hasDialog = false;

  // ==== 按鈕事件 ==== //
  /**
   * 左側按鈕事件
   * 後續被subscribe複寫
   */
  leftBtnClick = () => { };

  /**
   * 右側按鈕事件
   * 後續被subscribe複寫
   */
  rightBtnClick = () => { };

  constructor(
    private zone: NgZone,
    private _logger: Logger,
    private el: ElementRef,
    private _render: Renderer2,

    // == library == //
    // private exitApp: ExitAppService,
    private appCtrl: AppCtrlService,
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _formateService: FormateService,
    private logoutService: LogoutService,


    // == show == //
    // private scan: QrcodeService,
    private confirm: ConfirmService

  ) {
    this.androidBackCtrl();
    this.options = new HeaderOptions();
    this.options.style = 'login';
    if (!environment.NATIVE) {
      this.options.style = 'normal';
    }
    this.modifyLeftEvent('ignor');
    this.modifyRightEvent('ignor');
    // this.personalInfo = new PersonalInfo();
    // this.setBodyClass(this.options.style);
    // this.amountOption = new OverAmountOptions();
    // this.amountOption.animate_flag = true;

  }


  ngOnInit() {
    this.subscriptionLogin = this.appCtrl.changeLogin.subscribe((value: any) => {
      // 登入
      this.is_login = true;
    });
    this.subscriptionLogout = this.appCtrl.changeLogout.subscribe((value: any) => {
      // 登出
      this.is_login = false;
    });
    this.subscriptionLeftBtnClickChange = this.headerCtrl.changeLeftBtnClick.subscribe((value: any) => {
      // 左側事件設定
      this.modifyLeftEvent(value);
    });
    this.subscriptionRightBtnClickChange = this.headerCtrl.changeRightBtnClick.subscribe((value: any) => {
      // 右側事件設定
      this.modifyRightEvent(value);
    });
    this.subscriptOption = this.headerCtrl.changeOption.subscribe((value: any) => {
      // 重新設定header
      this._logger.log('HeaderCtrl', 'reset option', value);
      this.options = value;
      this._modifyHeaderOptions();
    });
    this.subscriptUpdateOption = this.headerCtrl.updateOptionSubject.subscribe((value: any) => {
      // 修改header設定
      let headerOption = this.navgator.getHeader();
      this.options = { ...headerOption, ...value };
      this._logger.log('HeaderCtrl', 'update option', headerOption, value);
      this._modifyHeaderOptions();
    });
    // this.subscriptDisableNativeReturn = this.headerCtrl.disableNativeReturnSubject.subscribe((disable: boolean) => {
    //   this.disableNativeReturn = disable;
    // });
    // this.subscriptPersonalInfo = this.headerCtrl.changePersonalInfo.subscribe((value: PersonalInfo) => {
    //   this.personalInfo = value;
    // });

    // -- event -- //
    this.headerCtrl.onLeftEventClickSubject.subscribe((value: any) => {
      // 左側按鈕點選事件
      this.leftBtnClick();
    });



  }

  /**
   * 登出按鈕點擊
   */
  onLogoutBtnClick() {
    this._logger.log('HeaderCtrl', 'dologin btn');
    if (this.is_login) {
      this.logoutService.logout();
    } else {
      this.navgator.push('login');
    }
  }

  /**
   * 參數整理
   * [事件]
   * 回首頁事件: this.backToHome
   * 回前一功能(history): this.back
   */
  private _modifyHeaderOptions() {
    // 左側按鈕樣式
    this.modifyLeftEvent(this.leftBtnClick, this.options.leftBtnIcon);

    // 右側按鈕樣式
    if (!!this.options.rightBtnIcon) {
      this.modifyRightEvent(this.rightBtnClick, this.options.rightBtnIcon);
    }

    this.setHeaderClass();

  }

  /**
   * 修改左側選單事件
   * @param e 事件
   * @param left_icon 左側icon控制
   */
  private modifyLeftEvent(e?: any, left_icon?: string) {
    if (typeof e == 'string') {
      // 傳入字串，視為要設定left_icon
      left_icon = e;
    }
    // 左側按鈕樣式
    switch (left_icon) {
      case 'back':
        // 查詢、選單等返回按鈕
        this.leftBtnClick = this.backToHome; // 回首頁
        this.leftBtnClass = 'btn_back';
        this.leftBtnText = '';
        break;
      case 'edit-back':
        // 編輯交易等返回按鈕
        this.leftBtnClick = this.editBackEvent; // 編輯返回
        this.leftBtnClass = 'btn_back';
        this.leftBtnText = '';
        break;
      case 'ignor': // 關閉左側按鈕
        this.leftBtnClick = this.ignorEvent;
        this.leftBtnClass = '';
        this.leftBtnText = '';
        break;
      // case 'cancel':
      //   // 取消文字(目前不提供)
      //   // this.leftBtnClick = this.back;
      //   this.leftBtnClass = 'btn_txt';
      //   this.leftBtnText = 'BTN.CANCEL';
      //   break;
      // case 'menu':
      //   // 選單事件(目前沒有)
      //   break;
      default:
        // 其他類型: 不提供變動left icon!!!
        if (typeof e == 'function') {
          this.leftBtnClick = e;
        } else {
          this.leftBtnClick = this.backToHome; // 回首頁
        }
        if (typeof left_icon == 'string') {
          // 有設定的才調整預設: 因為想改但不知道要改什麼
          this.leftBtnClass = '';
          this.leftBtnText = '';
        }
        break;
    }
  }

  /**
   * 修改右側選單事件
   * @param e 事件
   * @param right_icon 右側icon控制
   */
  private modifyRightEvent(e?: any, right_icon?: string) {
    if (typeof e == 'string') {
      // 傳入字串，視為要設定right_icon
      right_icon = e;
    }
    switch (right_icon) {
      case 'qrcode': // qrcode
        // this.rightBtnClick = this.back;
        this.rightBtnClass = 'btn_qrcode';
        this.rightBtnText = '';
        break;
      case 'edit': // 編輯
        // this.rightBtnClick = this.back;
        this.rightBtnClass = 'btn_txt';
        this.rightBtnText = 'BTN.EDIT';
        break;
      case 'finish': // 完成
        // this.rightBtnClick = this.back;
        this.rightBtnClass = 'btn_txt';
        this.rightBtnText = 'BTN.FINISH';
        break;
      case 'customer_service': // 客服
        // this.rightBtnClick = this.back;
        this.rightBtnClass = 'btn_customer_service';
        this.rightBtnText = '';
        break;
      case 'ignor': // 不提供右側按鈕
        this.leftBtnClick = this.ignorEvent;
        this.rightBtnClass = '';
        this.rightBtnText = '';
        break;
      default:
        // 其他類型: 不提供變動right icon!!!
        if (typeof e == 'function') {
          this.rightBtnClick = e;
        } else {
          this.rightBtnClick = this.backToHome; // 回首頁
        }
        if (typeof right_icon == 'string') {
          // 有設定的才調整預設: 因為想改但不知道要改什麼
          this.rightBtnClass = '';
          this.rightBtnText = '';
        }
        break;
    }
  }


  /**
   * 調整header Class設定
   */
  private setHeaderClass() {
    let set_class = this._formateService.checkField(this.options, 'headerClass');
    if (set_class != '') {
      this.headerType = set_class;
    } else {
      this.headerType = 'default';
    }
    this._logger.error('HeaderCtrl', 'set', this.headerType, set_class, this.options);
  }


  // ----------------------------- [指定動作控制 Start] ----------------------------- //

  /**
   * Android實體返回鍵控制
   */
  private androidBackCtrl() {
    this._render.listen('document', 'backbutton', () => {
      this.appCtrl.onReturnBtn();
    });
    document.addEventListener('backbutton', () => {
      this._logger.step('AndridBack', 'ignor event');
    }, false);
  }

  /**
   * 返回動作
   */
  private back() {
    if (!!this.options && !!this.options.backPath) {
      this.navgator.popTo(this.options.backPath);
    } else {
      this.navgator.pop();
    }
  }

  /**
   * eidt-back的控制事件
   */
  private editBackEvent() {
    this.navgator.editBack();
  }

  /**
   * 返回home
   */
  private backToHome() {
    this.navgator.popTo('home');
  }

  /**
   * 無事件
   */
  private ignorEvent() {
    this._logger.log('HeaderCtrl', 'ignor event');
  }

  // ----------------------------- [指定動作控制 End] ----------------------------- //

}
