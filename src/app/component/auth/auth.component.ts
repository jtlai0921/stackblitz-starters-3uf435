import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { DoAuthorizeService } from '../../shared/service/customize/doAuthorize.service';
import { PendingAuthInqService } from '../../shared/service/customize/pendingAuthInq.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { HiBiometricAuthService } from '../../shared/service/cordova/HiBiometricAuth.service';
import { QUICK_LOGIN_CONFIGURATIONS, QUICK_LOGIN_STORAGE_KEY } from '../../../assets/configuration/quickLoginConfiguration';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { SearchFilterService } from '../../shared/component/public/search-filter.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { PatternLockService } from '../../shared/service/global/patternLock.service';
import { CustomCodeService } from '../../shared/pipe/publicPipe/custom/custom.service';
import { Router } from '@angular/router';
import { DateTimeService } from '../../shared/service/global/daettime.service';
import { SearchComponent } from '../../shared/component/public/search.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, AfterViewInit {

  @ViewChild(SearchComponent) Search : SearchComponent;
  title = 'AUTH.TITLE'; // 標題 授權放行
  pageType; // 頁面控制
  isMyAuth = true; // 我的/其他授權
  isAuth = false; // 已/待授權
  noAuth = this.isAuth ? 'u3217.png' : 'u3413.png'; // 待授權圖片
  yesAuth = this.isAuth ? 'u3218.png' : 'u3409.png'; // 已授權圖片
  btnShowFlag = false; // 待授權頁下方按鈕

  // 授權放行頁相關參數
  originalData; // 初始已/待授權資料
  dataArray; // 顯示已/待授權資料
  authReason; // 操作取消/退回之使用者輸入說明
  index; // 授權取消/退回資料序號
  // 待授權勾選單相關參數
  checkCounter = 0; // 待授權勾選計數器
  checkList = []; // 待授權勾選index清單
  // 授權明細頁相關參數
  showOperationBtn = !this.isAuth;
  detailData; // 明細頁資料
  // 授權操作相關參數
  authOperationData; // 欲操作資料
  isDetailCallback = false; // 取消/退回操作是否由明細頁發動
  // 授權結果相關參數
  authResultData; // 完成授權交易資料
  action; // 授權操作類型

  // 篩選
  public filterBlock = false; // 篩選div
  public source = []; // 要篩選的資料
  public searchSource = []; // 搜尋bar要搜尋的資料
  public loadData; // 要被載入更多的data
  public viewCountryData; // 篩選畫面呈現的資料 國家
  public viewTrnTypeData; // 篩選畫面呈現的資料 交易類型
  public viewTxnStatusData; // 篩選畫面呈現的資料 交易狀態
  public viewChannelIdData; // 篩選畫面呈現的資料 來源通路
  public viewDebitCurData; // 篩選畫面呈現的資料 扣帳幣別
  public viewCreditCurData; // 篩選畫面呈現的資料 入帳幣別
  public viewTOTALRECORDData; // 篩選畫面呈現的資料 總筆數
  public viewREMITTANCEPURPOSEData; // 篩選畫面呈現的資料 匯款性質
  public viewDateData; // 篩選畫面呈現的資料 交易日期
  /**
   * 關鍵字輸入框搜尋範圍：
   * 扣帳帳號、扣款帳號所屬統編、扣款帳號所屬公司、 扣款銀行名稱
   * 收款帳號、收款人名稱、收款人代碼、收款代碼、收款銀行代碼、收款銀行名稱
   * 總筆數、手續費金額(X)、SWIFT ID、交易序號
   */
  public filterArray = [
    'nDebitAccount', 'nDebitBankId', 'nDebitBranchId', 'nDebitIdNo', 'nDebitName',
    'nCreditAccount', 'nCreditBankId', 'nCreditBankName', 'nCreditBranchId', 'nCreditIdNo', 'nCreditName',
    'nTxnRecords', 'BENEFICIARYBANKSWIFTCODE', 'nTxnBatchId'];
  dAmntFrom: any; // 扣帳金額_起
  dAmntTo: any; // 扣帳金額_到
  cAmntFrom: any; // 收帳金額_起
  cAmntTo: any; // 收帳金額_到
  public closeBtnChange = true; // 篩選關閉鈕切換
  public isFilterReset = false; // 是否為重設篩選結果

  constructor(
    public layout: LayoutService,
    public pendingAuth: PendingAuthInqService,
    public popup: PopupService,
    public storage: LocalStorageService,
    public hiBiometricAuth: HiBiometricAuthService,
    public authorize: DoAuthorizeService,
    public route: ActivatedRoute,
    private optionFilter: SearchFilterService,
    private langTrans: LangTransService,
    private codeTrans: CustomCodeService,
    private patternLock: PatternLockService,
    private router: Router,
    private datetime: DateTimeService
  ) {
    // 初始化頁面實例
    this.layout.setHeaderStatus({
      status: true,
      initbackStack: true,
      title: this.title
    });
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.startAuthData();

      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // 無指定時，預設開啟待授權畫面
      this.isAuth = (params.type == 'auth');
      this.pageType = "list";
      // 重置標題列資訊
      this.layout.setHeaderStatus({
        initbackStack: true,
        title: this.title
      });
      // 開始頁面資料查詢作業
      this.startAuthData();
    });
  }

  /**
   * 開始授權放行頁面資料查詢作業
   */
  startAuthData() {
    // 控制開啟Loading畫面
    this.popup.setLoading(true);
    
    console.log('[授權放行頁] startAuthData 初始化 開啟', this.isAuth ? '已授權' : '待授權');
    this.noAuth = this.isAuth ? 'u3217.png' : 'u3413.png';
    this.yesAuth = this.isAuth ? 'u3218.png' : 'u3409.png';
    if (this.isAuth) {
      // 預設開啟已授權頁面
      // 查詢我的授權/其他授權資料
      this.getAuthData();
    } else {
      // 預設開啟待授權頁面
      // 查詢所有待授權資料
      this.getPendingAuthData();
    }
  }

  /**
   * 初始化資料數據
   */
  initializeData() {
    // 清空待授權勾選紀錄
    this.checkCounter = 0;
    this.checkList = [];
    // 隱藏授權操作按鈕
    this.btnShowFlag = false;
    // 清空明細資料
    this.detailData = null;
    // 清空授權操作資料
    this.authOperationData = null;
    // 清空授權結果資料
    this.authResultData = null;
    // 清空畫面顯示資料
    this.pagerData = null;
    // 清空搜尋bar
    this.Search.searchkey = "";
  }

  /**
   * 查詢待授權資料
   */
  getPendingAuthData() {
    // 清空舊資料紀錄
    this.initializeData();
    console.log('[授權放行頁][待授權] getPendingAuthData');
    this.pendingAuth.pendingAuthInq("P").then(
      (res) => {
        console.log('[授權放行頁][待授權][API] PendingAuthInq success', res);
        this.originalData = res;
        this.handleDisplayData();
        this.LoadPage(true);
      },
      (err) => {
        console.log('[授權放行頁][待授權][API] PendingAuthInq error', err);
        this.handleApiError(err);
      }
    );
  }

  /**
   * 查詢已授權(我的授權/其他授權)資料
   */
  getAuthData() {
    // 清空舊資料紀錄
    this.initializeData();
    if (this.isMyAuth) {
      console.log('[授權放行頁][已授權][我的授權] getAuthData');
      // 已授權預設開啟我的授權畫面
      // 查詢所有我的授權資料
      this.pendingAuth.pendingAuthInq("M").then(
        (res) => {
          console.log('[授權放行頁][已授權][我的授權][API] PendingAuthInq success', res);
          this.originalData = res;
          this.handleDisplayData();
          this.LoadPage(true);
        },
        (err) => {
          console.log('[授權放行頁][已授權][我的授權][API] PendingAuthInq error', err);
          this.handleApiError(err);
        }
      );
    } else {
      console.log('[授權放行頁][已授權][其他授權] getAuthData');
      // 已授權預設開啟其他授權畫面
      // 查詢所有其他授權資料
      this.pendingAuth.pendingAuthInq("O").then(
        (res) => {
          console.log('[授權放行頁][已授權][其他授權][API] PendingAuthInq success', res);
          this.originalData = res;
          this.handleDisplayData();
          this.LoadPage(true);
        },
        (err) => {
          console.log('[授權放行頁][已授權][其他授權][API] PendingAuthInq error', err);
          this.handleApiError(err);
        }
      );
    }
  }

  /**
   * 處理授權查詢錯誤
   * @param error 電文文數據
   */
  handleApiError(error) {
    let ResultCode = error['Result'] ? error['Result'] : error['HeaderRs']['Result'];
    console.log('[授權放行頁][API] handleApiError errCode =', ResultCode);

    if (ResultCode == 144) {
      // 重啟授權查詢作業
      this.startAuthData();
    } else {
      // 初始化顯示資料陣列，以開啟no-data效果
      this.pagerData = [];
      // 過濾不顯示錯誤訊息之代碼
      if (ResultCode != 13) {
        // 顯示錯誤訊息
        this.popup.setConfirm({
          content: this.langTrans.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')'
        });
      }
      // 控制關閉Loading畫面
      this.popup.setGestures({
        'reload_close': true
      });
      this.popup.setLoading(false);
    }
  }

  /**
   * 搜尋篩選並排序欲顯示資料
   */
  handleDisplayData() {
    /**
     * 授權資料格式標準化
     * [---交易通用資訊---]
     *   nTxnDate
     *  !nTxnChannel
     *  !nTxnType
     *  !nTxnStatus
     *  !nTxnRecords
     *   nTxnAuthLvl
     *   nTxnBatchId
     *  !nTxnPurpose
     *   nTxnMemo
     *   nTxnAccount
     *   nTxnAmount
     *   nTxnCurrency
     *   nTxnRate
     * [---客戶資訊---]
     *   nCustomerId
     *   nCustomerName
     *  !nCustomerCountry
     * [---轉出/扣帳資訊---] 
     *   nDebitAccount
     *   nDebitCountry
     *  !nDebitCurrency
     *  !nDebitAmount
     *   nDebitBankId
     *   nDebitBranchId
     *   nDebitIdNo
     *   nDebitName
     * [---轉入/入帳資訊---] 
     *   nCreditAccount
     *   nCreditCountry
     *  !nCreditCurrency
     *  !nCreditAmount
     *   nCreditBankId
     *   nCreditBankName
     *   nCreditBranchId
     *   nCreditIdNo
     *   nCreditName
     * [---特殊交易類型資訊---]
     *   nTdPeriod
     *   nTdDisposal
     *   nLcNo
     *   nLcModifyAmount
     *   nLcModifyCurrency
     *   nLcModifyEndDate
     *   nLcModifyShipmentDate
     * 
     * [---畫面特殊顯示使用---]
     *   dTxnYear
     * 
     * [注意事項]
     * !標記項目為篩選器欄位，依據篩選器元件實作設計
     * 即使電文缺少相關數據，亦須給入空值為預設值
     */
    this.dataArray = JSON.parse(JSON.stringify(this.originalData));
    this.dataArray.forEach(data => {
      if (data['ChannelId'] != "CSFAX") {
        // 交易狀態
        data.TxnStatus = data['TxnStatus'] ? data['TxnStatus'] : "";
        data.Action = data['Action'] ? data['Action'] : "";
        // 交易資訊
        data.nTxnType = data['TrnType'] ? data['TrnType'] : "";
        // 交易日期(10) yyyy-MM-dd
        data.nTxnDate = data['TxnDate'] ? data['TxnDate'] : "";
        data.nTxnChannel = data['ChannelId'] ? data['ChannelId'] : "";
        //交易狀態(先拿掉)
        // data.nTxnStatus = data['TxnStatus'] ? data['TxnStatus'] : "";
        data.nTxnRecords = data['TOTALRECORD'] ? data['TOTALRECORD'] : "";
        data.nTxnAuthLvl = data['AuthLv'] ? data['AuthLv'] : "";
        data.nTxnBatchId = data['BatchId'] ? data['BatchId'] : "";
        data.nTxnPurpose = data['REMITTANCEPURPOSE'] ? data['REMITTANCEPURPOSE'] : "";
        // 客戶資訊
        data.nCustomerId = data['CUSTOMERID'] ? data['CUSTOMERID'] : "";
        data.nCustomerName = data['CUSTOMERNAME'] ? data['CUSTOMERNAME'] : "";
        data.nCustomerCountry = data['CUSTOMERCOUNTRYCODE'] ? data['CUSTOMERCOUNTRYCODE'] : "";
        // 扣帳資訊
        data.nDebitAccount = data['DEBITACCOUNT'] ? data['DEBITACCOUNT'] : "";
        data.nDebitCurrency = data['DEBITCURRENCY'] ? data['DEBITCURRENCY'] : "";
        data.nDebitAmount = data['DEBITAMOUNT'] ? data['DEBITAMOUNT'] : "";
        data.nDebitBankId = data['DEBITBANKCODE'] ? data['DEBITBANKCODE'] : "";
        data.nDebitBranchId = data['DEBITBRANCHCODE'] ? data['DEBITBRANCHCODE'] : "";
        data.nDebitIdNo = data['DEBITCUSTOMERID'] ? data['DEBITCUSTOMERID'] : "";
        data.nDebitName = data['DEBITCUSTOMERNAME'] ? data['DEBITCUSTOMERNAME'] : "";
        // 入帳資訊
        data.nCreditAccount = data['CREDITACCOUNT'] ? data['CREDITACCOUNT'] : "";
        data.nCreditCountry = data['BENEFICIARYCOUNTRYCODE'] ? data['BENEFICIARYCOUNTRYCODE'] : "";
        data.nCreditCurrency = data['TRANSACTIONCURRENCY'] ? data['TRANSACTIONCURRENCY'] : "";
        data.nCreditAmount = data['CREDITAMOUNT'] ? data['CREDITAMOUNT'] : "";
        data.nCreditBankId = data['BENEFICIARYBANKCODE'] ? data['BENEFICIARYBANKCODE'] : "";
        data.nCreditBranchId = data['BENEFICIARYBRANCHCODE'] ? data['BENEFICIARYBRANCHCODE'] : "";
        data.nCreditIdNo = data['BENEFICIARYID'] ? data['BENEFICIARYID'] : "";
        data.nCreditName = data['BENEFICIARYNAME'] ? data['BENEFICIARYNAME'] : "";
        //整批交易
        if (data.nTxnType == "0"){
          data.BULKREFNO = data['BULKREFNO'] ? data['BULKREFNO'] : "";
          data.BULKFILETYPE = data['BULKFILETYPE'] ? data['BULKFILETYPE'] : "";
        }

        // 定存開戶
        if (data.nTxnType == "4") {
          data.nTxnCurrency = data['TRANSACTIONCURRENCY'] ? data['TRANSACTIONCURRENCY'] : "";
          data.nTxnAmount = data['TDAMOUNT'] ? data['TDAMOUNT'] : "";
          data.nTxnAccount = data['DEBITACCOUNT'] ? data['DEBITACCOUNT'] : "";
          data.nTxnRate = data['TDINTERESTRATE'] ? data['TDINTERESTRATE'] : "";
          data.nTdPeriod = data['TENORPERIOD'] ? data['TENORPERIOD'] : "";
          data.nTdDisposal = data['TDINSTRUCTION'] ? data['TDINSTRUCTION'] : "";
          data.ISSUEDATE = data['ISSUEDATE'] ? data['ISSUEDATE'] : "";
          data.TENORPERIOD = data['TENORPERIOD'] ? data['TENORPERIOD'] : "";
          data.TENORPERIODUNIT = data['TENORPERIODUNIT'] ? data['TENORPERIODUNIT'] : "";

          //計算到期日
          let temp = data.ISSUEDATE.split("-");
          let day = new Date(temp[0],temp[1]-1,temp[2]);
          //如果單位是月
          if(data.TENORPERIODUNIT == "M"){
            // 交易日與期別相加
            day.setMonth(day.getMonth()+parseInt(data.TENORPERIOD));
            let year = day.getFullYear();
            let month = day.getMonth()+1;
            let days = day.getDate();
            data.DUEDATE = year +"/"+ month + "/" +days;
          }
          //如果單位是日
          else if(data.TENORPERIODUNIT == "D"){
            //交易日與期別相加
            day.setDate(day.getDate()+parseInt(data.TENORPERIOD));
            let year = day.getFullYear();
            let month = day.getMonth()+1;
            let days = day.getDate();
            data.DUEDATE = year +"/"+ month + "/" +days;
          }
          data.DUEDATE = data['DUEDATE'] ? data['DUEDATE'] : "";
        }
        //
        // 定存解約
        else if (data.nTxnType == "6") {
          data.nTxnCurrency = data['TDCURRENCY'] ? data['TDCURRENCY'] : "";
          data.nTxnAmount = data['TDAMOUNT'] ? data['TDAMOUNT'] : "";
          data.nTxnAccount = data['TDACCOUNT'] ? data['TDACCOUNT'] : "";
          data.nTxnRate = data['TDINTERESTRATE'] ? data['TDINTERESTRATE'] : "";
          data.nTdPeriod = data['TENORPERIOD'] ? data['TENORPERIOD'] : "";
          data.nTdDisposal = data['TDINSTRUCTION'] ? data['TDINSTRUCTION'] : "";
          data.TENORPERIODUNIT = data['TENORPERIODUNIT'] ? data['TENORPERIODUNIT'] : "";
        }
        // LC開狀
        else if (data.nTxnType == "7") {
          data.nTxnCurrency = data['TRANSACTIONCURRENCY'] ? data['TRANSACTIONCURRENCY'] : "";
          data.nTxnAmount = data['CREDITAMOUNT'] ? data['CREDITAMOUNT'] : "";
        }
        // LC修狀
        else if (data.nTxnType == "8") {
          data.nTxnCurrency = data['TRANSACTIONCURRENCY'] ? data['TRANSACTIONCURRENCY'] : "";
          data.nTxnAmount = data['CREDITAMOUNT'] ? data['CREDITAMOUNT'] : "";
          data.nLcNo = "";
          // 以下4項為可修狀參數
          data.nLcModifyCurrency = data['TRANSACTIONCURRENCY'] ? data['TRANSACTIONCURRENCY'] : "";
          data.nLcModifyAmount = data['CREDITAMOUNT'] ? data['CREDITAMOUNT'] : "";
          data.nLcModifyEndDate = "";
          data.nLcModifyShipmentDate = "";
        }
        // 電子聯繫單/LC文件上傳
        else if (data.nTxnType == "10") {
          data.nTxnCurrency = data['TRANSACTIONCURRENCY'] ? data['TRANSACTIONCURRENCY'] : "";
          data.nTxnAmount = data['CREDITAMOUNT'] ? data['CREDITAMOUNT'] : "";
          // 電子聯繫單
          if(data.nCreditName == '' && data.REMARK != ''){
            data.nTxnType = "10A";
          // LC文件上傳
          }else{
            data.nTxnType = "10B";
          }
        }
      }
      if (data['ChannelId'] == "CSFAX") {
        // 交易狀態
        data.TxnStatus = data['TxnStatus'] ? data['TxnStatus'] : "";
        data.Action = data['Action'] ? data['Action'] : "";
        // 通用資訊
        data.nTxnType = data['TrnType'] ? data['TrnType'] : "";
        data.nTxnDate = data['TxnDate'] ? data['TxnDate'] : "";
        data.nTxnChannel = data['ChannelId'] ? data['ChannelId'] : "";
        // 交易狀態(先拿掉)
        // data.nTxnStatus = data['TxnStatus'] ? data['TxnStatus'] : "";
        data.nTxnAuthLvl = data['AuthLv'] ? data['AuthLv'] : "";
        data.nTxnBatchId = data['BatchId'] ? data['BatchId'] : "";
        data.nTxnRecords = "";
        data.nTxnPurpose = "";
        data.nCustomerCountry = "";
        data.nDebitCurrency = "";
        data.nDebitAmount = "";
        data.nCreditCurrency = "";
        data.nCreditAmount = "";

        // 行內轉帳
        if (data.nTxnType == "1") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['LEGALNAME'] ? data['LEGALNAME'] : "";
          // 交易日期(10) yyyy-MM-dd
          data.nDebitAccount = data['PAYERACCTID'] ? data['PAYERACCTID'] : "";
          data.nCreditAccount = data['PAYEEACCTID'] ? data['PAYEEACCTID'] : "";
          data.nCreditCurrency = data['REMITCURCODE_1'] ? data['REMITCURCODE_1'] : "";
          data.nCreditAmount = data['AMT'] ? data['AMT'] : "";
          data.nCreditName = data['PAYEENAME'] ? data['PAYEENAME'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
          // 使用入帳幣別、金額補齊扣帳幣別、金額
          data.nDebitCurrency = data['REMITCURCODE_1'] ? data['REMITCURCODE_1'] : "";
          data.nDebitAmount = data['AMT'] ? data['AMT'] : "";
        }
        // 國內匯款
        else if (data.nTxnType == "2") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['LEGALNAME'] ? data['LEGALNAME'] : "";
          data.nDebitAccount = data['PAYERACCTID_1'] ? data['PAYERACCTID_1'] : "";
          data.nCreditAccount = data['PAYEEACCTID_1'] ? data['PAYEEACCTID_1'] : "";
          data.nCreditCurrency = data['REMITCURCODE'] ? data['REMITCURCODE'] : "";
          data.nCreditAmount = data['AMT_1'] ? data['AMT_1'] : "";
          data.nCreditBankId = data['BANKID'] ? data['BANKID'] : "";
          data.nCreditName = data['PAYEENAME_1'] ? data['PAYEENAME_1'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
          // 使用入帳幣別、金額補上扣帳幣別、金額
          data.nDebitCurrency = data['REMITCURCODE'] ? data['REMITCURCODE'] : "";
          data.nDebitAmount = data['AMT_1'] ? data['AMT_1'] : "";
        }
        // 國際匯款
        else if (data.nTxnType == "3") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['LEGALNAME'] ? data['LEGALNAME'] : "";
          data.nDebitAccount = data['PAYERACCTID_1'] ? data['PAYERACCTID_1'] : "";
          data.nCreditAccount = data['PAYEEACCTID_1'] ? data['PAYEEACCTID_1'] : "";
          data.nCreditCurrency = data['REMITCURCODE'] ? data['REMITCURCODE'] : "";
          data.nCreditAmount = data['AMT_1'] ? data['AMT_1'] : "";
          data.nCreditBankId = data['BANKID'] ? data['BANKID'] : "";
          data.nCreditName = data['PAYEENAME_1'] ? data['PAYEENAME_1'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
          // 使用入帳幣別、金額補上扣帳幣別、金額
          data.nDebitCurrency = data['REMITCURCODE'] ? data['REMITCURCODE'] : "";
          data.nDebitAmount = data['AMT_1'] ? data['AMT_1'] : "";
        }
        // 定存申請
        else if (data.nTxnType == "4") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME'] ? data['CUSTNAME'] : "";
          data.nTxnCurrency = data['DEPOSITSCURRENCY'] ? data['DEPOSITSCURRENCY'] : "";
          data.nTxnAmount = data['DEPOSITSAMOUNT'] ? data['DEPOSITSAMOUNT'] : "";
          data.nTxnAccount = "";
          data.nTxnRate = data['RATE'] ? data['RATE'] : "";
          data.nTdPeriod = data['DEPOSITPERIOD'] ? data['DEPOSITPERIOD'] : "";
          data.nTdDisposal = data['DISPOSALINSTRUCTION'] ? data['DISPOSALINSTRUCTION'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
        }
        // 定存變更
        else if (data.nTxnType == "5") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME'] ? data['CUSTNAME'] : "";
          data.nTxnCurrency = data['DEPOSITSCURRENCY'] ? data['DEPOSITSCURRENCY'] : "";
          data.nTxnAmount = data['DEPOSITSAMOUNT'] ? data['DEPOSITSAMOUNT'] : "";
          data.nTxnAccount = data['DEPOSITSACCOUNT'] ? data['DEPOSITSACCOUNT'] : "";
          data.nTdPeriod = data['MODIFYDEPOSITPERIOD'] ? data['MODIFYDEPOSITPERIOD'] : "";
          data.nTdDisposal = data['MODIFYDISPOSALINSTRUCTION'] ? data['MODIFYDISPOSALINSTRUCTION'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
        }
        // 定存解約
        else if (data.nTxnType == "6") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME'] ? data['CUSTNAME'] : "";
          data.nTxnCurrency = data['DEPOSITSCURRENCY'] ? data['DEPOSITSCURRENCY'] : "";
          data.nTxnAmount = data['DEPOSITSAMOUNT'] ? data['DEPOSITSAMOUNT'] : "";
          data.nTxnAccount = data['DEPOSITACCOUNT'] ? data['DEPOSITACCOUNT'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
        }
        // LC開狀
        else if (data.nTxnType == "7") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME'] ? data['CUSTNAME'] : "";
          data.nTxnCurrency = data['LCCURRENCY'] ? data['LCCURRENCY'] : "";
          data.nTxnAmount = data['LCAMOUNT'] ? data['LCAMOUNT'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
        }
        // LC修狀
        else if (data.nTxnType == "8") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME'] ? data['CUSTNAME'] : "";
          data.nTxnCurrency = "";
          data.nTxnAmount = "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
          data.nLcNo = data['LCNO'] ? data['LCNO'] : "";
          // 以下4項為可修狀參數
          data.nLcModifyCurrency = data['ADJUSTEDCURRENCY'] ? data['ADJUSTEDCURRENCY'] : "";
          data.nLcModifyAmount = data['ADJUSTEDAMOUNT'] ? data['ADJUSTEDAMOUNT'] : "";
          data.nLcModifyEndDate = data['ADJUSTEDENDDATE'] ? data['ADJUSTEDENDDATE'] : "";
          data.nLcModifyShipmentDate = data['MODIFYSHIPMENTDATE'] ? data['MODIFYSHIPMENTDATE'] : "";
        }
        // 動撥
        else if (data.nTxnType == "9") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME'] ? data['CUSTNAME'] : "";
          data.nTxnCurrency = data['LOANCURRENCY'] ? data['LOANCURRENCY'] : "";
          data.nTxnAmount = data['LOANAMOUNT'] ? data['LOANAMOUNT'] : "";
          data.nTxnAccount = data['INCOMINGACCOUNT'] ? data['INCOMINGACCOUNT'] : "";
          data.nTxnRate = data['RATE_1'] ? data['RATE_1'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
        }
        // 其他
        else if (data.nTxnType == "10") {
          data.nCustomerCountry = data['COUNTRY'] ? data['COUNTRY'] : "";
          data.nCustomerId = data['CUSTPERMID'] ? data['CUSTPERMID'] : "";
          data.nCustomerName = data['CUSTNAME_1'] ? data['CUSTNAME_1'] : "";
          data.nTxnMemo = data['MEMO'] ? data['MEMO'] : "";
        }
      }
    })

    // 依照交易日期由新至舊排序
    let today = this.datetime.datetimeFormat(Date.now(), "yyyy-MM-dd");
    this.dataArray.sort((a, b) => {
      if (a.nTxnDate == today)
        return -1;
      else if (b.nTxnDate == today)
        return 1;
      else if (a.nTxnDate >= b.nTxnDate)
        return -1;
      else
        return 1;
    });
    

    // 篩選來源數據
    this.source = this.dataArray;
    this.searchSource = this.dataArray;
    // 顯示/備載來源數據
    this.loadData = this.dataArray;
    // 控制關閉Loading畫面
    this.popup.setGestures({
      'reload_close': true
    });
    this.popup.setLoading(false);
  }

  /**
   * 設定上一頁事件：回到授權放行頁
   */
  backAuthPage() {
    this.layout.setHeaderStatus({
      initbackStack: false,
      backEvent: () => {
        this.pageType = 'list';
        // 更新標題
        this.layout.setHeaderStatus({ 
          initbackStack: false,
          title: this.title 
        });
      }
    });
  }

  /**
   * [前端事件綁定] 授權放行畫面切換：已授權/待授權
   */
  isAuthClick(e) {
    // 控制開啟Loading畫面
    this.popup.setLoading(true);

    this.isAuth = e;
    console.log('[授權放行頁] isAuthClick 切換 開啟', this.isAuth ? '已授權' : '待授權');
    this.noAuth = e ? 'u3217.png' : 'u3413.png';
    this.yesAuth = e ? 'u3218.png' : 'u3409.png';
    // 顯示資料變換
    if (this.isAuth) {
      // 已授權頁預設開啟我的授權
      this.isMyAuth = true;
      this.getAuthData();
    }
    else {
      this.getPendingAuthData();
    }
  }

  /**
   * [前端事件綁定] 已授權畫面切換：我的授權/其他授權
   */
  whoAuthClick(e) {
    // 控制開啟Loading畫面
    this.popup.setLoading(true);

    this.isMyAuth = e;
    console.log('[授權放行頁][已授權] whoAuthClick 切換 開啟', this.isMyAuth ? '我的授權' : '其他授權');
    // 顯示資料變換
    this.getAuthData();
  }

  /**
   * [前端事件綁定] 點擊資料卡片開啟授權明細頁
   * @param i 資料陣列index
   */
  onDetailClick(i) {
    console.log('[授權放行頁] onDetailClick pagerData index =', i);
    this.detailData = this.pagerData[i];

    // // LC開狀/修狀交易時，提示指定訊息
    // if (this.detailData.nTxnType == "7" || this.detailData.nTxnType == "8") {
    //   this.popup.setConfirm({
    //     content: this.detailData.nTxnType == "7" ? 'AUTH.MSG_LC_INITIATE_DETAIL' : 'AUTH.MSG_LC_AMENDMENT_DETAIL'
    //   });
    //   return;
    // }

    // 切換至授權明細頁
    this.pageType = 'detailPage';
    // 待授權明細顯示操作按鈕；已授權明細隱藏操作按鈕
    this.showOperationBtn = !this.isAuth;
    // 設定上一頁：回到授權放行頁
    this.backAuthPage();
  }

  /**
   * [前端事件綁定] 勾選待授權資料checkBox
   */
  onCheckboxClick(e, i) {
    this.pagerData[i]['aFlag'] = !e;
    this.checkCounter = !e ? (this.checkCounter + 1) : (this.checkCounter - 1);
    console.log('[授權放行頁][待授權] onCheckboxClick pagerData index =', i, ', before =', e, ', aFlag =', !e, ', count =', this.checkCounter);

    if (!e) {
      // 記錄勾選之資料index
      this.checkList.push(i);
    } else {
      // 刪除勾選之資料index
      this.checkList.splice(this.checkList.indexOf(i), 1);
    }

    // 勾選數大於0顯示授權button
    if (this.checkCounter > 0) {
      this.btnShowFlag = true;
    } else {
      this.btnShowFlag = false;
    }
  }

  /**
   * 取得已勾選之待授權資料
   */
  getAuthOperationData = () => {
    if (this.isDetailCallback) {
      console.log('[授權放行頁][待授權] getAuthOperationData isDetailCallback =', this.isDetailCallback);
      // 由授權明細頁對該筆資料發動操作
      this.authOperationData = [];
      this.authOperationData.push(this.detailData);
      // 解除明細頁操作發動之標記
      this.isDetailCallback = false;
      console.log('[授權放行頁][待授權] getAuthOperationData authOperationData legnth =', this.authOperationData.length);
    } else {
      // 於授權放行頁勾選欲操作之資料
      console.log('[授權放行頁][待授權] getAuthOperationData checkList legnth =', this.checkList.length, this.checkList);
      this.authOperationData = [];
      this.checkList.forEach(element => {
        this.authOperationData.push(this.pagerData[element]);
      });
      console.log('[授權放行頁][待授權] getAuthOperationData authOperationData legnth =', this.authOperationData.length);
    }
  }

  /**
   * [前端事件綁定] 點擊授權按鈕
   */
  onAuthClick() {
    console.log('[授權放行頁][待授權] onAuthClick');
    // 取得欲操作之待授權資料
    this.getAuthOperationData();
    // 切換至授權確認頁
    this.pageType = 'confirmedPage';
    // 設定上一頁：回到授權放行頁
    this.backAuthPage();
  }

  /**
   * [前端事件綁定] 點擊取消按鈕
   */
  onCancelClick() {
    console.log('[授權放行頁][待授權] onCaneclClick');
    // 確認取消授權操作，使用者輸入說明
    this.popup.setInput({
      title: 'AUTH.CONFIRM_CANCEL', // 確認取消交易？
      placeholder: 'AUTH.ENTER_DESCRIPTION', // 請輸入說明(非必填)
      default: '',
      checkTxt: 'BTN.CHECK', // 確認
      cancelTxt: 'BTN.CANCEL', // 取消
      event: (value) => {
        this.action = 'cancel';
        this.authReason = value;
        console.log('[授權放行頁][待授權] onCaneclClick action =', this.action);
        console.log('[授權放行頁][待授權] onCaneclClick authReason =', this.authReason);
        // 取得欲操作之待授權資料
        this.getAuthOperationData();
        // 檢查授權交易密碼驗證模式
        this.checkAuthVerifyMode();
      },
      checkEvent: (value) => {
        console.log('[授權放行頁][待授權] onCaneclClick checkEvent length =', value.length, ', value =', value);
        // 取消授權原因為必填項目
        if (value && value != "") {
          return true;
        } else {
          // 提示錯誤訊息: 請輸入原因說明
          this.popup.setConfirm({
            content: 'AUTH.MSG_PLEASE_INPUT_REASON'
          });
          return false;
        }
      }
    });
  }

  /**
   * [前端事件綁定] 點擊退回按鈕
   */
  onRefundClick() {
    console.log('[授權放行頁][待授權] onRefundClick');
    // TODO: 二階段開發功能
  }

  /**
   * [前端事件綁定] 待授權點擊全選按鈕
   */
  onCheckAllClick() {
    console.log('[授權放行頁][待授權] onCheckAllClick original count =', this.checkCounter);
    // 清空已勾選紀錄
    this.checkCounter = 0;
    this.checkList = [];

    this.pagerData.forEach((element, index) => {
      element['aFlag'] = true;
      // 紀錄所有資料index
      this.checkList.push(index);
      this.checkCounter++;
    });
    //若沒資料被勾選則不顯示btn
    if (this.checkCounter > 0) {
      this.btnShowFlag = true;
    }
    console.log('[授權放行頁][待授權] onCheckAllClick final count =', this.checkCounter);
  }

  /**
   * [前端事件綁定] 待授權點擊全不選按鈕
   */
  onUncheckAllClick() {
    console.log('[授權放行頁][待授權] onCheckAllClick original count =', this.checkCounter);
    this.pagerData.forEach(element => {
      element['aFlag'] = false;
    });
    this.checkCounter = 0;
    this.btnShowFlag = false;
    // 清空待授權勾選index清單
    this.checkList = [];
    console.log('[授權放行頁][待授權] onCheckAllClick final count =', this.checkCounter);
  }

  /**
   * [子頁回調事件] 授權明細頁面點擊操作按鈕callback：間接開啟授權確認頁/取消交易/(TODO)退回交易
   * @param event 事件參數
   */
  onDetailCallback(event) {
    this.isDetailCallback = true;
    console.log('[授權放行頁][callback] onDetailCallback', event);
    let action = event['Action'];
    console.log('[授權放行頁][callback] Action =', action);

    // 執行交易授權作業
    if (action == "auth") {
      this.getAuthOperationData();
      // 切換至授權確認頁
      this.pageType = 'confirmedPage';
      // 設定上一頁：回到授權明細頁
      this.layout.setHeaderStatus({
        initbackStack: false,
        backEvent: () => {
          this.pageType = 'detailPage';
          this.showOperationBtn = true;
        }
      });
    }
    // 執行交易取消作業
    else if (action == "cancel") {
      this.onCancelClick();
    }
    // 執行交易退回作業
    else if (action == "refund") {
      // TODO: 二階段開發功能
    }
  }

  /**
   * [子頁回調事件] 授權確認頁點擊資料卡片callback：間接開啟待授權明細頁
   * @param event 事件參數
   */
  onCardClickCallback(event) {
    console.log('[授權放行頁][callback] onCardClickCallback', event);
    // 由授權確認頁間轉至授權明細頁時，不顯示任何操作按鈕
    this.showOperationBtn = false;
    this.detailData = event;
    // 切換至授權明細頁
    this.pageType = 'detailPage';
    // 設定標題列的上一頁按鈕與事件：回到授權確認頁
    this.layout.setHeaderStatus({
      initbackStack: false,
      backEvent: () => {
        this.pageType = 'confirmedPage';
      }
    });
  }

  /**
   * [子頁回調事件] 授權確認頁完成授權後callback：間接開啟授權結果頁
   * @param event 事件參數
   */
  onAuthFinishCallback(event) {
    console.log('[授權放行頁][callback] onAuthFinishCallback', event);
    this.authOperationData = event;
    this.action = 'auth';
    this.finishAuthorize();
  }

  /**
   * 檢查交易驗證模式
   */
  private checkAuthVerifyMode = () => {
    //啟動快登
    this.verifyQuickMode();
  }

  /**
   * 驗證快登模式
   */
  private verifyQuickMode() {
    this.patternLock.checkQuickLogin((type) => {
      // 快速驗證成功，啟動授權相關操作流程
      this.startAuthorize("", type);
    },
      PatternLockService.order,
      () => {
        // 快速驗證失敗，啟動手動輸入密碼模式
        this.verifyPasswordMode();
      }
    ).then(
      (result) => {
        // 無啟用快速交易驗證(result == false)，啟動手動輸入密碼模式
        if (!result)
          this.verifyPasswordMode();
      }
    );
  }

  /**
   * 驗證使用者輸入密碼模式
   */
  private verifyPasswordMode = () => {
    let userInput;
    // 顯示密碼輸入框
    this.popup.setInput({
      title: 'AGREEDACCOUNT.INPUT_PASSWORD_TITLE', // 請輸入網銀密碼
      placeholder: 'AGREEDACCOUNT.INPUT_PASSWORD_TITLE', // 6-12碼英數字
      default: '',
      checkTxt: 'BTN.CHECK', // 確認
      cancelTxt: 'BTN.CANCEL', // 取消
      inPassword: true,
      event: (value) => {
        userInput = value;
        console.log('[授權放行頁][待授權] verifyPasswordMode userInput =', userInput);
        // 執行交易授權
        this.startAuthorize(userInput, "0");
      }
    });
  }

  /**
   * 開始執行待授權交易取消/退回請求作業
   * @param userInput 使用者輸入之密碼字串
   * @param isQuickVerify 是否為快速交易驗證模式
   */
  private startAuthorize(userInput, authType) {
    console.log('[授權放行頁][待授權] startAuthorize action =', this.action);
    console.log('[授權放行頁][待授權] startAuthorize data length =', this.authOperationData.length);
    // 轉換授權操作動作代碼
    let actCode;
    if (this.action == "cancel")
      actCode = 1;
    // TODO: refund action code
    // 初始化待授權資料計算序號
    this.index = 0;
    // 逐一發送每筆待授權資料之授權請求
    this.doAuthorize(this.index, userInput, authType, actCode);
  }

  /**
   * [遞迴函式] 指定筆待授權交易取消/退回
   * @param index 待授權資料序號
   * @param userInput 使用者輸入之密碼字串
   * @param isQuickVerify 密碼驗證模式
   * @param actCode 授權操作之動作
   */
  private doAuthorize(index, userInput, authType, actCode) {
    // 發送該筆交易授權請求
    this.authorize.doAuthorize(
      this.authOperationData[index]['ChannelId'],
      this.authOperationData[index]['BatchId'],
      parseInt(this.authOperationData[index]['TxnDate']),
      this.authOperationData[index]['AuthLv'],
      actCode, this.authReason, authType, userInput, "").then(
        (res) => {
          console.log('[授權放行頁][待授權][API] doAuthorize data index =', index, 'success', res);
          // 授權成功
          this.authOperationData[index]['authResult'] = true;
          // 快登錯誤次數歸0
          this.storage.set("QuickLoginErrorKey", 0)
          this.index++;
          if (this.index == this.authOperationData.length) {
            console.log('[授權放行頁][待授權] doAuthorize all finished');
            // 授權完成前往授權結果頁
            this.finishAuthorize();
            return;
          }
          // 遞迴執行
          this.doAuthorize(this.index, userInput, authType, actCode);
        },
        (err) => {
          console.log('[授權放行頁][待授權][API] doAuthorize data index =', index, 'success', err);
          // 授權失敗
          this.authOperationData[index]['authResult'] = false;

          this.index++;
          if (this.index == this.authOperationData.length) {
            console.log('[授權放行頁][待授權] doAuthorize all finished');
            // 授權完成前往授權結果頁
            this.finishAuthorize();
            return;
          }
          // 遞迴執行
          this.doAuthorize(this.index, userInput, authType, actCode);
        }
      );
  }

  /**
   * 授權操作完成轉至授權結果頁
   */
  finishAuthorize() {
    console.log('[授權放行頁][待授權] finishAuthorize');
    this.authResultData = this.authOperationData;
    console.log('[授權放行頁][待授權] finishAuthorize authResultData', this.authResultData);
    // 切換至授權結果頁
    this.pageType = 'resultPage';
    // 設定側選單按鈕
    this.layout.setHeaderStatus({
      backEvent: null
    });
  }

  /**
   * [子頁回調事件] 授權結果頁點擊已授權清單按鈕callback：切換開啟已授權頁
   * @param event 事件參數
   */
  onAuthListClickCallBack(event) {
    console.log('[授權放行頁][callback] onAuthListClickCallBack');
    // 開啟授權放行-已授權頁
    this.pageType = 'list';
    // 重新設定標題，移除上一頁事件
    this.layout.setHeaderStatus({
      title: this.title,
      initbackStack: true,
      backEvent: null
    });
    this.isAuth = true;
    this.isMyAuth = true;
    // 重新查詢已授權資料
    this.startAuthData();
  }

  //觸底更新handler
  public pager = 0;      //目前顯示筆數
  public pagerAdd = 20;   //每次增加筆數
  public pagerData; //顯示資料筆數
  public showLoad = false;//顯示下方載入更多
  LoadPage(reset?) {
    if (reset) {
      this.pager = 0;
      this.showLoad = true;

      // 清空待授權勾選紀錄
      this.checkCounter = 0;
      this.checkList = [];

      let txnYear;
      this.loadData.forEach(data => {
        // 清空預計將顯示之數據勾選標記
        if (!this.isAuth)
          data['aFlag'] = false;
        // 設定時間軸年份資訊
        if (txnYear && txnYear == data.nTxnDate.substr(0, 4)) {
          data.dTxnYear = undefined;
        } else {
          txnYear = data.nTxnDate.substr(0, 4);
          data.dTxnYear = txnYear;
        }
      });
    }
    if (this.loadData && this.loadData.length > this.pager + this.pagerAdd) {
      this.pager += this.pagerAdd;
      this.pagerData = this.loadData.slice(0, this.pager);
      this.showLoad = true;
    } else {
      this.pagerData = this.loadData;
      this.showLoad = false;
    }
    console.log('[授權放行頁] LoadPage pagerData', this.pagerData);
  }

  countryArr;
  trnTypeArr;
  txnStatusArr;
  channelIdArr;
  debitCurArr;
  creditCurArr;
  totalRecordArr;
  remittancePurposeArr;
  /**
   * 開啟篩選畫面/初始化
   * @param reset 是否為選項重置
   */
  filterClick(reset?) {
    if (!reset) {
      // 篩選畫面資料初始化
      this.filterBlock = true;
      this.countryArr = [];
      this.trnTypeArr = [];
      this.txnStatusArr = [];
      this.channelIdArr = [];
      this.debitCurArr = [];
      this.creditCurArr = [];
      this.totalRecordArr = [];
      this.remittancePurposeArr = [];
      // 取得篩選項目選項值
      this.distinctData(this.source, "nCustomerCountry").forEach(data => {
        this.countryArr.push({ name: data, value: data });
      });
      this.distinctData(this.source, "nTxnStatus").forEach(data => {
        this.txnStatusArr.push({ name: data, value: data });
      });
      this.distinctData(this.source, "nTxnChannel").forEach(data => {
        this.channelIdArr.push({ name: data, value: data });
      });
      this.distinctData(this.source, "nDebitCurrency").forEach(data => {
        this.debitCurArr.push({ name: data, value: data });
      });
      this.distinctData(this.source, "nCreditCurrency").forEach(data => {
        this.creditCurArr.push({ name: data, value: data });
      });
      this.distinctData(this.source, "nTxnPurpose").forEach(data => {
        this.remittancePurposeArr.push({ name: data, value: data });
      });

      this.totalRecordArr.push({ name: "<5", value: "0-6" });
      this.totalRecordArr.push({ name: "5-20", value: "5-21" });
      this.totalRecordArr.push({ name: "20-50", value: "20-51" });
      this.totalRecordArr.push({ name: "50-100", value: "50-101" });
      this.totalRecordArr.push({ name: ">100", value: "100-" + Number.MAX_SAFE_INTEGER.toString() });

      this.source.map((item) => {
        let data = { "nTxnType": item.nTxnType, "nTxnChannel": item.nTxnChannel };
        return JSON.stringify(data);
      }).filter((item, index, array) => {
        return (item && index === array.indexOf(item))
      })
        .forEach(jsonStr => {
          let data = JSON.parse(jsonStr);
          if(data.nTxnChannel){
            this.trnTypeArr.push({
              name: (data.nTxnChannel + " - " +
                this.langTrans.instant(this.codeTrans.transform(
                  data.nTxnType,
                  data.nTxnChannel == "CSFAX" ? "AUTH_TRNTYPE_CSFAX" : "AUTH_TRNTYPE"))),
              value: data.nTxnChannel + "_" + data.nTxnType
            });
          }
        });
      this.trnTypeArr.sort((a, b) => { return (a.name <= b.name) ? -1 : 1 });
      console.log('[授權放行頁][filter] distinctData col = nTxnType', this.trnTypeArr);
    }


    this.viewCountryData = {
      title: 'AUTH.FILTER_FIELD_COUNTRY',
      default_value: reset ? "" : this.r1['nCustomerCountry'],
      option: this.countryArr
    }

    this.viewTrnTypeData = {
      title: 'AUTH.FILTER_FIELD_TXNTYPE',
      default_value: reset ? "" : this.r2['nTxnType'],
      option: this.trnTypeArr
    }

    this.viewTxnStatusData = {
      title: 'AUTH.FILTER_FIELD_TXNSTATUS',
      default_value: reset ? "" : this.r3['nTxnStatus'],
      option: this.txnStatusArr
    }

    this.viewChannelIdData = {
      title: 'AUTH.FILTER_FIELD_CHANNEL',
      default_value: reset ? "" : this.r4['nTxnChannel'],
      option: this.channelIdArr
    }

    this.viewDebitCurData = {
      title: 'AUTH.FILTER_FIELD_DEBIT_CUR',
      default_value: reset ? "" : this.r5['nDebitCurrency'],
      option: this.debitCurArr
    }

    this.viewCreditCurData = {
      title: 'AUTH.FILTER_FIELD_CREDIT_CUR',
      default_value: reset ? "" : this.r6['nCreditCurrency'],
      option: this.creditCurArr
    }

    this.viewTOTALRECORDData = {
      title: 'AUTH.FILTER_FIELD_RECORDS',
      default_value: reset ? "" : this.r7['nTxnRecords'],
      option: this.totalRecordArr
    }

    this.viewREMITTANCEPURPOSEData = {
      title: 'AUTH.FILTER_FIELD_PURPOSE',
      default_value: reset ? "" : this.r8['nTxnPurpose'],
      option: this.remittancePurposeArr
    }
    this.viewDateData = (reset || !this.viewDateData) ?  {
      default_value: {
        dateType: 'nTxnDate'
      },
      timeOption: [
        { name: 'AUTH.FILTER_HALF_YEAR', select: false, type: '6M' },
        { name: 'AUTH.FILTER_ONE_YEAR', select: false, type: '1Y' },
        { name: 'AUTH.FILTER_TWO_YEAR', select: false, type: '2Y' },
        { name: 'AUTH.FILTER_THREE_YEAR', select: false, type: '3Y' }
      ],
      dateOption: [
        { name: this.langTrans.instant("TRANSACTION.TXNDATE"), value: 'nTxnDate' }
      ],
      type: 'past'
    } : this.viewDateData;

    this.dAmntFrom = (reset || !this.dAmntFrom) ? "" : this.dAmntFrom;
    this.dAmntTo = (reset || !this.dAmntTo) ? "" : this.dAmntTo;
    this.cAmntFrom = (reset || !this.cAmntFrom) ? "" : this.cAmntFrom;
    this.cAmntTo = (reset || !this.cAmntTo) ? "" : this.cAmntTo;

    if (reset)
      this.isFilterReset = true;
  }

  /**
   * 清除篩選器的選取項紀錄
   */
  clearFilterResult() {
    this.r1 = "";
    this.r2 = "";
    this.r3 = "";
    this.r4 = "";
    this.r5 = "";
    this.r6 = "";
    this.r7 = "";
    this.r8 = "";
    this.r9 = "";
    this.dAmntFrom = "";
    this.dAmntTo = "";
    this.cAmntFrom = "";
    this.cAmntTo = "";
    this.nTxnTypeFilter = undefined;
    this.nTxnChannelFilter = undefined;
  }

  public r1 = {};
  result1(filter) {
    console.log('[授權放行頁][filter] r1 =', filter);
    this.r1 = filter;
  }

  public r2 = {};
  public nTxnTypeFilter = {};
  result2(filter) {
    // 交易類型 nTxnType
    console.log('[授權放行頁][filter] r2 =', filter);
    this.r2 = filter;
    // 交易類型 與 來源通路 為連動關係，轉換實際篩選數據
    let values = filter['nTxnType'].split("_");
    this.nTxnTypeFilter = { nTxnType: (values[1] ? values[1] : "") };
    this.nTxnChannelFilter = { nTxnChannel: values[0] };
    console.log('[授權放行頁][filter] nTxnTypeFilter =', this.nTxnTypeFilter, ', nTxnChannelFilter =', this.nTxnChannelFilter);
  }

  public r3 = {};
  result3(filter) {
    console.log('[授權放行頁][filter] r3 =', filter);
    this.r3 = filter;
  }

  public r4 = {};
  public nTxnChannelFilter = {};
  result4(filter) {
    // 已選擇交易類型時，來源通路篩選無效
    if (this.nTxnTypeFilter && this.nTxnTypeFilter['nTxnType'] != "") {
      return;
    }

    console.log('[授權放行頁][filter] r4', filter);
    this.r4 = filter;
    this.nTxnTypeFilter = { nTxnType: "" };
    this.nTxnChannelFilter = filter;
    console.log('[授權放行頁][filter] nTxnTypeFilter =', this.nTxnTypeFilter, ', nTxnChannelFilter =', this.nTxnChannelFilter);
  }

  public r5 = {};
  result5(filter) {
    console.log('[授權放行頁][filter] r5 =', filter);
    this.r5 = filter;
  }

  public r6 = {};
  result6(filter) {
    console.log('[授權放行頁][filter] r6 =', filter);
    this.r6 = filter;
  }

  public r7 = {};
  public nTxnRecordsMax;
  public nTxnRecordsMin;
  result7(filter) {
    // 總筆數 nTxnRecords
    console.log('[授權放行頁][filter] r7 =', filter);
    this.r7 = filter;
  }

  public r8 = {};
  result8(filter) {
    console.log('[授權放行頁][filter] r8 =', filter);
    this.r8 = filter;
  }
  
  public r9 = {};
  result9(filter){
    console.log('[授權放行頁][filter] r9 =', filter);
    this.r9 = filter;
  }

  /**
   * [前端事件綁定] 點擊篩選畫面套用按鈕
   */
  onFilterClick() {

    /**
     * 篩選欄位對應總表
     * 國別     nCustomerCountry
     * 交易類型 nTxnType
     * 交易狀態 nTxnStatus
     * 來源通路 nTxnChannel
     * 扣帳幣別 nDebitCurrency
     * 扣帳金額 nDebitAmount
     * 入帳幣別 nCreditCurrency
     * 入帳金額 nCreditAmount
     * 總筆數   nTxnRecords
     * 匯款性質 nTxnPurpose
     */

    let damtData;
    let camtData;
    if (this.dAmntFrom && this.dAmntTo && this.dAmntFrom != '' && this.dAmntTo != '') {
      let min = parseFloat(this.dAmntFrom) * 10000;
      let max = parseFloat(this.dAmntTo) * 10000;
      if (min != NaN && max != NaN)
        damtData = { nDebitAmount: { 'rangeNum': min.toString() + '-' + max.toString() } }
    }
    if (this.cAmntFrom && this.cAmntTo && this.cAmntFrom != '' && this.cAmntTo != '') {
      let min = parseFloat(this.cAmntFrom) * 10000;
      let max = parseFloat(this.cAmntTo) * 10000;
      if (min != NaN && max != NaN)
        camtData = { nCreditAmount: { 'rangeNum': min.toString() + '-' + max.toString() } }
    }

    let nTxnRecordsFilter;
    if (this.r7 && this.r7['nTxnRecords'] && this.r7['nTxnRecords'] != "") {
      nTxnRecordsFilter = { nTxnRecords: { 'mutliRangeNum': this.r7['nTxnRecords'] } };
    }

    let finalFilter = Object.assign({},
      this.r1, this.nTxnTypeFilter, this.r3, this.nTxnChannelFilter, this.r5, this.r6, nTxnRecordsFilter, this.r8,
      damtData, camtData,this.r9["filter"] ? this.r9["filter"] : {}
    );

    console.log('[授權放行頁][filter] onFilterClick filter', finalFilter);
    this.loadData = this.optionFilter.FilterData(this.source, finalFilter, true, true);
    console.log('[授權放行頁][filter] onFilterClick data', this.loadData);
    this.filterBlock = false;
    this.isFilterReset = false;
    // 篩選完更新搜尋bar要搜尋的資料
    this.searchSource = this.loadData;
    this.Search.source = this.loadData;
    this.Search.Submit();
    //重置待授權下方按鈕
    this.btnShowFlag = false;
    this.LoadPage(true);
    // TODO: reset search
  }

  /**
   * [前端事件綁定] 點擊篩選畫面關閉按鈕
   */
  onFilterCloseClick() {
    this.filterBlock = false;
    if (this.isFilterReset) {
      this.isFilterReset = false;
      this.loadData = this.dataArray;
      this.LoadPage(true);
    }
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
  search_result(filter) {
    console.log('search_result_data >>>>', filter);
    this.loadData = filter;
    this.LoadPage(true);

  }

  /**
   * 提取指定欄位之不重複數據
   * @param source 原始資料
   * @param col 提取欄位名稱
   */
  private distinctData(source, col) {
    let colData = source.map(item => item[col])
      .filter((item, index, array) => {
        return (item && index === array.indexOf(item))
      }).sort();
    console.log('[授權放行頁][filter] distinctData col =', col, colData);
    return colData;
  }
}


