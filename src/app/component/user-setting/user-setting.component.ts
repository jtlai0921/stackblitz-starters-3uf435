import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { PopupService } from '../../shared/service/global/popup.service';
@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  constructor(
    public router: Router,
    public layout: LayoutService,
    public popup: PopupService,
    public route: ActivatedRoute
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'USERSETTING.TITLE',
      backEvent: false
    })
    this.layout.checkFooterUpdate(this.router.url.substr(0,this.router.url.indexOf('?')) || this.router.url);

    this.route.queryParams.subscribe(params => {
      // 從footerBar點擊icon回到當前功能頁面，關閉loading畫面
      this.popup.setLoading(false);
    });
  }
  ngAfterViewInit() {
    // 關閉Loading畫面
    this.popup.setLoading(false);
  }
  ngOnInit() {
  }
  public dataList = [
    {
      "url": "quick_login",
      "name": "SUB_MENU.QUICKLOGIN", // 快速登入與交易
      "LoadingPage":false
    }, {
      "url": "device-manage",
      "name": "SUB_MENU.DEVICE_MANAGE", // 裝置管理員
      "LoadingPage":true
    }, {
      "url": "defaultLoginPage",
      "name": "SUB_MENU.DEFAULTLOGIN", // 預設登入頁
      "LoadingPage":false
    }, {
      "url": "default_currency",
      "name": "SUB_MENU.DEFAULTCURRENCY", // 預設幣別
      "LoadingPage":false
    }, {
      "url": "lang",
      "name": "SUB_MENU.TRANSLATE", // 變更語系
      "LoadingPage":false
    }
  ]

  public dataList2 = [
    {
      "url": "user_code_change",
      "name": "SUB_MENU.CHANGEUSERID" // 變更使用者代號
    }, {
      "url": "do_change_password",
      "parameter": "userSet",
      "name": "SUB_MENU.CHANGEPASSWORD" // 變更交易/登入密碼
    }, {
      "url": "",
      "name": "SUB_MENU.CHANGECERTIFICATE" // 變更憑證密碼
    }
  ]

  Link(e) {
    let url = "../" + e.url;    
    if(e.LoadingPage)
    {
      this.popup.setLoading(true);
    }
    if (e.parameter != undefined) {
      this.router.navigate([url], { queryParams: { 'type': e.parameter } });
    } else {
      this.router.navigate([url]);
    }
  }

  onLink(item) {
    console.log(item);
    let url = '../' + item;
    this.router.navigate([url]);
  }
}






