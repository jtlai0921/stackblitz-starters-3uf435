/**
 * Footer
 */
declare var window;

import { Component, OnInit,NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { Config } from '../../../../assets/configuration/config'
import { PopupService } from '../../../shared/service/global/popup.service';
import { LINKS } from '../../../../assets/configuration/links';
import { Http } from '@angular/http';
import { DoLogoutService } from '../../../shared/service/customize/do-logout.service';
import { GetSessionKeyService } from '../../../shared/service/global/getSessionKey.service'
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';
import { DeviceService } from '../../../shared/service/cordova/device.service';
import { BeforeLoginMenuList, BeforeLoginSubMenuList, AfterLoginMenuList, AfterLoginSubMenuList } from '../../../../assets/configuration/menu';
import { PushService } from '../../../shared/service/cordova/push.service';
declare var hitrust;
declare var navigator;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  activeClass = '';
  active = false;
  isOpen = false;
  isLogin = false;
  isLinksExpand = false;
  isLinksExpand_login = false;
  isLinksExpand_OTP = false;
  paramInHeaderComponet = 1;
  announcementCount;
  WelcomeWord = "";
  UserName = "";
  UserAccount = "";
  appVersion;
  contentVersion = Config.WWW_VERSION;
  versionDate = Config.VERSION_DATE;
  header_title = '';
  header_logo = false;
  backEvent: any;
  rightIcon: any;
  hasNewNotification = false;
  hasNoticePermission = true;

  //控制左上及右上圖示是否消失
  topDisapear = false;

  backEventStack = [];
  initbackStack = false;


  constructor(
    public router: Router,
    public layout: LayoutService,
    public storage: LocalStorageService,
    public popup: PopupService,
    public http: Http,
    public doLogoutService: DoLogoutService,
    public session: GetSessionKeyService,
    public functionList: FunctionListService,
    public doLogin: DoLoginService,
    public device: DeviceService,
    public push : PushService,
    public ngzone : NgZone
  ) {
    document.addEventListener('backbutton', (event)=>{
      if(hitrust && hitrust.device.platform.toLowerCase() == 'android') {
        if (this.backEventStack.length > 0) {
          this.ngzone.run(()=>{
            var backEvent = this.backEventStack.pop();
            backEvent();
          })
        }else{
          this.ngzone.run(()=>{
            this.popup.setConfirm(
              { 
                content:"BTN.EXIT_APP",
                event:()=>{
                  this.ngzone.runOutsideAngular(()=>{
                    navigator.app.exitApp();
                  })
                },
                cancelTxt:"BTN.CANCEL",
                errEvent:()=>{ }
              }
            )
          })
        }
        event.preventDefault()
        return false;
      }
    });
    this.appVersion = device.getDeviceInfo('appinfo')['version'];
    this.layout.headerUpdated.subscribe(
      (status) => {
        //若有新通知，則顯示點點icon
        if(this.storage.get("hasNewNotification")){
          this.hasNewNotification = true;
        }else{
          this.hasNewNotification = false;
        }
        //直接控制開關
        if (typeof status === 'boolean') {
          this.isOpen = status;
        };
        //控制標題
        if (typeof status === 'string') {
          this.header_title = status;
        }
        //多重處理
        if (typeof status === 'object') {
          if (status.hasOwnProperty('status')) {
            this.isOpen = status['status'];
          }
          if (status.hasOwnProperty('title')) {
            this.header_title = status['title'];
          }

          //控制左上及右上圖示是否消失
          if(status.hasOwnProperty('topDisapear')){
            this.topDisapear = status['topDisapear'];
          }

          if (status.hasOwnProperty('initbackStack')) {
            // [新制] Back Event Stack
            this.initbackStack = status['initbackStack'];
            // 初始化backEvent軌跡紀錄
            if (this.initbackStack)
              this.backEventStack = [];

            // 儲存backEvent
            if (status.hasOwnProperty('backEvent') && typeof status['backEvent'] == 'function')
              this.backEventStack.push(status['backEvent']);
          } else {
            // [舊制] Back Event
            if (status.hasOwnProperty('backEvent')) {
              this.backEventStack = [];
              if (typeof status['backEvent'] == 'function')
                this.backEventStack.push(status['backEvent']);
            }
          }

          this.rightIcon = status.hasOwnProperty('rightIcon') ? status['rightIcon'] : null;
          this.header_logo = status['logo'] ? status['logo'] : false;
          this.backEventStack = status['backEventStack'] ? status['backEventStack'] : this.backEventStack;
        }

        var announcement = this.storage.get('announcement');
        if (typeof announcement != 'undefined' && announcement.length > 0) {
          this.announcementCount = '(' + announcement.length + ')';
        }
        
        // this.WelcomeWord = UserName + "\n(" + UserAccount + ")";
        var login = this.storage.get('isLogin');
        this.isLogin = login;
        this.initMenuList();
        

        if(this.isLogin){
          this.UserName = this.storage.get('userName');
          this.UserAccount = this.storage.get('loginUserAccount');
          this.checkHeaderNoticeIcon();
        }
      }
    );
    //背景開啟的推播的觸發事件
    this.push.RedirectToNitification.subscribe(()=>{
      this.ngzone.run(()=>{
        this.notice();
      });
    });
    this.layout.backEventTrigger.subscribe(() => {
      this.ngzone.run(() => {
        this.back();
      });
    });
    this.layout.backEventClear.subscribe(() => {
      this.ngzone.run(() => {
        this.backEventStack = [];
      });
    });
  }


  NowList = []
  private initMenuList() {
    this.NowList = [];
    
    var mainList = !this.isLogin ? BeforeLoginMenuList : AfterLoginMenuList;
    let subList = !this.isLogin ? BeforeLoginSubMenuList : AfterLoginSubMenuList;
    mainList.forEach(element => {
      element["isVisible"] = true;
      element["sub"] = false;

      // 使用者登入後，檢查通知權限，沒權限則隱藏
      if (element.key == "MENU.NOTICE") {
        if (!this.functionList.checkHasFunction(element['permission']))
          return;
      }

      // 子功能項選單
      let subMenu = [];
      
      subList.forEach(sub_element => {
        
        // 使用者登入後，檢查通知設定權限，沒權限則隱藏
        if(sub_element.key == "SUB_MENU.NOTIFICATIONSETTING" ){
          if (!this.functionList.checkHasFunction(sub_element['permission'])){
            return;
          }
        }
        
        if (sub_element["main"] == element["key"]) {
          sub_element["sub"] = true;
          subMenu.push(sub_element);
          element['subMenu'] = subMenu;
          element["isVisible"] = false;
        }
      });

      // 任一子功能項有操作權限時，才顯示主功能項
      if (element['link'] != "sub" || (element['link'] == "sub" && subMenu.length != 0))
        this.NowList.push(element);
    });
  }

  private ExpandCloseMenu(key) {
    this.NowList.forEach(item => {
      if (item.key != key) {
        item.isVisible = false;
      }
    })
  }

  private menuClick(menu_item) {
    if (menu_item["link"] == "sub") {
      menu_item["isVisible"] = !menu_item["isVisible"];
      this.ExpandCloseMenu(menu_item["key"]);
    } else if (menu_item["link"].startsWith("/")) {
      if (menu_item["permission"] != undefined &&
        menu_item["permission"] != "") {
        if (!this.functionList.checkHasFunction(menu_item["permission"])) {
          this.popup.setConfirm({
            content: "MENU.NO_PERMISSION"
          });
          return;
        }
      }else if(menu_item["permissionGroup"] != undefined &&
        menu_item["permissionGroup"] != ""){
          if (!this.functionList.checkHasFunctionGroup(menu_item["permissionGroup"])) {
            this.popup.setConfirm({
              content: "MENU.NO_PERMISSION"
            });
            return;
          }
      }
      this.linkTo(menu_item["link"], menu_item["parameter"]);
    } else if (menu_item["link"].startsWith("url")) {
      this.openUrl(menu_item["link"].split(":")[1])
    }
  }


  ngOnInit() {
    //this.initMenuList();
  }

  ngOnDestroy() {
    this.layout.headerUpdated.unsubscribe();
  }

  linkTo(url, parameter?) {
    this.toggle();

    if(url !== '/user-setting' && url !=='/user-setting-change' && url !== this.router.url.substr(0,this.router.url.indexOf('?')) && url !== this.router.url)
    {
      this.popup.setLoading(true);
    }
    if (parameter != null && parameter.length > 0) {
      this.router.navigate([url], { queryParams: {"type": parameter ,time: Date.now().toString()} });
    } else {
      this.router.navigate([url],{ queryParams: {time: Date.now().toString()}});
    }
  }

  loginSuccess() {
    this.storage.set("isLogin", true);
    this.storage.set("userName", "User999");
    this.storage.set("functionList", [
      "TXN_AUTH", "ACCT_OVERVIEW", "ACT_QUERY", "ACT_TRANS", "ACCT_SUMM", "ACCT_ACTIVITY", "LOAN_DET_INQ", "LOAN_DET_INQ", "TD_ACCT_SUMM",
      "TD_ACCT_DET", "INV_PRD_SUMM", "INV_PRD_DET", "ATM_TXN", "INTERNAL_TXN", "LCY_TXN", "FCY_TXN"]);
    
    console.log("Login Success");
    this.popup.setConfirm({
      content: "成功登入", // 成功登入
      event: () => {
        this.router.navigate(["/home"]);
      }
    });
  }

  otpLinkTo(type) {
    this.toggle();
    //this.isLinksExpand_OTP = false;
    //0:單人 1:多人

    this.storage.set("DemoOtpType", type == "0" ? "CCMPTX000185Rq1" : "CCMPTX000185Rq2");
    console.log(this.storage.get("DemoOtpType"));
    this.router.navigate(["/otp"]);
  }

  openUrl(key) {
    this.toggle();
    this.popup.setConfirm({
      content: 'LOGINOUT.LEAVE_APP_GO_OTHER', // 是否確定要離開當前應用程式?
      cancelTxt: 'BTN.NO', // 否
      checkTxt: 'BTN.YES', // 是
      event: () => {
        this.paramInHeaderComponet = 2;
        console.log('Parameter in HeaderComponet', this.paramInHeaderComponet);
        window.open(LINKS[key]["URL"], '_blank');
      }
    });
  }

  onBackClick() {
    this.toggle();
  }

  toggle() {
    this.active = !this.active;
    this.activeClass = (this.active) ? 'active' : 'close';
  }

  logginTest() {
    this.isLogin = true;
  }

  logout() {
    this.toggle();
    this.popup.setConfirm({
      content: "LOGINOUT.CHECK_LOGOUT", // 確認進行登出?
      cancelTxt: "BTN.CANCEL", // 取消
      event: () => {
        this.doLogoutService.Action_Logout().then(
          (response) => {
            this.router.navigate(["/logout"]);
          }, (error) => {
            this.router.navigate(["/logout"]);
          })
      }
    })
  }


  expandLinks() {
    this.isLinksExpand = !this.isLinksExpand
    
  }




  expandLinks_Login() {
    this.isLinksExpand_login = !this.isLinksExpand_login
  }

  expandLinks_OTP() {
    this.isLinksExpand_OTP = !this.isLinksExpand_OTP
  }
  
  back() {
    if (this.backEventStack.length > 0) {
      var backEvent = this.backEventStack.pop();
      backEvent();
    }
  }

  notice() {
    if (!this.functionList.checkHasFunction("ATM_TXN")) {
      this.popup.setConfirm({
        content: "MENU.NO_PERMISSION"
      });
    }else{
      this.popup.setLoading(true);
      // 清除所有BackEvent紀錄
      this.backEventStack = [];
      this.router.navigate(["/notification"],{ queryParams: { time: Date.now().toString()} });
    }
  }
  setting() {
    // 清除所有BackEvent紀錄
    this.backEventStack = [];
    this.router.navigate(["/personal_setting"]);
  }
  annouce(){
    // 清除所有BackEvent紀錄
    this.backEventStack = [];
    this.router.navigate(["/annou"]);
  }

  /**
   * 檢查有無通知權限，沒有則將右上通知訊息圖示隱藏
   */
  checkHeaderNoticeIcon(){
    if(!this.functionList.checkHasFunction("ATM_TXN")){
      this.hasNoticePermission = false;
    }else{
      this.hasNoticePermission = true;
    }
  }

}
