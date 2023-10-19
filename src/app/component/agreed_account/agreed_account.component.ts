import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { FundXferAddService } from '../../shared/service/customize/fundXferAdd.service';
import { PayeeAcctInqService } from '../../shared/service/customize/payeeAcctInq.service';
import { GetRelAcctInqService } from '../../shared/service/customize/getRelAcctInq.service';
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { Base64Service } from '../../shared/service/global/base64.service';
import { DateTimeService } from '../../shared/service/global/daettime.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { HiBiometricAuthService } from '../../shared/service/cordova/HiBiometricAuth.service';
import { DoLoginService } from '../../shared/service/customize/doLogin.service';
import { PatternLockService } from '../../shared/service/global/patternLock.service';
import { Router } from '@angular/router';
import { HexadecimalService } from '../../shared/service/global/hexadecimal.service';

declare var Swiper: any;
declare var window;
@Component({
  templateUrl: './agreed_account.component.html',
  styleUrls: ['./agreed_account.component.css']
})
export class AgreedAccountComponent implements OnInit {

  public static TempViewObject;
  // Parameter
  public Amount;
  public AmountCur = '';
  public relAcctCustomerIdName = "";
  public payeeAcctCustomerIdName = "";
  public Memo = "";
  public TxnAlias = ""
  public NowStatus = 0;
  public SelectStatus = 0;
  public PeriodType = "";
  public PeriodValue = "";
  public TxnType = "1";
  public DateFrom = new Date();
  public DateTo = new Date();
  public DateTrans = new Date();
  public TransDate = "";
  public TransCount = 1;
  public Fee = "";
  public NowCurCode = "";
  public BatchId;

  // PayeeAcct
  public PayeeAcctList;           //原資料
  public PayeeAcctSelectList;     //篩選過--用於呈現的資料
  public PayeeAcctSelected = 0;
  private PayeeAcctloaded = false;
  // RelAcct
  public UserName = "(" + this.langTransService.instant('countryCode.' + this.storage.get('loginUserCountry')) + ")" + this.storage.get('CompanyID');
  public RelAcctList           //原資料
  public RelAcctSelectList;    //篩選過--用於呈現的資料
  public RelAcctSelected = 0;
  private RelAcctloaded = false;
  // FundXferAdd
  public ReqObject;
  public ViewObject;
  public DataResult;

  //errMsg
  public errMsg1 = false;
  public errMsg2 = false;
  public errMsg3 = false;
  public errMsg4 = false;
  public errorMsg1 = "";
  public errorMsg2 = "";
  public errorMsg3 = "";
  public errorMsg4 = "";

  public patternFlag = false;
  private isSaveTemp = true;
  private isAllowQuick = true;
  quickLoginError = 0;
  private selectedClass = "pop-li-default";

  constructor(
    private zone: NgZone,
    private layout: LayoutService,
    private payeeAcct: PayeeAcctInqService,
    private relAcct: GetRelAcctInqService,
    private fundXferAdd: FundXferAddService,
    private idGate: IDGateService,
    private base64: Base64Service,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private popup: PopupService,
    private route: ActivatedRoute,
    private patternLockService: PatternLockService,
    public doLogin: DoLoginService,
    private langTransService: LangTransService,
    public hiBiometricAuth: HiBiometricAuthService,
    public router: Router,
    private hex: HexadecimalService
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: 'AGREEDACCOUNT.TITLE'
    });
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.NowStatus = 0;
      //初始化
      this.RelAcctSelected = 0;
      this.PayeeAcctSelected = 0;
      this.Amount = undefined;
      this.Memo = "";
      this.TxnAlias = "";
      this.NowCurCode = "";
      this.TransDate = "";
      //日期選擇初始化
      this.popup.setTransQuery({ clear: true });
      this.popup.setLoading(true);
      this.getRelAcct();
      setTimeout(() => {
        this.getPayeeAcct();
      }, 100);

      /**
     * 如果有未完成資料則填回
     */

      if (this.storage.get("agreeUnfinishData") && AgreedAccountComponent.TempViewObject) {
        var temp = AgreedAccountComponent.TempViewObject;
        this.Amount = temp.Amount;
        this.RelAcctSelected = temp.RelAcctSelected;
        this.PayeeAcctSelected = temp.PayeeAcctSelected;
        this.DateFrom = temp.DateFrom;
        this.DateTo = temp.DateTo;
        this.Memo = temp.Memo;
        this.PeriodType = temp.PeriodType;
        this.PeriodValue = temp.PeriodValue;
        this.TransDate = temp.TxnDate;
        this.TxnType = temp.TxnType;
        this.TxnAlias = temp.TxnAlias

      }
      //若沒有選擇日期則顯示當日日期
      if (this.TransDate == "") {
        this.TransDate = this.TransDate = this.dateTime.datetimeFormat(this.DateFrom.getTime(), 'yyyy/MM/dd');
      }
    })


  }

  ngAfterViewInit() {

  }

  /**
   * Get rel accounts
   */
  private getRelAcct() {
    // Success callback event
    this.RelAcctloaded = false;
    const success = (res) => {
      this.RelAcctList = [];
      // this.UserName = undefined;
      var CompanyId = this.storage.get("loginUserCompany");
      res["AcctList"].forEach(element => {
        if (CompanyId == element["CustomerId"]) {
          this.UserName = "(" + this.langTransService.instant('countryCode.' + this.storage.get('loginUserCountry')) + ")" +
            element["CustomerId"] + element["CustomerName"];
        } else {
          // 扣帳帳戶選單過濾非登入公司所屬帳號
          return;
        }
        element["CurCodeList"].forEach(element_sub => {
          var item = {
            "Country": element["Country"]
            , "CustomerId": element["CustomerId"]
            , "CustomerName": element["CustomerName"]
            , "AcctNo": element["AcctNo"]
            , "OBUDBU": element["OBUDBU"]
            , "AcctType": element["AcctType"]
            , "BankCode": element["BankCode"]
            , "BankCodeType": element["BankCodeType"]
            , "CurCode": element_sub["CurCode"]
            , "CurrentBal": element_sub["CurrentBal"]
            , "AvailableBal": element_sub["AvailableBal"]
          }
          if (!item["BankCode"].startsWith("822")) {
            return;
          }
          this.RelAcctList.push(item);
        });
      });
      
      this.RelAcctSelectList = this.RelAcctList;
      this.RelAcctloaded = true;
      this.checkPayeeRelAcctLoaded();
    };

    // Error callback event
    const error = (err) => {
      this.RelAcctloaded = true;
      this.checkPayeeRelAcctLoaded();
    };

    // Get rel accounts
    this.relAcct.getRelAcctInq().then(success, error);
  }

  /**
   * Get payee accounts
   */
  private getPayeeAcct() {
    // Success callback event
    const success_ = (res) => {
      this.PayeeAcctList = [];
      res["PayeeAcctList"].forEach(element => {
        element["CurCodeList"].forEach(element_sub => {
          var item = {
            "Country": element["Country"],
            "CustomerId": element["CustomerId"],
            "CustomerType": element["CustomerType"],
            "AcctNo": element["AcctNo"],
            "AcctName": element["AcctName"],
            "OBUDBU": element["OBUDBU"],
            "FunctionList": element["FunctionList"],
            "BankCode": element["BankCode"],
            "BankName": element["BankName"],
            "BankCodeType": element["BankCodeType"],
            "CurCode": (typeof element_sub == "string") ? element_sub : element_sub["CurCode"],
            "MaxAmt": element["MaxAmt"],
            "ChargeType": element["ChargeType"]
          }
          if (!item["BankCode"].startsWith("822")) {
            if (element_sub["CurCode"] != "TWD") {
              return;
            }
            if (item["MaxAmt"] == "" || +item["MaxAmt"] > 2000000) {
              item["MaxAmt"] = 2000000;
            }
          }
          this.PayeeAcctList.push(item);
        });
      });
      this.PayeeAcctSelectList = this.PayeeAcctList;
      this.PayeeAcctloaded = true;
      this.checkPayeeRelAcctLoaded();
    };

    // Error callback event
    const error_ = (err) => {
      console.log(err);
      this.PayeeAcctloaded = true;
      this.checkPayeeRelAcctLoaded();
    };

    // Get payee accounts
    this.payeeAcct.payeeAcctInq().then(success_, error_);
  }

  checkPayeeRelAcctLoaded() {
    if (this.RelAcctloaded && this.PayeeAcctloaded) {
      setTimeout(() => {
        this.popup.setLoading(false);

        // 扣款帳號過濾完後，無可交易帳號時顯示提示訊息
        if (this.RelAcctSelectList && this.RelAcctSelectList.length == 0) {
          this.popup.setConfirm({
            content: this.langTransService.instant('AGREEDACCOUNT.REL_ACCT_ERROR')
          });
        }
      }, 500);
    }
  }
  /**
   * 進行約定轉帳
   */
  private doFundXferAdd(password, type) {
    this.popup.setLoading(true);
    // Init result object
    this.DataResult = {};

    // Success callback event
    const success = (res) => {
      // DEBUG
      console.log(JSON.stringify(res));

      //將交易序號帶到finish頁面
      this.BatchId = res.BatchId;
      // 
      if (res["Result"] == 4001) {
        this.DataResult["result"] = 0
        this.DataResult["message"] = "AGREEDACCOUNT.TRANS_SUCCESS"
        this.DataResult["messageDetail"] = "";
        // 快登錯誤次數歸0
        this.storage.set("QuickLoginErrorKey", 0)
        //交易成功 清除暫存
        this.storage.set("agreeUnfinishData", "")
      } else {
        this.DataResult["result"] = res["Result"]
        this.DataResult["message"] = "AGREEDACCOUNT.TRANS_FAILED";
        this.DataResult["messageDetail"] = "ERROR.ERROR_" + res["Result"];
      }
      this.NowStatus = 2;
      this.isSaveTemp = false;
      setTimeout(() => {
        this.popup.setLoading(false);
      }, 500);
    };

    // Error callback event
    const error = (err) => {
      // DEBUG
      console.log(JSON.stringify(err));
      this.DataResult["result"] = err["HeaderRs"]["Result"]
      this.DataResult["message"] = "AGREEDACCOUNT.TRANS_FAILED";
      this.DataResult["messageDetail"] = "ERROR.ERROR_" + err["HeaderRs"]["Result"];
      this.NowStatus = 2;
      this.isSaveTemp = false;
      setTimeout(() => {
        this.popup.setLoading(false);
      }, 500);
    };
    this.setReqObject(() => {
      this.zone.run(() => {
        this.fundXferAdd.fundXferAdd(this.ReqObject, password, type).then(success, error);
      })

    });

  }

  /**
   * Verify input fields
   */
  private verifyInputFields() {
    // Date
    if (this.DateFrom == undefined || this.DateTo == undefined) {
      this.errorMsg1 = this.langTransService.instant('AGREEDACCOUNT.DATE_EMPTY');
    } else {
      this.errorMsg1 = "";
    }

    if(this.TransCount == 0){
      this.errorMsg1 = this.langTransService.instant('AGREEDACCOUNT.ZERO_DEBIT_ERROR');
    }

    // Rel account
    if (this.RelAcctSelected == 0) {
      this.errorMsg2 = this.langTransService.instant('AGREEDACCOUNT.REL_ACCT_EMPTY');
    } else {
      this.errorMsg2 = "";
    }

    // Payee account
    if (this.PayeeAcctSelected == 0) {
      this.errorMsg4 = this.langTransService.instant('AGREEDACCOUNT.PAYEE_ACCT_EMPTY');
    } else {
      this.errorMsg4 = "";
    }

    // Amount
    // Amount empty
    if (this.Amount) {
      this.Amount = this.Amount.toString();
    }
    this.errorMsg3 = "";
    var max = this.PayeeAcctSelected["MaxAmt"];
    if (this.Amount == undefined || this.Amount.length == 0) {
      this.errorMsg3 = this.langTransService.instant('AGREEDACCOUNT.AMOUNT_EMPTY');
    }
    else if (!this.Amount.match(/^\d+\.{0,1}\d*$/g)) {
      // Amount format
      this.errorMsg3 = this.langTransService.instant('AGREEDACCOUNT.AMONT_NUMERIC');
    }
    else if (max != "" && +max < +this.Amount) {
      // Amount limit
      this.errorMsg3 = this.langTransService.instant('AGREEDACCOUNT.AMOUNT_OUT_OF_LIMIT');
    }
    else if (+this.Amount <= 0) {
      // Amount min
      this.errorMsg3 = this.langTransService.instant('AGREEDACCOUNT.AMOUNT_LESS_THEN_ZERO');
    }
    //this.Amount = +this.Amount.toString();

    // Input filed valid
    if (this.errorMsg1 == "" && this.errorMsg2 == "" && this.errorMsg3 == "" && this.errorMsg4 == "") {
      return true;
    }
    return false;
  }

  /**
   * Fill string with space
   * @param value String
   * @param length Target string length 
   */
  private fixSpace(value, length) {
    var size = length - value.length;
    if (size < 0) {
      return value.substring(0, length);
    }
    for (var i = 0; i < size; i++) {
      value = value + "";
    }
    return value;
  }

  /**
   * Fill string with zero
   * @param value String
   * @param length Target string length
   */
  private fixZero(value, length) {
    var size = length - value.length;
    if (size < 0) {
      return value.substring(0, length);
    }
    for (var i = 0; i < size; i++) {
      value = "0" + value;
    }
    return value.toString();
  }

  /**
   * On next button clicked
   */
  public onNextClick() {
    // Check input fields
    if (!this.verifyInputFields()) {
      return;
    }
    //先將手續費設為18
    this.Fee = this.langTransService.instant("AGREEDACCOUNT.DOLLOR").replace("[#DOLLOR]", "18");
    // 驗證選擇帳戶是否為自行若為自行則免手續費
    if (this.RelAcctSelected['BankCodeType'] == 1) {
      if (this.RelAcctSelected['BankCode'].slice(0, 3) == 822) {
        this.Fee = this.langTransService.instant("AGREEDACCOUNT.DOLLOR").replace("[#DOLLOR]", "0");
      }
    }
    //將附言轉換為全形
    this.Memo = this.Memo.toString();
    let temp = "";
    for (let i = 0; i < this.Memo.length; i++) {
      let charCode = this.Memo.charCodeAt(i)
      if (charCode <= 126 && charCode >= 33) {
        charCode += 65248;
      } else if (charCode == 32) { // 半形空白轉全形
        charCode = 12288;
      }
      temp += String.fromCharCode(charCode);
    }
    this.Memo = temp

    var first = "";
    var last = "";
    if(this.TxnType == "2"){
      var periodValue = +this.PeriodValue;
      var day = new Date(this.DateFrom.getFullYear(),this.DateFrom.getMonth(),this.DateFrom.getDate(),0,0,0,0);
      var lastDay = new Date(this.DateTo.getFullYear(),this.DateTo.getMonth(),this.DateTo.getDate(),0,0,0,0);
      if(this.PeriodType == "M"){
        if(this.DateFrom.getDate() > periodValue){
          day.setDate(1);
          day.setMonth(day.getMonth()+1);
          var maxDay = new Date(day.getFullYear(),day.getMonth()+1,0).getDate();
          if(maxDay < periodValue){
            day.setMonth(day.getMonth()+1);
          }else{
            day.setDate(periodValue);
          }
        }else if(this.DateFrom.getDate() < periodValue){
          var maxDay = new Date(day.getFullYear(),day.getMonth()+1,0).getDate();
          if(maxDay < periodValue){
            day.setDate(1);
            day.setMonth(day.getMonth()+1);
          }else{
            day.setDate(periodValue);
          }
        }

       
        if(this.DateTo.getDate() > periodValue){
          lastDay.setDate(periodValue);
        }else if(this.DateTo.getDate() < periodValue){
          lastDay.setDate(1);
          lastDay.setMonth(lastDay.getMonth() - 1);
          var maxDay = new Date(lastDay.getFullYear(),lastDay.getMonth()+1,0).getDate();
          if(maxDay < periodValue){
            lastDay.setMonth(lastDay.getMonth()+1);
          }else{
            lastDay.setDate(periodValue);
          }
        }

      }else{
        if(this.DateFrom.getDay() > periodValue){
          day.setDate(day.getDate() + 7 - this.DateFrom.getDay() + periodValue);
        }else if(this.DateFrom.getDay() < periodValue){
          day.setDate(day.getDate() - this.DateFrom.getDay() + periodValue);
        }
        if(this.DateTo.getDay() > periodValue){
          lastDay.setDate(lastDay.getDate() - this.DateTo.getDay() + periodValue);
        }else if(this.DateTo.getDay() < periodValue){
          lastDay.setDate(lastDay.getDate() - 7 - this.DateTo.getDay() + periodValue);
        }
      }
      first = this.dateTime.datetimeFormat(day.getTime(), 'yyyy/MM/dd')
      last = this.dateTime.datetimeFormat(lastDay.getTime(), 'yyyy/MM/dd')
    }


    // View object
    this.ViewObject = {
      Amount: this.Amount.toString(),
      PayerAcctNo: this.RelAcctSelected["AcctNo"],
      PayeeAcctNo: this.PayeeAcctSelected["AcctNo"],
      BankId: this.fixSpace(this.PayeeAcctSelected["BankCode"], 3),
      DebitCur: this.fixSpace(this.RelAcctSelected["CurCode"], 3),
      CreditCur: this.fixSpace(this.PayeeAcctSelected["CurCode"], 3),
      DateFrom: this.dateTime.datetimeFormat(this.DateFrom.getTime(), 'yyyy/MM/dd'),
      DateTo: this.dateTime.datetimeFormat(this.DateTo.getTime(), 'yyyy/MM/dd'),
      First:first,
      Last:last,
      Memo: this.Memo,
      PeriodType: this.PeriodType,
      PeriodValue: this.PeriodValue.toString(),
      TxnDate: this.TransDate,
      TxnType: this.TxnType,
      TxnAlias: this.TxnAlias,
    };

    this.NowStatus = 1;
  }

  onPreviousClick() {

  }

  setReqObject(success) {
    this.ReqObject = {
      Amount: "",
      PayerAcctNo: "",
      PayeeAcctNo: "",
      BankId: "",
      DebitCur: "",
      CreditCur: "",
      DateFrom: "",
      DateTo: "",
      Memo: "",
      PeriodType: "",
      PeriodValue: "",
      TxnType: "",
      TxnAlias: "",
      TxnDate: "",
      Signature: ""
    };

    this.ReqObject.Amount = this.fixZero(this.Amount.toString(), 15)
    this.ReqObject.PayerAcctNo = this.fixSpace(this.RelAcctSelected["AcctNo"], 16)
    this.ReqObject.PayeeAcctNo = this.fixSpace(this.PayeeAcctSelected["AcctNo"], 16)
    this.ReqObject.BankId = this.fixSpace(this.PayeeAcctSelected["BankCode"], 3)
    this.ReqObject.DebitCur = this.fixSpace(this.RelAcctSelected["CurCode"], 3)
    this.ReqObject.CreditCur = this.fixSpace(this.PayeeAcctSelected["CurCode"], 3)
    this.ReqObject.DateFrom = this.dateTime.datetimeFormat(this.DateFrom.getTime(), 'yyyyMMdd')
    this.ReqObject.DateTo = this.dateTime.datetimeFormat(this.DateTo.getTime(), 'yyyyMMdd')
    this.ReqObject.Memo = this.fixSpace(this.Memo, 7)
    this.ReqObject.PeriodType = this.fixSpace(this.PeriodType, 1)
    this.ReqObject.PeriodValue = this.PeriodType ? this.fixZero(this.PeriodValue.toString(), 2) : "";
    this.ReqObject.TxnType = this.TxnType == "1" ? "SDT" : "PDT";//this.fixSpace(this.TxnType, 1)
    this.ReqObject.TxnAlias = this.fixSpace(this.TxnAlias, 36)
    this.ReqObject.TxnDate = this.dateTime.datetimeFormat(this.DateFrom.getTime(), 'yyyyMMdd')

    var Signature = this.mergeReqString();
    this.idGate.genSignatureOTP(Signature).then((res) => {
      console.log("[Signature] SignatureOTP =", res);
      this.ReqObject.Signature = res.toString();
      success();
    }, (err) => {
      console.log("[Signature] generate SignatureOTP error", err);
    })
    // Update status
  }

  mergeReqString() {
    var result = this.ReqObject.PayerAcctNo.trim();
    result += "|" + this.ReqObject.PayeeAcctNo.trim();
    result += "|" + this.ReqObject.DebitCur.trim();
    result += "|" + this.ReqObject.CreditCur.trim();
    result += "|" + this.ReqObject.Amount.trim();
    result += "|" + this.ReqObject.BankId.trim();
    result += "|" + this.ReqObject.TxnType.trim();
    if (this.ReqObject.TxnType == "SDT") {
      result += "|" + this.ReqObject.TxnDate.trim();
    } else if (this.ReqObject.TxnType == "PDT") {
      result += "|" + this.ReqObject.PeriodType.trim();
      result += "|" + this.ReqObject.PeriodValue.trim();
      result += "|" + this.ReqObject.DateFrom.trim();
      result += "|" + this.ReqObject.DateTo.trim();
    }
    result += "|" + this.ReqObject.TxnAlias.trim();
    console.log("[Signature] original-string =", result);
    let hexStr = this.hex.utf8ToHex(result).toUpperCase();
    console.log("[Signature] hex-string =", hexStr);
    return hexStr;
  }


  /**
   * On confirm button click
   * @param event Click event
   */
  onConfirmClick(event) {
    if (event == 2) {
      this.patternLockService.checkQuickLogin((type) => {
        this.quickOrder(type);
      }, PatternLockService.order, () => {
        //快登失敗
        this.setInput();
      }).then((res) => {
        //若有快登則結束鍵盤
        if (!res) {
          this.setInput();
        }
      })


    } else {
      this.NowStatus = event;
      if(event == 0){
        this.isSaveTemp = true;
      }
    }
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
        this.doFundXferAdd(value, "0");
      }
    });
  }

  openRelAcctSelect() {
    this.SelectStatus = 88
  }
  openPayeeAcctSelect() {
    this.SelectStatus = 99
  }
  private selectedNoChange = false;
  /**
   * 當匯款帳號更變時
   */
  onRelAcctChange(item) {
    console.log("onRelAcctChange")
    this.RelAcctSelected = item;
    this.errorMsg2 = '';
    this.CloseSelect();
    if (this.RelAcctSelected == 0) {
      this.RelAcctListFilter();
      this.PayeeAcctListFilter();
      this.PayeeAcctSelected = 0
      this.NowCurCode = "";
      return;
    }
    if (this.NowCurCode == this.RelAcctSelected["CurCode"]) {
      return;
    }
    this.NowCurCode = this.RelAcctSelected["CurCode"]
    this.PayeeAcctListFilter(this.RelAcctSelected["CurCode"], this.RelAcctSelected["OBUDBU"]);

  }
  /**
    * 收款帳號更變時
    */
  onPayeeAcctChange(item) {
    this.PayeeAcctSelected = item;
    console.log("onPayeeAcctChange")
    this.CloseSelect();
    this.errorMsg4 = '';
    if (this.PayeeAcctSelected == 0) {
      this.RelAcctListFilter();
      this.PayeeAcctListFilter();
      this.RelAcctSelected = 0
      this.NowCurCode = "";
      return;
    }
    if (this.NowCurCode == this.PayeeAcctSelected["CurCode"]) {
      return;
    }
    this.NowCurCode = this.PayeeAcctSelected["CurCode"]
    this.RelAcctListFilter(this.PayeeAcctSelected["CurCode"], this.PayeeAcctSelected["OBUDBU"]);

  }

  getRelAcctSelectValue() {
    if (this.RelAcctSelected == 0) {
      return this.langTransService.instant("AGREEDACCOUNT.REL_ACCT_HINT");
    } else {
      this.AmountCur = this.RelAcctSelected['CurCode'];
      this.relAcctCustomerIdName = this.RelAcctSelected['CustomerId'] + " " +  this.RelAcctSelected['CustomerName'];
      this.errorMsg2 = "";
      return this.RelAcctSelected["CurCode"] + "-" + this.RelAcctSelected["AcctNo"] + " " + this.RelAcctSelected["CustomerName"];
    }
  }

  getPayeeAcctSelectValue() {
    if (this.PayeeAcctSelected == 0) {
      return this.langTransService.instant("AGREEDACCOUNT.PAYEE_ACCT_HINT");
    } else {
      this.AmountCur = this.PayeeAcctSelected['CurCode'];
      this.payeeAcctCustomerIdName = this.PayeeAcctSelected['CustomerId'] + " " + this.PayeeAcctSelected['AcctName'];
      this.errorMsg4 = "";
      return this.PayeeAcctSelected["CurCode"] + "-" + this.PayeeAcctSelected["AcctNo"] + " " + this.PayeeAcctSelected["BankName"];
    }
  }
  /**
   * 匯款帳號篩選
   * @param code 幣別
   */
  RelAcctListFilter(code?: String, obudbu?) {
    if (code == null || code == undefined && obudbu == null || obudbu == undefined) {
      this.RelAcctSelectList = this.RelAcctList;
      return;
    }
    this.RelAcctSelectList = [];
    this.RelAcctSelected = 0;
    this.RelAcctList.forEach(element => {
      if (element["CurCode"] == code && element["OBUDBU"] == obudbu) {
        this.RelAcctSelectList.push(element);
      }
    });
    if (this.RelAcctSelectList.length == 0) {
      this.popup.setConfirm({
        content: this.langTransService.instant('AGREEDACCOUNT.REL_ACCT_ERROR')
      })
    }
  }
  /**
  * 收款帳號篩選
  * @param code 幣別
  */
  PayeeAcctListFilter(code?: String, obudbu?) {
    if (code == null || code == undefined && obudbu == null || obudbu == undefined) {
      this.PayeeAcctSelectList = this.PayeeAcctList;
      return;
    }
    this.PayeeAcctSelectList = [];
    this.PayeeAcctSelected = 0;
    this.PayeeAcctList.forEach(element => {
      if (element["CurCode"] == code && element["OBUDBU"] == obudbu) {
        this.PayeeAcctSelectList.push(element);
      }
    });
    if (this.PayeeAcctSelectList.length == 0) {
      this.popup.setConfirm({
        content: this.langTransService.instant('AGREEDACCOUNT.PAYEE_ACCT_ERROR')
      })
	  //若沒資料亦不顯示入帳帳號
      this.payeeAcctCustomerIdName = "";
    }
  }

  CloseSelect() {
    this.SelectStatus = 0;
  }



  /**
   * On date picker click
   */
  onDatePickerButtonClick() {
    this.popup.setTransQuery({
      status: true,
      defaultDateFrom: this.DateFrom,
      defaultDateTo: this.DateTo,
      event: (selectedValue) => {
        // Check selected value
        if (selectedValue == null) {
          return;
        }

        // Check selected date
        if (selectedValue.DateFrom != null && selectedValue.DateTo != null) {
          this.TxnType = selectedValue.TxnType;
          this.PeriodType = selectedValue.PeriodType;
          this.PeriodValue = selectedValue.PeriodValue;
          this.DateFrom = selectedValue.DateFrom;
          this.DateTo = selectedValue.DateTo;
          if (this.TxnType == '1') {
            // Single
            this.TransDate = this.dateTime.datetimeFormat(selectedValue.DateFrom.getTime(), 'yyyy/MM/dd');
            this.PeriodType = "";
            this.PeriodValue = "";
          }
          else if (this.TxnType == '2') {
            // Cycle
            if (this.PeriodType == 'M') {
              // Monthly
              var counter = 0;
              var isChecked = false;
              var dateCounter = new Date(this.DateFrom.getFullYear(), this.DateFrom.getMonth(), 1);
              while (dateCounter <= this.DateTo) {
                if (dateCounter.getFullYear() == this.DateFrom.getFullYear() &&
                  dateCounter.getMonth() == this.DateFrom.getMonth() &&
                  this.DateFrom.getDate() > parseInt(this.PeriodValue)) {
                  dateCounter = new Date(dateCounter.setMonth(dateCounter.getMonth() + 1));
                  continue;
                }
                else if (dateCounter.getFullYear() == this.DateTo.getFullYear() &&
                  dateCounter.getMonth() == this.DateTo.getMonth() &&
                  this.DateTo.getDate() < parseInt(this.PeriodValue)) {
                  dateCounter = new Date(dateCounter.setMonth(dateCounter.getMonth() + 1));
                  continue;
                }
                else {
                  counter = counter + 1;
                }
                dateCounter = new Date(dateCounter.setMonth(dateCounter.getMonth() + 1));
              }
              this.TransDate = this.langTransService
                .instant("AGREEDACCOUNT.MONTHLY_AMOUNT")
                .replace("[#DATE]", this.PeriodValue)
                .replace("[#COUNT]", counter.toString());
            }
            else if (this.PeriodType == 'W') {
              // Weekly
              var counter = 0;
              var isChecked = false;
              var dateCounter = new Date(this.DateFrom.getFullYear(), this.DateFrom.getMonth(), this.DateFrom.getDate());
              const suffixDate = parseInt(this.PeriodValue) < dateCounter.getDay() ? 7 + parseInt(this.PeriodValue) - dateCounter.getDay() : parseInt(this.PeriodValue) - dateCounter.getDay();
              dateCounter = new Date(dateCounter.setDate(dateCounter.getDate() + suffixDate));
              while (dateCounter <= this.DateTo) {
                if (dateCounter.getFullYear() == this.DateTo.getFullYear() &&
                  dateCounter.getMonth() == this.DateTo.getMonth() &&
                  dateCounter.getDate() > this.DateTo.getDate()) {
                  continue;
                } else {
                  counter = counter + 1;
                }
                dateCounter = new Date(dateCounter.setDate(dateCounter.getDate() + 7));
              }

              // Get week string
              var week;
              switch (parseInt(this.PeriodValue)) {
                case 0:
                  week = this.langTransService.instant("AGREEDACCOUNT.SUNDAY");
                  break;
                case 1:
                  week = this.langTransService.instant("AGREEDACCOUNT.MONDAY");
                  break;
                case 2:
                  week = this.langTransService.instant("AGREEDACCOUNT.TUESDAY");
                  break;
                case 3:
                  week = this.langTransService.instant("AGREEDACCOUNT.WEDNESDAY");
                  break;
                case 4:
                  week = this.langTransService.instant("AGREEDACCOUNT.THURSDAY");
                  break;
                case 5:
                  week = this.langTransService.instant("AGREEDACCOUNT.FRIDAY");
                  break;
                case 6:
                  week = this.langTransService.instant("AGREEDACCOUNT.SATURDAY");
                  break;
              }
              this.TransDate = this.langTransService
                .instant("AGREEDACCOUNT.WEEKLY_AMOUNT")
                .replace("[#WEEK]", week)
                .replace("[#COUNT]", counter.toString());
            }
          }
        }

        // Check selected memo
        if (selectedValue.Memo != null && selectedValue.Memo.length > 0) {
          this.TxnAlias = selectedValue.Memo;
        }
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
        this.doFundXferAdd(res, type);
      }
      , (err) => {
        this.popup.setConfirm({
          content: "BTN.ERROR", // 快登失敗
          event: () => { }
        });
      }
    )

  }

  hiddenPatterClick() {
    this.isAllowQuick = false;
    this.hiddenPatter();
  }

  hiddenPatter() {
    this.quickLoginError = 0;
    this.popup.setPatternLock({ reset: true, Isopen: false });
  }



  ngOnDestroy() {
    /**
     * 保留未完成資料
     */
    if(!this.isSaveTemp){
      AgreedAccountComponent.TempViewObject = undefined;
      return;
    }
    AgreedAccountComponent.TempViewObject = {
      Amount: this.Amount,
      RelAcctSelected: this.RelAcctSelected,
      PayeeAcctSelected: this.PayeeAcctSelected,
      DateFrom: this.DateFrom,
      DateTo: this.DateTo,
      Memo: this.Memo,
      PeriodType: this.PeriodType,
      PeriodValue: this.PeriodValue,
      TxnDate: this.TransDate,
      TxnType: this.TxnType,
      TxnAlias: this.TxnAlias,
    };
    this.storage.set("agreeUnfinishData", "true");
  }
}
