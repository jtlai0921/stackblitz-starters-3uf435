/**
 * 外幣匯率
 */
import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '@pages/financial/shared/service/exchange-rate.service';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';

@Component({
  selector: 'app-exchange-rate-main',
  templateUrl: './exchange-rate-main.component.html',
  styleUrls: []
})

export class ExchangeRateMainComponent implements OnInit {
  dataTime: any; // 資料時間
  nonCashData = []; // 即期data
  cashData = []; // 現金data
  haveData = true;
  nowBookMark = 'spot-rate'; // 現在分頁
  errorMsg = '';

  // 頁籤data
  bookmarkData = [
    {
      id: 'spot-rate',
      name: 'FINANCIAL.SPOT_RATE',
      sort: 1
    },
    {
      id: 'cash-rate',
      name: 'FINANCIAL.CASH_RATE',
      sort: 2
    }
  ];

  constructor(
    private mainService: ExchangeRateService,
    private navgator: NavgatorService,
    private _logger: Logger
  ) { }

  ngOnInit() {
    this.getData();
  }

  /**
   * 頁籤選擇完返回事件
   */
  onBookMarkBack(e) {
    this.nowBookMark = e.data.id;
  }

  /**
   * 重新取得資料
   */
  onRefresh() {
    this.getData();
  }

  /**
   * navgator push to 歷史匯率走勢圖頁面
   */
  onHistory(item) {
    let params = {
      dfCurrency: item.currencyCode
    };
    this.navgator.push('exchangeRateHistory', params);
  }

  /**
   * 取得外幣匯率data
   */
  getData() {
    this.mainService.getData().then(
      (res) => {
        this.haveData = true;
        this.dataTime = res.dataTime;
        this.nonCashData = res.nonCashData;
        this.cashData = res.cashData;
      },
      (errObj) => {
        this.haveData = false;
        this.errorMsg = errObj.content;
        // Error
      }
    );
  }

  /**
   * [外幣轉帳]按鈕點擊事件
   */
  onForeignTransferBtnClick() {
    this._logger.error("onForeignTransferBtnClick");
  }

  /**
   * [設定到價通知]按鈕點擊事件
   */
  onExchangeRateNoticeBtnClick() {
    this.navgator.push('exchangeRateNotice');
  }

  /**
   * [幣別換算]按鈕點擊事件
   */
  onCurrencyConverterBtnClick() {
    this.navgator.push('currencyConverter');
  }

}
