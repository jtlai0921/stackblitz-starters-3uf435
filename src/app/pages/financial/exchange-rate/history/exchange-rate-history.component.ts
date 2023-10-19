/**
 * 外幣歷史匯率走勢圖
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { CurrencyFlagPopupService } from '@template/list/currency-flag/currency-flag-popup.service';
import { ExchangeRateService } from '@pages/financial/shared/service/exchange-rate.service';
import { ExchangeRateHistoryService } from '@pages/financial/shared/service/exchange-rate-history.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { FormateService } from '@template/formate/formate.service';
declare var Chart: any;

@Component({
  selector: 'app-exchange-rate-history',
  templateUrl: './exchange-rate-history.component.html',
  styleUrls: [],
  providers: [ExchangeRateHistoryService]
})

export class ExchangeRateHistoryComponent implements OnInit {
  
  private currencyList: any; // 外幣list
  currencyData = []; // 幣別data
  haveData = true;
  private dfCurrency = 'USD'; // 預設幣別
  private selectCurrency = ''; // 已選幣別
  private rateList: any; // 匯率list
  rateData = []; // 匯率data
  errorMsg = '';
  line: any;

  // 查詢時間
  searchTime = {
    start: '',
    end: ''
  };
  
  // 當前選擇物件
  chooseCurrencyObj = {
    currencyCode: '',
    currencyName: '',
    data: []
  };

  nowBookMark = '1M'; // 現在分頁

  // 頁籤data
  bookmarkData = [
    {
      id: '1M',
      name: 'FINANCIAL.1MONTH',
      sort: 1
    },
    {
      id: '3M',
      name: 'FINANCIAL.3MONTH',
      sort: 2
    },
    {
      id: '6M',
      name: 'FINANCIAL.6MONTH',
      sort: 3
    },
    {
      id: '1Y',
      name: 'FINANCIAL.1YEAR',
      sort: 4
    }
  ];

  reqData = {
    currencyCode: '',
    dateRange: {
      start: '',
      end: ''
    }
  };
  openChart = false; // 是否開啟走勢圖,api發送成功開啟

  constructor(
    private _currencyPop: CurrencyFlagPopupService,
    private exchangeRateService: ExchangeRateService,
    private exchangeRateHistoryService: ExchangeRateHistoryService,
    private _logger: Logger,
    private navgator: NavgatorService,
    private _formateService: FormateService
  ) { }

  ngOnInit() {
    let inputCurrency = this._formateService.checkField(this.navgator.getParams(), 'dfCurrency');
    if (!!inputCurrency && inputCurrency != 'undefined') {
      this.dfCurrency = inputCurrency;
    }
    
    // 取得幣別data
    this.exchangeRateService.getData().then(
      (res) => {
        this.haveData = true;
        // this.searchTime = res.dataTime;
        this.currencyList = res.list;
        this.currencyData = res.currencyData;
        if (typeof this.currencyList[this.dfCurrency] != 'undefined') {
          this.onCurrencyChange(this.currencyList[this.dfCurrency]);
        }
        else {
          this.chooseCurrencyObj = {
            currencyCode: '',
            currencyName: '',
            data: []
          };
        }
      },
      (errObj) => {
        this.haveData = false;
        this.errorMsg = errObj.content;
        // Error
      }
    );

  }

  /**
   * 打開幣別選單popup
   */
  popOpen() {
    this._currencyPop.show({
      // title: '',
      data: this.currencyData,
      selectCurrency: this.selectCurrency
    }).then(
      (currencyItem) => {
        this.onCurrencyChange(currencyItem);
      },
      () => {
        // 使用者取消

      }
    );
  }

  /**
   * Popup幣別選擇完
   * @param item 
   */
  onCurrencyChange(item) {
    this.selectCurrency = item.currencyCode;
    this.chooseCurrencyObj = {
      currencyCode: item.currencyCode,
      currencyName: item.currencyName,
      data: item.data
    };
    this.getData(this.chooseCurrencyObj.currencyCode);
  }

  /**
   * 頁籤選擇完返回事件
   */
  onBookMarkBack(e) {
    this.nowBookMark = e.data.id;
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();
    this.reqData.dateRange.end = year + '-' + month + '-' + date;
    switch (e.data.id) {
      case '1M':
        this.reqData.dateRange.start = 
          ((month - 1) <= 0 ? (year - 1) : (year)) + '-' + ((month - 1) <= 0 ? (month - 1 + 12) : (month - 1)) + '-' + date;
        break;
      case '3M':
        this.reqData.dateRange.start = 
          ((month - 3) <= 0 ? (year - 1) : (year)) + '-' + ((month - 3) <= 0 ? (month - 3 + 12) : (month - 3)) + '-' + date;
        break;
      case '6M':
        this.reqData.dateRange.start = 
          ((month - 6) <= 0 ? (year - 1) : (year)) + '-' + ((month - 6) <= 0 ? (month - 6 + 12) : (month - 6)) + '-' + date;
        break;
      case '1Y':
        this.reqData.dateRange.start = (year - 1) + '-' + month + '-' + date;
        break;
      default:
        break;
    }
    this.getData(this.chooseCurrencyObj.currencyCode);
    
  }

  /**
   * 取得歷史匯率data
   */
  getData(currencyCode) {
    if (!currencyCode) {
      return false;
    }

    this.reqData.currencyCode = currencyCode;

    this.exchangeRateHistoryService.getData(this.reqData).then(
      (res) => {
        this.haveData = true;
        this.searchTime = res.dateRange;
        this.rateList = res.list;
        this.rateData = res.data;
        this.openChart = true; // 取得api資訊,開啟走勢圖計算
      },
      (errObj) => {
        this.haveData = false;
        this.errorMsg = errObj.content;
        // Error
      }
    );
  }

  // 接收走勢圖錯誤返回
  onChartErrorBack(e) {
    this._logger.log('Deposit', 'onErrorBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let errorObj: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        errorObj = e.data;
      }
    }
    // 下方顯示白箱
    this.haveData = false;
    this.errorMsg = errorObj.content; // 錯誤訊息清掉
  }

}
