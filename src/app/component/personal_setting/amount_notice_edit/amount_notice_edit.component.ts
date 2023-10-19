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
  selector: 'app-amount-notice-edit',
  templateUrl: './amount_notice_edit.component.html',
  styleUrls: ['./amount_notice_edit.component.css']
})
export class AmountNoticeEditComponent implements OnInit {

  @Input() editedData: any; // reqData
  @Input() accountInfo: any; // reqData

  public companyId; // 公司統編
  public userName; // 使用者名稱
  public customerName; //使用者公司名稱
  public showAcctList = false; // 控制是否顯示帳號選單
  public selectedAccountInfo; // 畫面顯示之選取帳號資訊
  public amount; // 額度
  public isAmount = false;
  private PRODUCT_ID;
  private idUser; // 使用者識別代碼
  private accounts;
  private account; // 欲設定之帳號

  public currency; // 帳號幣別
  public equivalentCurrency; // 約當幣別
  private equivalentAmount; // 約當上限值
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


  }

  ngOnInit() {
    console.log('[額度通知編輯頁][req] editedData', this.editedData);
    console.log('[額度通知編輯頁][req] accountInfo', this.accountInfo);
    this.initializeData();
  }

  /**
   * 初始化畫面資料
   */
  initializeData() {
    // 使用者資訊
    this.companyId = this.storage.get("loginUserCompany");
    this.userName = this.storage.get("userName");
    this.idUser = this.storage.get("idUser");
    this.customerName = this.storage.get("loginUserCustomerName");
    this.equivalentCurrency = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    console.log('[額度通知編輯頁] initializeData equivalentCurrency =', this.equivalentCurrency);

    this.PRODUCT_ID = this.accountInfo["key"];
    switch (this.PRODUCT_ID) {
      case "MS02":
      case "MS03":
        this.isAmount = true;
        break;
      case "MS04":
      case "MS05":
        this.isAmount = false;
        break;
    }
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
    this.layout.setHeaderStatus({
      status: true,
      title: "NOTIFICATIONSETTING." + this.PRODUCT_ID + "_Title"
    });
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
    console.log('[額度通知編輯頁] getExchangeRate country', country);
    // 取得中台匯率數據並組織成匯率轉換表
    return new Promise((resolve, reject) => {
      this.forExRateDetailsInq.getExRateTable(country).then(
        (res) => {
          console.log('[額度通知編輯頁] getExchangeRate success', res);
          this.exchangeTable = res;
          resolve(true);
        },
        (err) => {
          console.log('[額度通知編輯頁] getExchangeRate error', err);
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
      console.log('[額度通知編輯頁] initializeData Edit-Mode');
      // 取得原設定之帳號、幣別
      this.account = this.editedData;
      this.currency = this.editedData['AcctCur'];
      // 取得原額度設定
      this.amount = this.editedData['Amount'];
      if (this.amount && this.amount != "") {
        this.amount = true;
        this.equivalentAmount = this.calculateEquivAmt(this.amount);
      }
    } else {
      // 新增模式
      console.log('[額度通知編輯頁] initializeData Add-Mode');
      // 預設選取第一個帳號
      this.account = this.accounts[0];
      // 預設帳號幣別與約當幣別相同
      this.currency = this.equivalentCurrency;
      // 預設勾選啟用上限、下限設定
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
    console.log('[額度通知編輯頁] calculateEquivAmt original', amt);
    let equivAmt = amt * this.exchangeTable[this.equivalentCurrency][this.currency];
    console.log('[額度通知編輯頁] calculateEquivAmt equivalent', equivAmt);
    return equivAmt;
  }

  /**
   * [前端事件綁定] 點擊設定儲存按鈕
   */
  onSaveClick() {
    console.log('[額度通知編輯頁] onSaveClick');
    console.log('[額度通知編輯頁] onSaveClick amount =', this.amount);

    // 檢查畫面輸入上下限值
    if (!this.checkInput())
      return;

    let paraPairs = [];
    if (this.account == "ALL") {
      // 所有帳號
      this.accounts.forEach(item => {
        // 額度設定
        item["Amount"] = this.amount;
        paraPairs.push(item);
      });
    } else {
      // 指定帳號
      this.account["Amount"] = this.amount;
      paraPairs.push(this.account);
    }

    this.popup.setLoading(true);
    var paras = [];
    paraPairs.forEach(element => {
      var para = { ProductId: this.PRODUCT_ID, Status: "1", AppId: "MMAS", UDFList: [] }
      var udf = { AcctNo: element.AcctNo, AcctCur: element.AcctCur }
      if (this.isAmount) {
        udf["Amount"] = element["Amount"].toString();
      }
      para.UDFList.push(udf);
      paras.push(para);
    });
    this.notifyListMod.notifyModInq(paras).then((res) => {
      console.log('[額度通知編輯頁][API] updateUserParas success', res);
      var count = 0
      res["NotifyResultList"].forEach(element => {
        if (element.Result != 4001) {
          count += 1;
        }
      });
      let msg = "";
      if(count == res["NotifyResultList"].length){
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      }else if(count >0){
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      }else{
        msg = this.langTrans.instant('BALANCE_LIMIT.SAVE_SUCCESS');
      }
      this.popup.setConfirm({
        content:msg
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
    console.log('[額度通知編輯頁] onDeleteClick');
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
      var para = { ProductId: this.PRODUCT_ID, Status: "0", AppId: "MMAS", UDFList: [] }
      var udf = { AcctNo: element.AcctNo, AcctCur: element.AcctCur }
      if (this.isAmount) {
        udf["Amount"] = "0";
      }
      para.UDFList.push(udf);
      paras.push(para);
    });
    this.popup.setLoading(true);
    this.notifyListMod.notifyModInq(paras).then((res) => {
      console.log('[額度通知編輯頁][API] deleteUserParas success', res);
      var count = 0
      res["NotifyResultList"].forEach(element => {
        if (element.Result != 4001) {
          count += 1;
        }
      });
      let msg = "";
      if(count == res["NotifyResultList"].length){
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      }else if(count >0){
        msg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
      }else{
        msg = this.langTrans.instant('BALANCE_LIMIT.SAVE_SUCCESS');
      }
      this.popup.setConfirm({
        content:msg
      })
      this.popup.setLoading(false);
    }, (err) => {
      console.log('[額度通知編輯頁][API] deleteUserParas error', err);
      this.popup.setLoading(false);
    })
  }

  /**
   * 檢查上下限輸入值
   */
  checkInput() {
    let result: boolean = true;
    let errMsg = "";
    var amount = this.amount.toString();
    if(!this.isAmount){
      return true;
    }
    if (!amount || amount == "") {
      errMsg = 'AGREEDACCOUNT.AMONT_NUMERIC';
    }
    else if (!amount.toString().match(/^\d+\.{0,1}\d*$/g)) {
      // Amount format
      errMsg = 'AGREEDACCOUNT.AMONT_NUMERIC';
    }
    // 顯示錯誤訊息
    if (errMsg.length > 0) {
      result = false;
      this.popup.setConfirm({
        content: errMsg
      });
    }
    console.log('[額度通知編輯頁] checkInput', result);
    return result;
  }


  /**
   * [前端事件綁定] 輸入餘額上限值
   */
  onAmountInput() {
    // 換算約當幣別之上限設定值金額
    this.equivalentAmount = this.calculateEquivAmt(this.amount);
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
    console.log('[額度通知編輯頁] onAcctItemClick', acct);
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

    this.onAmountInput();

    // 更新選取帳號資訊顯示
    this.updateSelectedAccountInfo();

    // 關閉帳號選單
    this.showAcctList = false;
    console.log('[額度通知編輯頁] onAcctItemClick account =', this.account);
    console.log('[額度通知編輯頁] onAcctItemClick currency =', this.currency);
  }

  /**
   * 更新畫面選取帳號顯示資訊
   */
  updateSelectedAccountInfo() {
    if (this.account == "ALL") {
      this.selectedAccountInfo = this.langTrans.instant("BALANCE_LIMIT.ALL_ACOUNT");
      this.amount = "";
    }
    else {
      //統編為0000000000000000的要做特殊處理(統編+所有帳號)
      if(this.account["AcctNo"] == "0000000000000000"){
        this.selectedAccountInfo = this.companyId + "-" +  this.langTrans.instant("BALANCE_LIMIT.ALL_ACOUNT")
      }else{
        this.selectedAccountInfo = this.account["AcctCur"] + "-" + this.account["AcctNo"];
      }
      this.amount = this.account["Amount"] ? this.account["Amount"] : "";
      this.equivalentAmount = this.calculateEquivAmt(this.amount);
    }
  }
}
