/**
 * 票據查詢頁
 */
import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { DoDomColInqService } from '../../../shared/service/customize/doDomColInq.service';
import { DoChkIssueInqService } from '../../../shared/service/customize/doChkIssue.service';
import { AcctSummPlusInqService } from '../../../shared/service/customize/acctSummPlusInq.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { SearchFilterService } from '../../../shared/component/public/search-filter.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';
import { SortByService } from '../../../shared/service/global/sortby.service';
import { SearchComponent } from '../../../shared/component/public/search.component';

@Component({
  selector: 'app-bill-collection',
  templateUrl: './billCollection.component.html',
  styleUrls: ['./billCollection.component.css']
})
export class BillCollectionComponent implements OnInit, AfterViewInit {

  @ViewChild(SearchComponent)
  private searchComponent: SearchComponent;

  /**1
   * 參數設定
   */
  tabClass = 'active_2'; // 功能選單下黃色底線控制
  yellowStyle1 = true; // 子頁籤黃色背景控制(託收票據)
  yellowStyle2 = false; // 子頁籤黃色背景控制(當日支存不足明細)
  collection = true; // 子頁籤切換
  switchIndex = 1;
  // 託收票據清單 hard code data
  listItem = {
    "openType": false,
  }
  list = []
  accRes = [];
  accSumRes;
  apiRes = [];
  chkIssueRes;

  public source = []; // 要篩選的資料
  public loadData; // 要被載入更多的data
  public selectedData; //下拉選擇的data
  public filterBlock = false; // 篩選div
  public viewStatusData; // 篩選畫面呈現的資料 狀態
  public viewDateData; // 篩選畫面呈現的資料 託收日/ 到期日/ 最後更新日
  public filterArray = ['DebitAcctNo', 'DebitBankName']; // 頁面input搜尋keyArray 扣款帳號,扣帳行名稱
  // public filterDateKey = ['ColDate', 'MaturityDate', 'LastModifiedDate'];
  dAmntFrom: any; // 扣帳金額_起
  dAmntTo: any; // 扣帳金額_到
  public closeBtnChange = true; // 關閉鈕切換

  selAccountName = '';

  constructor(
    private layout: LayoutService,
    private popup: PopupService,
    private dateformat: DateTimeService,
    private doDomColInq: DoDomColInqService,
    private doChkIssue: DoChkIssueInqService,
    private getAcctSummInq: AcctSummPlusInqService,
    private langTransService: LangTransService,
    private optionFilter: SearchFilterService,
    private functionList: FunctionListService,
    private router: Router,
    private storage: LocalStorageService,
    private sortBy: SortByService,
    private zone: NgZone
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.DEPOSIT_DETAIL'
    });
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.getData();
        // 下拉reload重置search bar
        this.searchComponent.searchkey = "";
      }
    });
  }
  Detailitle
  ngOnInit() {

    if (!this.functionList.checkHasFunction(FunctionListService.CHK_INQ)
      && !this.functionList.checkHasFunction(FunctionListService.COL_INQ)) {
      return;
    }
    if (this.functionList.checkHasFunction(FunctionListService.COL_INQ)) {
      this.switchIndex = 1
    } else {
      this.switchIndex = 2
    }
    this.Detailitle = {
      "DebitBankTitle": this.langTransService.instant("BILLCOLLECTION.DebitBankTitle")
      , "DebitAcctNoTitle": this.langTransService.instant("BILLCOLLECTION.DebitAcctNoTitle")
      , "ColBranchNameTitle": this.langTransService.instant("BILLCOLLECTION.ColBranchNameTitle")
      , "LastModifiedDateTitle": this.langTransService.instant("BILLCOLLECTION.LastModifiedDateTitle")
      , "MaturityDateTitle": this.langTransService.instant("BILLCOLLECTION.MaturityDateTitle")
    }

    this.getData();
  }


  

  getData() {
    const success = (res) => {
      this.accSumRes = res;
      this.initAccRes();
      //關閉Reload Method
      this.popup.setGestures({
        'reload_close': true
      });
    };
    const error = (err) => {
      // 票據查詢 概要取得失敗
      console.log(this.langTransService.instant('BILLCOLLECTION.GET_FAILED'), err);
      let ResultCode = err['Result'] ? err['Result'] : err['HeaderRs']['Result'];
      // 顯示錯誤訊息
      this.popup.setConfirm({
        content: this.langTransService.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')'
      });
      //關閉Reload Method
      this.popup.setGestures({
        'reload_close': true
      });
      // 關閉Loading畫面
      this.popup.setLoading(false);
      this.loadData = [];
    };
    var cur = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    if (cur == "" || cur == undefined) {
      cur = "TWD";
    }
    this.getAcctSummInq.acctSummPlusInq(cur).then(success, error);
  }

  /**
   * 收合清單點擊事件
   * @param listIndex 點擊之清單索引值
   */
  toggle(listIndex) {
    this.loadData[listIndex]["openType"] = !this.loadData[listIndex]["openType"]
  }

  /**
   * 子頁標籤點擊事件
   * @param num 標籤索引參數
   */
  onSwitchClick(num) {
    if (!this.functionList.checkHasFunction(FunctionListService.CHK_INQ)
      && !this.functionList.checkHasFunction(FunctionListService.COL_INQ)) {
      return;
    }
    switch (num) {
      case '1':
        if (!this.functionList.checkHasFunction(FunctionListService.COL_INQ)) {
          this.popup.setConfirm({
            content: this.langTransService.instant("ERROR.ERROR_120")
          })
          return;
        }
        this.switchIndex = 1;
        this.collection = true;
        this.yellowStyle1 = true;
        this.yellowStyle2 = false;
        break;

      case '2':
        if (!this.functionList.checkHasFunction(FunctionListService.CHK_INQ)) {
          this.popup.setConfirm({
            content: this.langTransService.instant("ERROR.ERROR_120")
          })
          return;
        }
        this.switchIndex = 2;
        this.collection = false;
        this.yellowStyle1 = false;
        this.yellowStyle2 = true;
        break;
      default:
        break;
    }
    this.popup.setLoading(true);
    this.initAccRes();
  }

  statusToString(code) {
    var result = "";
    switch (code) {
      case "1":
        result = this.langTransService.instant('BILLCOLLECTION.STATUS_1'); // All
        break;
      case "2":
        result = this.langTransService.instant('BILLCOLLECTION.STATUS_2'); // 兌現
        break;
      case "3":
        result = this.langTransService.instant('BILLCOLLECTION.STATUS_3'); // 託收
        break;
      case "4":
        result = this.langTransService.instant('BILLCOLLECTION.STATUS_4'); // 退票
        break;
      case "5":
        result = this.langTransService.instant('BILLCOLLECTION.STATUS_5'); // 撤票
        break;
      case "6":
        result = this.langTransService.instant('BILLCOLLECTION.STATUS_6'); // 銷帳
        break;
    }
    return result;
  }


  AcctNoSelected;
  onAccountClick() {
    this.popup.setCheckList({
      // title: this.langTransService.instant(''), // 
      data: this.accRes,
      type: 'radio',
      event: (result) => {
        this.selAccountName = result['desc'];
        this.AcctNoSelected = result['original'];
        this.popup.setLoading(true);
        this.zone.run(() => {
          //下拉選單選擇完重製filter
          this.filterClick(true)
          this.r1['Status'] = "";
          this.sendApi();
        })
      }
    })
  }

  ReflashAcctNo() {
    var index = this.accRes.findIndex((item) => {
      if (item.type != 'account') {
        return false;
      }
      return true;
    })
  //初始化下拉選單    
    if(!this.AcctNoSelected){
      this.AcctNoSelected = this.accRes[index]["original"];
    }

  //初始化下拉選單    
    if(!this.selAccountName){
      this.selAccountName = this.accRes[index].desc;
    }
  }


  Init() {
    this.initCustomerList();

    this.zone.run(() => {
      this.filterClick(true);
      this.sendApi();
    })

  }

  initCustomerList() {
    this.ReflashAcctNo();
  }

  initAccRes() {
    var result = [];
    this.accSumRes["AcctSummList"].forEach(element => {
      if (this.switchIndex == 1 && (element["AcctType"] == "C" || element["AcctType"] == "S")) {
        result.push(element);
      } else if (element["AcctType"] == "C") {
        result.push(element);
      }
    });
    /*    [ 必填項目 ]
     *    keyCountry: "原資料之「國別」鍵值",
     *    keyCompanyId: "原資料之「公司統編」鍵值",
     *    keyCompanyName: "原資料之「公司名稱」鍵值",
     *    keyCurrency: "原資料之「帳戶幣別」鍵值",
     *    keyAccout: "原資料之「帳戶帳號」鍵值",
     *    [ 選填項目 ]
     *    showAll: "是否增加全部選項，預設值true",
     *    allDesc: "指定全部項顯示文案，給入完整i18n鍵值",
     */
    if (result.length > 0) {
      this.accRes = this.sortBy.sortAcctList(result, {
        keyCountry: "Country",
        keyCompanyId: "CustomerId",
        keyCompanyName: "CustomerName",
        keyCurrency: "AcctCurrency",
        keyAccout: "AcctNo",
        showAll: false,
        default: this.selAccountName,
      })
      console.log("this.sortBy = "+this.sortBy)

      this.InitChkIssue();
      this.Init();
    } else {
      this.popup.setLoading(false);
    }
  }

  reflashReqObject() {
    this.ReqObject = this.doDomColInq.getReqObjectSample();
    this.ReqObject["Country"] = "TW";
    this.ReqObject["CustomerId"] = this.AcctNoSelected["CustomerId"];
    this.ReqObject["AcctNo"] = this.AcctNoSelected["AcctNo"];
    this.ReqObject["Branch"] = this.AcctNoSelected["BranchCode"];
    this.ReqObject["Status"] = "1";
    this.ReqObject["DateType"] = "3";
    var from = new Date();
    var to = new Date();

    //default查詢三個月
    from.setMonth(from.getMonth() - 3);
    this.ReqObject["DateTo"] = this.dateformat.datetimeFormat(Date.now(), 'yyyyMMdd');
    this.ReqObject["DateFrom"] = this.dateformat.datetimeFormat(from.getTime(), 'yyyyMMdd');

  }

  ChkIssueModel
  InitChkIssue() {
    this.ChkIssueModel = {
      "balance": "",
      "currency": "",
      "notEnough": "",
      "chkTotal": "",
      "time": "",
    };
  }

  ReqObject
  sendApi(FilterSource?) {
    const error = (err) => {
      //關閉Reload Method
      this.popup.setGestures({
        'reload_close': true
      });
      this.popup.setLoading(false);
      this.loadData = [];

    }; // 票據查詢 查詢失敗
    if (this.switchIndex == 1) {
      const success = (res) => {
        if (res.Result != 4001) {
          return;
        }
        this.apiRes = res["ChkColList"];
        this.apiRes.forEach(element => {
          element["openType"] = false
        });
        //關閉Reload Method
        this.popup.setGestures({
          'reload_close': true
        });

        this.popup.setLoading(false);
		//套用篩選完之source
        if(FilterSource){
          this.source = FilterSource;
        }else{
          this.source = JSON.parse(JSON.stringify(this.apiRes));
        }
        this.searchComponent.source = this.source;
        this.searchComponent.Submit();
      };
      this.doDomColInq.doDomColInq(this.ReqObject).then(success, error);
    } else if (this.switchIndex == 2) {
      var issueReqObject = this.doChkIssue.getReqObjectSample();
      issueReqObject["AcctNo"] = this.AcctNoSelected["AcctNo"];
      issueReqObject["AcctCur"] = this.AcctNoSelected["AcctCurrency"];
      issueReqObject["Date"] = this.dateformat.datetimeFormat(Date.now(), 'yyyyMMdd');
      this.ChkIssueModel["time"] = this.dateformat.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss');
      this.ChkIssueModel["balance"] = this.AcctNoSelected["CurBalance"];
      this.ChkIssueModel["currency"] = "TWD";
      const success = (res) => {
        if (res.Result != 4001) {
          return;
        }
        var total = 0
        this.chkIssueRes = res["ChkIssueList"];
        this.source = JSON.parse(JSON.stringify(this.chkIssueRes));
        this.loadData = this.chkIssueRes;
        this.chkIssueRes.forEach(element => {
          total += +element["ChkAmt"];
        });
        this.ChkIssueModel["chkTotal"] = total.toString();
        var notEnough = 0;
        if (total > +this.AcctNoSelected["CurBalance"]) {
          notEnough = total - +this.AcctNoSelected["CurBalance"];
        }
        this.ChkIssueModel["notEnough"] = notEnough.toString();
        this.LoadPage(true);
        //關閉Reload Method
        this.popup.setGestures({
          'reload_close': true
        });
        this.popup.setLoading(false);
      };

      this.doChkIssue.doChkIssue(issueReqObject).then(success, error);
    }
  }


  CompanySort(a, b) {
    var CompanyA = a["CustomerId"];
    var CompanyB = b["CustomerId"];

    if (CompanyA < CompanyB) {
      return -1;
    }
    if (CompanyA > CompanyB) {
      return 1;
    }
    return 0
  }

  LoadPage(reset?) {
    if (this.switchIndex == 1) {
      //資料排序---最新日期在最上面
      this.loadData.sort(function (a, b) {
        let aStrings = a['ColDate'].split("/");
        let bStrings = b['ColDate'].split("/");

        if (aStrings[0] != bStrings[0]) {
          return bStrings[0] - aStrings[0];
        } else {
          return bStrings[1] - aStrings[1]
        }
      })
    } else {

    }

  }

  getActive(index) {
    if (this.collection && index == 0) {
      return "active"
    }
    if (!this.collection && index == 1) {
      return "active"
    }
    return "";
  }

  /**
   * 篩選
   */
  filterClick(reset?) {
    if (reset) {
      this.viewStatusData = {
        default_value: '',
        option: [
          { name: this.langTransService.instant('BILLCOLLECTION.STATUS_2'), value: '2' },
          { name: this.langTransService.instant('BILLCOLLECTION.STATUS_3'), value: '3' },
          { name: this.langTransService.instant('BILLCOLLECTION.STATUS_4'), value: '4' },
          { name: this.langTransService.instant('BILLCOLLECTION.STATUS_5'), value: '5' },
          { name: this.langTransService.instant('BILLCOLLECTION.STATUS_6'), value: '6' }
        ]
      };
      this.viewDateData = {
        default_value: {
          dateType: 'ColDate'
        },
        timeOption: [
          { name: this.langTransService.instant('BILLCOLLECTION.OneWeek'), select: false, type: '1W' },
          { name: this.langTransService.instant('BILLCOLLECTION.OneMonth'), select: true, type: '1M' },
          { name: this.langTransService.instant('BILLCOLLECTION.ThreeMonth'), select: false, type: '3M' },
          { name: this.langTransService.instant('BILLCOLLECTION.SixMonth'), select: false, type: '6M' },
          { name: this.langTransService.instant('BILLCOLLECTION.OneYear'), select: false, type: '1Y' }
        ],
        dateOption: [
          { name: this.langTransService.instant('BILLCOLLECTION.COL_DATA'), value: 'ColDate' },
          { name: this.langTransService.instant('BILLCOLLECTION.MATURITY'), value: 'MaturityDate' },
          { name: this.langTransService.instant('BILLCOLLECTION.UPDATE_DATE'), value: 'LastModifiedDate' },
        ],
        type: 'past'
      }
      this.dAmntFrom = '';
      this.dAmntTo = '';
      this.reflashReqObject();
    } else {

      this.filterBlock = true;
      let StatusArr = [
        { name: this.langTransService.instant('BILLCOLLECTION.STATUS_2'), value: '2' },
        { name: this.langTransService.instant('BILLCOLLECTION.STATUS_3'), value: '3' },
        { name: this.langTransService.instant('BILLCOLLECTION.STATUS_4'), value: '4' },
        { name: this.langTransService.instant('BILLCOLLECTION.STATUS_5'), value: '5' },
        { name: this.langTransService.instant('BILLCOLLECTION.STATUS_6'), value: '6' }
      ];

      this.viewStatusData = {
        title: this.langTransService.instant('BILLCOLLECTION.STATUS'),
        default_value: this.r1['Status'],
        option: StatusArr
      }
    }

  }

  public r1 = {};
  result1(filter) {
    console.log('r1', filter);
    this.r1 = filter;
  }

  public r2 = {};
  result2(filter) {
    console.log('r2', filter);
    this.r2 = filter;
  }

  /**
   * 篩選popup 套用鈕
   */
  onFilterClick() {
    this.reflashReqObject();
    if (this.r2["selectedDateFrom"] && this.r2["selectedDateTo"]) {
      this.ReqObject["DateTo"] = this.dateformat.datetimeFormat(new Date(this.r2["selectedDateTo"]).getTime(), 'yyyyMMdd');
      this.ReqObject["DateFrom"] = this.dateformat.datetimeFormat(new Date(this.r2["selectedDateFrom"]).getTime(), 'yyyyMMdd');
    } else {
      var from = new Date();
      var to = new Date();
      
      from.setMonth(from.getMonth() - 3);
      this.ReqObject["DateTo"] = this.dateformat.datetimeFormat(Date.now(), 'yyyyMMdd');
      this.ReqObject["DateFrom"] = this.dateformat.datetimeFormat(from.getTime(), 'yyyyMMdd');
    }
    if (this.r2["selectrdDateOption"]) {
      switch (this.r2["selectrdDateOption"]) {
        case "ColDate":
          this.ReqObject["DateType"] = "3"
          break;
        case "MaturityDate":
          this.ReqObject["DateType"] = "2"
          break;
        case "LastModifiedDate":
          this.ReqObject["DateType"] = "1"
          break;
      }
    }
    if (this.r1["Status"]){
      this.ReqObject["Status"] = this.r1["Status"]
    }
    this.doFilter();
    this.sendApi(this.source);
    this.popup.setLoading(true);
    this.filterBlock = false;
  }

  doFilter() {
    let amtData;
    if (this.dAmntFrom != undefined && this.dAmntTo != undefined && this.dAmntFrom != '' && this.dAmntTo != '') {
      amtData = { Amount: { 'rangeNum': (+this.dAmntFrom * 10000).toString() + '-' + (+this.dAmntTo * 10000).toString() } }
    }
    
    let finalFilter = Object.assign(
      this.r1,
      this.r2["filter"] ? this.r2["filter"] : {},
      amtData
    );

    var data = this.switchIndex == 1 ? this.apiRes : this.chkIssueRes
    this.source = this.optionFilter.FilterData(data, finalFilter, true);

    this.searchComponent.source = this.source;
    this.searchComponent.Submit();
    
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
    this.loadData = filter;
    this.LoadPage(true);
  }

}
