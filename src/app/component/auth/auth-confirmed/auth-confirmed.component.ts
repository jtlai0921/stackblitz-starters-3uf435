import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { DoAuthorizeService } from '../../../shared/service/customize/doAuthorize.service';
import { ForExRateDetailsInqService } from '../../../shared/service/customize/forExRateDetailsInq.service';
import { HiBiometricAuthService } from '../../../shared/service/cordova/HiBiometricAuth.service';
import { KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';
import { QUICK_LOGIN_CONFIGURATIONS, QUICK_LOGIN_STORAGE_KEY } from '../../../../assets/configuration/quickLoginConfiguration';
import { PatternLockService } from '../../../shared/service/global/patternLock.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';


@Component({
  selector: 'app-auth-confirmed',
  templateUrl: './auth-confirmed.component.html',
  styleUrls: ['./auth-confirmed.component.css']
})
export class AuthConfirmedComponent implements OnInit, OnDestroy {

  @Input() authOperationData: any; // reqData

  @Output() cardClick: EventEmitter<any> = new EventEmitter();
  @Output() authResultData: EventEmitter<any> = new EventEmitter();

  equivalentCurrency; // 約當幣別
  equivalentAmount = 0; // 約當幣別總金額
  currencyStatistic; // 各幣別統計數據
  exchangeTable; // 幣別匯率轉換表
  exchangeError; // 是否發生匯率查詢錯誤
  hasEtrustBatch = false; // 是否含有網銀整批交易，需要額外顯示確認框
  allowAuth = false;

  keys; // 統計數據JSON鍵值集合
  authReason; // 畫面使用者輸入之說明原因
  index; // 授權執行資料序號
  overdueTxns; // 須再執行逾期授權之資料序號
  datetimeNow = new Date(); // 當前日期時間

  constructor(
    public layout: LayoutService,
    public storage: LocalStorageService,
    public authorize: DoAuthorizeService,
    public popup: PopupService,
    public hiBiometricAuth: HiBiometricAuthService,
    public forExRateDetailsInq: ForExRateDetailsInqService,
    public patternLock: PatternLockService,
    public langTrans: LangTransService
  ) {
  }

  ngOnDestroy() {
    // 授權操作完成後開啟footer顯示
    this.layout.setFooterStatus(true);
  }

  ngOnInit() {
    this.layout.setHeaderStatus({
      initbackStack: false,
      rightIcon: ' ', //隱藏右上角icon
      title: 'AUTH.NONAUTH'
    });
    // 授權過程頁面均不顯示footer
    this.layout.setFooterStatus(false);
    
    console.log('[授權確認頁][req] authOperationData', this.authOperationData);
    // 檢查是否含網銀整批交易
    this.checkEtrustBatch();
    // 取得使用者設定之約當幣別
    this.equivalentCurrency = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    // 欲授權資料筆數大於1筆時，進行統計作業
    if (this.authOperationData.length > 1) {
      this.getExchangeTable().then(
        (success) => {
          // 成功取得匯率轉換表
          this.calculateData(success);
        },
        (failed) => {
          // 無法取得匯率轉換表
          this.exchangeError = true;
          this.calculateData(failed);
        }
      );
    }
    //scrollTop在沒footer的情況下下移至10px
    document.getElementById("backTop").style.bottom = "10px";
  }
  
  /**
   * 檢查是否含有網銀整批交易
   */
  checkEtrustBatch() {
    let result = this.authOperationData.some((data) => {
      return data.nTxnChannel == "ETRUST" && data.nTxnType == "0";
    });
    console.log('[授權確認頁] checkEtrustBatch', result);
    this.hasEtrustBatch = result;
    this.allowAuth = !result;
  }

  /**
   * 統計欲授權資料數據
   * @param hasExRateTable 是否成功取得匯率轉換表
   */
  calculateData(hasExRateTable) {
    // 幣別金額統計
    let currency;
    let amt = 0;
    let totalCurrencyData = {};
    let totalAmt = 0;
    let equivalentAmt = 0;
    if (hasExRateTable) {
      this.authOperationData.forEach(element => {
        // 取得該筆待授權資料之轉出幣別
        currency = element['nDebitCurrency'];
        amt = element['nDebitAmount'] != '' ? parseInt(element['nDebitAmount']) : 0;
        if (!currency) {
          // effect as continue
          return;
        }

        // 約當幣別換算
        if (hasExRateTable)
          equivalentAmt += amt * this.exchangeTable[this.equivalentCurrency][currency];

        // 取得該幣別當前累計金額
        totalAmt = totalCurrencyData[currency];
        if (!totalAmt)
          totalAmt = amt;
        else
          totalAmt += amt;

        // 更新該幣別統計紀錄
        totalCurrencyData[currency] = totalAmt;
      });
      console.log('[授權確認頁] calculateData totalCurrencyData', totalCurrencyData);
      console.log('[授權確認頁] calculateData equivalentAmt', equivalentAmt);
    }
    
    this.currencyStatistic = totalCurrencyData;
    this.equivalentAmount = equivalentAmt;
    // 取得統計之所有幣別值
    this.keys = Object.keys(this.currencyStatistic);
  }

  /**
   * 取得匯率轉換數據表
   */
  getExchangeTable() {
    // 取得裝置設定國別地區
    let country = this.storage.get('Area');
    console.log('[授權確認頁] getExchangeRate country', country);
    // 取得中台匯率數據並組織成匯率轉換表
    return new Promise((resolve, reject) => {
      this.forExRateDetailsInq.getExRateTable(country).then(
        (res) => {
          console.log('[授權確認頁] getExchangeRate success', res);
          this.exchangeTable = res;
          resolve(true);
        },
        (err) => {
          console.log('[授權確認頁] getExchangeRate error', err);
          reject(false);
        }
      );
    });
  }

  /**
   * [前端事件綁定] 點擊上一步按鈕：觸發當前back event
   */
  onPreviousClick() {
    console.log('[授權確認頁] onPreviousClick');
    this.layout.triggerBackEvent();
  }

  /**
   * [前端事件綁定][母頁回調觸發] 點擊資料卡片間轉至授權明細頁
   * @param i 資料陣列index
   */
  onCardClick(i) {
    console.log('[授權確認頁] onCardClick');
    console.log('[授權確認頁][callback] callbackData', this.authOperationData[i]);
    this.cardClick.emit(this.authOperationData[i]);
  }

  /**
   * [前端事件綁定] 點擊eTrust網銀確認checkBox
   */
  onETrustClick() {
    this.allowAuth = !this.allowAuth;
    console.log('[授權確認頁] onETrustClick allowAuth =', this.allowAuth);
  }

  /**
   * [前端事件綁定] 點擊確認授權按鈕
   */
  onAuthClick() {
    console.log('[授權確認頁] onAuthClick');
    // 快速交易驗證模式
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
        // 快速驗證失敗/無啟用快速交易驗證，啟動手動輸入密碼模式
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
  private verifyPasswordMode() {
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
        console.log('[授權確認頁] verifyPasswordMode userInput =', userInput);
        console.log('[授權確認頁] verifyPasswordMode authReason =', this.authReason);
        // 執行交易授權
        this.startAuthorize(userInput, "0");
      }
    });
  }

  /**
   * 開始執行待授權交易授權請求作業
   * @param userInput 使用者輸入之密碼字串
   * @param isQuickVerify 是否為快速交易驗證模式
   */
  private startAuthorize(userInput, authType) {
    console.log('[授權確認頁] startAuthorize data length =', this.authOperationData.length);

    // 開啟Loading畫面
    this.popup.setLoading(true);

    // 初始化待授權資料計算序號
    this.index = 0;
    this.overdueTxns = [];
    // 逐一發送每筆待授權資料之授權請求
    this.doAuthorize(this.index, userInput, authType);
  }

  /**
   * [遞迴函式] 指定筆待授權交易授權
   * @param index 待授權資料序號
   * @param userInput 使用者輸入之密碼字串
   * @param isQuickVerify 是否為快速交易驗證模式
   */
  private doAuthorize(index, userInput, authType) {
    // 發送該筆交易授權請求
    this.authorize.doAuthorize(
      this.authOperationData[index]['ChannelId'],
      this.authOperationData[index]['BatchId'],
      parseInt(this.authOperationData[index]['TxnDate']),
      this.authOperationData[index]['AuthLv'],
      0, this.authReason, authType, userInput, "").then(
        (res) => {
          console.log('[授權確認頁][API] doAuthorize data index =', index, 'success', res);
          // 授權成功
          this.authOperationData[index]['authResult'] = true;
          // 快登錯誤次數歸0
          this.storage.set("QuickLoginErrorKey",0)
          this.index++;
          if (this.index == this.authOperationData.length) {
            console.log('[授權確認頁] doAuthorize all finished');
            // 普通授權作業完成，檢查是否執行逾期授權作業
            this.checkOverdueTxns(userInput, authType);
            return;
          }
          // 遞迴執行
          this.doAuthorize(this.index, userInput, authType);
        },
        (err) => {
          console.log('[授權確認頁][API] doAuthorize data index =', index, 'failed', err);
          // 授權失敗
          let errCode = err['Result'] ? err['Result'] : err['HeaderRs']['Result'];
          if (errCode == 64) {
            // 交易逾期錯誤
            let overdueTxn = {};
            overdueTxn['index'] = this.index;
            overdueTxn['modifyTxnDate'] = err['HeaderRs']['Desc'];
            this.overdueTxns.push(overdueTxn);
          }
          else {
            this.authOperationData[index]['authResult'] = false;
          }

          this.index++;
          if (this.index == this.authOperationData.length) {
            console.log('[授權確認頁] doAuthorize all finished');
            // 普通授權作業完成，檢查是否執行逾期授權作業
            this.checkOverdueTxns(userInput, authType);
            return;
          }
          // 遞迴執行
          this.doAuthorize(this.index, userInput, authType);
        }
      );
  }

  /**
   * 檢查執行逾期授權
   * @param userInput 使用者輸入之密碼字串
   * @param isQuickVerify 是否為快速交易驗證模式
   */
  private checkOverdueTxns(userInput, authType) {
    console.log('[授權確認頁] checkOverdueTxns pending length =', this.overdueTxns.length);
    
    // 關閉Loading畫面
    this.popup.setLoading(false);

    if (this.overdueTxns.length > 0) {
      this.popup.setConfirm({
        content: this.langTrans.instant('AUTH.MSG_OVERDUE_AUTH_DESC') + this.overdueTxns[0]['modifyTxnDate'],
        checkTxt: 'BTN.CHECK',
        event: (e) => {
          // 開啟Loading畫面
          this.popup.setLoading(true);
          // 執行逾期授權
          this.doOverdueAuthorize(this.overdueTxns[0]['index'], userInput, authType, 2, this.overdueTxns[0]['modifyTxnDate']);
        }
      });
    } else {
      // 不須再執行逾期授權，前往授權結果頁
      this.finishAuthorize();
    }
  }

  /**
   * 指定筆待授權交易逾期授權
   * @param index 待授權資料序號
   * @param userInput 使用者輸入之密碼字串
   * @param isQuickVerify 是否為快速交易驗證模式
   * @param actCode 授權操作類型(1:取消授權; 2:逾期授權)
   * @param overdueDate 逾期授權改動日期
   */
  private doOverdueAuthorize(index, userInput, authType, actCode, overdueDate) {
    console.log('[授權確認頁] doOverdueAuthorize index =', index);
    this.authorize.doAuthorize(
      this.authOperationData[index]['ChannelId'],
      this.authOperationData[index]['BatchId'],
      parseInt(this.authOperationData[index]['TxnDate']),
      this.authOperationData[index]['AuthLv'],
      actCode, this.authReason, authType, userInput, overdueDate).then(
        (res) => {
          console.log('[授權確認頁][API] doAuthorize success', res);
          // 授權成功
          this.authOperationData[index]['authResult'] = true;
          // 移除已操作之資料序號
          this.overdueTxns.splice(0, 1);
          // 檢查是否尚有逾期授權待執行
          this.checkOverdueTxns(userInput, authType);
        },
        (err) => {
          console.log('[授權確認頁][API] doAuthorize failed', err);
          // 授權失敗
          this.authOperationData[index]['authResult'] = false;
          // 移除已操作之資料序號
          this.overdueTxns.splice(0, 1);
          // 檢查是否尚有逾期授權待執行
          this.checkOverdueTxns(userInput, authType);
        }
      );
  }

  /**
   * [母頁回調觸發] 結束授權作業間轉至授權結果頁
   */
  finishAuthorize() {
    console.log('[授權確認頁] finishAuthorize');
    console.log('[授權確認頁][callback] callbackData', this.authOperationData);
    this.authResultData.emit(this.authOperationData);
  }
}
