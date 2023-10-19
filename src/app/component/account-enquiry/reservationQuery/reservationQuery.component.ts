import { Component, OnInit, NgZone, AfterViewInit, Output, EventEmitter,ViewChild } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { PopupService } from '../../../shared/service/global/popup.service';
import { IDGateService } from '../../../shared/service/cordova/IdGete.service';
import { FundXferInqService } from '../../../shared/service/customize/fundXferInq.service';
import { FundXferModService } from '../../../shared/service/customize/fundXferMod.service';
import { SearchFilterService } from '../../../shared/component/public/search-filter.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { AppTxnInqService } from '../../../shared/service/customize/appTxnInq.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { PatternLockService } from '../../../shared/service/global/patternLock.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';
import { SearchComponent } from '../../../shared/component/public/search.component';
import { HexadecimalService } from '../../../shared/service/global/hexadecimal.service';

@Component({
  selector: 'app-reservationQuery',
  templateUrl: './reservationQuery.component.html',
  styleUrls: ['./reservationQuery.component.css']
})

export class ReservationQueryComponent implements OnInit, AfterViewInit {

  @Output()
  public tabChange = new EventEmitter<string>();
  @ViewChild(SearchComponent)
  private searchComponent: SearchComponent;
  /**
   * 參數設定
   */
  tabClass = 'active_3'; // 功能選單下黃色底線控制
  yellowStyle1 = false; // 子頁籤黃色背景控制(APP交易紀錄)
  yellowStyle2 = true; // 子頁籤黃色背景控制(預約查詢與取消)
  collection = true; // 子頁籤切換(APP交易紀錄/預約查詢與取消)
  switchIndex = 2;
  summaryPage = true;
  singleDetailPage = false;
  cycleDetailPage = false;
  // checkingTime: any;
  // 篩選相關參數
  // 篩選
  filterBlock = false; // 篩選div
  source = []; // 要篩選的資料
  // loadData; // 要被載入更多的data
  viewCountryData; // 篩選畫面呈現的資料 國家
  viewTxnCodeData; // 篩選畫面呈現的資料 交易類型
  viewDebitCurData; // 篩選畫面呈現的資料 扣帳幣別
  viewCreditCurData; // 篩選畫面呈現的資料 扣帳幣別
  // viewTOTALRECORDData; // 篩選畫面呈現的資料 總筆數
  finishCount = 0 // 已完成
  today = new Date();
  selectedDateFrom: any;
  selectedDateTo: any;
  dateType = [
    { name: this.langTransService.instant("TRANSACTION.ONEWEEK"), select: false, type: '1' }, // 一週
    { name: this.langTransService.instant("TRANSACTION.ONEMONTH"), select: true, type: '2' }, // 一月
    { name: this.langTransService.instant("TRANSACTION.THREEMONTH"), select: false, type: '3' }, // 三月
    { name: this.langTransService.instant("TRANSACTION.HALFYEAR"), select: false, type: '4' }, // 半年
    { name: this.langTransService.instant("TRANSACTION.ONEYEAR"), select: false, type: '5' } // 一年
  ];
  filterArray = ['PayerAcct','PayerName','PayerId','DebitBankId','BatchId' ];
  // 頁面input搜尋keyArray 扣帳帳號,所屬統編,所屬公司名稱,扣帳銀行名稱,交易序號
  dAmntFrom: any; // 扣帳金額_起
  dAmntTo: any; // 扣帳金額_到
  cAmntFrom: any; // 收帳金額_起
  cAmntTo: any; // 收帳金額_到
  closeBtnChange = true; // 篩選關閉鈕切換
  // 清單頁相關參數
  originalData; // 初始資料
  groups;
  lists: any; // Total List Data顯示資料
  listData: any; // Selected List Data
  // 勾選單相關參數
  checkCounter = 0; // 勾選計數器
  cancelBtn = false; // 取消預約按鈕顯示控制
  // 操作相關參數
  cancelOprationData; // 欲操作資料

  constructor(
    private layout: LayoutService,
    private router: Router,
    private popup: PopupService,
    private idGate: IDGateService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private langTransService: LangTransService,
    private optionFilter: SearchFilterService,
    // private fundXferService: FundXferInqService,
    private fundXferModService: FundXferModService,
    private patternLockService: PatternLockService,
    private doLogin: DoLoginService,
    private appTxnInq: AppTxnInqService,
    private zone: NgZone,
    private hex: HexadecimalService
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.ACT_QUERY'
    });
  }


  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.ngOnInit();
        // 下拉reload重製search bar
        this.searchComponent.searchkey = "";
      }
    });
  }

  ngOnInit() {
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.ACT_QUERY'
    });
    
    this.getLists(this.getRequestParameter(),false);

    this.getSearchDate('2');
  }

  /**
   * [API] List Data of Wire Transfer Reservation 約定轉帳交易查詢
   */
  getLists(req,isFilter) {
    return new Promise((resolve, reject) => {
      this.appTxnInq.appTxnInq(req).then(
        (appTxnInq_res) => {
          // 清單取得成功
          console.log('[Transfer Reservation List] appTxnInq success', appTxnInq_res);
          this.lists = [];
          let tempLists = [];
          appTxnInq_res['TxnRecList'].forEach(item => {
            if (item['TxnCode'] === 'SDT' || item['TxnCode'] === 'PDT') {
              item['TxnDetList'].forEach(list => {
                list['TxnNo'] = item['TxnNo'];
                list['CreateTime'] = item['CreateTime']; // 建立時間
                list['TxnCode'] = item['TxnCode']; // 交易類型
                list['CustomerId'] = item['CustomerId']; // 統編
                list['CustomerName'] = item['CustomerName']; // 公司名稱
                list['TxnAlias'] = item['TxnAlias'] ? item['TxnAlias'].trim() : ""; // 該筆交易的交易名稱
                tempLists.push(list);
              });
            }
          });

          this.originalData = JSON.parse(JSON.stringify(tempLists));
          
          this.initCard();
          
          this.checkCounter = 0;
          this.cancelBtn = false;

          // For filter
          this.source = JSON.parse(JSON.stringify(this.lists));

          if(isFilter){
            this.doFilter();
          }

          resolve(appTxnInq_res);
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
        },
        (appTxnInq_err) => {
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
          this.groups = [];
          //reject(appTxnInq_err);
        }
      );
    });
  }

  getRequestParameter(){
    // Init request parameter
    var requestParameter = {};
    requestParameter["TxnCode"] = "ALL";

    // Date from
    var dateFrom = new Date();
    var dateFromString = this.dateTime.datetimeFormat(dateFrom.getTime(), "yyyyMMdd");
    requestParameter["DateFrom"] = dateFromString;

    // Date to
    var dateTo = new Date();
    //default查詢三個月
    dateTo.setMonth(dateTo.getMonth() + 3);
    var dateToString = this.dateTime.datetimeFormat(dateTo.getTime(), "yyyyMMdd");
    requestParameter["DateTo"] = dateToString;

    // Other parameter
    requestParameter["TxnStatus"] = "0";
    requestParameter["PayerId"] = ""; //this.storage.get("CompanyID");
    requestParameter["PayerAcct"] = "";
    requestParameter["TxnCur"] = "";
    requestParameter["PayeeId"] = "";
    requestParameter["PayeeAcct"] = "";
    requestParameter["TxnNo"] = "*";
    requestParameter["CacheId"] = "";
    requestParameter["LastTxnNo"] = "";
    requestParameter["LastTxnCode"] = "";
    return requestParameter;
  }

  private initCard() {

    this.groups = [];
    //補值
    this.originalData.forEach(element => {
      element['checked'] = false;
      var time = new Date(element['TxnDate']).getTime()
      var date = this.dateTime.datetimeFormat(time, 'MM/dd');
      element['date'] = date;
      element['txnDate'] = this.dateTime.datetimeFormat(time, 'yyyyMMdd');;
      if (element['TxnCode'] === 'PDT') {
        element['date'] = undefined;
        let num = 0;
        element['PeriodStatus'].sort((a, b) => {
          return a['TxnDate'] > b['TxnDate'] ? -1 : 1;
        })
        element['PeriodStatus'].forEach(item => {
          item['date'] = item['TxnDate'].slice(4, 6) + '/' + item['TxnDate'].slice(6, 8);
          if (item['TxnDate'] > this.dateTime.datetimeFormat(this.today.getTime(), 'yyyyMMdd')) {
            item['type'] = 'todo';
            num++;
          } else {
            item['type'] = 'done';
          }
        });
        if (num > 0) {
          element['date'] = element['PeriodStatus'][num - 1]['date'];
          element['TxnDate'] = element['PeriodStatus'][num - 1]['TxnDate'];
        } else {
          element['date'] = element['PeriodStatus'][0]['date']
          element['TxnDate'] = element['PeriodStatus'][0]['TxnDate'];
        }
        element['txnDate'] = element['TxnDate'];
        element['TxnDate'] = (element['TxnDate'].substring(0, 4) + '/' + element['TxnDate'].substring(4, 6) + '/' + element['TxnDate'].substring(6, 8))
        element['AvailablePeriodCnt'] = num; // 剩餘扣款次數
      }
    });
    this.lists = JSON.parse(JSON.stringify(this.originalData));
    this.groupList();
  }
  //Group
  groupList() {
    this.groups = [];
    this.lists.sort((a, b) => {
      var dateA = new Date(a['TxnDate']).getTime()
      var dateB = new Date(b['TxnDate']).getTime()
      return dateA > dateB ? -1 : 1;
    })

    var tempItem = { year: "", list: [] };
    this.lists.forEach(element => {
      element['checked'] = false;
      var time = new Date(element['TxnDate']).getTime()
      var year = this.dateTime.datetimeFormat(time, 'yyyy');
      if (tempItem["year"] != year) {
        if (tempItem["year"] != "") {
          this.groups.push(tempItem);
        }
        tempItem = { year: "", list: [] };
        tempItem["year"] = year;
      }
      tempItem.list.push(element);
    });
    if (tempItem["year"] != "") {
      this.groups.push(tempItem);
    }
    this.groups.forEach(group => {
      group["list"].sort((a, b) => {
        return a['date'] > b['date'] ? -1 : 1;
      })
    });
  }

  /**
   * 排序功能
   * @param date 原始資料
   * @param format format 格式：'id,name'
   */
  private sortBy(value, format) {
    var sortKeys = (typeof format == 'undefined' || format == '') ? [] : format.split(',');
    value.sort(function (a, b) {
      for (var i = 0; i < sortKeys.length; i++) {
        if (a[sortKeys[i]] != b[sortKeys[i]]) {
          return a[sortKeys[i]] - b[sortKeys[i]];
        }
        if (i == sortKeys.length) {
          return a[sortKeys[i]] - b[sortKeys[i]];
        }
      }
    });
    return value;
  }

  /**
   * 篩選
   */
  filterClick(reset?) {
    this.filterBlock = true;

    let TxnCodeArr = []; // 交易類型
    let DebitCurArr = [];
    let CreditCurArr = [];
    // let TOTALRECORDArr = [];

    this.originalData.forEach(item => {
      TxnCodeArr.push({ name: this.getTxnName(item.TxnCode), value: item.TxnCode });
      TxnCodeArr = this.dedup(TxnCodeArr); // 交易類型

      DebitCurArr.push({ name: item.DebitCur, value: item.DebitCur });
      DebitCurArr = this.dedup(DebitCurArr); // 扣帳幣別

      CreditCurArr.push({ name: item.CreditCur, value: item.CreditCur });
      CreditCurArr = this.dedup(CreditCurArr); // 收款幣別
    })

    if (reset) {
      this.viewTxnCodeData = { default_value: '' };
      this.viewDebitCurData = { default_value: '' };
      this.viewCreditCurData = { default_value: '' };
      // this.viewTOTALRECORDData = {
      //   default_value: '',
      //   option: TOTALRECORDArr
      // }
      this.dAmntFrom = '';
      this.dAmntTo = '';
      this.cAmntFrom = '';
      this.cAmntTo = '';
    } else {
      this.viewTxnCodeData = {
        title: this.langTransService.instant("TRANSACTION.TRAN_TYPE"),
        default_value: this.r1['TxnCode'],
        option: TxnCodeArr
      }

      this.viewDebitCurData = {
        title: this.langTransService.instant("TRANSACTION.DEBITUNG_CUR"),
        default_value: this.r2['DebitCur'],
        option: DebitCurArr
      }

      this.viewCreditCurData = {
        title: this.langTransService.instant("TRANSACTION.PAYEE_CUR"),
        default_value: this.r3['CreditCur'],
        option: CreditCurArr
      }
    }
  }

  /**
   * Get txn name
   * @param code Txn code
   */
  getTxnName(code) {
    return this.langTransService.instant('TXN_CODE.' + code);
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

  public r3 = {};
  result3(filter) {
    console.log('r3', filter);
    this.r3 = filter;
  }
  /**
   * 篩選popup 套用鈕
   */
  onFilterClick() {
    var parameter =this.getRequestParameter();

    parameter["TxnCode"] = this.r1["TxnCode"] ? this.r1["TxnCode"] :parameter["TxnCode"]
    if(this.selectedDateTo && this.selectedDateFrom){
      parameter["DateFrom"] = this.selectedDateFrom
      parameter["DateTo"] = this.selectedDateTo 
    }else{
      
    }
    parameter["DebitCur"] = this.r2["DebitCur"] ? this.r2["DebitCur"] :parameter["DebitCur"]
    parameter["CreditCur"] = this.r3["CreditCur"] ? this.r3["CreditCur"] :parameter["CreditCur"]

    this.getLists(parameter,true);
  }
  

  doFilter() {
    // 金額篩選條件設定
    let damtData;
    let camtData;
    if (this.dAmntFrom != undefined && this.dAmntTo != undefined && this.dAmntFrom != '' && this.dAmntTo != '') {
      damtData = { DebitAmt: { 'rangeNum': (+this.dAmntFrom * 10000).toFixed(0) + '-' + (+this.dAmntTo * 10000).toFixed(0) } }
    }
    if (this.cAmntFrom != undefined && this.cAmntTo != undefined && this.cAmntFrom != '' && this.cAmntTo != '') {
      camtData = { DebitAmt: { 'rangeNum': (+this.cAmntFrom * 10000).toFixed(0) + '-' + (+this.cAmntTo * 10000).toFixed(0) } }
    }

    // 日期篩選條件設定
    let dateData;
    if (this.selectedDateTo != undefined && this.selectedDateFrom != undefined && this.selectedDateTo != '' && this.selectedDateFrom != '') {
      dateData = {
        txnDate: {
          'rangeDate': this.dateTime.datetimeFormat(this.selectedDateFrom, 'yyyyMMdd') + '-' + this.dateTime.datetimeFormat(this.selectedDateTo, 'yyyyMMdd')
        }
      }
    }

    // 篩選總參數
    let finalFilter = Object.assign(
      this.r1, this.r2, this.r3, damtData, camtData, dateData
    );
    this.source = this.optionFilter.FilterData(this.originalData, finalFilter, true);
    this.searchComponent.source = this.source;
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
   * 日期篩選
   * @param item 選定項目
   */
  SelectDateType(item) {
    this.dateType.forEach(date => {
      date['select'] = false;
    });
    item.select = !item.select;
    this.getSearchDate(item['type']);
  }

  /**
   * 取得查詢日期參數
   */
  getSearchDate(type: String) {
    let date = new Date();
    let month;
    month = (date.getMonth() + 1);
    this.selectedDateFrom = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
    switch (type) {
      // 一週
      case '1':
        date.setDate(date.getDate() + 7);
        break;
      // 一月
      case '2':
        date.setMonth(date.getMonth() + 1);
        break;
      // 三月
      case '3':
        date.setMonth(date.getMonth() + 3);
        break;
      // 半年
      case '4':
        date.setMonth(date.getMonth() + 6);
        break;
      // 一年
      case '5':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        break;
    }
    month = (date.getMonth() + 1);
    this.selectedDateTo = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
  }

  /**
   * On date picker button clicked
   * @param type Button type: form/to
   */
  onDatePickerButtonClick(type) {
    this.popup.setDatePicker({
      status: true,
      datepicDefalult: this.dateTime.datetimeFormat(+this.today.getTime(), 'yyyy/MM/dd'),
      maxDate: type == 'from' && this.selectedDateTo ? this.selectedDateTo : null,
      minDate: type != 'from' && this.selectedDateFrom ? this.selectedDateFrom : null,
      event: (seleted) => {
        if (type == 'from') {
          this.selectedDateFrom = seleted;
        } else if (type == 'to') {
          this.selectedDateTo = seleted;
        }
        //選擇日期 清除上方選擇
        this.dateType.forEach(element => {
          element.select = false;
        });
      }
    });
  }

  /**
   * 頁面input搜尋
   */
  public search_result_data;
  search_result(filter) {
    console.log('search_result_data >>>>', filter);
    this.lists = filter;
    this.groupList();
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
   * 子頁標籤點擊事件
   * @param num 標籤索引參數
   */
  onSwitchClick(num) {
    let time = Date.now();
    switch (num) {
      case '1':
        this.switchIndex = 1;
        this.collection = true;
        this.yellowStyle1 = true;
        this.yellowStyle2 = false;
        this.router.navigate(['account_enquiry'], { queryParams: { type: 'transPage' ,'time': time.toString()} });
        break;

      case '2':

        break;
      default:
        break;
    }
  }

  /**
   * 功能選單點擊事件
   * @param page 選單索引參數
   */
  onTabClick(page) {
    switch (page) {
      case '1':
        // this.router.navigate(['account_enquiry'], { queryParams: { type: 'billColPage' } });
        break;
      case '2':
        this.router.navigate(['account_enquiry'], { queryParams: { type: 'billColPage' } });
        break;
      case '3':
        // this.router.navigate(['account_enquiry'], { queryParams: { type: 'transPage' } });
        break;
      case '4':
        this.router.navigate(['account_enquiry'], { queryParams: { type: 'menuPage' } });
        break;
      default:
        break;
    }
  }

  onPageClick(page, listData) {
    this.listData = listData;
    switch (page) {
      case 'singleDetailPage':
        this.singleDetailPage = true;
        this.summaryPage = false;
        this.layout.setHeaderStatus({
          backEvent: () => {
            this.singleDetailPage = false;
            this.summaryPage = true;
            this.popup.setLoading(true);
            this.ngOnInit();
          }
        });
        break;

      case 'cycleDetailPage':
        this.cycleDetailPage = true;
        this.summaryPage = false;
        this.layout.setHeaderStatus({
          backEvent: () => {
            this.cycleDetailPage = false;
            this.summaryPage = true;
            this.popup.setLoading(true);
            this.ngOnInit();
          }
        });
        break;

      default:
        break;
    }
  }

  /**
   * 點擊全選按鈕
   */
  onCheckAllClick() {
    console.log('[查詢預約與取消頁] onCheckAllClick original count =', this.checkCounter);
    this.checkCounter = 0;
    this.lists.forEach((element, index) => {
      element['checked'] = true;
      // 紀錄所有資料index
      this.checkCounter++;
    });
    //若有選取值才顯示預約取消鍵
    if(this.checkCounter != 0){
      this.cancelBtn = true;
    }
    console.log('[查詢預約與取消頁] onCheckAllClick final count =', this.checkCounter);
  }

  /**
   * 點擊全不選按鈕
   */
  onCancelAllClick() {
    console.log('[查詢預約與取消頁] onCheckAllClick original count =', this.checkCounter);
    this.lists.forEach(element => {
      element['checked'] = false;
    });
    this.checkCounter = 0;
    this.cancelBtn = false;
    console.log('[查詢預約與取消頁] onCheckAllClick final count =', this.checkCounter);
  }

  /**
   * 勾選資料checkBox
   */
  onCheckboxClick(g, l) {
    var item = this.groups[g]["list"][l]
    var checked = item['checked'];
    item['checked'] = !checked;
    this.checkCounter = !checked ? (this.checkCounter + 1) : (this.checkCounter - 1);
    console.log('[查詢預約與取消頁] onCheckboxClick lists item =', item);

    // 勾選數大於0顯示授權button
    if (this.checkCounter > 0) {
      this.cancelBtn = true;
    } else {
      this.cancelBtn = false;
    }
  }


  onCancel() {

    // 取得欲操作之資料
    this.cancelOprationData = [];
    this.groups.forEach(group => {
      group.list.forEach(list => {
        if (list["checked"]) {
          this.cancelOprationData.push(list);
        }
      })
    })

    if (this.cancelOprationData.length == 0) {
      return;
    }
    this.patternLockService.checkQuickLogin((type) => {
      this.quickOrder(type);
    }, PatternLockService.order, () => {
      this.setInput();
    }).then(
      (res) => {
        if (!res) {
          this.setInput();
        }
      });

  }
  setInput() {
    this.popup.setInput({
      title: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_TITLE"),
      placeholder: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_HINT"),
      default: "",
      checkTxt: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_CONFIRM"),
      cancelTxt: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_CANCEL"),
      inPassword: true,
      event: (value) => {
        this.cancel(value, "0");
      }
    });
  }
  quickOrder(type) {
    this.popup.setInput({
      isOpen: false
    });
    this.idGate.generateSignatureOTP().then(
      (res) => {
        console.log("快登密碼", res);
        console.log("執行登入");
        this.cancel(res, type);
      }
      , (err) => {
        this.popup.setConfirm({
          content: "BTN.ERROR", // 快登失敗
          event: () => { }
        });
      }
    )
  }
  cancel(pin, type) {
    this.popup.setLoading(true);
    this.popup.setInput({
      isOpen: false
    });
    // 取得欲操作之資料
    this.cancelOprationData = [];
    this.groups.forEach(group => {
      group.list.forEach(list => {
        if (list["checked"]) {
          this.cancelOprationData.push(list);
        }
      })
    })

    var finishCount = 0;
    var errCount = 0;
    this.cancelOprationData.forEach(item => {
      let req = {};
      let signatureStr = item['TxnNo'].trim();
      if (item['TxnCode'] === 'PDT') {
        let tempArray = [];
        var i = 0;
        item['PeriodStatus'].forEach(list => {
          tempArray.push(list['Seq']);
        });
        tempArray.forEach(str => {
          signatureStr += '|' + str;
        });
        req['PeriodIdList'] = tempArray;
      }
      req['BatchId'] = item['TxnNo'];
      req['UserPIN'] = pin;
      req['AuthType'] = type;

      console.log("[Signature] original-string =", signatureStr);
      let hexStr = this.hex.utf8ToHex(signatureStr).toUpperCase();
      console.log("[Signature] hex-string =", hexStr);

      this.idGate.genSignatureOTP(hexStr).then((res) => {
        console.log("[Signature] SignatureOTP =", res);
        req['Signature'] = res.toString();
        this.fundXferModService.getFundXferMod(req).then(
          (fundXferMod_res) => {
            finishCount += 1;
            var resultList = fundXferMod_res['PeriodResultList'];
            if (resultList != undefined) {
              var errResult = 0;
              resultList.forEach(result => {
                if (result["Result"] != 4001) {
                  errResult += 1
                }else{
                  // 快登錯誤次數歸0
                 this.storage.set("QuickLoginErrorKey",0)
                }
              });
              errCount += 1 * (errResult / resultList.length);
            }
            this.checkCancelFinish(this.cancelOprationData.length, finishCount, errCount);
          },
          (fundXferMod_err) => {
            finishCount += 1;
            errCount += 1;
            this.checkCancelFinish(this.cancelOprationData.length, finishCount, errCount);
          }
        );
      })
    });
  }
  checkPayeeIdName(listData) {
    return listData.PayeeId != "" && listData.PayeeId != undefined
      && listData.PayeeName != "" && listData.PayeeName != undefined;
  }
  checkCancelFinish(all, now, errCount) {
    if (now < all) {
      return;
    }
    var msg = ""
    if (errCount == 0) {
      //全部成功
      msg = "TRANSACTION.ALL_CANCEL_SUCCESS";
    } else if (all == errCount) {
      //全部失敗
      msg = "TRANSACTION.ALL_CANCEL_FAIL";
    } else {
      //部分失敗
      msg = "TRANSACTION.PART_CANCEL_SUCCESS";
    }

    this.popup.setConfirm({
      content: msg
    })
    this.ngOnInit();
  }


  onLeftClick(e?) {
    this.zone.run(() => {
      this.cycleDetailPage = e.cycleDetailPage;
      this.singleDetailPage = e.singleDetailPage;
      this.summaryPage = e.summaryPage;
      this.layout.setHeaderStatus({
        status: true,
        title: 'MENU.ACT_QUERY'
      });
    })

    if (this.summaryPage) {
      if (e.reload) {
        this.popup.setLoading(true);
        this.ngOnInit();
      }
    }
  }


}
