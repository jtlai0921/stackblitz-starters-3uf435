import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';

@Component({
  selector: 'app-user-setting-change',
  templateUrl: './user_setting_change.component.html',
  styleUrls: ['./user_setting_change.component.css']
})
export class UserSettingChangeComponent implements OnInit {

  constructor(
    public router: Router,
    public layout: LayoutService
  ) {
    
    this.layout.setHeaderStatus({
      status: true,
      title: 'USERSETTING.TITLE',
      backEvent: false
    })
    this.layout.checkFooterUpdate("/user-setting");
  }

  ngOnInit() {
  }
  public dataList = [
    {
      "url": "quick_login",
      "name": "SUB_MENU.QUICKLOGIN" // 快速登入與交易
    }, {
      "url": "device-manage",
      "name": "SUB_MENU.DEVICE_MANAGE" // 裝置管理員
    }, {
      "url": "defaultLoginPage",
      "name": "SUB_MENU.DEFAULTLOGIN" // 預設登入頁
    }, {
      "url": "default_currency",
      "name": "SUB_MENU.DEFAULTCURRENCY" // 預設幣別
    }, {
      "url": "lang",
      "name": "SUB_MENU.TRANSLATE" // 變更語系
    }
  ]

  public dataList2 = [
    // {
    //   "url": "user_code_change",
    //   "name": "SUB_MENU.CHANGEUSERID" // 變更使用者代號
    // }, 
    {
      "url": "do_change_password",
      "parameter": "userSet",
      "name": "SUB_MENU.CHANGEPASSWORD" // 變更交易/登入密碼
    }
    // , {
    //   "url": "",
    //   "name": "SUB_MENU.CHANGECERTIFICATE" // 變更憑證密碼
    // }
  ]

  Link(e) {
    console.log("url");
    let url = "../" + e.url;
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






