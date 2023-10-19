import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';
import { PopupService } from '../../../shared/service/global/popup.service';

@Component({
  selector: 'app-do-activite',
  templateUrl: './do-activite.component.html',
  styleUrls: ['./do-activite.component.css']
})
export class DoActiviteComponent implements OnInit {

  constructor(
    public layout: LayoutService,
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
  ActivateCode = "";
  isInputError = false;
  public avtivite() {
    // if (this.ActivateCode.toString().length == 0) {
    //   this.popup.setConfirm({
    //     content: "LOGINOUT.ENTER_START_CODE", // 請輸入啟動碼
    //     event: () => { }
    //   });
    //   return;
    // }
    console.log("帳號啟用中");
    this.doLogin.doActivate(this.ActivateCode.toString());
  }

  public cancel(){
    this.router.navigate(['/login'],{queryParams:{'type':'error'}});
  }


  checkInput(){
    if(this.ActivateCode != ""){
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
