import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit,EventEmitter } from '@angular/core';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { Observable, Subject} from 'rxjs';
import { PopupService } from '../../../shared/service/global/popup.service';

@Component({
  selector: 'app-financeRoot',
  templateUrl: './financeRoot.component.html',
  styleUrls: ['./financeRoot.component.css']
})
export class FinanceRootComponent implements OnInit {

  public isLogin;
  public isPageInit;
  public isTabBarVisiable;
  public selectedPage;
  private OldPage = "";
  public loginStatus = this.storage.get("isLogin") //登入狀態

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private layout: LayoutService,
    private storage: LocalStorageService,
    private popup:PopupService,
  ) {
    this.route.queryParams.subscribe(params => {
      if(params.type == undefined){
        this.initPage("");
        // 從footerBar點擊icon回到當前功能頁面，關閉loading畫面
        this.popup.setLoading(false);
      }else if(typeof params.type == 'string'){
        this.initPage(params.type)
      }
      this.isPageInit = true;
    });
  }

  ngOnInit() {
    FinanceRootComponent.initExitEvent()
    // Init footer
    this.isLogin = this.storage.get("isLogin");

    // Init default page and title
    if (!this.isPageInit) {
      this.initPage(this.selectedPage);
    }
  }

  /**
   * Init page and title
   * @param page Page name
   */
  public initPage(page) {
    // Display L2 tab bar
    this.isTabBarVisiable = true;
    if(!this.loginStatus){
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }else{
      this.layout.setHeaderStatus({
        rightIcon: false
      })
    }
    // Init layout by selected page
    switch (page) {
      // 匯率換算器
      case "exchangeRateConverter":
        this.selectedPage = page;
        this.layout.setHeaderStatus({
          status: true,
          title: "MENU.FINANCE", //金融資訊
          backEvent: null
        });
        break;

      // 利率查詢
      case "interestRateQuery":
        this.selectedPage = page;
        this.layout.setHeaderStatus({
          status: true,
          title: "MENU.FINANCE", //金融資訊
          backEvent: null
        });
        break;

      // 匯率查詢
      default:
        this.selectedPage = "exchangeRateQuery";
        this.layout.setHeaderStatus({
          status: true,
          title: "MENU.FINANCE", //金融資訊
          backEvent: null
        });
        break;
    }
    this.OldPage = this.selectedPage;
  }

  /**
   * Navigate to target page
   * @param page Target page
   */
  public navigate(page) {
    console.log(page);
    console.log(this.OldPage);
    if(page !==this.OldPage)
    {
      this.popup.setLoading(true);
      this.OldPage = page;
      
    }
    this.router.navigate(["/finance"], { queryParams: { "type": page } });
  }

  /**
   * Set L2 tab bar visiable or not
   * @param isVisiable Is visiable or not
   */
  public setTabBarVisiable(isVisiable) {
    this.isTabBarVisiable = isVisiable;
  }
  //canDeactivateValue : Subject<boolean>;
  canDeactivate(): Observable<boolean> | boolean {
    // FinanceRootComponent.exitEvent.emit()
    if(FinanceRootComponent.canExit){
      return true;
    }
    FinanceRootComponent.canDeactivateValue = new Subject<boolean>();
    this.popup.setConfirm({
      content: "CUSTOM_CURRENCY.EXIT_CONTENT",
      checkTxt: "CUSTOM_CURRENCY.EXIT_CONFIRM",
      cancelTxt: "CUSTOM_CURRENCY.EXIT_CANCEL",
      event : ()=>{
        FinanceRootComponent.exitEvent.emit();
        this.layout.setHeaderStatus({
          status: true,
          title: "EXCHANGE_CONVERTER.TITLE",
          backEvent: null
        });
      },
      errEvent : ()=>{
        FinanceRootComponent.canDeactivateValue.next(true)
        this.layout.setHeaderStatus({
          status: true,
          title: "EXCHANGE_CONVERTER.TITLE",
          backEvent: null
        });
      }
    })
    return FinanceRootComponent.canDeactivateValue;
  }
  static canDeactivateValue : Subject<boolean>;
  static exitEvent:EventEmitter<object> = new EventEmitter();
  static canExit = true;
  static initExitEvent(){
    this.canDeactivateValue = new Subject<boolean>();
    this.exitEvent.subscribe(()=>{})
    this.canExit = true;
  }
 
}
