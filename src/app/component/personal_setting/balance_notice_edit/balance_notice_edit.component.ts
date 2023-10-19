import { Component, OnInit, Input, NgZone } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { UserParaModService } from '../../../shared/service/customize/userParaMod.service';
import { ForExRateDetailsInqService } from '../../../shared/service/customize/forExRateDetailsInq.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { KEY_USER_PARA, KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';
import { NotifyListModService } from '../../../shared/service/customize/notifyListMod.service';

@Component({
  selector: 'app-balance-notice-edit',
  templateUrl: './balance_notice_edit.component.html',
  styleUrls: ['./balance_notice_edit.component.css']
})
export class BalanceNoticeEditComponent implements OnInit {

  @Input() editedData: any; // reqData
  @Input() accountInfo: any; // reqData

  private title = "BALANCE_LIMIT.TITLE"; // 頁面標題
  public companyId; // 公司統編
  public userName; // 使用者名稱
  public customerName; //使用者公司名稱
  public showAcctList = false; // 控制是否顯示帳號選單
  public selectedAccountInfo; // 畫面顯示之選取帳號資訊
  public max; // 上限值
  public checkMax; // 勾選啟用上限值設定
  public min; // 下限值
  public checkMin; // 勾選啟用下限值設定
  private maxErrorMessage = ""; //上限值錯誤訊息
  private minErrorMessage = ""; //下限值錯誤訊息

  private idUser; // 使用者識別代碼
  private accounts;
  private account; // 欲設定之帳號

  public currency; // 帳號幣別
  public equivalentCurrency; // 約當幣別
  private equivalentMax; // 約當上限值
  private equivalentMin; // 約當下限值
  public exchangeTable; // 幣別匯率轉換表

  constructor(
    private layout: LayoutService,
    private storage: LocalStorageService,
    private paraMod: UserParaModService,
    private popup: PopupService,
    private zone: NgZone,
    private forExRateDetailsInq: ForExRateDetailsInqService,
    private langTrans: LangTransService,
    private notifyListMod: NotifyListModService
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: this.title
    });
  }

  ngOnInit() {
    console.log('[餘額上下限通知編輯頁][req] editedData', this.editedData);
    console.log('[餘額上下限通知編輯頁][req] accountInfo', this.accountInfo);
    this.initializeData();
  }

  /**
   * 初始化畫面資料
   */
  initializeData() {
    // 使用者資訊
    this.companyId = this.storage.get("loginUserCompany");
    this.userName = this.storage.get("userName");
    this.customerName = this.storage.get("loginUserCustomerName");
    
    this.idUser = this.storage.get("idUser");
    this.equivalentCurrency = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    console.log('[餘額上下限通知編輯頁] initializeData equivalentCurrency =', this.equivalentCurrency);

    // 帳號下拉選單
    if (this.accountInfo == undefined) {
      this.accounts = []
    } else {
      //初始化資料，並且將統編為000000000000000的帳號排在第一個
      this.accounts = [];
      this.accountInfo["UDFList"].forEach(element => {
        if(element["AcctNo"] == "0000000000000000"){
          this.accounts.splice(0,0, element);
        }else{
          this.accounts.push(element);
        }
      });
      
    }
    // 取得選單所有帳號值
    this.popup.setLoading(true);
    // 取得匯率轉換表
    this.getExchangeTable().then(
      (res) => {
        // 通知設定參數
        this.analyzeSettingsData();
        this.popup.setLoading(false);
      },
      (err) => {
        // 通知設定參數
        this.analyzeSettingsData();
        this.popup.setConfirm({
          content: 'BALANCE_LIMIT.ERR_NO_EXRATE_TABLE'
        });
        this.popup.setLoading(false);
      }
    );
  }

  /**
   * 取得匯率轉換數據表
   */
  getExchangeTable() {
    // 取得裝置設定國別地區
    let country = this.storage.get('Area');
    console.log('[餘額上下限通知編輯頁] getExchangeRate country', country);
    // 取得中台匯率數據並組織成匯率轉換表
    return new Promise((resolve, reject) => {
      this.forExRateDetailsInq.getExRateTable(country).then(
        (res) => {
          console.log('[餘額上下限通知編輯頁] getExchangeRate success', res);
          this.exchangeTable = res;
          resolve(true);
        },
        (err) => {
          console.log('[餘額上下限通知編輯頁] getExchangeRate error', err);
          this.exchangeTable = null;
          reject(false);
        }
      );
    });
  }

  /**
   * 解析通知設定參數
   */
  analyzeSettingsData() {
    // 通知設定參數
    if (this.editedData) {
      // 編輯模式
      console.log('[餘額上下限通知編輯頁] initializeData Edit-Mode');
      // 取得原設定之帳號、幣別
      this.account = this.editedData;
      this.currency = this.editedData['AcctCur'];
      // 取得原上限設定
      this.max = this.editedData['MaxAmount'];
      if (this.max && this.max != "") {
        this.checkMax = true;
        this.equivalentMax = this.calculateEquivAmt(this.max);
      }
      // 取得原下限設定
      this.min = this.editedData['MinAmount'];
      if (this.min && this.min != "") {
        this.checkMin = true;
        this.equivalentMin = this.calculateEquivAmt(this.min);
      }
    } else {
      // 新增模式
      console.log('[餘額上下限通知編輯頁] initializeData Add-Mode');
      // 預設選取第一個帳號
      this.account = this.accounts[0];
      // 預設帳號幣別與約當幣別相同
      this.currency = this.equivalentCurrency;
      // 預設勾選啟用上限、下限設定
      this.checkMax = true;
      this.checkMin = true;
    }
    // 更新選取帳號資訊顯示
    this.updateSelectedAccountInfo();
  }

  /**
   * 計算約當幣別金額值
   * @param amt 原始幣別金額
   */
  calculateEquivAmt(amt) {
    // 檢查是否有匯率轉換表數據
    if (!this.exchangeTable || this.currency == this.equivalentCurrency || !amt)
      return null;
    if (!this.exchangeTable[this.equivalentCurrency][this.currency]) {
      return null;
    }
    // 計算約當金額
    console.log('[餘額上下限通知編輯頁] calculateEquivAmt original', amt);
    let equivAmt = amt * this.exchangeTable[this.equivalentCurrency][this.currency];
    console.log('[餘額上下限通知編輯頁] calculateEquivAmt equivalent', equivAmt);
    return equivAmt;
  }

  /**
   * [前端事件綁定] 點擊設定儲存按鈕
   */
  onSaveClick() {
    console.log('[餘額上下限通知編輯頁] onSaveClick');
    console.log('[餘額上下限通知編輯頁] onSaveClick max =', this.max, ', checkMax =', this.checkMax);
    console.log('[餘額上下限通知編輯頁] onSaveClick min =', this.min, ', checkMin =', this.checkMin);

    // 檢查畫面輸入上下限值
    if (!this.checkInput())
      return;

    let paraPairs = [];
    if (this.account == "ALL") {
      // 所有帳號
      this.accounts.forEach(item => {
        // 餘額上限設定
        if (this.checkMax) {
          item["MaxAmount"] = this.max;
        } else {
          item["MaxAmount"] = undefined;
        }
        // 餘額下限設定
        if (this.checkMin) {
          item["MinAmount"] = this.min;
        } else {
          item["MinAmount"] = undefined;
        }
        paraPairs.push(item);
      });
    } else {
      // 指定帳號
      // 餘額上限設定
      if (this.checkMax) {
        this.account["MaxAmount"] = this.max;
      } else {
        this.account["MaxAmount"] = undefined;
      }
      // 餘額下限設定
      if (this.checkMin) {
        this.account["MinAmount"] = this.min;
      } else {
        this.account["MinAmount"] = undefined;
      }
      paraPairs.push(this.account);
    }

    this.popup.setLoading(true);
    var paras = [];
    paraPairs.forEach(element => {
      var para = { ProductId: "MS01", Status: "1", AppId: "MMAS", UDFList: [] }
      var udf = { AcctNo: element.AcctNo, AcctCur: "TWD" }
      if (element["MinAmount"]) {
        udf["MinAmt"] = element["MinAmount"].toString();
      }
      if (element["MaxAmount"]) {
        udf["MaxAmt"] = element["MaxAmount"].toString();
      }
      para.UDFList.push(udf);
      paras.push(para)
    });
    this.notifyListMod.notifyModInq(paras).then((res) => {
      console.log('[餘額上下限通知編輯頁][API] updateUserParas success', res);
      var count = 0
      res["NotifyResultList"].forEach(element => {
        if (element.Result != 4001) {
          count += 1;
        }
      });
      let msg = "";
      if (count == res["NotifyResultList"].length) {
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      } else if (count > 0) {
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      } else {
        msg = this.langTrans.instant('BALANCE_LIMIT.SAVE_SUCCESS');
      }
      this.popup.setConfirm({
        content: msg
      })
      this.popup.setLoading(false);
    }, (err) => {
      this.popup.setLoading(false);
    })
  }

  /**
   * [前端事件綁定] 點擊設定刪除按鈕
   */
  onDeleteClick() {
    console.log('[餘額上下限通知編輯頁] onDeleteClick');
    // 取得上下限設定中台儲存參數識別碼
    let paraPairs = [];
    if (this.account == "ALL") {
      // 所有帳號
      this.accounts.forEach(item => {
        paraPairs.push(item);
      });
    } else {
      paraPairs.push(this.account);
    }
    var paras = [];
    paraPairs.forEach(element => {
      var para = { ProductId: "MS01", Status: "0", AppId: "MMAS", UDFList: [] }
      var udf = { AcctNo: element.AcctNo, AcctCur: "TWD" }
      para.UDFList.push(udf);
      paras.push(para);
    });
    this.popup.setLoading(true);
    this.notifyListMod.notifyModInq(paras).then((res) => {
      console.log('[餘額上下限通知編輯頁][API] deleteUserParas success', res);
      var count = 0
      res["NotifyResultList"].forEach(element => {
        if (element.Result != 4001) {
          count += 1;
        }
      });
      let msg = "";
      if (count == res["NotifyResultList"].length) {
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      } else if (count > 0) {
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      } else {
        msg = this.langTrans.instant('BALANCE_LIMIT.SAVE_SUCCESS');
      }
      this.popup.setConfirm({
        content: msg
      })
      this.popup.setLoading(false);
    }, (err) => {
      console.log('[餘額上下限通知編輯頁][API] deleteUserParas error', err);
      this.popup.setLoading(false);
    })
  }

  /**
   * 檢查上下限輸入值
   */
  checkInput() {
    let result: boolean = true;
    let errMsg = "";

    // 上限值須大於0
    if (this.checkMax && (!this.max || this.max <= 0))
      errMsg += this.langTrans.instant("BALANCE_LIMIT.ERR_INPUT_MAX_NOT_POSITIVE");

    // 下限值須大於0
    if (this.checkMin && (!this.min || this.min <= 0))
      errMsg += this.langTrans.instant("BALANCE_LIMIT.ERR_INPUT_MIN_NOT_POSITIVE");

    // 上限值須大於下限值
    if (this.checkMax && this.checkMin && this.max <= this.min)
      errMsg += this.langTrans.instant("BALANCE_LIMIT.ERR_INPUT_MIN_LARGER_MAX");
    // 上下限必須擇一填寫
    if (!this.checkMax && !this.checkMin) {
      errMsg += this.langTrans.instant("BALANCE_LIMIT.ERR_INPUT_MUST_HAVE_VALUE");
    }
    // 顯示錯誤訊息
    if (errMsg.length > 0) {
      result = false;
      this.popup.setConfirm({
        content: errMsg
      });
    }
    console.log('[餘額上下限通知編輯頁] checkInput', result);
    return result;
  }

  /**
   * 組織中台儲存設定參數識別碼
   * @param type 類型(上限:MAX / 下限:MIN)
   * @param account 帳號
   */
  getKeyParaId(type, account) {
    let key = KEY_USER_PARA.NOTIFICATION_BALANCE_LIMIT + this.idUser + "_" + account + "_" + type;
    console.log('[餘額上下限通知編輯頁] getKeyParaId key =', key);
    return key;
  }

  /**
   * [前端事件綁定] 輸入餘額上限值
   */
  onMaxInput() {
    // 換算約當幣別之上限設定值金額
    this.equivalentMax = this.calculateEquivAmt(this.max);
  }

  /**
   * [前端事件綁定] 輸入餘額下限值
   */
  onMinInput() {
    // 換算約當幣別之下限設定值金額
    this.equivalentMin = this.calculateEquivAmt(this.min);
  }

  /**
   * [前端事件綁定] 開啟帳號選單頁
   */
  onAcctListOpen() {
    this.showAcctList = true;
  }

  /**
   * [前端事件綁定] 關閉帳號選單頁
   */
  onAcctListClose() {
    this.showAcctList = false;
  }

  /**
   * [前端事件綁定] 點擊選取帳號選單項目
   * @param acct 帳號
   */
  onAcctItemClick(acct) {
    console.log('[餘額上下限通知編輯頁] onAcctItemClick', acct);
    if (this.account == acct) {
      // 關閉帳號選單
      this.showAcctList = false;
      return;
    }
    this.account = acct;
    // 更換上下限設定顯示之帳號幣別
    if (this.account['AcctNo'] == "0000000000000000") {
      this.currency = this.equivalentCurrency;
    }
    else {
      this.currency = this.account["AcctCur"];
    }

    this.onMaxInput();
    this.onMinInput();

    // 更新選取帳號資訊顯示
    this.updateSelectedAccountInfo();

    // 關閉帳號選單
    this.showAcctList = false;
    console.log('[餘額上下限通知編輯頁] onAcctItemClick account =', this.account);
    console.log('[餘額上下限通知編輯頁] onAcctItemClick currency =', this.currency);
  }

  /**
   * 更新畫面選取帳號顯示資訊
   */
  updateSelectedAccountInfo() {
    if (this.account == "ALL") {
      this.selectedAccountInfo = this.langTrans.instant("BALANCE_LIMIT.ALL_ACOUNT");
      this.max = "";
      this.min = "";
      this.checkMax = true;
      this.checkMin = true;
    }
    else {
      //統編為0000000000000000的要做特殊處理(統編+所有帳號)
      if(this.account["AcctNo"] == "0000000000000000"){
        this.selectedAccountInfo = this.companyId + "-" +  this.langTrans.instant("BALANCE_LIMIT.ALL_ACOUNT")
      }else{
        this.selectedAccountInfo = this.account["AcctCur"] + "-" + this.account["AcctNo"];
      }
      this.max = this.account["MaxAmount"] ? this.account["MaxAmount"] : "";
      this.min = this.account["MinAmount"] ? this.account["MinAmount"] : "";
      this.equivalentMax = this.calculateEquivAmt(this.max);
      this.equivalentMin = this.calculateEquivAmt(this.max);
      this.checkMax = this.max && this.max != "";
      this.checkMin = this.min && this.min != "";;
    }
  }
}
