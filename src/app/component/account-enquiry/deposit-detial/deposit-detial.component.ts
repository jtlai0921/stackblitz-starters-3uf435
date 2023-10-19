/**
 * 存款明細頁
 */
import { Component, OnInit, Input, AfterViewInit, NgZone } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { CASAActivityInqService } from '../../../shared/service/customize/CASAActivityInq.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { TDDetailInqRqService } from '../../../shared/service/customize/TDDetailInqRq.service';
import { STDetailInqRqService } from '../../../shared/service/customize/stDetailInqRq.service';
import { LangTransService } from 'src/app/shared/pipe/langTransPipe/lang-trans.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { AcctSummPlusInqService } from '../../../shared/service/customize/acctSummPlusInq.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';
import { Router } from '@angular/router';
import { SortByService } from '../../../shared/service/global/sortby.service';
import { SearchFilterService } from '../../../shared/component/public/search-filter.service';

@Component({
  selector: 'app-deposit-detial',
  templateUrl: './deposit-detial.component.html',
  styleUrls: ['./deposit-detial.component.css']
})
export class DepositDetialComponent implements OnInit, AfterViewInit {

  /**
   * 參數設定
   */
  static lastSelectedOption = undefined;
  @Input() detailReq: any; // reqData
  @Input() homeReq: any; // 由總覽頁過來的設定
  @Input() formWho: any; // 入口點： 'deposit_summary' => 存款概要
  dateTime: any; // 現在查詢時間
  currency: any; // 預設幣別
  type = 'blank'; // S-活期存款, T-定期存款, C-支票存款, SD-結構型存款
  certificate = false; // true-定期存款 結構型存款, false-活期存款 支票存款
  req: any; // Request Object
  badgeName = ''; // 標示卡片之產品別
  badgeItem = ''; // 標示卡片之顯示項目
  stDetail = {}; // SD-結構型 明細資料
  tDetail = {}; // T-定存 明細資料
  keys = []; // S-活存 C-支存 明細資料之群組月份
  rawLists: any; // S-活存 C-支存 原始明細資料
  list = {}; // S-活存 C-支存 明細資料
  depositData: any; // 原始Data 
  selectOptions = []; // 下拉選單資料來源
  selectedOption: any; // 下拉選單預設值
  selectedOptionIndex: any;
  selectData: any; // 下拉選單資料來源
  countryArr: any; // 下拉選單清單(國別)
  companyArr: any; // 下拉選單清單(統編)
  countryGroup: any;
  companyGroup: any;
  curType = ''; // 幣別
  curBalance = 0; // 活支存-帳戶餘額
  availBalance = 0; // 活支存-可用餘額
  isSetSelected = false;
  isShowFilter = false;
  isNoData = undefined;
  // == Input Filter == //
  source = []; // 要篩選的資料
  filterArray = ['AcctNo', 'BranchName']; // 頁面input搜尋keyArray 扣/入帳號,所屬銀行名稱
  searchBarArray = ['TxnDate','TrnDesc','Balance', 'DetailedNoteMemo','NarrativeMemo'];    //搜尋bar條件

  // == Popup Filter == //
  private filterStatus = false; // 過濾popup使用狀態
  private filterCondition = {}; // 過濾條件
  searchDate = {}; // 查詢日期參數值
  searchType = '1'; // 查詢類型參數值(預設值:交易明細[1])

  selCompanyName = this.langTransService.instant('DEPOSITDETAIL.PLEASECHOOSE');

  public popCondition;

  constructor(
    private layout: LayoutService,
    private popup: PopupService,
    private storage: LocalStorageService,
    private dateformat: DateTimeService,
    private langTransService: LangTransService,
    private acctSummPlusInq: AcctSummPlusInqService,
    private casaActivityService: CASAActivityInqService,
    private tdDetailService: TDDetailInqRqService,
    private stDetailService: STDetailInqRqService,
    private functionList: FunctionListService,
    private router: Router,
    private sortBy: SortByService,
    private search: SearchFilterService,
    private zone: NgZone
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.DEPOSIT_DETAIL' // 帳戶查詢
    });
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.dateTime = this.dateformat.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss');
        this.getData();
      }

    });

  }

  ngOnInit() {
    this.currency = this.storage.get("slectedCurrency");
    this.dateTime = this.dateformat.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss');
    this.getData();
  }

  homeInq() {
    if (this.homeReq != undefined) {
      var index = this.selectOptions.findIndex((item) => {
        if (item.type != 'account') {
          return false;
        }
        return item.original.CustomerId == this.homeReq.company &&
          item.original.Country == this.homeReq.country &&
          (this.homeReq.acctNo == undefined || item.original.AcctNo == this.homeReq.acctNo);
      })
      if (index != -1) {
        this.setSelectedIndex(index);
        DepositDetialComponent.lastSelectedOption = this.selectOptions[this.selectedOptionIndex];
        this.onOptionChange();
      }
      this.homeReq = undefined;
      return true;
    }
    return false;
  }
  //由存款概要帶入資料
  detailInq() {
    // == 由存款概要帶入資料 == //
    if (this.detailReq != undefined) {
      var index = this.selectOptions.findIndex((item) => {
        item.checked = false;
        if (item.type != 'account') {
          return false;
        }
        return item.original.CustomerId == this.detailReq['CustomerId'] &&
          item.original.AcctNo == this.detailReq['AcctNo'] &&
          item.original.Country == this.detailReq['Country'] &&
          item.original.AcctCurrency == this.detailReq['AcctCurrency'];
      })
      if (index != -1) {
        this.setSelectedIndex(index);
        this.selectedOption = this.selectOptions[index];
        DepositDetialComponent.lastSelectedOption = this.selectOptions[this.selectedOptionIndex];
        this.onOptionChange();
      }
    }
  }

  getDetial() {
    // == 參數初始化 == //
    this.req = {};
    this.stDetail = {};
    this.tDetail = {};
    this.list = {};
    //顯示篩選器
    //this.isShowFilter = true;
    // 設定查詢日期值
    this.getSearchDate();

    // 由父層存款概要觸發
    if (this.detailReq !== undefined) {

      this.type = this.detailReq.AcctType;
      // == 上行電文設定 == //
      if (this.type === 'S' || this.type === 'C' || this.type === "SE") {
        // 活支存
        let inputReqObj = {
          'Currency': this.currency,
          'Country': this.detailReq['Country'],
          'CustomerId': this.detailReq['CustomerId'],
          'AcctNo': this.detailReq['AcctNo'],
          'AcctCur': this.detailReq['AcctCurrency'],
          //從存款概要頁過來沒有TrnType,預設查詢為 1 == 交易明細
          'TrnType': this.detailReq['TrnType'] ? this.detailReq['TrnType'] : "1",
          'DateFrom': this.detailReq['DateFrom'] ? this.detailReq['DateFrom'] : this.searchDate['DateFrom'],
          'DateTo': this.detailReq['DateTo'] ? this.detailReq['DateTo'] : this.searchDate['DateTo']
        };
        this.req = inputReqObj;

      } else if (this.type === 'T' || this.type === 'SD') {
        // 定存與結構型
        let inputReqObj = {
          'Country': this.detailReq['Country'],
          'CustomerId': this.detailReq['CustomerId'],
          'AcctNo': this.detailReq['AcctNo'],
          'AcctCur': this.detailReq['AcctCurrency']
        };
        this.req = inputReqObj;
      }

    } else {
      // 由選單存款明細觸發
      this.type = 'blank';
    }

    // == 頁面設定 == //


    if (this.type === 'T') {
      this.certificate = true;
      this.badgeName = this.langTransService.instant('DEPOSITDETAIL.TERM_DEPOSITS'); // 定期存款
      this.isNoData = undefined;
      this.isShowFilter = false;
      this.getTDDetail(this.req);
    } else if (this.type === 'SD') {
      this.certificate = true;
      this.badgeName = this.langTransService.instant('DEPOSITDETAIL.STRUCTURED_DEPOSITS'); // 結構型存款
      this.isNoData = undefined;
      this.isShowFilter = false;
      this.getSTDetail(this.req);
    } else if (this.type === 'C') {
      this.certificate = false;
      this.badgeName = this.langTransService.instant('DEPOSITDETAIL.CURRENT_ACCOUNT'); // 支票存款
      this.isNoData = undefined;
      this.isShowFilter = true;
      this.getCASADetail(this.req);
    } else if (this.type === 'S') {
      this.certificate = false;
      this.badgeName = this.langTransService.instant('DEPOSITDETAIL.SAVINGS_ACCOUNT'); // 活期存款
      this.isNoData = undefined;
      this.isShowFilter = true;
      this.getCASADetail(this.req);
    } else if (this.type === 'SE') {
      this.certificate = false;
      this.badgeName = this.langTransService.instant('DEPOSITDETAIL.SE'); // 活存備藏
      this.isNoData = undefined;
      this.isShowFilter = true;
      this.getCASADetail(this.req);
    } else {
      //隱藏篩選器
      this.isShowFilter = false;
      return;
    }
    // 本金 or 帳戶餘額
    this.badgeItem = this.certificate ? this.langTransService.instant('DEPOSITDETAIL.PRINCIPAL') : this.langTransService.instant('DEPOSITDETAIL.BALANCE');
  }

  /**
   * [API] Account Summary 帳戶概要(下拉選單資料來源)
   */
  getData() {
    var cur = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    if (cur == "" || cur == undefined) {
      cur = "TWD";
    }
    this.acctSummPlusInq.acctSummPlusInq(cur).then(
      (res) => {
        console.log('[Deposit Detail] acctSummPlusInq success', res);
        let data = this.modify(res);
        this.depositData = JSON.parse(JSON.stringify(data['depositData']['list']));
        this.selectOptions = this.sortBy.sortAcctList(this.depositData, {
          keyCountry: "Country",
          keyCompanyId: "CustomerId",
          keyCompanyName: "CustomerName",
          keyCurrency: "AcctCurrency",
          keyAccout: "AcctNo",
          // allDesc: this.langTransService.instant('DEPOSITDETAIL.ALL_COMPANY')
          showAll: false
        });
        this.selectOptions[0].disabled = true;
        //關閉Reload Method
        this.popup.setGestures({
          'reload_close': true
        });
        this.popup.setLoading(false);
        this.zone.run(() => {
          if (this.homeInq()) {

          } else if (this.detailReq != undefined) {
            this.detailInq();
          }
          else if ((this.selectedOptionIndex == undefined || this.selectedOptionIndex == 0)
            && DepositDetialComponent.lastSelectedOption != undefined) {
            var index = this.selectOptions.findIndex((item) => {
              return item.original.CustomerId == DepositDetialComponent.lastSelectedOption.original.CustomerId &&
                item.original.AcctNo == DepositDetialComponent.lastSelectedOption.original.AcctNo;
            })
            if (index > -1) {
              this.setSelectedIndex(index);
              this.selCompanyName = DepositDetialComponent.lastSelectedOption.desc
              this.onOptionChange();
            }
          }
        })

      },
      (error) => {
        console.log('[Deposit Detail] acctSummPlusInq failed', error);
        let ResultCode = error['Result'] ? error['Result'] : error['HeaderRs']['Result'];

        // ERROR_125為查無匯率資料，不跳POP顯示查無無資料圖片
        if (ResultCode == "125") {
          this.isNoData = true;
        } else {
          // 顯示錯誤訊息
          this.popup.setConfirm({
            content: this.langTransService.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')'
          });
        }
        //關閉Reload Method
        this.popup.setGestures({
          'reload_close': true
        });
        this.popup.setLoading(false);
      }
    )
  }

  modify(data) {
    let depositData = {
      'list': []
    };
    var isActivate = this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY);
    var isST = this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY_ST);
    var isTD = this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY_TD);

    data['AcctSummList'].forEach(item => {
      if ((item["AcctType"] == "ST" && !isST)
        || (item["AcctType"] == "T" && !isTD)
        || (item["AcctType"] != "ST" && item["AcctType"] != "T" && !isActivate)) {
        return;
      }
      switch (item.AcctType) {
        case 'S':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.S';
          item['AcctTypeNum'] = '1';
          depositData.list.push(item);
          break;

        case 'C':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.C';
          item['AcctTypeNum'] = '2';
          depositData.list.push(item);
          break;

        case 'T':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.T';
          item['AcctTypeNum'] = '3';
          depositData.list.push(item);
          break;

        case 'SD':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.SD';
          item['AcctTypeNum'] = '4';
          depositData.list.push(item);
          break;

        case 'SE':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.SE';
          item['AcctTypeNum'] = '5';
          depositData.list.push(item);
          break;

        case 'O':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.O';
          item['AcctTypeNum'] = '6';
          depositData.list.push(item);
          break;

        case 'OD':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.OD';
          item['AcctTypeNum'] = '7';
          depositData.list.push(item);
          break;

        default:
          break;
      }
    });
    data['depositData'] = depositData;
    return data;
  }

  /**
   * [API] Detail of Structured Deposits 結構型
   */
  getSTDetail(req) {
    return new Promise((resolve, reject) => {
      this.popup.setLoading(true);
      this.stDetailService.getSTDetail(req).then(
        (stDetail_res) => {
          // 清單取得成功
          console.log('[Deposit Detail] getSTDetail success', stDetail_res);

          this.stDetail = stDetail_res;
          this.isNoData = false;
          resolve(stDetail_res);
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);

        },
        (stDetail_err) => {
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
          this.isNoData = true;
          reject(stDetail_err);
        }
      );
    });
  }

  /**
   * [API] Detail of Term Deposits 定存
   */
  getTDDetail(req) {
    return new Promise((resolve, reject) => {
      this.popup.setLoading(true);
      this.tdDetailService.getTDDetail(req).then(
        (tdDetail_res) => {
          // 清單取得成功
          console.log('[Deposit Detail] getTDDetail success', tdDetail_res);
          this.tDetail = tdDetail_res;
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
          this.isNoData = false;
          resolve(tdDetail_res);
        },
        (tdDetail_err) => {
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
          this.isNoData = true;
          reject(tdDetail_err);
        }
      );
    });
  }

  /**
   * [API] Detail of Savings Account and Current Account 活支存
   */
  getCASADetail(req) {
    return new Promise((resolve, reject) => {
      this.popup.setLoading(true);

      this.casaActivityService.getCASAActivity(req).then(
        (depositDetail_res) => {
          console.log('[Deposit Detail] getCASADetail success', depositDetail_res);
          // 清單Array取得失敗
          if (!depositDetail_res['CASAAcctActivityList'] || depositDetail_res['CASAAcctActivityList'] == '') {
            console.log('[Deposit Detail] DepositDetail data array miss');
            return;

          } else {
            this.rawLists = JSON.parse(JSON.stringify(depositDetail_res['CASAAcctActivityList']));
            // 清單Array取得成功 依月份做資料整理

            if (this.filterStatus) {
              this.doFilter(this.rawLists);
            } else {
              this.modifyCASADetail(this.rawLists);
              // For Filter
              this.source = JSON.parse(JSON.stringify(this.rawLists));
            }
          }
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
          this.isNoData = false;
          resolve(depositDetail_res);
        },
        (depositDetail_err) => {
          //關閉Reload Method
          this.popup.setGestures({
            'reload_close': true
          });
          this.popup.setLoading(false);
          this.isNoData = true;
          reject(depositDetail_err);
        }
      );
    });
  }

  /**
   * [資料整理 by Month] Detail of Savings Account and Current Account 活支存
   */
  modifyCASADetail(modifyArray) {
    modifyArray.forEach(item => {
      let monthStr: string = (new Date(<string>item['TxnDate']).getMonth() + 1).toString();
      item['month'] = monthStr;
      item['openType'] = false;
      item['blueStyle'] = (item['DebitCredit'] === 'C') ? true : false;

      if (this.list[item.month] === undefined) {
        this.list[item.month] = [item];
      } else {
        this.list[item.month].push(item);
      }

    });

    //排序---依日期
    this.arraySortByDate(this.list);
    this.keys = Object.keys(this.list).reverse();

  }

  /**
   * 下拉選單選取事件
   */
  onOptionChange() {
    this.selectedOption = this.selectOptions[this.selectedOptionIndex];
    this.curType = this.selectedOption['original']['AcctCurrency'];
    this.availBalance = this.selectedOption['original']['AvailBalance'];
    this.curBalance = this.selectedOption['original']['CurBalance'];
    this.selCompanyName = this.selectedOption['desc'];
    if (!this.selectedOption.hasOwnProperty('original')) {
      // 選取項目不為有效值 無作用
      return;
    } else {
      // 選取項目為有效值 發API
      let reqObj = {};
      if (this.selectedOption['original']['AcctType'] === 'S' || this.selectedOption['original']['AcctType'] === 'C') {
        reqObj = {
          'Currency': this.currency,
          'Country': this.selectedOption['original']['Country'],
          'CustomerId': this.selectedOption['original']['CustomerId'],
          'AcctNo': this.selectedOption['original']['AcctNo'],
          'AcctCur': this.selectedOption['original']['AcctCurrency'],
          'TrnType': this.searchType,
          'DateFrom': this.searchDate['DateFrom'],
          'DateTo': this.searchDate['DateTo'],
        }

      } else if (this.selectedOption['original']['AcctType'] === 'T' || this.selectedOption['original']['AcctType'] === 'SD') {
        reqObj = {
          'Country': this.selectedOption['original']['Country'],
          'CustomerId': this.selectedOption['original']['CustomerId'],
          'AcctNo': this.selectedOption['original']['AcctNo'],
          'AcctCur': this.selectedOption['original']['AcctCurrency']
        }
      }
      reqObj['AcctType'] = this.selectedOption['original']['AcctType'],
      reqObj['type'] = this.selectedOption['original']['AcctType'];
      reqObj['AcctCurrency'] = this.selectedOption['original']['AcctCurrency'];
      this.detailReq = reqObj;
      this.filterStatus = false;
      this.getDetial();
    }
  }

  setSelectedIndex(index) {
    this.selectedOptionIndex = index
    var treuIndex = this.selectOptions.findIndex((item) => {
      return item.checked;
    })
    if (treuIndex > 0) {
      this.selectOptions[treuIndex]["checked"] = false;
    }
    this.selectOptions[index]["checked"] = true;
    //this.detailReq = this.selectOptions[index]["original"]
  }

  onCompanyClick() {
    //API沒值 只有全部則不啟動下拉
    if (this.selectOptions.length <= 1) {
      return;
    }


    this.popup.setCheckList({
      // title: this.langTransService.instant(''), // 
      data: this.selectOptions,
      type: 'radio',
      event: (result) => {
        this.selCompanyName = result['desc'];
        this.selectedOptionIndex = +result['index'];
        DepositDetialComponent.lastSelectedOption = this.selectOptions[this.selectedOptionIndex];
        this.onOptionChange();
      }
    })
  }

  /**
   * 點擊事件
   * @param listsIndex 點擊之月份索引值
   * @param listIndex 點擊之清單索引值
   */
  toggle(listsIndex, listIndex) {
    if (this.list[this.keys[listsIndex]][listIndex].openType) {
      this.list[this.keys[listsIndex]][listIndex].openType = false;
    } else {
      this.list[this.keys[listsIndex]][listIndex].openType = true;
    }
  }

  /**
   * 頁面input搜尋
   */
  //暫時移除搜尋BAR
  public search_result_data;
  search_result(filter) {
    console.log('search_result_data >>>>', filter);
    let tempData = filter;
    this.list = {};
    this.modifyCASADetail(tempData);
  }

  tempfilter = {};
  /**
   * 篩選器Popup開關控制
   */
  filterPop() {
    // Open Filter Popup
    console.log("Open Filter Popup");
    this.popup.setDepositDetial({
      selectedValue: this.tempfilter,
      event: (selectedValue) => {
        this.tempfilter = selectedValue;
        let i = 0;
        let index = 0;
        this.selectOptions.forEach(item => {
          if (item.type != "account") {
            return;
          }
          if (item['original']['AcctNo'] === this.selectedOption['original']['AcctNo']) index = i;
          i++;
        });


        let tempObj = {
          'Currency': this.currency,
          'Country': this.selectedOption['original']['Country'],
          'CustomerId': this.selectedOption['original']['CustomerId'],
          'AcctType': this.selectedOption['original']['AcctType'],
          'AcctNo': this.selectedOption['original']['AcctNo'],
          'AcctCur': this.selectedOption['original']['AcctCurrency'],
          'AcctCurrency': this.selectedOption['original']['AcctCurrency'],
          'TrnType': selectedValue['TrnType'],
          'DateFrom': selectedValue['DateFrom'],
          'DateTo': selectedValue['DateTo']
        }
        tempObj['type'] = 'S';
        this.filterStatus = true;
        this.filterCondition['AmntType'] = selectedValue['DebitCredit'];
        this.filterCondition['AmntFrom'] = (selectedValue['DebitCredit'] === 'D') ? +selectedValue['dAmntFrom'] : +selectedValue['cAmntFrom'];
        this.filterCondition['AmntTo'] = (selectedValue['DebitCredit'] === 'D') ? +selectedValue['dAmntTo'] : +selectedValue['cAmntTo'];

        //日期做格式處理  8位數變2018/08/08
        let fromDate = selectedValue['DateFrom'].slice(0, 4) + "/" + selectedValue['DateFrom'].slice(4, 6) + "/" + selectedValue['DateFrom'].slice(6, 8);
        let toDate = selectedValue['DateTo'].slice(0, 4) + "/" + selectedValue['DateTo'].slice(4, 6) + "/" + selectedValue['DateTo'].slice(6, 8);

        if (selectedValue['DebitCredit'] == "D") {
          //去掉沒輸入範圍金額
          if (selectedValue['dAmntTo'] && selectedValue['dAmntTo'] != "0") {
            this.popCondition = {
              "TxnDate": { "rangeDate": fromDate + "-" + toDate },
              "Amt": { "rangeNum": selectedValue['dAmntFrom'] + "-" + selectedValue['dAmntTo'] },
              "DebitCredit": selectedValue['DebitCredit']
            }
          } else {
            this.popCondition = {
              "TxnDate": { "rangeDate": fromDate + "-" + toDate }
            }
          }

        } else if (selectedValue['DebitCredit'] == "C") {

          //去掉沒輸入範圍金額
          if (selectedValue['cAmntTo'] && selectedValue['cAmntTo'] != "0") {
            this.popCondition = {
              "TxnDate": { "rangeDate": fromDate + "-" + toDate },
              "Amt": { "rangeNum": selectedValue['cAmntFrom'] + "-" + selectedValue['cAmntTo'] },
              "DebitCredit": selectedValue['DebitCredit']
            }
          } else {
            this.popCondition = {
              "TxnDate": { "rangeDate": fromDate + "-" + toDate }
            }
          }
        }

        if (!this.selectedOption.hasOwnProperty('original')) {
          // 選取項目不為有效值 無作用
          return;
        } else {
          this.detailReq = tempObj;
          this.getDetial();
        }

      }

      
    });

  }

  /**
   * Do Filter by Amnt
   * @param filterArray 
   */
  doFilter(filterArray) {
    let tempArray = [];

    tempArray = this.search.FilterData(filterArray, this.popCondition, true);

    this.modifyCASADetail(tempArray);
  }

  /**
   * 取得查詢日期參數
   */
  getSearchDate() {
    let date = new Date();
    let month;
    month = (date.getMonth() + 1);
    this.searchDate['DateTo'] = date.getFullYear().toString() + (month > 9 ? month.toString() : "0" + month.toString()) + date.getDate().toString();
    //default查詢二個月
    date.setMonth(date.getMonth() - 2);
    month = (date.getMonth() + 1);
    this.searchDate['DateFrom'] = date.getFullYear().toString() + (month > 9 ? month.toString() : "0" + month.toString()) + date.getDate().toString();
  }


  arraySortByDate(data) {
    let keys = Object.keys(data);

    keys.forEach(element => {
      data[element].sort(function (a, b) {
        let aStrings = a['TxnDate'].split("-");
        let bStrings = b['TxnDate'].split("-");

        return bStrings[2] - aStrings[2]

      })
    });
  }



}
