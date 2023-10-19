import { Component, OnInit,NgZone } from '@angular/core';
import { IntRateDetailsInqService } from '../../../shared/service/customize/doIntRateDetailsInq.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { CurrencyService } from '../../../shared/service/customize/Currency.service';
import { KEY_CURRENCY_PARA, KEY_USER_PARA } from '../../../../assets/configuration/userParaKey';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { EX_RATE_AREA } from '../../../../assets/configuration/exRateArea';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { Router } from '@angular/router';

/**
 * 利率查詢頁
 */
@Component({
  selector: 'app-interestRateQuery',
  templateUrl: './interestRateQuery.component.html',
  styleUrls: ['./interestRateQuery.component.css']
})
export class InterestRateQueryComponent implements OnInit {

  //國別選單
  CountryList
  CountryListSelected
  CountrySelected
  //幣別選單
  CurList
  //Api回傳
  ApiRes
  //存款
  CASADetailsList
  //放款
  LoanDetailsList
  //其他
  OtherDetailsList
  //上選單
  TopSelecters
  TopSelecter = 0;
  IsShowTopSelecter = false;
  IsShowTopSelecter2 = true;
  //次選單
  SubSelecters;
  SubSelecter = 0;
  IsShowSubSelecter = false;
  //期別選單
  TermList
  TermSelected;
  IsShowTermSelecter = true;
  //篩選期別選單
  FilterTermList
  FilterTermSelected
  IsShowFilterTermSelecter = true;
  FilterProductTypeList
  FilterProductTypeSelected;
  //預設幣別
  DefaultCurrency
  //用於顯示的list
  ShowListTitle;
  ShowList;
  ShowValueCount = 0;
  SelectStatus = 0;
  IsFilter = false;
  nowTime;
  loginStatus = this.storage.get("isLogin") //登入狀態

  constructor(
    private intRateDetailsInq: IntRateDetailsInqService,
    private popup: PopupService,
    private currency: CurrencyService,
    private storage: LocalStorageService,
    public layout: LayoutService,
    private dateformat: DateTimeService,
    private langTrans: LangTransService,
    private router: Router,
    private zone:NgZone,
  ) {
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngOnInit() {
    this.initCountryList();
    this.InterestRateQuery(this.initList);
    if (!this.loginStatus) {
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    } else {
      this.layout.setHeaderStatus({
        rightIcon: false
      })
    }
  }

  ngAfterViewInit() {
    // Init gestures
    this.popup.setGestures({
      'reload': () => {
        this.InterestRateQuery(this.initList);
      }
    });
  }

  onRateTypeClick(type) {
    this.TopSelecter = type;
  }

  //**初始化國籍選單 */
  initCountryList() {
    this.CountryList = EX_RATE_AREA;
    this.CountrySelected = this.CountryList[0];
    console.log('[利率查詢] initCountryList CountrySelected =', this.CountrySelected);
    this.initTopSelecter();
    this.initSubSelecter();
    this.initTermList();
  }
  initCurList() {
    this.CurList = [];
    EX_RATE_AREA.forEach(element => {
      this.CurList.push({ "value": element.currency, "key": element.currency })
    });
  }
  TermChange(item) {
    if (!this.IsFilter) {
      this.TermSelected = item;
      this.initShowList();
    }
    this.CloseSelect();
  }
  //**國籍變更時 */
  CountryChange(item) {
    if (!this.IsFilter) {
      this.CountrySelected = item;
      console.log('[利率查詢] CountryChange CountrySelected =', this.CountrySelected);
      this.initTermList();
      this.InterestRateQuery(this.initList)
    } else {
      this.FilterValue.Country = item;
    }
    this.CloseSelect();
  }
  //**初始化幣別選單 */
  initResList() {
    var resArray = []
    this.LoanDetailsList = [];
    this.CASADetailsList = [];
    this.OtherDetailsList = [];
    resArray = this.ApiRes["IntRateDetailsList"];
    resArray.forEach(element => {
      if (element.Category.includes("存款")) {
        this.CASADetailsList.push(element);
      }
      else if (
        element.ProductId != undefined && (
          element.ProductId.includes("放款") ||
          element.ProductId.includes("定儲") ||
          element.ProductId.includes("Base Lending Rate"))) {
        this.LoanDetailsList.push(element);
      } else {
        this.OtherDetailsList.push(element);
      }
    });

    // this.currency.SortCurrency(resArray, "CurCode");
    // resArray.forEach(element => {
    //   var code = this.CurList[this.CurList.length - 1];
    //   if (code != element["CurCode"]) {
    //     this.CurList.push(element["CurCode"]);
    //   }
    // });
    // this.CurSelected = this.CurList[0];
  }

  initTopSelecter() {
    this.TopSelecters = [];
    this.TopSelecter = 0;
    if (this.CountrySelected.country == "TW") {
      this.TopSelecters.push("INTEREST_RATE.RATE_TYPE_S");
      this.TopSelecters.push("INTEREST_RATE.RATE_TYPE_L");
      this.TopSelecters.push("INTEREST_RATE.RATE_TYPE_O");
    }
    else {
      this.TopSelecters.push("INTEREST_RATE.CurCode_Country");
      this.TopSelecters.push("INTEREST_RATE.CurCode_NotCountry");
      this.TopSelecters.push("INTEREST_RATE.RATE_TYPE_L");
    }
  }
  showTopSelecter() {
    this.IsShowTopSelecter = true;
    this.IsShowTopSelecter2 = true;
    if(this.ApiRes == undefined || this.ApiRes["IntRateDetailsList"].length == 0){
      this.IsShowTopSelecter = false;
    }
    if (this.CountrySelected.country == "TW") {
      return;
    }
    if (this.LoanDetailsList.length == 0) {
      this.IsShowTopSelecter2 = false;
    }

    var count = 0;
    this.CASADetailsList.forEach(element => {
      if (element.CurCode != this.CountrySelected.currency) {
        count += 1;
      }
    });
    if (count == 0 && !this.IsShowTopSelecter2) {
      this.IsShowTopSelecter = false;
    }
  }
  initSubSelecter() {
    this.SubSelecters = [];
    this.SubSelecter = 0;
    if(this.ApiRes == undefined || this.ApiRes["IntRateDetailsList"].length == 0){
      this.IsShowSubSelecter = false;
    }
    else if (this.CountrySelected.country == "TW") {
      if (this.TopSelecter == 1) {
        this.IsShowSubSelecter = false;
      } else {
        this.IsShowSubSelecter = true;
      }
    } else {
      if (this.TopSelecter == 2) {
        this.IsShowSubSelecter = false;
      } else {
        this.IsShowSubSelecter = true;
      }
    }

    if (this.CountrySelected.country == "TW") {
      if (this.TopSelecter == 0) {
        this.SubSelecters.push("INTEREST_RATE.CurCode_Country")
        this.SubSelecters.push("INTEREST_RATE.CurCode_NotCountry")
      } else if (this.TopSelecter == 2) {
        this.SubSelecters.push("INTEREST_RATE.NCD")
        this.SubSelecters.push("INTEREST_RATE.MoneyMarket")
      }
    } else {
      if (this.TopSelecter != 2) {
        this.SubSelecters.push("INTEREST_RATE.ProductType_S")
        this.SubSelecters.push("INTEREST_RATE.ProductType_F")
      }
    }
  }
  initTermList() {
    this.TermList = []
    this.TermSelected = undefined;
    this.IsShowTermSelecter = false;
    if (this.CountrySelected.country != "TW") {
      return;
    }
    if (this.TopSelecter != 0) {
      return;
    }
    this.IsShowTermSelecter = true;
    // 活期
    this.TermList.push({ key: "S", value: "INTEREST_RATE.ProductType_S" })
    // 定期
    this.TermList.push({ key: "F", value: "INTEREST_RATE.ProductType_F" })
    this.TermSelected = this.TermList[0];
    // 若為外幣則不添加大額
    if (this.SubSelecter == 1) {
      return;
    }
    // 大額
    this.TermList.push({ key: "B", value: "INTEREST_RATE.ProductType_B" })
  }
  initFilterTermList() {
    this.FilterTermList = [];
    //全部
    this.FilterTermList.push({ key: "0", value: "INTEREST_RATE.FilterTerm_0" })
    //活期
    this.FilterTermList.push({ key: "999", value: "INTEREST_RATE.FilterTerm_999" })
    this.FilterTermList.push({ key: "1", value: "INTEREST_RATE.FilterTerm_1" })
    this.FilterTermList.push({ key: "2", value: "INTEREST_RATE.FilterTerm_2" })
    this.FilterTermList.push({ key: "3", value: "INTEREST_RATE.FilterTerm_3" })
    this.FilterTermList.push({ key: "6", value: "INTEREST_RATE.FilterTerm_6" })
    this.FilterTermList.push({ key: "9", value: "INTEREST_RATE.FilterTerm_9" })
    this.FilterTermList.push({ key: "12", value: "INTEREST_RATE.FilterTerm_12" })
  }
  initProductTypeList() {
    this.FilterProductTypeList = []
    var IntRateDetailsList = this.ApiRes.IntRateDetailsList;
    IntRateDetailsList.forEach(element => {
      if (element.ProductId == undefined) {
        element.ProductId = "";
      }
      element.ProductId = element.ProductId.replace(/ /g, "");
    });
    IntRateDetailsList.sort((a, b) => { return a.ProductId > b.ProductId ? 1 : -1 });;
    IntRateDetailsList.forEach(element => {
      if (element.ProductId == "") {
        return;
      }
      if (this.FilterProductTypeList.length == 0) {
        this.FilterProductTypeList.push({ key: element.ProductId, value: element.ProductId })
        return;
      }
      var code = this.FilterProductTypeList[this.FilterProductTypeList.length - 1];
      if (code.value != element.ProductId) {
        this.FilterProductTypeList.push({ value: element.ProductId });
      }
    });
  }

  InterestRateQuery(successInit) {
    const success = (res) => {
      console.log("[InterestRateQueryComponent] getData Success", res);
      this.zone.run(()=>{
        this.ApiRes = res;
        successInit();
      })
    }
    const error = (err) => {
      console.log("[InterestRateQueryComponent] getData Error", err);
      this.ShowList = [];
      this.zone.run(()=>{
        this.popup.setGestures({
          'reload_close': true
        });
        this.IsShowTopSelecter = false;
        this.IsShowSubSelecter = false;
        this.popup.setLoading(false);
      })
    }

    this.nowTime = new Date();
    this.popup.setLoading(true);
    this.ApiRes = [];
    this.intRateDetailsInq.IntRateDetailsInq(this.CountrySelected["country"]).then(success, error);
  }

  initList = () => {
    this.initResList();
    this.initTopSelecter();
    this.initSubSelecter();
    this.initShowList();
    this.showTopSelecter();
    this.popup.setGestures({
      'reload_close': true
    });
    // 關閉Loading畫面
    this.popup.setLoading(false);
  }

  initShowList() {
    if (this.CountrySelected.country == "TW") {
      this.initTWShowList();
    } else {
      this.initNotTwShowList();
    }
    console.log('[利率查詢] handled completely ShowList', this.ShowList);
  }

  initTWShowList() {
    switch (this.TopSelecter) {
      case 0:
        this.initTWCASADetailsList();
        break;
      case 1:
        this.initTWLoanDetailsList();
        break;
      case 2:
        this.initTWOtherListInit();
        break;
    }
  }

  initNotTwShowList() {
    switch (this.TopSelecter) {
      case 0:
        this.initNotTWCASA_Currency_DetailsList();
        break;
      case 1:
        this.initNotTWCASA_NotCurrency_DetailsList();
        break;
      case 2:
        this.initNotTWLoanDetailsList();
        break;
    }
  }

  //台灣 存款利率
  initTWCASADetailsList() {
    this.ShowList = [];
    var showList = [];

    if(!this.TermSelected){
      this.TermSelected= { key: "S", value: "INTEREST_RATE.ProductType_S" };
    }


    this.CASADetailsList.forEach(element => {
      if (this.SubSelecter != 0 && this.CheckCurrency(element)) {
        //外幣檢查
        return;
      } else if (this.SubSelecter == 0 && !this.CheckCurrency(element)) {
        //本幣檢查
        return;
      }
      if (this.IsFilter) {
        if (!this.FilterCheckCurCode(element)) {
          return;
        }
        if (!this.FilterCheckTenor(element)) {
          return;
        }
        if (!this.FilterCheckProductType(element)) {
          return;
        }
      }
      if (this.TermSelected.key == "A") {
        showList.push(element);
        return;
      }
      if (element.ProductId.includes("大額")) {
        if (this.TermSelected != undefined && this.TermSelected.key == "B") {
          showList.push(element);
        }
        return;
      }
      if (this.TermSelected.key == "S") {
        //活期
        if (+element.Count == 0) {
          showList.push(element);
        }
      } else if (this.TermSelected.key == "F") {
        if (+element.Count > 0) {
          showList.push(element);
        }
      }
    });


    //建立title
    if (this.TermSelected.key == "A" || this.TermSelected.key == "B" || this.TermSelected.key == "F") {
      this.ShowValueCount = 4;
      this.ShowListTitle = {
        name: "INTEREST_RATE.ProductType",
        value1: "INTEREST_RATE.Tenor",
        value2: "INTEREST_RATE.FxdRate",
        value3: "INTEREST_RATE.FltgRate"
      };
    } else {
      this.ShowValueCount = 3;
      this.ShowListTitle = {
        name: "INTEREST_RATE.ProductType",
        value1: "INTEREST_RATE.FxdRate",
        value2: "INTEREST_RATE.FltgRate"
      };
    }
    var key = this.TermSelected.key == "A" ? "F" : this.TermSelected.key;
    showList.forEach(item => {
      switch (key) {
        case "S":
          this.ShowList.push({
            name: item.ProductId,
            cur: item.CurCode ? item.CurCode.trim():"",
            value1: this.FindIntType(item, "Fixed"),
            value2: this.FindIntType(item, "Floating")
          });
          break;
        case "F":
          this.ShowList.push({
            name: item.ProductId,
            cur: item.CurCode ? item.CurCode.trim():"",
            value1: item.Count > 0 ? item.Count + this.langTrans.instant("INTEREST_RATE.TermUnits_" + item.TermUnits) : "-",
            value2: this.FindIntType(item, "Fixed"),
            value3: this.FindIntType(item, "Floating")
          });
          break;
        case "B":
          this.ShowList.push({
            name: this.BigName(item.ProductId),
            cur: item.CurCode ? item.CurCode.trim():"",
            value1: item.Count > 0 ? item.Count + this.langTrans.instant("INTEREST_RATE.TermUnits_" + item.TermUnits) : "-",
            value2: this.FindIntType(item, "Fixed"),
            value3: this.FindIntType(item, "Floating")
          });
          break;
      }
    });
  }
  //台灣 放款利率
  initTWLoanDetailsList() {
    this.ShowList = [];
    var showList = [];

    this.LoanDetailsList.forEach(element => {
      if (this.IsFilter) {
        if (!this.FilterCheckCurCode(element)) {
          return;
        }
        if (!this.FilterCheckProductType(element)) {
          return;
        }
      }
      showList.push(element);
    });

    //建立title
    this.ShowValueCount = 3;
    this.ShowListTitle = {
      name: "INTEREST_RATE.ProductType",
      value1: "INTEREST_RATE.CurCode",
      value2: "INTEREST_RATE.Rate"
    };
    showList.forEach(item => {
      this.ShowList.push({
        name: item.ProductId,
        value1: item.CurCode,
        value2: this.FindIntType(item)
      });
    });
  }
  //台灣 其他利率
  initTWOtherListInit() {
    this.ShowList = [];
    var showList = [];

    this.OtherDetailsList.forEach(element => {
      if (this.SubSelecter != 0 && element.Category != "MoneyMarket") {
        //Money Market檢查
        return;
      } else if (this.SubSelecter == 0 && element.Category != "NCD") {
        //NCD 檢查
        return;
      }
      showList.push(element);
    });
    //建立title
    if (this.SubSelecter == 0) {
      this.ShowValueCount = 3;
      this.ShowListTitle = {
        name: "INTEREST_RATE.Tenor",
        value1: "INTEREST_RATE.FxdRate",
        value2: "INTEREST_RATE.LargeRate"
      };
    } else {
      this.ShowValueCount = 71;
      this.ShowListTitle = {
        name: "INTEREST_RATE.Tenor",
        value1: "INTEREST_RATE.CPRate",
        value2: "INTEREST_RATE.BARate",
        value3: "INTEREST_RATE.RPRate",
        value4: "INTEREST_RATE.RsRate",
        value5: "INTEREST_RATE.SellRate",
        value6: "INTEREST_RATE.BuyRate"
      };
    }
    showList.forEach(item => {
      if (this.SubSelecter == 0) {
        this.ShowList.push({
          name: item.TermUnits != "" ? item.TermUnits + this.langTrans.instant("INTEREST_RATE.TermUnits_M") : "-",
          value1: this.FindIntType(item, "Rate"),
          value2: this.FindIntType(item, "LargeRate")
        });
      } else {
        this.ShowList.push({
          name: item.TermUnits != "" ? (+item.TermUnits).toString() + this.langTrans.instant("INTEREST_RATE.TermUnits_M") : "-",
          value1: this.FindIntType(item, "BACP"),
          value2: this.FindIntType(item, "MoneyMarketLoan"),
          value3: this.FindIntType(item, "RP"),
          value4: this.FindIntType(item, "RS"),
          value5: this.FindIntType(item, "Sell"),
          value6: this.FindIntType(item, "Buy"),
        });
      }
    });
  }
  //非台灣本幣 存款利率
  initNotTWCASA_Currency_DetailsList() {
    this.ShowList = [];
    var showList = [];
    this.CASADetailsList.forEach(element => {
      if (!this.CheckCurrency(element)) {
        //本幣檢查
        return;
      }
      if (this.IsFilter) {
        if (!this.FilterCheckCurCode(element)) {
          return;
        }
        if (!this.FilterCheckTenor(element)) {
          return;
        }
        if (!this.FilterCheckProductType(element)) {
          return;
        }
      }
      if (this.SubSelecter == 0) {
        //活期
        if (element.ProductId == "SAVING" || element.ProductId == "CHECKING") {
          showList.push(element);
        }
      } else if (this.SubSelecter == 1) {
        //定期
        if (+element.Count > 0) {
          showList.push(element);
        }
      } else {
        //全部
        showList.push(element);
      }
    });

    if (this.SubSelecter == 0) {
      //建立title
      this.ShowValueCount = 3;
      this.ShowListTitle = {
        name: "INTEREST_RATE.ProductType",
        value1: "INTEREST_RATE.FxdRate",
        value2: "INTEREST_RATE.FltgRate"
      };
      showList.forEach(item => {
        this.ShowList.push({
          name: item.ProductId,
          cur: item.CurCode ? item.CurCode.trim():"",
          value1: this.FindIntType(item, "Fixed"),
          value2: this.FindIntType(item, "Floating")
        });
      });
    } else {
      //建立title
      this.ShowValueCount = 4;
      this.ShowListTitle = {
        name: "INTEREST_RATE.ProductType",
        value1: "INTEREST_RATE.Tenor",
        value2: "INTEREST_RATE.FxdRate",
        value3: "INTEREST_RATE.FltgRate"
      };

      showList.forEach(item => {
        this.ShowList.push({
          name: item.ProductId,
          cur : item.CurCode ? item.CurCode.trim():"",
          value1: item.Count > 0 ? item.Count + this.langTrans.instant("INTEREST_RATE.TermUnits_" + item.TermUnits) : "-",
          value2: this.FindIntType(item, "Fixed"),
          value3: this.FindIntType(item, "Floating"),
          value4: parseInt(item.Count),
          value5: item.TermUnits
        });
        //資料排序
        this.ShowList = this.sortShowList(this.ShowList);
      });
    }
  }
  //非台灣外幣 存款利率
  initNotTWCASA_NotCurrency_DetailsList() {
    this.ShowList = [];
    var showList = [];

    this.CASADetailsList.forEach(element => {
      if (this.CheckCurrency(element)) {
        //外幣檢查
        return;
      }
      if (this.IsFilter) {
        if (!this.FilterCheckCurCode(element)) {
          return;
        }
        if (!this.FilterCheckTenor(element)) {
          return;
        }
        if (!this.FilterCheckProductType(element)) {
          return;
        }
      }
      if (this.SubSelecter == 0) {
        //活期
        if (element.ProductId == "SAVING" || element.ProductId == "CHECKING") {
          showList.push(element);
        }
      } else if (this.SubSelecter == 1) {
        //定期
        if (+element.Count > 0) {
          showList.push(element);
        }
      } else {
        //全部
        showList.push(element);
      }
    });

    if (this.SubSelecter == 0) {
      //建立title
      this.ShowValueCount = 3;
      this.ShowListTitle = {
        name: "INTEREST_RATE.ProductType",
        value1: "INTEREST_RATE.FxdRate",
        value2: "INTEREST_RATE.FltgRate"
      };
      showList.forEach(item => {
        this.ShowList.push({
          name: item.ProductId,
          cur: item.CurCode ? item.CurCode.trim():"",
          value1: this.FindIntType(item, "Fixed"),
          value2: this.FindIntType(item, "Floating")
        });
      });
    } else {
      //建立title
      this.ShowValueCount = 4;
      this.ShowListTitle = {
        name: "INTEREST_RATE.ProductType",
        value1: "INTEREST_RATE.Tenor",
        value2: "INTEREST_RATE.FxdRate",
        value3: "INTEREST_RATE.FltgRate"
      };
      showList.forEach(item => {
        this.ShowList.push({
          name: item.ProductId,
          cur: item.CurCode ? item.CurCode.trim():"",
          value1: item.Count > 0 ? item.Count + this.langTrans.instant("INTEREST_RATE.TermUnits_" + item.TermUnits) : "-",
          value2: this.FindIntType(item, "Fixed"),
          value3: this.FindIntType(item, "Floating"),
          value4: parseInt(item.Count),
          value5: item.TermUnits
        });
        //排序資料
        this.ShowList = this.sortShowList(this.ShowList);
      });
    }

  }
  //非台灣 放款利率
  initNotTWLoanDetailsList() {
    this.ShowList = [];
    var showList = [];

    this.LoanDetailsList.forEach(element => {
      if (this.IsFilter) {
        if (!this.FilterCheckCurCode(element)) {
          return;
        }
        if (!this.FilterCheckProductType(element)) {
          return;
        }
      }
      showList.push(element);
    });

    //建立title
    this.ShowValueCount = 4;
    this.ShowListTitle = {
      name: "INTEREST_RATE.ProductType",
      value1: "INTEREST_RATE.CurCode",
      value2: "INTEREST_RATE.Tenor",
      value3: "INTEREST_RATE.Rate"
    };
    showList.forEach(item => {
      this.ShowList.push({
        name: item.ProductId,
        value1: item.CurCode,
        value2: item.Count > 0 ? item.Count + this.langTrans.instant("INTEREST_RATE.TermUnits_" + item.TermUnits) : "-",
        value3: this.FindIntType(item, "Floating"),
        value4: parseInt(item.Count),
        value5: item.TermUnits
      });
      //資料排序
      this.ShowList = this.sortShowList(this.ShowList);
    });
  }

  CheckCurrency(element) {
    for (const currency of this.CountrySelected.currencys) {
      if (element.CurCode == currency) {
        return true
      }
    }
    return false
  }
  //處理大額名稱
  BigName(name) {
    return name;
  }
  //從item中的利率表找到特定利率
  FindIntType(item, IntType = "") {
    var found = item.RateInfoList.find(function (element) {
      if(IntType == ""){
        //台幣放款只要利率別為floating or fixed則皆顯示
        if(item.RateInfoList[0].IntType.toUpperCase() == "FLOATING" || item.RateInfoList[0].IntType.toUpperCase() == "FIXED"){
          return true
        }else{
          return false
        }
      }
      return element.IntType == IntType;
    });
    if (found != undefined && found != null) {
      return parseFloat(found.Rate).toFixed(4);
    }
    return "-";
  }

  CloseFilter() {
    this.SelectStatus = 0;
    this.IsFilter = false;
  }
  CloseSelect() {
    if (this.IsFilter) {
      this.SelectStatus = 77;
    } else {
      this.SelectStatus = 0;
    }
  }
  ShowCountry(item) {
    this.CountryListSelected = item;
    this.SelectStatus = 99;
  }
  ShowTerm() {
    this.SelectStatus = 88;
  }

  FilterValue;
  //篩選器顯示
  ShowFilter() {
    if (typeof this.FilterValue == 'undefined') {
      this.FilterReset();
    } else {
      this.FilterReset(false);
    }
    this.SelectStatus = 77;
    this.IsFilter = true;
  }
  ShowProductTypeSelecter() {
    this.FilterTermSelected = this.FilterValue["ProductType"];
    this.SelectStatus = 1010;
  }
  FilterTopSelectChange(index) {
    this.FilterValue["TopSelecter"] = index;
    this.IsShowFilterTermSelecter = index == 0;
  }
  TopSelectChange(index) {
    this.TopSelecter = index;
    this.initSubSelecter();
    this.initTermList();
    this.initShowList();
  }
  SubSelectChange(index) {
    this.SubSelecter = index;
    //設置右側下拉選單選項目前台幣/外幣只有活期跟定期
    this.initTermList();
    this.initShowList();
  }

  ProductTypeSelectChange(item) {
    this.FilterValue["ProductType"] = item;
    this.FilterProductTypeSelected = item;
    this.CloseSelect();
  }
  CurSelectChange(item) {
    this.FilterValue.CurCode = item;
  }
  TenorMinMaxChange() {
    if (this.FilterValue.TenorMin != "" || this.FilterValue.TenorMax != "") {
      this.FilterValue["Tenor"] = this.FilterTermList[0];
    }
  }
  FilterTermSelectChange(item) {
    this.FilterValue["Tenor"] = item;
    if (item != this.FilterTermList[0]) {
      this.FilterValue.TenorMin = ""
      this.FilterValue.TenorMax = ""
    }
  }
  FilterCheckCurCode(element) {
    if (this.FilterValue.CurCode.key != element.CurCode) {
      return false;
    }
    return true;
  }
  FilterCheckTenor(element) {
    var Count = +element.Count;
    if (+element.Count > 0) {
      if (element.TermUnits == "D") {
        Count = +element.Count / 30;
      } else if (element.TermUnits == "W") {
        Count = +element.Count / 4;
      } else if (element.TermUnits == "Y") {
        Count = +element.Count * 12;
      }
    }
    if (this.FilterValue.Tenor.key != "0" && this.FilterValue.Tenor.key != "999") {
      if (Count != this.FilterValue.Tenor.key) {
        return false;
      }
    }
    if (this.FilterValue.TenorMin != "" || this.FilterValue.TenorMax != "") {

      if (Count < +this.FilterValue.TenorMin) {
        return false;
      }
      if (Count > +this.FilterValue.TenorMax) {
        return false;
      }
    }
    return true;
  }
  FilterCheckProductType(element) {
    if (this.FilterValue.ProductType.key == "") {
      return true;
    }
    var value = element.ProductId.replace(/ /g, "");
    return value == this.FilterValue.ProductType.value;
  }

  FilterReset(isRest?) {
    this.initCurList();
    this.initFilterTermList();
    this.initProductTypeList();
    this.IsShowFilterTermSelecter = true;
    if (typeof isRest == 'undefined' || isRest) {
      this.FilterValue = {};
      this.FilterValue["TopSelecter"] = 0;
      this.FilterValue["Country"] = this.CountrySelected;
      this.FilterValue["CurCode"] = this.CurList[0];
      this.FilterValue["ProductType"] = { key: "", value: this.langTrans.instant("INTEREST_RATE.Select") };
      this.FilterValue["Tenor"] = this.FilterTermList[0];
      this.FilterValue["TenorMin"] = "";
      this.FilterValue["TenorMax"] = "";
    } else {
    }
  }
  /** 篩選確認時*/
  FilterComfirm() {
    if (this.CountrySelected.country == this.FilterValue.Country.country) {
      this.setFilterList();
    } else {
      this.CountrySelected = this.FilterValue.Country
      this.CountryListSelected = this.FilterValue.Country
      this.InterestRateQuery(this.initFilterList)
    }
    this.CloseFilter();
  }
  initFilterList = () => {
    this.initResList();
    this.setFilterList();
    this.showTopSelecter();
    this.popup.setGestures({
      'reload_close': true
    });
    this.popup.setLoading(false);
  }
  /**
   * 更新 有篩選器的LIST
   */
  setFilterList = () => {
    this.initTopSelecter();
    if (this.FilterValue.Country.country == "TW") {
      //台灣
      if (this.FilterValue.TopSelecter == 0) {
        //存款
        this.TopSelecter = 0
        this.initSubSelecter();
        if (this.FilterValue.CurCode.key == this.FilterValue.Country.currency) {
          //本幣
          this.SubSelecter = 0
        } else {
          //外幣
          this.SubSelecter = 1
        }
        this.initTermList();
        if (this.FilterValue["Tenor"].key == "0") {
          this.TermSelected = { key: "A", value: "INTEREST_RATE.FilterTerm_0" };
        } else if (this.FilterValue["Tenor"].key == "999") {
          this.TermSelected = this.TermList[0];
        } else {
          this.TermSelected = this.TermList[1];
        }
      } else {
        //放款
        this.TopSelecter = 1
        this.initSubSelecter();
        this.initTermList();
      }
    } else {
      //非台灣
      if (this.FilterValue.TopSelecter == 0) {
        //存款        
        if (this.FilterValue.CurCode.key == this.FilterValue.Country.currency) {
          //本幣
          this.TopSelecter = 0
          this.initSubSelecter();
        } else {
          //外幣
          this.TopSelecter = 1
          this.initSubSelecter();
        }

        if (this.FilterValue["Tenor"].key == "0") {
          this.SubSelecter = 2
        } else if (this.FilterValue["Tenor"].key == "999") {
          this.SubSelecter = 0
        } else {
          this.SubSelecter = 1
        }
        this.initTermList();
      } else {
        this.TopSelecter = 2
        this.initSubSelecter();
        this.initTermList();
      }
    }
    this.initShowList();
    this.IsFilter = false;
  }
  /** 檢查是否為空值*/
  checkValue(filter) {
    if (filter == undefined || filter == "") {
      return true;
    }
  }

  ChangeShowValueCount(number) {
    this.ShowValueCount = number;
  }

  SortList(List, key) {
    List.sort((a, b) => { return a[key] > b[key] });
  }
  /**
   * @param value //欲排序資料
   * 排序方式：產品別遞增排序後，依期別遞增排序
   */
  sortShowList(value){
    return value.sort((a,b) =>{
      if(a.name == b.name){
        //若單位為月則乘上30
        if(a.value4 * (a.value5 == "M"? 30 : 1) > b.value4 * (b.value5 == "M"? 30 : 1)){
          return 1;
        }
        //若單位為月則乘上30
        else if(a.value4 * (a.value5 == "M"? 30 : 1) < b.value4 * (b.value5 == "M"? 30 : 1)){
          return -1;
        }else{
          return 0;
        }
      }else{    
        if(a.name > b.name){
          return -1;
        }
        else{
          return 1;
        }
      }
    })
  }
}


