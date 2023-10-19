import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { AppTxnInqService } from '../../../shared/service/customize/appTxnInq.service';
import { GetAcctSummInqService } from '../../../shared/service/customize/getAcctsumminq.service';
import { SearchFilterService } from '../../../shared/component/public/search-filter.service';
import { SortByService } from '../../../shared/service/global/sortby.service';

/**
 * APP交易紀錄
 */
@Component({
  selector: 'app-translog',
  templateUrl: './translog.component.html',
  styleUrls: ['./translog.component.css']
})
export class TranslogComponent implements OnInit, AfterViewInit {

  public displayPage = "Translog";
  public queryDate = "";
  public queryCurrency = "";
  public accountArray = [];
  public selAccount = "";
  public selectedItem;
  public originalData;
  public txnRecArray = [];
  public displayxnRecArray
  public txnRecMonthlyGroupArray = undefined;
  public selectedCountry = "";
  public selectedCompany = "";
  public selectedAccount = "";
  public selectedTxnRec;
  public TranslogDetailCard = false;
  public loadData = [];
  public isSave = false;
  public temp = {
    TxnCode: "",
    TxnDate: {
      rangeDate: ""
    },
    TxnDetList: {
      DebitCur: ""
    },
    TxnRecord: "",
  }
  public tempViewDateData = {
    default_value: {
      dateType: 'TxnDate'
    },
    timeOption: [
      { name: this.langTrans.instant("TRANSACTION.TWODAY"), select: false, type: '2D' },
      { name: this.langTrans.instant("TRANSACTION.ONEWEEK"), select: false, type: '1W' },
      { name: this.langTrans.instant("TRANSACTION.HALFYEAR"), select: false, type: '6M' },
      { name: this.langTrans.instant("TRANSACTION.THREEYEAR"), select: false, type: '3Y' }
    ],
    dateOption: [
      { name: this.langTrans.instant("TRANSACTION.TXNDATE"), value: 'TxnDate' }
    ],
    type: 'past'
  }

  public filterBlock = false;
  private closeBtnChange = true;
  private viewTxnCodeData;
  private viewTxnRecordData;
  private viewDateData;
  private viewDebitCurData;

  @Output()
  public tabChange = new EventEmitter<string>();

  constructor(
    private router: Router,
    private popup: PopupService,
    private layout: LayoutService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private langTransService: LangTransService,
    private appTxnInq: AppTxnInqService,
    private getAcctSummInq: GetAcctSummInqService,
    private langTrans: LangTransService,
    private optionFilter: SearchFilterService,
    private sortBy: SortByService,
  ) {
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
    this.initHeader();

  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        //下拉reload時不重置filter條件
        this.isSave = true;    
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    // Init query info 
    this.queryDate = this.dateTime.datetimeFormat(new Date().getTime(), 'yyyy/MM/dd hh:mm:ss');
    this.queryCurrency = this.storage.get("slectedCurrency");
    
    var requestParameter = this.getAppTxnInqParameter();
    this.appTxnInqAPi(requestParameter,false);
  }

  isfilter = false
  appTxnInqAPi(requestParameter,isfilter) {
    this.isfilter = isfilter;
    this.appTxnInq.appTxnInq(requestParameter).then(this.onAppTxnSuccess, this.onQueryException);
  }

  getAppTxnInqParameter() {

    // Init request parameter
    var requestParameter = {};
    requestParameter["TxnCode"] = "ALL";

    // Date from
    var dateFrom = new Date();
    dateFrom = new Date();
    //default查詢三個月
    dateFrom.setMonth(dateFrom.getMonth() - 3);
    var dateFromString = this.dateTime.datetimeFormat(dateFrom.getTime(), "yyyyMMdd");
    requestParameter["DateFrom"] = dateFromString;

    // Date to
    var dateTo = new Date();
    var dateToString = this.dateTime.datetimeFormat(dateTo.getTime(), "yyyyMMdd");
    requestParameter["DateTo"] = dateToString;

    // Other parameter
    requestParameter["TxnStatus"] = "";
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

  /**
   * Init header by page name
   */
  private initHeader() {
    // Init fields
    var title;
    var backEvent;

    // Init fields by page name
    if (this.displayPage == "Translog") {
      // APP transaction log 
      backEvent = null;
    }
    else if (this.displayPage == "TranslogDetail") {
      // Transaction log detail
      backEvent = () => {
        this.displayPage = "Translog";
        this.initHeader();
        setTimeout(() => {
          //註冊手勢事件 下滑Reload
          this.popup.setGestures({
            //註冊Reload事件
            'reload': () => {
              this.ngOnInit();
            }
          });
        }, 300)
      }
    }

    // Update header
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.ACT_QUERY',
      backEvent: backEvent
    });
  }


  /**
   * On query app txn successful
   */
  private onAppTxnSuccess = (response) => {
    // DEBUG
    console.log("response data = ", response);

    // Clear data
    this.clearData();

    // Check response data
    if (response == null) {
      return;
    }
    const txnRecList = response.TxnRecList;
    if (txnRecList == null || txnRecList.length == 0) {
      return;
    }

    // Init all transaction list
    this.originalData = txnRecList;
    this.txnRecArray = txnRecList;
    this.loadData = txnRecList;



    var tempAcct = [];
    this.txnRecArray.forEach(element => {
      element.TxnDetList.forEach(txnDet => {
        if (tempAcct.length == 0) {
          tempAcct.push({
            type: "Acct",
            AcctNo: txnDet.PayerAcct,
            AcctCurrency: txnDet.DebitCur,
            CustomerName: element.CustomerName || "",
            CustomerId: element.CustomerId,
            Country: element.Country
          })
        }
        if (tempAcct.findIndex(item => { return item.AcctNo == txnDet.PayerAcct && item.AcctCurrency == txnDet.DebitCur }) == -1) {
          tempAcct.push({
            type: "Acct",
            AcctNo: txnDet.PayerAcct,
            AcctCurrency: txnDet.DebitCur,
            CustomerName: element.CustomerName || "",
            CustomerId: element.CustomerId,
            Country: element.Country
          })
        }
      });
    });

    this.accountArray = this.sortBy.sortAcctList(tempAcct,
      {
        keyCountry: "Country",
        keyCompanyId: "CustomerId",
        keyCompanyName: "CustomerName",
        keyCurrency: "AcctCurrency",
        keyAccout: "AcctNo",
        allowCompany: true,
        allowCountry: true,
        allDesc: this.langTransService.instant('TRANS_LOG.ALL_COUNTRY'),
        default: this.selAccount
    });
    //初始化下拉式選單
    if(!this.selAccount){
      this.selAccount = this.accountArray[0]["desc"];
    }
    //初始化下拉式選單
    if(!this.selectedItem){
      this.selectedItem = this.accountArray[0];
    }


    if(this.isfilter){
      this.doFilter();
    }else{
      this.onAccountSelected(this.selectedItem);
    }
    
    //關閉Reload Method
    this.popup.setGestures({
      'reload_close': true
    });

    this.isfilter = false;
    // 關閉Loading畫面
    this.popup.setLoading(false);
  };

  /**
   * On query exception
   */
  private onQueryException = (error) => {
    // DEBUG
    console.log(JSON.stringify(error));

    // Clear data
    this.clearData();

    //關閉Reload Method
    this.popup.setGestures({
      'reload_close': true
    });
    this.isfilter = false;
    // 關閉Loading畫面
    this.popup.setLoading(false);
  };

  /**
   * Clear data
   */
  private clearData() {
    this.accountArray = [];
    this.txnRecArray = [];
    this.txnRecMonthlyGroupArray = [];
    this.selectedCountry = "";
    this.selectedCompany = "";
    this.selectedAccount = "";
  }

  /**
   * On account option item selected
   * @param account Selected account number
   */
  public onAccountSelected(selectItem, filterData?) {

    if (filterData == undefined) {
      this.loadData = [];
    }
    console.log('[交易紀錄頁] onAccountSelected account =', selectItem);
    // Storage selected account 
    this.selectedAccount = selectItem;
    // Clear filter txn record
    this.txnRecMonthlyGroupArray = [];
    // Init transaction list


    for (const txn of (filterData || this.originalData)) {
      if (selectItem) {
        // 選單選取模式
        // Define variables
        var isCountryMatch = false;
        var isCompanyMatch = false;
        var isAccountMatch = false;


        // Verify account
        if (selectItem.type == "all") {
          isAccountMatch = true;
          isCountryMatch = true;
          isCompanyMatch = true;
        } else if (selectItem.type == "country") {
          if (txn.Country == selectItem.original.country) {
            isCountryMatch = true;
          }
          isCompanyMatch = true;
          isAccountMatch = true;
        } else if (selectItem.type == "company") {
          if (txn.Country == selectItem.original.country && txn.CustomerId == selectItem.original.company) {
            isCountryMatch = true;
            isCompanyMatch = true;
          }
          isAccountMatch = true;
        } else if (txn.TxnDetList != null && txn.TxnDetList.length > 0) {
          if (txn.Country == selectItem.original.Country && txn.CustomerId == selectItem.original.CustomerId) {
            isCountryMatch = true;
            isCompanyMatch = true;
          }
          for (const txnDet of txn.TxnDetList) {
            if (txnDet.PayerAcct == selectItem.original.AcctNo) {
              isAccountMatch = true;
            }
          }
        }
      } else {
        // 篩選器模式
        // Define variables
        var isCountryMatch = true;
        var isCompanyMatch = true;
        var isAccountMatch = true;
      }
      
      

      //205電文回傳個資料之變數TxnDetList底下之第一個元素的變數TxnStatus代碼為表示交易失敗，不顯示  等中信給文件
      if(true){
        // Add txn record
        if (isCountryMatch && isCompanyMatch && isAccountMatch) {
          // Get txn date string
          var txnDateString = txn.TxnDate;
          if (txnDateString == null || txnDateString.length == 0) {
            if (txn.TxnDetList != null && txn.TxnDetList.length > 0) {
              for (const txnDet of txn.TxnDetList) {
                const txnDetDate = txnDet.TxnDate;
                if (txnDetDate != null && txnDetDate.length >= 8) {
                  txnDateString = txnDetDate;
                  break;
                }
              }
            }
          }


          
          // Parse txn date string
          if (txnDateString != null && txnDateString.length >= 8) {
            // Get month
            txnDateString = (txnDateString.length != 8) ? txnDateString : (txnDateString.slice(0, 4) + '/' + txnDateString.slice(4, 6) + '/' + txnDateString.slice(6, 8));
            var txnDate = new Date(txnDateString);
            var month = txnDate.getMonth() + 1;
            var year = txnDate.getFullYear();

            // Get monthly group
            var monthlyGroup = null;
            for (const group of this.txnRecMonthlyGroupArray) {
              if (group.Month == month && group.Year == year) {
                monthlyGroup = group;
                break;
              }
            }

            // Construct group if needed
            if (monthlyGroup == null || monthlyGroup == undefined) {
              monthlyGroup = {
                Month: month,
                Year: txnDate.getFullYear(),
                Transactions: [],
                IsFirstMonth: false
              };
              this.txnRecMonthlyGroupArray[this.txnRecMonthlyGroupArray.length] = monthlyGroup;
            }

            // Add txn to monthly group
            monthlyGroup.Transactions[monthlyGroup.Transactions.length] = {
              DisplayDate: txnDate.getMonth() + 1 + "/" + txnDate.getDate(),
              DisplayType: this.getTxnName(txn.TxnCode),
              Amount: txn.TxnAmount,
              TxnRec: txn,
              Date: txnDate,

            };

            //取出下拉選單篩選出來的值
            if (filterData == undefined) {
              this.loadData.push(txn);
            }
          }
        }
      }
    }





    // Sort by transaction month
    this.txnRecMonthlyGroupArray.sort(function (a, b) {
      return b.Month - a.Month;
    });

    // Sort by transaction year
    this.txnRecMonthlyGroupArray.sort(function (a, b) {
      return b.Year - a.Year;
    });

    this.txnRecMonthlyGroupArray.forEach(element => {
      element.Transactions.sort(function (a, b) {
        return (b.Date.getTime() > a.Date.getTime()) ? 1 : -1;
      })
    });


    // Toggle first month 
    if (this.txnRecMonthlyGroupArray.length > 0) {
      this.txnRecMonthlyGroupArray[0].IsFirstMonth = true;
    }

    this.txnRecMonthlyGroupArray.forEach(group => {
      group.Transactions.forEach(item => {
        item.openFlag = false;
      });
    });
  }

  /**
   * On transaction item clicked
   * @param transaction Selected transaction item
   */
  public onTransactionSelected(i, j) {
    var transaction = this.txnRecMonthlyGroupArray[i].Transactions[j];
    this.displayPage = "TranslogDetail";
    this.TranslogDetailCard = true;
    this.selectedTxnRec = transaction.TxnRec;
    // this.txnRecMonthlyGroupArray[i].Transactions[j].openFlag = !this.txnRecMonthlyGroupArray[i].Transactions[j].openFlag;
    this.initHeader();
  }

  /**
   * Get country name
   * @param code Country code
   */
  getCountryName(code) {
    return this.langTransService.instant('countryCode.' + code);
  }

  /**
   * Get txn name
   * @param code Txn code
   */
  getTxnName(code) {
    return this.langTransService.instant('TXN_CODE.' + code);
  }

  /**
   * 子頁標籤點擊事件
   * @param num 標籤索引參數
   */
  onSwitchClick(num) {
    let time = Date.now();
    switch (num) {
      case '1':
        //this.router.navigate(['account_enquiry/translog']);
        break;

      case '2':
        this.router.navigate(['/account_enquiry'], { queryParams: { type: "reservationQuery", 'time': time.toString() } });
        break;

      default:
        break;
    }
  }

  onCompanyClick() {

    this.popup.setCheckList({
      data: this.accountArray,
      type: 'radio',
      event: (result) => {
        this.selAccount = result["desc"]
        this.selectedItem = result
        this.onAccountSelected(this.selectedItem)
      }
    })
  }


  /**
   * 幣別排序Array
   * 排序為，第一個為GL全球'、第二個是登入之網銀國別、第三個是台灣，其餘依照首位字母由A至Z排
   * @param sortCountryData
   */
  sortByCountry(a, b) {
    if (a.Country === b.Country) {
      return 0;
    }
    var loginCountry = this.storage.get("loginUserCountry");
    if (a.Country === loginCountry) {
      return 1;
    }
    if (b.Country === loginCountry) {
      return -1;
    }

    if (a.Country === "TW") {
      return 1;
    }
    if (b.Country === "TW") {
      return -1;
    }
    return a > b ? 1 : -1;
  }
  sortByCustomerId(a, b) {
    return a > b ? 1 : -1;
  }

  // 篩選相關參數
  public r1 = {}; // 交易類型
  public r2 = {}; // 單筆/整批
  public r3 = {}; // 交易日期
  public r5 = {}; // 扣款幣別
  public rDebitAmtStart;  // 扣帳金額下限
  public rDebitAmtEnd;    // 扣帳金額上限
  public rCreditAmtStart; // 入帳金額下限
  public rCreditAmtEnd;   // 入帳金額上限



  resetFilter() {
    //下拉選單選擇完重製filter
    this.r1['TxnCode'] = "";
    this.r2['TxnRecord'] = "";
    this.r3['TxnDate'] = "";
    this.r5['DebitCur'] = "";
    this.viewDateData = {
      default_value: {
        dateType: 'TxnDate'
      },
      timeOption: [
        { name: this.langTrans.instant("TRANSACTION.TWODAY"), select: false, type: '2D' },
        { name: this.langTrans.instant("TRANSACTION.ONEWEEK"), select: false, type: '1W' },
        { name: this.langTrans.instant("TRANSACTION.HALFYEAR"), select: false, type: '6M' },
        { name: this.langTrans.instant("TRANSACTION.THREEYEAR"), select: false, type: '3Y' }
      ],
      dateOption: [
        { name: this.langTrans.instant("TRANSACTION.TXNDATE"), value: 'TxnDate' }
      ],
      type: 'past'
    }
    this.isSave = false;
    // 扣帳金額
    this.rDebitAmtStart = null;
    this.rDebitAmtEnd = null;
    // 入帳金額
    this.rCreditAmtStart = null;
    this.rCreditAmtEnd = null;
  }

  /**
   * 開啟/重設篩選畫面
   * @param reset 重設篩選欄位
   */
  filterClick(reset?) {
    
    console.log('[交易紀錄頁] filterClick reset =', reset);
    //交易日期
    this.viewDateData = {
      default_value: {
        dateType: 'TxnDate'
      },
      timeOption: [
        { name: this.langTrans.instant("TRANSACTION.TWODAY"), select: false, type: '2D' },
        { name: this.langTrans.instant("TRANSACTION.ONEWEEK"), select: false, type: '1W' },
        { name: this.langTrans.instant("TRANSACTION.HALFYEAR"), select: false, type: '6M' },
        { name: this.langTrans.instant("TRANSACTION.THREEYEAR"), select: false, type: '3Y' }
      ],
      dateOption: [
        { name: this.langTrans.instant("TRANSACTION.TXNDATE"), value: 'TxnDate' }
      ],
      type: 'past'
    }
    if (reset) {
      this.isSave = false;
    }
    //套用暫存之filter值
    if (this.isSave) {
      this.r1['TxnCode'] = this.temp['TxnCode'];
      this.r2['TxnRecord'] = this.temp['TxnRecord'];
      this.r3['TxnDate'] = this.temp['TxnDate'];
      this.r5['DebitCur'] = this.temp['TxnDetList']['DebitCur'];
      this.viewDateData = this.tempViewDateData;

    }
    // 開啟篩選欄位畫面
    this.filterBlock = true;
    // 取得篩選欄位選項數據
    let txnCodeOpt = [];
    let tempDebitCur = [];
    let debitCurOpt = [];
    this.originalData.forEach(data => {
      // 交易類型
      if (!txnCodeOpt.map(x => x.value).includes(data['TxnCode'])) {
        txnCodeOpt.push({ name: this.langTransService.instant('TXN_CODE.' + data['TxnCode']), value: data['TxnCode'] });
      }

      // 交易明細相關數據
      if (data['TxnDetList']) {
        data['TxnDetList'].forEach(detail => {
          // 扣帳幣別
          if (!debitCurOpt.map(x => x.value).includes(detail['DebitCur'])) {
            debitCurOpt.push({ name: detail['DebitCur'], value: detail['DebitCur'] });
          }
        });
      }
    });

    // 組織篩選欄位資料
    // 交易類型
    this.viewTxnCodeData = {
      title: this.langTrans.instant("TRANSACTION.TRAN_TYPE"),
      default_value: reset ? undefined : this.r1['TxnCode'],
      option: txnCodeOpt
    }
    // 整批/單筆
    this.viewTxnRecordData = {
      title: this.langTrans.instant("TRANSACTION.TRAN_TYPE2"),
      default_value: reset ? undefined : this.r2['TxnRecord'],
      option: [
        { name: this.langTrans.instant("TRANSACTION.BATCH"), value: '0' },
        { name: this.langTrans.instant("TRANSACTION.SINGLE"), value: '1' }
      ]
    }
    // 扣帳幣別
    this.viewDebitCurData = {
      title: this.langTrans.instant("TRANSACTION.DEBITUNG_CUR"),
      default_value: reset ? undefined : this.r5['DebitCur'],
      option: debitCurOpt
    }

    // 篩選欄位輸入值重設
    if (reset) {
      // 扣帳金額
      this.rDebitAmtStart = null;
      this.rDebitAmtEnd = null;
      // 入帳金額
      this.rCreditAmtStart = null;
      this.rCreditAmtEnd = null;
    }
  }

  /**
   * 控制關閉按鈕顯不顯示
   */
  closeBtnFlag(e) {
    this.closeBtnChange = e;
  }

  /**
   * 關閉篩選畫面
   */
  filterCloseBtn() {
    this.filterBlock = false;
  }

  /**
   * 篩選器：交易類型
   */
  result1(filter) {
    console.log('[交易紀錄頁] result1 filter =', filter);
    this.r1 = (filter && filter['TxnCode'] != "") ? filter : {};
    console.log('[交易紀錄頁] r1 =', this.r1);
  }

  /**
   * 篩選器：整批/單筆
   */
  result2(filter) {
    console.log('[交易紀錄頁] result2 filter =', filter);
    this.r2 = (filter && filter['TxnRecord'] != "") ? filter : {};
    console.log('[交易紀錄頁] r2 =', this.r2);
  }

  /**
   * 篩選器：交易日期
   */
  result3(filter) {
    console.log('[交易紀錄頁] result3 filter =', filter);
    this.r3 = filter ? filter : {};
    console.log('[交易紀錄頁] r3 =', this.r3);
  }

  /**
   * 篩選器：扣款幣別
   */
  result5(filter) {
    console.log('[交易紀錄頁] result5 filter =', filter);
    this.r5 = (filter && filter['DebitCur'] != "") ? filter : {};
    console.log('[交易紀錄頁] r5 =', this.r5);
  }

  /**
   * 執行篩選作業
   */
  onFilterClick() {
    //點選套用暫filter值
    this.temp = {
      TxnCode: this.r1['TxnCode'],
      TxnDate: this.r3['TxnDate'],
      TxnDetList: {
        DebitCur: this.r5["DebitCur"]
      },
      TxnRecord: this.r2['TxnRecord'],
    }
    this.tempViewDateData = this.viewDateData;
    this.isSave = true;

    console.log('[交易紀錄頁] onFilterClick rDebitAmtStart =', this.rDebitAmtStart);
    console.log('[交易紀錄頁] onFilterClick rDebitAmtEnd =', this.rDebitAmtEnd);
    console.log('[交易紀錄頁] onFilterClick rCreditAmtStart =', this.rCreditAmtStart);
    console.log('[交易紀錄頁] onFilterClick rCreditAmtEnd =', this.rCreditAmtEnd);
    var parameter = this.getAppTxnInqParameter();
    if (this.r3["selectedDateFrom"] && this.r3["selectedDateTo"]) {
      parameter["DateTo"] = this.dateTime.datetimeFormat(new Date(this.r3["selectedDateTo"]).getTime(), 'yyyyMMdd');
      parameter["DateFrom"] = this.dateTime.datetimeFormat(new Date(this.r3["selectedDateFrom"]).getTime(), 'yyyyMMdd');
    }
    parameter["TxnCode"] = this.r1["TxnCode"] ?  this.r1["TxnCode"] :  parameter["TxnCode"];
    parameter["DebitCur"] = this.r5["DebitCur"] ?  this.r5["DebitCur"] :  parameter["DebitCur"];
    this.popup.setLoading(true)
    this.appTxnInqAPi(parameter,true);
    this.filterBlock = false;
  }
  doFilter(){
     // 交易總筆數：單筆/整批
     let result2 = {};
     if (this.r2['TxnRecord'] == "1")
       result2 = { "TxnRecord": "1" };
     if (this.r2['TxnRecord'] == "0")
       result2 = { "TxnRecord": { "rangeNum": "1-9999" } };
 

     // 交易明細：扣帳金額、扣帳幣別、入帳金額
     let r4 = {};
     let r6 = {};
     if (this.rDebitAmtStart && this.rDebitAmtEnd)
       r4 = { DebitAmt: { 'rangeNum': this.rDebitAmtStart + "-" + this.rDebitAmtEnd } };
     if (this.rCreditAmtStart && this.rCreditAmtEnd)
       r6 = { CreditAmt: { 'rangeNum': this.rCreditAmtStart + "-" + this.rCreditAmtEnd } };
     let detail = {};
     detail['TxnDetList'] = Object.assign({}, r4, this.r5, r6);
 
     // 所有篩選欄位內容
     let finalFilter = Object.assign({}, this.r1, result2, this.r3["filter"] ? this.r3["filter"] :{}, detail);
     console.log('[交易紀錄頁] onFilterClick finalFilter', finalFilter);
     this.txnRecArray = this.optionFilter.FilterData(this.originalData, finalFilter, true);
     
     console.log(this.txnRecArray);
     // 更新畫面顯示資料
     this.onAccountSelected(null, this.txnRecArray);
  }
}
