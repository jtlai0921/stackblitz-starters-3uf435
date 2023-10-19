import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';
import { PopupService } from '../../../shared/service/global/popup.service';

@Component({
  selector: 'app-do-register-device',
  templateUrl: './do-register-device.component.html',
  styleUrls: ['./do-register-device.component.css']
})
export class DoRegisterDeviceComponent implements OnInit {

  constructor(public layout: LayoutService,
    public router: Router,
    public routeAct: ActivatedRoute,
    public storage: LocalStorageService,
    public doLogin: DoLoginService,
    public popup: PopupService
  ) { }

  ngOnInit() {
    this.layout.setHeaderStatus({
      topDisapear: true
    })
  }
  AuthenticationCode = "";
  isInputError = false;
  public comfirm() {
    // if (this.AuthenticationCode.toString().length == 0) {
    //   this.popup.setConfirm({
    //     content: "LOGINOUT.ENTER_REGISTR_CODE", // 請輸入裝置註冊碼
    //     event: () => { }
    //   });
    //   return;
    // }
    console.log("裝置註冊碼確認中");
    this.doLogin.doRegisterConfirm(this.AuthenticationCode.toString());
  }

  cancel() {
    this.router.navigate(['/login'],{queryParams:{'type':'error'}});
  }

  checkInput(){
    if(this.AuthenticationCode != ""){
      this.isInputError = false;
    }else{
      this.isInputError = true
    }
  }

  ngOnDestroy(){
    this.layout.setHeaderStatus({
      topDisapear: false
    })
  }


}
