/**
 * 首頁
 */
import { Component, OnInit, setTestabilityGetter, AfterViewInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';
import { GetRelCustInqService } from '../../../shared/service/customize/getRelCustInq.service';
import { AcctSummPlusInqService } from '../../../shared/service/customize/acctSummPlusInq.service';
import { GetAcctOverviewInqService } from '../../../shared/service/customize/getAcctoverviewinq.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { LoanSummInqService } from '../../../shared/service/customize/loanSummInq.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { SortByService } from '../../../shared/service/global/sortby.service';
import { PopupService } from '../../../shared/service/global/popup.service';
declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {

  loanBarSize = '100%';
  depositBarSize = '100%';
  TopDropContent;
  BottomDropContent  //下層下拉選單內容值

  public cirlce0 = 'c0';
  public cirlce1 = 'c1';
  public cirlce2 = 'c2';
  public cirlce3 = 'c3';
  public nowIndex = 0;
  public direct = 'right';
  state: string = 'inactive';
  simpleView = false; // false => 有球的畫面, true => 沒有球的畫面

  private errMsg = "" //API錯誤訊息
  public res = [];
  public loanRes = [];
  //卡片資料源
  public cardSource
  public loanCardSource
  //金額總和
  public totalAmount
  public totalLoanAmount
  //依據Option res取出之資料集合
  public selectRes
  public selectLoanRes
  //可選的集合＆公司
  public selectOptions
  public selectedOption
  public selectedOptionIndex = 0
  //下方可選群組
  public selectGroups
  public selectedGroup
  public selectedGroupIndex = 0
  public countryGroup
  public nowCurrency
  //權限
  public isActivity
  public isSumm

  public queryDate
  public cardRightArrow = true;

  constructor(
    private router: Router,
    private menuSet: LayoutService,
    private pop: PopupService,
    private login: DoLoginService,
    private getAcctSummInq: AcctSummPlusInqService,
    private getAcctOverviewInq: GetAcctOverviewInqService,
    private functionList: FunctionListService,
    private _langTransService: LangTransService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private loanSummInq: LoanSummInqService,
    private ngzone: NgZone,
    private sortBy: SortByService,
    private route: ActivatedRoute,
  ) {
    this.menuSet.setHeaderStatus({
      status: true,
      title: '',
      logo: true
    });
    this.menuSet.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    let OutsideBlock;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      var cur = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
      if (cur == "" || cur == undefined) {
        cur = "TWD";
      }
      this.ngzone.run(() => {
        this.pop.setLoading(true);
      })
      this.nowCurrency = cur;
      this.getAcctSummInqData();
      this.selectedGroup = { "id": "" }


      this.totalAmount = 0
      this.totalLoanAmount = 0

      this.pop.setGestures({
        'right': () => {
          // this.ngzone.run(() => {
          //   if (!this.simpleView) {
          //     this.nowIndex = this.nowIndex + 1;
          //     if (this.nowIndex > 2) {
          //       this.nowIndex = 0;
          //     }
          //   }
          // });
        },
        'left': () => {
          // this.ngzone.run(() => {
          //   if (!this.simpleView) {
          //     this.nowIndex = this.nowIndex - 1;
          //     if (this.nowIndex < 0) {
          //       this.nowIndex = 2;
          //     }
          //   }
          // });
        },
        'up': () => {
          if (!this.simpleView) {
            this.ngzone.run(() => {
              this.simpleView = true;

              $('#homeSection').animate({ scrollTop: 0 }, 50);
              document.getElementById('homeSection').style.overflow = 'hidden';
              setTimeout(() => {
                document.getElementById('homeSection').style.overflow = '';
              }, 300)
            });
          }
        },
        'down':()=>{
          if (this.simpleView) {
            this.ngzone.run(()=>{
              this.onChangeViewBtnClick();
            })
          }
        }
      });

      this.TopDropContent = this._langTransService.instant('HOME.ALL_COMPANY')
    });
  }


  active(index) {
    this.nowIndex = index;
  }

  getAcctSummInqData() {
    const success = (res) => {
      console.log('getAcctSummInqData success', res);
      this.res = res["AcctSummList"];
      this.getLoanSummInqData();
      this.getAcctSummInq.loading = true;
    };
    const error = (err) => {
      console.log('getAcctSummInqData Error', err);
      this.errMsg += this._langTransService.instant("HOME.ACCTSUMMINQ") +
        this._langTransService.instant("ERROR.ERROR_" + err.HeaderRs.Result) +
        "(" + err.HeaderRs.Result + ") <br>";
      this.getLoanSummInqData();
      this.getAcctSummInq.loading = true;
    };



    //查詢概要
    this.getAcctSummInq.loading = false;
    this.getAcctSummInq.acctSummPlusInq(this.nowCurrency).then(success, error);
  }
   /**
  * @param CCMPTX000187 
  * 取得帳戶總覽資料
  * AcctOverviewList : 帳戶總覽清單
     AcctType : 帳戶類別
     AcctCurrency : 帳戶幣別
     Balance : 餘額
     ExRate : AcctCurrency與Currency的匯率
  */
  getAcctOverviewInqData() {
    if (!this.functionList.checkHasFunction(FunctionListService.ACCT_OVERVIEW)) {
      this.init();
      this.pop.setLoading(false);
      return;
    }
    const success = (resOver) => {
      console.log('getAcctOverviewInqData success', resOver);
      var Company = this.login.getCompanyId();
      resOver["AcctOverviewList"].forEach(elementOver => {
        
        if (elementOver.AcctType == "L") {
          for (var i = 0; i < this.loanRes.length; i++) {
          /**
           * 找出與登入相符公司的放款資料並設定其金額與利率
           */
            var elementLoan = this.loanRes[i];
            if (elementLoan["Currency"] == elementOver["AcctCurrency"]
              && elementLoan["CustomerId"] == Company) {
              this.loanRes[i]["AmountFinanced"] = elementOver["Balance"];
              this.loanRes[i]["ExRate"] = elementOver["ExRate"]
              i = this.loanRes.length;
            }
          }
        } else {
          
          for (var i = 0; i < this.res.length; i++) {
            var elementSumm = this.res[i];
          /**
           * 找出與登入相符公司的非放款資料並設定其金額與利率
           */
            if (elementSumm["AcctCurrency"] == elementOver["AcctCurrency"]
              && elementSumm["AcctType"] == elementOver["AcctType"]
              && elementSumm["CustomerId"] == Company)
               {
              this.res[i]["CurBalance"] = elementOver["Balance"];
              this.res[i]["ExRate"] = elementOver["ExRate"]
              i = this.res.length;
            }
          }


        }

      });
      this.init();
      this.pop.setLoading(false);
      this.getAcctOverviewInq.loading = true;
    };
    const error = (err) => {

      console.log('getAcctOverviewInqData Error', err);
      this.errMsg += this._langTransService.instant("HOME.ACCTOVERVIEWINQ") +
        this._langTransService.instant("ERROR.ERROR_" + err.HeaderRs.Result) +
        "(" + err.HeaderRs.Result + ") <br>";
      this.init();
      this.pop.setLoading(false);
      this.getAcctOverviewInq.loading = true;
    };
    //查詢概要
    this.getAcctOverviewInq.loading = false;
    this.getAcctOverviewInq.getAcctOverviewInqService(this.nowCurrency).then(success, error);
  }
  getLoanSummInqData() {
    if (!this.functionList.checkHasFunction(FunctionListService.LOAN_DET_INQ)) {
      this.loanSummInq.loading = true;
      this.getAcctOverviewInqData();
      return;
    }
    this.pop.setLoading(true);
    const success = (res) => {
      console.log('getLoanSummInqData success', res);
      this.loanRes = res.LoanSummList;
      this.loanSummInq.loading = true;
      this.getAcctOverviewInqData();
    };
    const error = (err) => {
      console.log('getLoanSummInqData Error', err);
      this.errMsg += this._langTransService.instant("HOME.LOANSUMMINQ") +
        this._langTransService.instant("ERROR.ERROR_" + err.HeaderRs.Result) +
        "(" + err.HeaderRs.Result + ") <br>";
      this.loanSummInq.loading = true;
      this.getAcctOverviewInqData();
    };
    //查詢概要
    this.loanSummInq.loading = false;
    this.loanSummInq.loanSummInq(this.nowCurrency).then(success, error);
  }



  init() {

    this.showErrorMsg();

    this.isSumm = this.functionList.checkHasFunction(FunctionListService.ACCT_SUMM);
    this.isActivity = this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY);

    this.queryDate = this.dateTime.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss');
    this.setOptions()
    this.setGroups()
    this.setSelectRes()
    this.setTotalAmount()
    this.setCard();
    this.saveLoans();

    console.log("res", this.res)
    console.log("cardSource", this.cardSource)
    console.log("totalAmount", this.totalAmount)
    console.log("selectOptions", this.selectOptions)
    console.log("selectGroups", this.selectGroups)
    console.log("selectRes", this.selectRes)
  }

  showErrorMsg() {
    if (this.errMsg != "") {
      this.pop.setConfirm({
        content: this.errMsg
      });
      this.errMsg = ""
    }
  }
  setOptions() {
    if (this.res.length > 0) {

    }
    this.countryGroup = [];
    this.selectOptions = [];


    var list = [];
    var sortList = [];
    list = this.res.concat(this.loanRes);
    list.forEach(element => {
      if (sortList.length == 0) {
        sortList.push({
          Country: element.Country
          , CustomerId: element.CustomerId
          , CustomerName: element.CustomerName
        });
      }

    });
    /*
    *    keyCountry: "原資料之「國別」鍵值",
    *    keyCompanyId: "原資料之「公司統編」鍵值",
    *    keyCompanyName: "原資料之「公司名稱」鍵值",
    * 
    * */
    this.selectOptions = this.sortBy.sortCompanyList(list, {
      keyCountry: "Country",
      keyCompanyId: "CustomerId",
      keyCompanyName: "CustomerName",
    });
    if (this.selectOptions.length > 0) {
      this.selectedOption = this.selectOptions[0];
      this.selectedOptionIndex = 0;
    }

    this.loanRes.forEach(element => {
      if (element["AmountFinanced"] == undefined) {
        element["AmountFinanced"] = "0";
      }
      if (element["ExRate"] == undefined) {
        element["ExRate"] = "1";
      }
      if (element["CustomerName"] != undefined) {
        element["CustomerIdName"] = element["CustomerId"] + " " + element["CustomerName"]
      } else {
        element["CustomerIdName"] = element["CustomerId"]
      }
      element["CountryCustomerId"] = element["Country"] + "_" + element["CustomerId"]
    })
    //補0
    this.res.forEach(element => {
      if (element["CurBalance"] == undefined) {
        element["CurBalance"] = "0";
      }
      if (element["ExRate"] == undefined) {
        element["ExRate"] = "1";
      }
      if (element["CustomerName"] != undefined) {
        element["CustomerIdName"] = element["CustomerId"] + " " + element["CustomerName"]
      } else {
        element["CustomerIdName"] = element["CustomerId"]
      }
      element["CountryCustomerId"] = element["Country"] + "_" + element["CustomerId"]
    })


  }

  setGroups() {
    this.selectGroups = [];
    this.selectedGroup = { "id": "0", "value": "HOME.ACCORDING_ACCT" }; // 依產品別
    this.selectedGroupIndex = 0;
    this.selectGroups.push(this.selectedGroup);
    this.selectGroups.push({ "id": "1", "value": "HOME.ACCORDING_CUR" }) // 依幣別
    var type = this.selectedOption["type"]
    if (type != "company") {
      this.selectGroups.push({ "id": "2", "value": "HOME.ACCORDING_COMPANY" }) // 依公司別
    }
    if (type == "all") {
      this.selectGroups.push({ "id": "3", "value": "HOME.ACCORDING_AREA" }) // 依區域
    }
    //設置下層下拉式選單預設內容值
    this.BottomDropContent = this.selectGroups[0]['value']
  }

  setSelectRes() {
    var type = this.selectedOption["type"]
    this.selectRes = [];
    this.res.forEach(element => {
      var isMatch = false;
      switch (type) {
        case "all":
          isMatch = true;
          break;
        case "country":
          isMatch = element["Country"] == this.selectedOption["original"]["country"]
          break;
        case "company":
          isMatch = element["CustomerId"] == this.selectedOption["original"]["company"] &&
                    element["Country"] == this.selectedOption["original"]["country"]
          break;
      }
      if (isMatch) {
        this.selectRes.push(element);
      }
    })

    this.selectLoanRes = [];
    this.loanRes.forEach(element => {
      var isMatch = false;
      switch (type) {
        case "all":
          isMatch = true;
          break;
        case "country":
          isMatch = element["Country"] == this.selectedOption["original"]["country"]
          break;
        case "company":
          isMatch = element["CustomerId"] == this.selectedOption["original"]["company"]&&
                  element["Country"] == this.selectedOption["original"]["country"]
          break;
      }
      if (isMatch) {
        this.selectLoanRes.push(element);
      }
    })
  }

  setTotalAmount() {
    this.totalAmount = 0;
    this.selectRes.forEach(element => {
      // 若金額為負則不予計算
      if(parseInt(element["CurBalance"]) > 0){
        this.totalAmount += +element["CurBalance"] * +element["ExRate"];
      }
    })
    this.totalAmount = this.totalAmount.toFixed(0);

    this.totalLoanAmount = 0;
    this.selectLoanRes.forEach(element => {
    // 若金額為負則不予計算
    if(parseInt(element["AmountFinanced"]) > 0){
      this.totalLoanAmount += +element["AmountFinanced"] * +element["ExRate"];
    }
    })
    this.totalLoanAmount = this.totalLoanAmount.toFixed(0);
  }

  setCard() {


    switch (this.selectedGroup["id"]) {
      case "0":
        //產品別
        this.setProductCard();
        break;
      case "1":
        //幣別
        this.setCurrencyCard();
        break;
      case "2":
        //公司別
        this.setCompanyCard();
        break;
      case "3":
        //區域別
        this.setCountryCard();
        break;
    }

  }

  setProductCard() {
    //產品別
    this.selectRes.sort((a, b) => { return this.ProductSort(a, b,"AcctType") })
    this.selectLoanRes.sort((a, b) => { return this.LoanProductSort(a, b,"ProductName")})
    this.setCardItem("AcctType", true, "AcctType");
    this.setLoanCardItem("ProductName", true, "ProductName");
    this.cardRightArrow = this.isSumm;
  }
  setCurrencyCard() {
    //幣別
    this.selectRes.sort((a, b) => { return this.CurrencySort(a, b,"AcctCurrency") })
    this.selectLoanRes.sort((a, b) => { return this.CurrencySort(a, b,"Currency")})
    this.setCardItem("AcctCurrency", false, "AcctCurrency");
    this.setLoanCardItem("Currency", false, "Currency");
    this.cardRightArrow = this.isSumm;
  }
  setCountryCard() {
    //區域別
    this.selectRes.sort((a, b) => { return this.CountrySort(a, b) })
    this.selectLoanRes.sort((a, b) => { return this.CountrySort(a, b)})
    this.setCardItem("Country", true, "Country");
    this.setLoanCardItem("Country", true, "Country");
    this.cardRightArrow = this.isSumm;
  }
  setCompanyCard() {
    //公司別
    this.selectRes.sort((a, b) => { return this.CompanySort(a, b) })
    this.selectLoanRes.sort((a, b) => { return this.CompanySort(a, b) })
    this.setCardItem("CustomerIdName", true, "CountryCustomerId");
    this.setLoanCardItem("CustomerIdName", true, "CountryCustomerId");
    this.cardRightArrow = this.isSumm || this.isActivity;
  }
  addCardItem(subType, ExRate, Amount: number, Currency, type, id) {
    var CardSource
    var TotalAmount
    if (type == "S") {
      CardSource = this.cardSource
      TotalAmount = this.totalAmount
    } else {
      CardSource = this.loanCardSource
      TotalAmount = this.totalLoanAmount
    }
    var exRate = ExRate == "" ? 1 : ExRate;

    var percentValue = (Amount * exRate / TotalAmount * 100.0);
    var percent;
    if (percentValue >= 1) {
      percent = percentValue.toFixed(0)
    } else if (percentValue < 0.01) {
      percent = "<0.01";
      if(percentValue == 0){
        percent = "0";
      }
    } else {
      percent = percentValue.toFixed(2);
    }

    if (percent == "100") {
      percent = "99";
    }

    if (TotalAmount == 0) {
      percent = "0";
    }

    var currentItem = {
      "subType": subType,
      "percent": percent,
      "amount": Amount.toFixed(0),
      "currency": Currency,
      "exRate": ExRate,
      "id": id
    }
    CardSource.push(currentItem)
  }

  setCardItem(TypeKey, isExRate, IDType) {
    this.cardSource = [];
    var currentType = undefined
    var currentID = undefined
    var currentAmount = 0;
    var exRateValue = undefined
    var currency = undefined
    var typeElement = "";

    this.selectRes.forEach(element => {
      if(TypeKey == "AcctType"){
        typeElement = this.getType(element[TypeKey]);
      }else{
        typeElement = element[TypeKey];
      }
      var idElement = element[IDType];
      var exRate = isExRate ? +element["ExRate"] : 1;
      if (typeElement != currentType) {
        if (currentType != undefined) {
          this.addCardItem(currentType, exRateValue, currentAmount, currency, "S", currentID)
        }
        // 若金額為負則不予計算
        if(parseInt(element["CurBalance"]) >= 0){
          currentAmount = +element["CurBalance"] * exRate;
        }
        currentType = typeElement;
        currentID = idElement;
        exRateValue = !isExRate ? +element["ExRate"] : "";
        currency = !isExRate ? element["AcctCurrency"] : "";
      } else {
        // 若金額為負則不予計算
        if(parseInt(element["CurBalance"]) >= 0){
          currentAmount += +element["CurBalance"] * exRate;
        }
      }
    })
    if (currentType != undefined) {
      this.addCardItem(currentType, exRateValue, currentAmount, currency, "S", currentID)
    }
    if (this.cardSource.length == 1) {
      this.cardSource[0]["percent"] = "100.00";
    }
  }
  setLoanCardItem(TypeKey, isExRate, IDType) {
    this.loanCardSource = [];
    var currentType = undefined
    var currentID = undefined
    var currentAmount = 0;
    var exRateValue = undefined
    var currency = undefined
    this.selectLoanRes.forEach(element => {
      var typeElement = element[TypeKey];
      var idElement = element[IDType];
      var exRate = isExRate ? +element["ExRate"] : 1;
      if (typeElement != currentType) {
        if (currentType != undefined) {
          this.addCardItem(currentType, exRateValue, currentAmount, currency, "L", currentID)
        }
        // 若金額為負則不予計算
        if(parseInt(element["AmountFinanced"]) >= 0){
          currentAmount = +element["AmountFinanced"] * exRate;
        }
        currentType = typeElement;
        currentID = idElement;
        exRateValue = !isExRate ? +element["ExRate"] : "";
        currency = !isExRate ? element["Currency"] : "";
      } else {
        // 若金額為負則不予計算
        if(parseInt(element["AmountFinanced"]) >= 0){
          currentAmount += +element["AmountFinanced"] * exRate;
          
        }
      }
    })

    if (currentType != undefined) {
      this.addCardItem(currentType, exRateValue, currentAmount, currency, "L", currentID)
    }
    if (this.loanCardSource.length == 1) {
      this.loanCardSource[0]["percent"] = "100.00";
    }
  }
  onGroupChange(e) {
    this.selectedGroup = this.selectGroups[this.selectedGroupIndex];
    this.setSelectRes()
    this.setTotalAmount()
    this.setCard();
    this.saveLoans();
  }
  onOptionChange(e) {
    this.selectedOption = this.selectOptions[this.selectedOptionIndex];
    this.setGroups()
    this.setSelectRes()
    this.setTotalAmount()
    this.setCard();
    this.saveLoans();
    this.simpleView = false;
  }


  CountrySort(a, b) {
    //GL 為第一位
    var CountryA = a["Country"]
    var CountryB = b["Country"]
    if (CountryA == "GL") {
      return -1;
    } else if (CountryB == "GL") {
      return 1;
    }

    //登入語系為第二順位
    var loginC = this.login.getCountry()
    if (CountryA == loginC) {
      return -1;
    } else if (CountryB == loginC) {
      return 1;
    }
    //台灣為第三順位
    if (loginC != "TW" && loginC != "TWN") {
      if (CountryA == "TW" || CountryA == "TWN") {
        return -1;
      } else if (CountryB == "TW" || CountryB == "TWN") {
        return 1;
      }
    }

    if (CountryA < CountryB) {
      return -1;
    }

    if (CountryA > CountryB) {
      return 1;
    }
    return 0
  }
  CompanySort(a, b) {
    var CompanyA = a["CountryCustomerId"]
    var CompanyB = b["CountryCustomerId"]

    if (CompanyA < CompanyB) {
      return -1;
    }
    if (CompanyA > CompanyB) {
      return 1;
    }
    return 0
  }
  ProductSort(a, b,AcctType) {
    var ProductA = a[AcctType]
    var ProductB = b[AcctType]

    if (this.getTypeLV(ProductA) - this.getTypeLV(ProductB) < 0) {
      return -1;
    } else if (this.getTypeLV(ProductA) - this.getTypeLV(ProductB) > 0) {
      return 1;
    }
    return 0;
  }
  LoanProductSort(a, b ,AcctType){
    var ProductA = a[AcctType]
    var ProductB = b[AcctType]

    if(ProductA < ProductB) {
      return -1;
    } else if (ProductA > ProductA) {
      return 1;
    }
    return 0;
  }
  CurrencySort(a, b,AcctCurrency) {

    var CurrencyA = a[AcctCurrency]
    var CurrencyB = b[AcctCurrency]

    if (CurrencyA < CurrencyB) {
      return -1;
    }
    if (CurrencyA > CurrencyB) {
      return 1;
    }
    return 0
  }

  getTypeName(Type) {
    switch (Type) {
      case "S":
        return "ACCTTYPE.ACCT_S"; // 活期存款
      case "C":
        return "ACCTTYPE.ACCT_C"; // 支票存款
      case "T":
      case "TDS":
        return "ACCTTYPE.ACCT_T"; // 定期存款
      case "SD":
      case "SDS":
        return "ACCTTYPE.ACCT_SD"; // 結構型存款
      case "SE":
        return "ACCTTYPE.ACCT_SE"; // 活存備償
      case "L":
        return "ACCTTYPE.ACCT_L"; // 授信帳戶
      case "OD":
        return "ACCTTYPE.ACCT_OD"; // 支存透支
    }
  }

  getTypeLV(Type) {
    switch (Type) {
      case "S":
        return 0;
      case "C":
        return 1;
      case "T":
      case "TDS":
        return 2;
      case "SD":
      case "SDS":
        return 3;
      case "SE":
        return 4;
      case "L":
        return 6;
      case "OD":
        return 5;
      default:
        return 999;
    }
  }
  /**
   * @param Type 帳戶類別 AcctType
   * 取得對應帳戶類別
   */
  getType(Type) {
    switch (Type) {
      case "S":
        return "S";
      case "C":
        return "C";
      case "T":
      case "TDS":
        return "T";
      case "SD":
      case "SDS":
        return "SD";
      case "SE":
        return "SE";
      case "L":
        return "L";
      case "OD":
        return "OD";
    }
  }


  saveAmount
  saveAmountPercent
  saveLoansPercent
  loansAmount
  loansAmountPercent
  saveLoans() {
    this.saveAmount = parseFloat(this.totalAmount);
    this.loansAmount = parseFloat(this.totalLoanAmount);

    this.saveAmountPercent = (this.saveAmount / (this.saveAmount + this.loansAmount) * 100).toFixed(1) + "%"
    this.loansAmountPercent = (this.loansAmount / (this.saveAmount + this.loansAmount) * 100).toFixed(1) + "%"
    if (this.saveAmount == 0) {
      this.saveLoansPercent = "";
    } else if (this.loansAmount == 0) {
      this.saveLoansPercent = "0%"
    } else {
      var percent = this.loansAmount / this.saveAmount * 100;
      if (percent < 0.01) {
        this.saveLoansPercent = "<0.01%";
      } else {
        this.saveLoansPercent = (this.loansAmount / this.saveAmount * 100).toFixed(2) + "%";
      }
    }

    this.loanBarSize = ((this.loansAmount / (this.loansAmount + this.saveAmount)) * 100).toFixed(1) + "%";
    this.depositBarSize = ((this.saveAmount / (this.loansAmount + this.saveAmount)) * 100).toFixed(1) + "%";
  }


  cardClick(value) {
    var isSumm = this.isSumm
    var isActivity = this.functionList.checkHasFunctionGroup(FunctionListService.DepositDetailGroupKey);

    if (!isSumm && !isActivity) {
      return;
    }
    if (!isSumm && (this.selectedGroup.id == "0" || this.selectedGroup.id == "1" || this.selectedGroup.id == "3")) {
      return;
    }
    var Url = "/account_enquiry";
    var Tab = "";
    var DetTab = "";
    var TabDetail = "";
    switch (this.nowIndex) {
      case 0:
        // Deposit summary
        Tab = "depositSumPage"
        DetTab = "depositDetailPage"
        break;
      case 1:
        // Loan summary
        Tab = "loanSumPage";
        DetTab = "loanDetailPage"
        break;
      case 2:
        if (value == 1) {
          // Deposit summary
          Tab = "depositSumPage"
          DetTab = "depositDetailPage"
        } else {
          // Loan summary
          Tab = "loanSumPage";
          DetTab = "loanDetailPage"
        }
        break;
    }
    var Company = "";
    var Country = "";
    var CompanyType = "";
    var Product = "";
    var Currency = "";
    switch (this.selectedOption.type) {
      case "all":
        Company = "All";
        CompanyType = "All";
        break;
      case "country":
        Company = this.selectedOption.original.country;
        CompanyType = "Country";
        break;
      case "company":
        Company = this.selectedOption.original.company;
        Country = this.selectedOption.original.country;
        CompanyType = "Customer";
        break;
    }

    switch (this.selectedGroup.id) {
      case "0":
        //產品
        Product = value.id
        break;
      case "1":
        //幣別
        Currency = value.id
        break;
      case "2":
        //公司
        Company = value.id.split('_')[1] 
        Country = value.id.split('_')[0]
        CompanyType = "Customer"
        break;
      case "3":
        //區域
        Country = value.id
        CompanyType = "Country"
        break;
    }

    if (this.selectedGroup.id == "0" || this.selectedGroup.id == "1" || this.selectedGroup.id == "3") {
      this.router.navigate([Url], { queryParams: { from: 'home', type: Tab, company: Company,country: Country, companyType: CompanyType, product: Product, currency: Currency } });
      return;
    }

    if (isSumm) {
      //前往概要
      this.router.navigate([Url], { queryParams: { from: 'home', type: Tab, company: Company,country: Country, companyType: CompanyType, product: Product, currency: Currency } });
    } else if (isActivity) {
      //前往細節
      this.router.navigate([Url], { queryParams: { from: 'home', type: DetTab, company: Company,country: Country, companyType: CompanyType, product: Product, currency: Currency } });
    }
  }

  onChangeViewBtnClick() {
    this.simpleView = false;
    $('#homeSection').animate({ scrollTop: 0 }, 50);
  }
  onTopSelectClick() {
    this.pop.setCheckList({
      data: this.selectOptions,
      type: 'radio',
      event: (result) => {
        this.TopDropContent = result['desc'];
        this.selectedOptionIndex = result['index'];
        this.onOptionChange(this.selectedOptionIndex)
      }
    })
  }
  onBottomSelectClick() {
    let newArr = [];
    this.selectGroups.forEach((item, i) => {
      if (this.selectedGroupIndex == i) {
        newArr.push({
          desc: this._langTransService.instant(item.value),
          checked: true,
          value: item.id
        })
      } else {
        newArr.push({
          desc: this._langTransService.instant(item.value),
          checked: false,
          value: item.id
        })
      }
    })
    this.pop.setCheckList({
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.BottomDropContent = result['desc'];
        this.selectedGroupIndex = result['value'];
        this.onGroupChange(this.selectedGroupIndex);
      }
    })
  }
}
