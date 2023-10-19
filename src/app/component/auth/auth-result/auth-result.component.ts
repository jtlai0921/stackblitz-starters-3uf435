import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { ForExRateDetailsInqService } from '../../../shared/service/customize/forExRateDetailsInq.service';
import { KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';

@Component({
  selector: 'app-auth-result',
  templateUrl: './auth-result.component.html',
  styleUrls: ['./auth-result.component.css']
})
export class AuthResultComponent implements OnInit {

  @Input() authResultData: any; // reqData
  @Input() action: any; // reqData

  @Output() authListClick: EventEmitter<any> = new EventEmitter();

  equivalentCurrency; // 約當幣別
  exchangeTable; // 幣別匯率轉換表
  exchangeError; // 是否發生匯率查詢錯誤
  successEquivalentAmount = 0; // 授權成功約當幣別總金額
  successCount; // 授權成功總筆數
  failEquivalentAmount = 0; // 授權失敗約當幣別總金額
  failCount; // 授權失敗總筆數
  currencyStatistic; // 授權成功/失敗各幣別統計數據
  successKeys; // 授權成功統計數據JSON鍵值集合
  failKeys; // 授權失敗統計數據JSON鍵值集合

  constructor(
    public layout : LayoutService,
    public storage : LocalStorageService,
    public forExRateDetailsInq : ForExRateDetailsInqService,
    public popup : PopupService
  ) {
  }

  ngOnInit() {
    this.layout.setHeaderStatus({
      initbackStack: true,
      title: 'AUTH.TRANS_RESULT' // 交易結果
    });
    console.log('[授權結果頁][req] action', this.action);
    console.log('[授權結果頁][req] authResultData', this.authResultData);
    // 統計授權結果成功失敗筆數
    this.calculateCount();
    // 取得使用者設定之約當幣別
    this.equivalentCurrency = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    // 依照授權結果成功/失敗區分統計
    this.getExchangeTable().then(
      (success) => {
        // 成功取得匯率轉換表
        this.calculateAmount(success);
      }, 
      (failed) => {
        // 無法取得匯率轉換表
        this.exchangeError = true;
        this.calculateAmount(failed);
      }
    );
  }

  /**
   * 統計授權結果筆數
   */
  calculateCount() {
    // 統計成功失敗筆數
    this.successCount = 0;
    this.failCount = 0;
    this.authResultData.forEach(element => {
      // 統計筆數
      if (element['authResult']) 
        this.successCount++;
      else 
        this.failCount++;
    });
  }

  /**
   * 統計授權結果金額數據
   * @param hasExRateTable 是否成功取得匯率轉換表
   */
  calculateAmount(hasExRateTable) {
    // 幣別金額統計
    let currency;
    let amt = 0;
    let authResult;
    
    let totalAmt = 0;
    let successCurrencyData = {};
    let successAmt = 0;
    let failCurrencyData = {};
    let failAmt = 0;
    
    if (hasExRateTable) {
      this.authResultData.forEach(element => {
        // 取得該筆待授權資料之轉出幣別
        currency = element['nDebitCurrency'];
        amt = element['nDebitAmount'] != '' ? parseInt(element['nDebitAmount']) : 0;
        authResult = element['authResult'];
        if (!currency) {
          // effect as continue
          return;
        }

        // 約當幣別換算
        if (authResult) 
          successAmt += amt * this.exchangeTable[this.equivalentCurrency][currency];
        else 
          failAmt += amt * this.exchangeTable[this.equivalentCurrency][currency];

        // 取得該幣別當前累計金額
        totalAmt = authResult ? successCurrencyData[currency] : failCurrencyData[currency];
        if (!totalAmt) 
          totalAmt = amt;
        else
          totalAmt += amt;

        // 更新該幣別統計紀錄
        if (authResult) 
          successCurrencyData[currency] = totalAmt;
        else 
          failCurrencyData[currency] = totalAmt;
      });
      console.log('[授權結果頁] calculateAmount successAuth', successCurrencyData);
      console.log('[授權結果頁] calculateAmount successAmt', successAmt);
      console.log('[授權結果頁] calculateAmount failAuth', failCurrencyData);
      console.log('[授權結果頁] calculateAmount failAmt', failAmt);
    }
    
    // 取得統計之所有幣別值
    this.successKeys = Object.keys(successCurrencyData);
    this.failKeys = Object.keys(failCurrencyData);
    // 儲存統計數據
    this.currencyStatistic = [];
    this.currencyStatistic.push(successCurrencyData);
    this.currencyStatistic.push(failCurrencyData);
    // 儲存約當幣別總金額
    this.successEquivalentAmount = successAmt;
    this.failEquivalentAmount = failAmt;
  }

  /**
   * 取得匯率轉換數據表
   */
  getExchangeTable() {
    // 取得裝置設定國別地區
    let country = this.storage.get('Area');
    console.log('[授權結果頁] getExchangeRate country', country);
    // 取得中台匯率數據並組織成匯率轉換表
    return new Promise((resolve, reject) => {
      this.forExRateDetailsInq.getExRateTable(country).then(
        (res) => {
          console.log('[授權結果頁] getExchangeRate success', res);
          this.exchangeTable = res;
          resolve(true);
        }, 
        (err) => {
          console.log('[授權結果頁] getExchangeRate error', err);
          reject(false);
        }
      );
    });
  }

  /**
   * [前端事件綁定][母頁回調觸發] 點擊已授權清單按鈕
   */
  onAuthListClick() {
    console.log('[授權結果頁] onAuthListClick');
    this.authListClick.emit();
  }
}
