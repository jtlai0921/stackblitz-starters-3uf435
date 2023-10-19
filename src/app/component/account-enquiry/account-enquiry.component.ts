import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { FunctionListService } from '../../shared/service/customize/functionList.service';

@Component({
  selector: 'app-account-enquiry',
  templateUrl: './account-enquiry.component.html',
  styleUrls: ['./account-enquiry.component.css']
})
export class AccountEnquiryComponent implements OnInit {

  pageType = 'depositSumPage'; // 頁面類型
  tabIndex = 0;
  detailReq;
  homeReq;
  formWho;
  // arrowImg = 'u4449.png';
  menuType = 'first';
  from = "";
  OldPage = "";
  menuPage = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public layout: LayoutService,
    private storage: LocalStorageService,
    private functionList: FunctionListService,
    private popup: PopupService
  ) {
    let isLogin = this.storage.get("isLogin");
    //驗證用戶是否已登入
    if (!isLogin) {
      //註冊登入後要返回的網址
      this.layout.RegistLoginRedirect();
      //返回登入頁
      this.layout.redirectLogin();
    } else {
      this.layout.setHeaderStatus({
        status: true,
        title: 'MENU.ACT_QUERY', // 帳戶查詢
        backEvent: false
      });
    }
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.from == "home" || (params.from == "notification" && params.type == "depositSumPage")) {
        this.from = params.from;
        this.homeReq = {
          company: params.company,
          country: params.country,
          companyType: params.companyType,
          product: params.product,
          currency: params.currency
        };
      }
      if ((params.from == "agree" || params.from == "notification") && params.type == "depositDetailPage") {
        this.from = params.from;
        this.homeReq = {
          company: params.company,
          acctNo: params.acctNo
        };
      }

      if (params.type == 'depositSumPage' ||
        params.type == 'depositDetailPage' ||
        params.type == 'loanSumPage' ||
        params.type == 'inquiryPage' ||
        params.type == 'billColPage' ||
        params.type == 'menuPage' ||
        params.type == 'transPage' ||
        params.type == 'reservationQuery') {
        this.onTabClick(params.type);
      }

      if (params.type == 'loanDetailPage') {
        this.homeReq.Detail = true;
        this.onTabClick('loanSumPage');
      }
    });
  }


  onTabClick(page) {

    if (this.from != "") {
      this.from = "";
    } else {
      this.homeReq = undefined;
    }
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.ACT_QUERY', // 帳戶查詢
      backEvent: false
    });
    if (!this.checkPermission(page)) {
      return;
    }

    if (page !== 'menuPage' && page !== this.OldPage) {
      this.popup.setLoading(true);
      this.OldPage = page;
    }
    if(page !=="menuPage" ){
      this.pageType = page;
    }
    
    // this.arrowImg = 'u4449.png';
    switch (page) {
      // 存款概要
      case 'depositSumPage':
        this.tabIndex = 0;
        // this.menuType = 'first';
        this.menuPage = false;
        break;

      // 存款明細
      case 'depositDetailPage':
        this.tabIndex = 1;
        // this.menuType = 'first';
        this.menuPage = false;
        break;

      // 放款概要
      case 'loanSumPage':
        this.tabIndex = 2;
        // this.menuType = 'first';
        this.menuPage = false;
        break;

      case 'menuPage':
        this.menuPage = !this.menuPage;
        // this.arrowImg = 'u4609.png';
        break;

      //匯款查詢
      case 'inquiryPage':
        this.tabIndex = 3;
        // this.menuType = 'second';
        this.menuPage = false;
        break;

      //票據查詢
      case 'billColPage':
        this.tabIndex = 4;
        // this.menuType = 'second';
        this.menuPage = false;
        break;

      //交易紀錄
      case 'transPage':
        this.tabIndex = 5;
        // this.menuType = 'second';
        this.menuPage = false;
        break;
      //約轉取消
      case 'reservationQuery':
        this.tabIndex = 5;
        // this.menuType = 'second';
        this.menuPage = false;
        break;
      default:
        break;
    }
  }

  private checkPermission(page: string) {
    var permission = ""
    var permissionGroup = ""
    console.log("page===========", page);
    switch (page) {
      // 存款概要
      case 'depositSumPage':
        permission = FunctionListService.ACCT_SUMM;
        break;
      // 存款明細
      case 'depositDetailPage':
        permissionGroup = FunctionListService.DepositDetailGroupKey;
        break;

      // 放款概要
      case 'loanSumPage':
        permission = FunctionListService.LOAN_DET_INQ;
        break;

      //票據查詢
      case 'billColPage':
        permissionGroup = FunctionListService.BillCollectionGroupKey;
        break;
      //交易紀錄
      case 'transPage':
        permission = FunctionListService.ATM_TXN;
      default:
        break;
    }
    if (permission == "" && permissionGroup == "") {
      return true;
    }
    if ((permission != "" && !this.functionList.checkHasFunction(permission)) ||
      (permissionGroup != "" && !this.functionList.checkHasFunctionGroup(permissionGroup))) {
      this.popup.setConfirm({
        content: "MENU.NO_PERMISSION"
      });
      return false;
    }
    return true;
  }

  getActive(index) {
    if (this.tabIndex == index) {
      if (document.getElementById("active") != null) {
        let elePos = document.getElementById("active").getBoundingClientRect();
        document.getElementById("scrolllefttest").scrollLeft = elePos['width'] * (index - 1);
      }
      return "active";
    }
    return "";
  }

  toDepositDetailPage(e) {
    this.detailReq = e;
    this.homeReq = undefined;
    this.formWho = 'deposit_summary';
    this.onTabClick('depositDetailPage');
  }

  getMenuType(e) {
    // this.pageType = e;
    this.onTabClick(e);
  }

}
