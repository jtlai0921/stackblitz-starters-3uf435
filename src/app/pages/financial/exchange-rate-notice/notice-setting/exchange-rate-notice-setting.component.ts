/**
 * 匯率到價通知設定
 */
import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { Logger } from '@systems/system/logger/logger.service';
import { CurrencyFlagPopupService } from '@template/list/currency-flag/currency-flag-popup.service';
import { ExchangeRateService } from '@pages/financial/shared/service/exchange-rate.service';
import { DatepickerPopService } from '@template/list/datepicker-pop/datepicker-pop.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { FormateService } from '@template/formate/formate.service';
import { ReferenceExchangeRateService } from '@template/reference-exchange-rate/reference-exchange-rate.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { note_content } from '@pages/financial/shared/notePopup-content';

@Component({
  selector: 'app-exchange-rate-notice-setting',
  templateUrl: './exchange-rate-notice-setting.component.html',
  styleUrls: []
})

export class ExchangeRateNoticeSettingComponent implements OnInit {
  nowStep = 'edit'; // 當前步驟
  // 步驟列data
  stepMenuData = [
    {
      id: 'edit',
      name: 'STEP_BAR.COMMON.EDIT' // 輸入資料頁
    },
    {
      id: 'check',
      name: 'STEP_BAR.COMMON.CHECK', // 確認資料頁
    },
    {
      id: 'result',
      name: 'STEP_BAR.COMMON.RESULT', // 結果頁
      // 執行此步驟時是否隱藏步驟列
      hidden: true
    }
  ];

  notePopupOption = {}; // 注意事項設定
  note_content = note_content;
  private currencyList: any; // 外幣list
  currencyData = []; // 幣別data
  haveData = true;
  private dfSellCurrency = ''; // 預設兌出幣別
  private selectSellCurrency = ''; // 已選兌出幣別
  private dfBuyCurrency = ''; // 預設兌入幣別
  private selectBuyCurrency = ''; // 已選兌入幣別

  // 兌出幣別當前選擇物件
  chooseSellCurrencyObj = {
    currencyCode: '',
    currencyName: '',
    buyRate: '',
    sellRate: ''
  };

  // 兌入幣別當前選擇物件
  chooseBuyCurrencyObj = {
    currencyCode: '',
    currencyName: '',
    buyRate: '',
    sellRate: ''
  };

  weightType = ''; // 1:權重大轉小 2:權重小轉大 
  referenceRate = '--'; // 參考匯率
  expectedRate = ''; // 已設定匯率
  selectStartDate: any = ''; // 已選開始日期
  selectEndDate: any = ''; // 已選結束日期
  showConfirmPage = false; // 顯示確認頁
  minDate = new Date().toLocaleDateString(); // 最小可選日期
  maxDate = (new Date().getFullYear() + 1) + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();

  // 輸出資料
  outputData = {
    action: '',
    settingTime: '',
    email: '',
    sellCurrencyObj: {},
    buyCurrencyObj: {},
    referenceRate: '',
    expectedRate: '',
    startDate: '',
    endDate: ''
  };

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private _logger: Logger,
    private _currencyPop: CurrencyFlagPopupService,
    private exchangeRateService: ExchangeRateService,
    private _datePickerPop: DatepickerPopService,
    private navgator: NavgatorService,
    private _formateService: FormateService,
    private _referenceRateService: ReferenceExchangeRateService,
    private errorHandler: HandleErrorService
  ) { }

  ngOnInit() {
    this._headerCtrl.setLeftBtnClick(() => {
      this.back();
    });
    
    // 前一頁傳入的data
    let item = this._formateService.checkObjectList(this.navgator.getParams(), 'item');
    let action = this._formateService.checkField(this.navgator.getParams(), 'action');
    if (action == 'delete') {
      this.outputData.action = action;
      this.outputData.settingTime = item.settingTime;
      this.outputData.email = item.email;
      this.outputData.sellCurrencyObj = item.sellCurrencyObj;
      this.outputData.buyCurrencyObj = item.buyCurrencyObj;
      this.outputData.referenceRate = item.referenceRate;
      this.outputData.expectedRate = item.expectedRate;
      this.outputData.startDate = item.startDate;
      this.outputData.endDate = item.endDate;
      this.showConfirmPage = true;
    } else if (action == 'update') {
      this.outputData.action = action;
      this.outputData.settingTime = item.settingTime;
      this.outputData.email = item.email;
      this.dfSellCurrency = item.sellCurrencyObj.currencyCode;
      this.dfBuyCurrency = item.buyCurrencyObj.currencyCode;
      this.expectedRate = item.expectedRate;
      this.selectStartDate = item.startDate;
      this.selectEndDate = item.endDate;
    } else if (action == 'create') {
      this.outputData.action = action;
      this.outputData.email = item.email;
    }

    this.notePopupOption = {
      title: 'POPUP.NOTE.TITLE',
      content: this.note_content,
    };

    // 取得幣別data
    this.exchangeRateService.getData().then(
      (res) => {
        this.haveData = true;
        // this.searchTime = res.dataTime;
        this.currencyList = res.list;
        this.currencyData = res.currencyData;
        if (typeof this.currencyList[this.dfSellCurrency] != 'undefined') {
          this.onCurrencyChange(this.currencyList[this.dfSellCurrency], 'sell');
        }
        else {
          this.chooseSellCurrencyObj = {
            currencyCode: '',
            currencyName: '',
            buyRate: '',
            sellRate: ''
          };
        }
        if (typeof this.currencyList[this.dfBuyCurrency] != 'undefined') {
          this.onCurrencyChange(this.currencyList[this.dfBuyCurrency], 'buy');
        }
        else {
          this.chooseBuyCurrencyObj = {
            currencyCode: '',
            currencyName: '',
            buyRate: '',
            sellRate: ''
          };
        }
      },
      (errObj) => {
        this.haveData = false;
        // Error
      }
    );

  }

  /**
   * Header右側按鈕點擊事件
   */
  onRightBtnClick(){
    // if (this.isEditing) {
    //   this.isEditing = false;
    //   this._headerCtrl.setOption({rightBtnIcon: 'edit'}); // 變更Header右側按鈕樣式
    // } else {
    //   this.isEditing = true;
    //   this._headerCtrl.setOption({rightBtnIcon: 'finish'}); // 變更Header右側按鈕樣式
    // }
    
  }

  /**
   * [清除]按鈕點擊事件
   */
  onClearBtnClick() {
    this.selectSellCurrency = '';
    this.chooseSellCurrencyObj = {
      currencyCode: '',
      currencyName: '',
      buyRate: '',
      sellRate: ''
    };
    this.selectBuyCurrency = '';
    this.chooseBuyCurrencyObj = {
      currencyCode: '',
      currencyName: '',
      buyRate: '',
      sellRate: ''
    };
    this.expectedRate = '';
    this.selectStartDate = '';
    this.selectEndDate = '';
  }

  /**
   * [下一步]按鈕點擊事件
   */
  onNextStepBtnClick() {
    // 檢核欄位
    if (!this.checkData().status) {
      this.errorHandler.handleError({
        title: 'ERROR.TITLE',
        content: this.checkData().err_msg
      });
      return;
    }

    this.outputData.sellCurrencyObj = this.chooseSellCurrencyObj;
    this.outputData.buyCurrencyObj = this.chooseBuyCurrencyObj;
    this.outputData.referenceRate = this.referenceRate;
    this.outputData.expectedRate = this.expectedRate;
    this.outputData.startDate = this.selectStartDate;
    this.outputData.endDate = this.selectEndDate;
    this._logger.error("outputData", this.outputData);
    this.showConfirmPage = true;
  }

  /**
   * 打開幣別選單popup
   */
  currencyPopOpen(type) {
    this._currencyPop.show({
      // title: '',
      data: this.currencyData,
      selectCurrency: (type == 'sell' ? this.selectSellCurrency : this.selectBuyCurrency)
    }).then(
      (currencyItem) => {
        this.onCurrencyChange(currencyItem, type);
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
  onCurrencyChange(item, type) {
    if (type == 'sell') {
      this.selectSellCurrency = item.currencyCode;
      this.chooseSellCurrencyObj = {
        currencyCode: item.currencyCode,
        currencyName: item.currencyName,
        buyRate: this.currencyList[this.selectSellCurrency].buyRate,
        sellRate: this.currencyList[this.selectSellCurrency].sellRate
      };
    } else {
      this.selectBuyCurrency = item.currencyCode;
      this.chooseBuyCurrencyObj = {
        currencyCode: item.currencyCode,
        currencyName: item.currencyName,
        buyRate: this.currencyList[this.selectBuyCurrency].buyRate,
        sellRate: this.currencyList[this.selectBuyCurrency].sellRate
      };
    }

    // 取得參考匯率
    if (!!this.selectSellCurrency && !!this.selectBuyCurrency) {
      this._referenceRateService.getReferenceRate(this.chooseSellCurrencyObj, this.chooseBuyCurrencyObj).then(
        (res) => {
          this.referenceRate = res.referenceCurrencyRate;
          this.weightType = res.weightType;
        },
        (err) => {
          this.referenceRate = '--';
        }
      );
    }

  }

  /**
   * 打開日期選單popup
   */
  datePickerPopOpen(type) {
    this._datePickerPop.show({
      date: (type == 'start' ? this.selectStartDate : this.selectEndDate),
      min: this.minDate,
      max: this.maxDate
    }).then(
      (dateItem) => {
        if (type == 'start') {
          this.selectStartDate = dateItem;
        } else {
          this.selectEndDate = dateItem;
        }
      },
      () => {
        // 使用者取消
        if (type == 'start') {
          this.selectStartDate = '';
        } else {
          this.selectEndDate = '';
        }

      }
    );
  }

  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this.showConfirmPage = false;
    this._headerCtrl.setLeftBtnClick(() => {
      this.back();
    });
  }

  /**
   * 返回動作
   */
  back() {
    this.navgator.pop();
  }

  /**
   * 檢核欄位
   */
  checkData() {
    let checkObj = {
      status: true,
      err_msg: ''
    };

    // 檢核兌出幣別資料
    if (!this.chooseSellCurrencyObj.currencyCode) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.SELECT_SELL_CURRENCY';
      return checkObj;
    }

    // 檢核兌入幣別資料
    if (!this.chooseBuyCurrencyObj.currencyCode) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.SELECT_BUY_CURRENCY';
      return checkObj;
    }

    if (this.chooseSellCurrencyObj.currencyCode == this.chooseBuyCurrencyObj.currencyCode) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.SAME_CURRENCY';
      return checkObj;
    }

    // 檢核參考匯率
    if (this.referenceRate == '--') {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.INVALID_REFERENCE_RATE';
      return checkObj;
    }

    // 檢核設定匯率
    if (!this.expectedRate) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.ENTER_EXCHANGE_RATE';
      return checkObj;
    } else {
      // 通知匯率格式(整數13位、小數4位)
      let reg = /^[1-9]\d{0,12}(\.\d{1,4})?$|^0(\.\d{1,4})?$/;
      if (!reg.test(this.expectedRate) || parseFloat(this.expectedRate) == 0) {
        checkObj.status = false;
        checkObj.err_msg = 'FINANCIAL.ERR.INVALID_EXCHANGE_RATE';
        return checkObj;
      }

      if (this.weightType == '1') {
        // 權重大轉小，通知匯率須大於等於參考匯率
        if (parseFloat(this.expectedRate) < parseFloat(this.referenceRate)) {
          checkObj.status = false;
          checkObj.err_msg = 'FINANCIAL.ERR.INVALID_EXCHANGE_RATE1';
          return checkObj;
        }
      } else if (this.weightType == '2') {
        // 權重小轉大，通知匯率須小於等於參考匯率
        if (parseFloat(this.expectedRate) > parseFloat(this.referenceRate)) {
          checkObj.status = false;
          checkObj.err_msg = 'FINANCIAL.ERR.INVALID_EXCHANGE_RATE2';
          return checkObj;
        }
      }
    }

    // 檢核開始日期
    if (!this.selectStartDate) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.SELECT_START_DATE';
      return checkObj;
    }

    // 檢核結束日期
    if (!this.selectEndDate) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.SELECT_END_DATE';
      return checkObj;
    }

    // 檢核結束日期大於開始日期
    if (new Date(this.selectStartDate) >= new Date(this.selectEndDate)) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.INVALID_DATE';
      return checkObj;
    }

    return checkObj;
  }

}
