// == 聯絡客服 == //
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { CONTACT_SETTING } from '../../../assets/configuration/contact';
import { PopupService } from '../../shared/service/global/popup.service';
import { Router } from '@angular/router';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  // 參數設定
  phone_title = this._langTransService.instant('CONTACT_US.PHONE'); // 電話
  tax_title = this._langTransService.instant('CONTACT_US.FAX') // 傳真
  mail_title = "assets/ui/images/u2309.png";
  data: any[]; // 頁面資料
  loginStatus = this.storage.get('isLogin'); // 登入狀態Flag (若為未登入狀態 => 使用者代號隱碼處理)
  tempPhone: string;

  constructor(
    private layout: LayoutService,
    private popup: PopupService,
    private storage: LocalStorageService,
    private _langTransService: LangTransService,
    private router: Router
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.CONTACT_US', // 聯絡客服
      rightIcon: false
    })
    this.layout.checkFooterUpdate(this.router.url.substr(0,this.router.url.indexOf('?')) || this.router.url);
    if(!this.loginStatus){
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }
  }

  ngOnInit() {
    this.data = CONTACT_SETTING; // 載入客服清單設定檔 contact.ts

    // 客服清單載入檢核
    // console.log('data type',this.data);
    if (typeof this.data === 'undefined') {
      this.popup.setConfirm({
        content: '載入設定檔的錯誤代碼資訊(待定)！！',
        event: () => {
          // 客服清單載入檢核失敗導頁(待定)
          this.router.navigate(['/']);
        }
      });
    }
  }

  ngAfterViewInit() {
      this.popup.setLoading(false);
  }


  // 撥打客服
  confirmCall(phone: string) {
    this.tempPhone = phone;
    if (typeof this.tempPhone !== 'string' || this.tempPhone === '') {
      // console.error('invalid phone!!!!');
      this.popup.setConfirm({
        content: 'CONTACT_US.DIAL_ERROR', // 撥號失敗！！
        event: () => { }
      });
      return;

    } else {
      const tellUrl = 'tel:' + this.tempPhone;
      // console.log('tellUrl',tellUrl);
      window.open(tellUrl);
    }
  }


}
