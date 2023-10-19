
import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { LoanSummInqService } from '../../../shared/service/customize/loanSummInq.service';
import { SearchFilterService } from '../../../shared/component/public/search-filter.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { SortByService } from '../../../shared/service/global/sortby.service';
import { SearchComponent } from '../../../shared/component/public/search.component';


/**
 * 放款概要頁
 */
@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.css']
})
export class LoanSummaryComponent implements OnInit, AfterViewInit {
  @Input() homeReq: any; // 由總覽頁過來的設定
  @ViewChild(SearchComponent)
  private searchComponent: SearchComponent;

  public pageType = 'list';
  public queryDate = "";

  public filterBlock = false; // 篩選div
  public viewCurrencyData; // 篩選畫面呈現的資料 幣別
  public viewProductNameData; // 篩選畫面呈現的資料 產品別
  public viewStatusData; // 篩選畫面呈現的資料 狀態
  public viewDateData; // 篩選畫面呈現的資料 到期日/動撥日
  public filterArray = ['AcctNo', 'BranchName']; // 頁面input搜尋keyArray 帳號,分行名稱
  public closeBtnChange = true; // 篩選關閉鈕切換

  public originalData; // 原始資料
  public sourceData = []; // 搜尋篩選來源資料
  public loadData; // 要被載入更多的data
  public selectedData //經過下拉後的資料
  public pagerData = undefined; // 畫面已顯示資料
  public selectedLoanSummary; // 放款明細數據
  public companyListData; // 公司選單資料陣列
  public selectedItem; // 選單選取值
  public DropContent = "LOANSUMMARY.ALL_COMPANY";  // 下拉選取內容值

  // 觸底更新handler
  public pager = 0; //目前顯示筆數
  public pagerAdd = 5; //每次增加筆數
  public showLoad = false;   //顯示下方載入更多

  //幣別CSS
  public tagStyle = "currency";

  constructor(
    private popup: PopupService,
    private layout: LayoutService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private langTrans: LangTransService,
    private loanSummInq: LoanSummInqService,
    private optionFilter: SearchFilterService,
    private router: Router,
    private sort: SortByService,
  ) {
    // Init layout
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      
      'reload': () => {
        this.ngOnInit();
      }
    });
  }


  ngOnInit() {
    // Display loading page
    this.popup.setLoading(true);
    // Display query time
    this.queryDate = this.dateTime.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss');
    // Clear data
    this.clearData();
    // Query loan summary
    this.loanSummInq.loanSummInq(this.storage.get("slectedCurrency"))
      .then((res) => { this.onLoanSummarySuccess(res) }, this.onNetworkError);
  }

  /**
   * On loan summary API query success
   */
  onLoanSummarySuccess = (res) => {
    console.log("[放款概要頁][API] loanSummInq success", res);

    // 取得放款概要資料
    this.originalData = res['LoanSummList'] ? res['LoanSummList'] : [];

    // 公司選單數據
    this.companyListData = this.sort.sortCompanyList(res['LoanSummList'],
      {
        keyCountry: "Country",
        keyCompanyId: "CustomerId",
        keyCompanyName: "CustomerName",
        showAll: true,
        allDesc: "LOANSUMMARY.ALL_COMPANY",
        default: this.DropContent
      }
    );
    console.log("[放款概要頁] companyListData", this.companyListData);

    // 從首頁轉頁來時取得相關參數
    if (this.homeReq != undefined)
      this.homeInq();
    else
      this.onListItemChange();

    //關閉Reload Method
    this.popup.setGestures({
      'reload_close': true
    });
    // Dismiss loading page
    this.popup.setLoading(false);
  }

  /**
   * 解析首頁傳遞參數
   */
  homeInq() {
    console.log("[放款概要頁] homeInq req", this.homeReq);

    // 直接跳轉放款明細
    if (this.homeReq.Detail == true) {
      let detail = this.originalData.find(data => {
        return data.CustomerId == this.homeReq.company &&
              data.Country == this.homeReq.country;
      });
      // 選取相符公司的第一筆資料
      this.onLoanSummaryItemClick((detail && detail.length > 0) ? detail[0] : {});
      return;
    }

    // 觸發選單機制變更畫面資料
    // 指定查詢地區國別
    if (this.homeReq.companyType == "Country") {
      this.selectedItem = { country: this.homeReq.country };
      this.onListItemChange();
      // 更新公司選單狀態
      this.updateList(this.homeReq.country.toString().toUpperCase(), null);
    }
    // 指定查詢公司
    else if (this.homeReq.companyType == "Customer") {
      this.selectedItem = { 
        country: this.homeReq.country,
        company: this.homeReq.company };
      this.onListItemChange();
      // 更新公司選單狀態
      this.updateList(this.homeReq.country, this.homeReq.company);
    } else {
      this.onListItemChange();
    }

    // 觸發篩選機制變更畫面資料
    // 指定查詢產品別
    if (this.homeReq.product != undefined && this.homeReq.product != "") {
      this.r3 = { ProductName: this.homeReq.product };
      this.onFilterClick();
    }
    // 指定查詢幣別
    else if (this.homeReq.currency != undefined && this.homeReq.currency != "") {
      this.r2 = { Currency: this.homeReq.currency };
      this.onFilterClick();
    }
    this.homeReq = undefined;
  }

  /**
   * 更新公司選單狀態(僅處理首頁參數時須使用)
   * @param country
   * @param company
   */
  updateList(country, company) {

    if (!company) {
      this.companyListData.forEach(data => {
        if (data['type'] == "country" && data['original']['country'] == country) {
          // 手動更新選單項目選取狀態
          data['checked'] = true;
          // 更新選單顯示資訊
          this.DropContent = data['desc'];
        }
        else
          data['checked'] = false;
      });
    }
    else {
      this.companyListData.forEach(data => {
        if (data['type'] == "company" && 
          data['original']['company'] == company &&
          data['original']['country'] == country) {
          // 手動更新選單項目選取狀態
          data['checked'] = true;
          // 更新選單顯示資訊
          this.DropContent = data['desc'];
        }
        else
          data['checked'] = false;
      });
    }
    console.log("[放款概要頁] updateList companyListData", this.companyListData);
  }

  /**
   * 清除所有欄位資料
   */
  clearData() {
    this.selectedItem = {};
    this.pagerData = undefined;
  }

  /**
   * On API query cause network error
   */
  onNetworkError = (error) => {
    console.log("[放款概要頁][API] loanSummInq failed", error);
    let ResultCode = error['Result'] ? error['Result'] : error['HeaderRs']['Result'];
    // 顯示錯誤訊息
    this.popup.setConfirm({
      content: this.langTrans.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')'
    });
    // 初始化顯示資料陣列，以開啟no-data效果
    this.pagerData = [];

    //關閉Reload Method
    this.popup.setGestures({
      'reload_close': true
    });
    // Dismiss loading page
    this.popup.setLoading(false);
  }

  /**
   * On loan summary item clicked
   * @param loanSummary Loan summary item
   */
  onLoanSummaryItemClick(loanSummary) {
    this.pageType = 'detailPage';
    this.selectedLoanSummary = loanSummary;
  }

  /**
   * Back to loan summary list
   * @param e Back event
   */
  backToLoanSum(e) {
    this.pageType = e;
    setTimeout(() => {
      //註冊手勢事件 下滑Reload
      this.popup.setGestures({
        //註冊Reload事件
        'reload': () => {
          this.ngOnInit();
        }
      });
    }, 500)

  }

  /**
   * Load more page items
   * @param reset Rest to first page or not
   */
  LoadPage(reset?) {
    if (this.pagerData == undefined) {
      this.pagerData = [];
    }
    if (reset) {
      this.pager = 0;
      this.showLoad = true;
    }
    if (this.loadData.length > this.pager + this.pagerAdd) {
      this.pager += this.pagerAdd;
      this.pagerData = this.loadData.slice(0, this.pager);
      this.showLoad = true;
    } else {
      this.pagerData = this.loadData;
      this.showLoad = false;
    }
  }

  /**
   * 清除篩選器的選取項紀錄
   */
  clearFilterResult() {
    this.r2 = "";
    this.r3 = "";
    this.r4 = "";
    this.r5 = "";
  }

  /**
   * 篩選
   */
  filterClick(reset?) {
    this.filterBlock = true;
    let countryArr = [];
    // let currencyObj = {};
    let currencyArr = [];
    // let ProductNameObj = {};
    let ProductNameArr = [];
    let StatusArr = [];

    this.originalData.forEach(item => {
      countryArr.push({ name: item.Currency, value: item.Currency });
      countryArr = this.dedup(countryArr);

      currencyArr.push({ name: item.Currency, value: item.Currency });
      currencyArr = this.dedup(currencyArr);

      ProductNameArr.push({ name: item.ProductName, value: item.ProductName });
      ProductNameArr = this.dedup(ProductNameArr);

      StatusArr.push({ name: item.Status, value: item.Status });
      StatusArr = this.dedup(StatusArr);
    });

    if (reset) {
      this.viewCurrencyData = {
        default_value: '',
        option: currencyArr
      };
      this.viewProductNameData = {
        default_value: '',
        option: ProductNameArr
      };
      this.viewStatusData = {
        default_value: '',
        option: StatusArr
      }
      this.viewDateData = {
        default_value: {
          dateType: 'MaturityDt'
        },
        timeOption: [
          { name: 'LOANSUMMARY.FILTER_HALF_YEAR', select: false, type: '6M' },
          { name: 'LOANSUMMARY.FILTER_ONE_YEAR', select: false, type: '1Y' },
          { name: 'LOANSUMMARY.FILTER_TWO_YEAR', select: false, type: '2Y' },
          { name: 'LOANSUMMARY.FILTER_THREE_YEAR', select: false, type: '3Y' }
        ],
        dateOption: [
          { name: 'LOANSUMMARY.MATURITY_DT', value: 'MaturityDt' },
          { name: 'LOANSUMMARY.DISBURSE_DT', value: 'DisburseDt' },
        ],
        type: 'past'
      }
    } else {
      this.viewCurrencyData = {
        title: 'LOANSUMMARY.FILTER_CURRENCY',
        default_value: this.r2['Currency'] ? this.r2['Currency'] : '',
        option: currencyArr
      }

      this.viewProductNameData = {
        title: 'LOANSUMMARY.FILTER_PRODUCT_NAME',
        default_value: this.r3['ProductName'] ? this.r3['ProductName'] : '',
        option: ProductNameArr
      }

      this.viewStatusData = {
        title: 'LOANSUMMARY.FILTER_STATUS',
        default_value: this.r4['Status'] ? this.r4['Status'] : '',
        option: StatusArr
      }

      this.viewDateData = this.viewDateData ? this.viewDateData : {
        default_value: {
          dateType: 'MaturityDt'
        },
        timeOption: [
          { name: 'LOANSUMMARY.FILTER_HALF_YEAR', select: false, type: '6M' },
          { name: 'LOANSUMMARY.FILTER_ONE_YEAR', select: false, type: '1Y' },
          { name: 'LOANSUMMARY.FILTER_TWO_YEAR', select: false, type: '2Y' },
          { name: 'LOANSUMMARY.FILTER_THREE_YEAR', select: false, type: '3Y' }
        ],
        dateOption: [
          { name: 'LOANSUMMARY.MATURITY_DT', value: 'MaturityDt' },
          { name: 'LOANSUMMARY.DISBURSE_DT', value: 'DisburseDt' },
        ],
        type: 'past'
      }
    }


  }

  public r2 = {};
  result2(filter) {
    console.log('[放款概要頁][filter] r2 =', filter);
    this.r2 = filter;
  }

  public r3 = {};
  result3(filter) {
    console.log('[放款概要頁][filter] r3 =', filter);
    this.r3 = filter;
  }

  public r4 = {};
  result4(filter) {
    console.log('[放款概要頁][filter] r4 =', filter);
    this.r4 = filter;
  }

  public r5 = {};
  result5(filter) {
    console.log('[放款概要頁][filter] r5 =', filter);
    this.r5 = filter;
  }


  /**
   * 篩選popup 套用鈕
   */
  onFilterClick() {
    let finalFilter = Object.assign({},
      this.r2, this.r3, this.r4, this.r5["filter"] ? this.r5["filter"] : {}
    );
    console.log("[放款概要頁][filter] onFilterClick sourceData", this.sourceData);
    console.log("[放款概要頁][filter] onFilterClick finalFilter", finalFilter);
    //篩選已選之條件
    this.loadData = this.optionFilter.FilterData(this.selectedData, finalFilter, true, false);
    console.log("[放款概要頁][filter] onFilterClick loadData", this.loadData);

    this.sourceData = this.loadData;
    this.searchComponent.source = this.loadData;
    this.searchComponent.Submit();
    this.filterBlock = false;
  }

  /**
   * 篩選popup 關閉鈕
   */
  filterCloseBtn() {
    this.filterBlock = false;
  }

  /**
   * 控制關閉按鈕顯不顯示
   */
  closeBtnFlag(e) {
    this.closeBtnChange = e;
  }

  /**
   * 頁面input搜尋
   */
  public search_result_data;
  search_result(filter) {
    console.log('search_result_data >>>>', filter);
    this.loadData = filter;
    this.LoadPage(true);
  }

  /**
   * array 重複刪除
   */
  dedup(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

  /**
   * [前端事件綁定] 點擊開啟公司選單
   */
  onListClick() {
    this.popup.setCheckList({
      data: this.companyListData,
      type: 'radio',
      event: (result) => {
        console.log("[放款概要頁] onListClick result =", result);
        this.selectedItem = result['original'];
        // 更新選單顯示資訊
        this.DropContent = result['desc'];
        this.onListItemChange();
      }
    });
  }

  /**
   * 選單選取觸發畫面資料變更
   */
  onListItemChange() {
    console.log("[放款概要頁] onListItemChange selectedItem", this.selectedItem);
    let country = this.selectedItem['country'];
    let companyId = this.selectedItem['company'];

    // 選取公司項目
    if (companyId) {
      this.selectedData = this.originalData.filter(data => {
        return data['CustomerId'] == companyId && data['Country'] == country;
      });
    }
    // 選取國家地區項目
    else if (country) {
      this.selectedData = this.originalData.filter(data => {
        return data['Country'] == country;
      });
    }
    // 全部
    else {
      this.selectedData = this.originalData;
    }

    // 清除篩選器紀錄
    this.loadData = this.selectedData;
    this.sourceData = JSON.parse(JSON.stringify(this.loadData));
    this.searchComponent.searchkey = "";
    this.LoadPage(true);
  }
}
