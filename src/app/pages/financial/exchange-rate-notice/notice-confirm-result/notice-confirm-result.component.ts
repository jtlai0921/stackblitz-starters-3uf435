/**
 * 匯率到價通知設定確認頁和結果頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { ConfirmService } from '@template/msg/confirm/confirm.service';
import { ExchangeRateNoticeCUDService } from '@pages/financial/shared/service/exchange-rate-notice-CUD.service';

@Component({
  selector: 'app-notice-confirm-result',
  templateUrl: './notice-confirm-result.component.html',
  styleUrls: [],
  providers: [ExchangeRateNoticeCUDService]
})

export class NoticeConfirmResultComponent implements OnInit {

  @Input() inputData;

  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

  nowStep = 'check'; // 當前步驟
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
  
  reqData = {
    action: '',
    record: {
      settingTime: '',
      email: '',
      transInCurrency: {
        currencyCode: '',
        currencyName: '',
        buyRate: '',
        sellRate: ''
      },
      transOutCurrency: {
        currencyCode: '',
        currencyName: '',
        buyRate: '',
        sellRate: ''
      },
      referenceRate: '',
      expectedRate: '',
      noticeDateRange: {
        start: '',
        end: ''
      }
    }
  };

  resData = {
    action: '',
    transInCurrency: {
      currencyCode: '',
      currencyName: ''
    },
    transOutCurrency: {
      currencyCode: '',
      currencyName: ''
    },
    expectedRate: '',
    startDate: '',
    endDate: ''
  };

  showResultPage = false; // 顯示結果頁

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _logger: Logger,
    private confirm: ConfirmService,
    private exchangeRateCUD: ExchangeRateNoticeCUDService
  ) { }

  ngOnInit() {
    this._headerCtrl.setLeftBtnClick(() => {
        this.onLeftBtnClick();
    });

  }

  /**
   * Header左側按鈕點擊事件
   */
  onLeftBtnClick() {
    if (this.inputData.action == 'delete') {
      this.backToMain();
    } else {
      this.onBackPageEvent();
    }
  }

  /**
   * [取消]按鈕點擊事件
   */
  onCancelBtnClick() {
    this.backToMain();
  }

  /**
   * [確認]按鈕點擊事件
   */
  onConfirmBtnClick() {
    this.reqData.action = this.inputData.action;
    this.reqData.record.email = this.inputData.email;
    this.reqData.record.transInCurrency = this.inputData.buyCurrencyObj;
    this.reqData.record.transOutCurrency = this.inputData.sellCurrencyObj;
    this.reqData.record.referenceRate = this.inputData.referenceRate;
    this.reqData.record.expectedRate = this.inputData.expectedRate;
    this.reqData.record.noticeDateRange.start = this.inputData.startDate;
    this.reqData.record.noticeDateRange.end = this.inputData.endDate;
    this._logger.error("reqData", this.reqData);
    if (this.inputData.action == 'create') {
      let date = new Date().toLocaleString('zh', {hour12: false});
      let temp = date.split(' ');
      let temp2 = temp[0].split('/');
      date = temp2[0] + '-' + (temp2[1].length < 2 ? '0' : '') + temp2[1] + '-' + temp2[2] + ' ' + temp[1];
      this.reqData.record.settingTime = date;
      this.exchangeRateCUD.addData(this.reqData).then(
        (res) => {
          this._logger.error("res", res);
          this.resData.action = res.action;
          this.resData.transInCurrency = res.transInCurrency;
          this.resData.transOutCurrency = res.transOutCurrency;
          this.resData.expectedRate = res.expectedRate;
          this.resData.startDate = res.startDate;
          this.resData.endDate = res.endDate;
          this.showResultPage = true;
          this._headerCtrl.setOption({ leftBtnIcon: '', rightBtnIcon: 'finish' }); // 變更Header按鈕樣式
          this._headerCtrl.setRightBtnClick(() => {
            this.navgator.popTo('exchangeRateNotice');
          });
        },
        (errObj) => {
          // Error
  
        }
      );
    } else if (this.inputData.action == 'update') {
      this.reqData.record.settingTime = this.inputData.settingTime;
      this.exchangeRateCUD.updateData(this.reqData).then(
        (res) => {
          this._logger.error("res", res);
          this.resData.action = res.action;
          this.resData.transInCurrency = res.transInCurrency;
          this.resData.transOutCurrency = res.transOutCurrency;
          this.resData.expectedRate = res.expectedRate;
          this.resData.startDate = res.startDate;
          this.resData.endDate = res.endDate;
          this.showResultPage = true;
          this._headerCtrl.setOption({ leftBtnIcon: '', rightBtnIcon: 'finish' }); // 變更Header按鈕樣式
          this._headerCtrl.setRightBtnClick(() => {
            this.navgator.popTo('exchangeRateNotice');
          });
        },
        (errObj) => {
          // Error
  
        }
      );
    } else if (this.inputData.action == 'delete') {
      this.reqData.record.settingTime = this.inputData.settingTime;
      this.exchangeRateCUD.deleteData(this.reqData).then(
        (res) => {
          this._logger.error("res", res);
          this.resData.action = res.action;
          this.resData.transInCurrency = res.transInCurrency;
          this.resData.transOutCurrency = res.transOutCurrency;
          this.resData.expectedRate = res.expectedRate;
          this.resData.startDate = res.startDate;
          this.resData.endDate = res.endDate;
          this.showResultPage = true;
          this._headerCtrl.setOption({ leftBtnIcon: '', rightBtnIcon: 'finish' }); // 變更Header按鈕樣式
          this._headerCtrl.setRightBtnClick(() => {
            this.navgator.popTo('exchangeRateNotice');
          });
        },
        (errObj) => {
          // Error
  
        }
      );
    }

  }

  /**
   * 返回匯率到價通知設定頁面
   */
  onBackPageEvent() {
    this.backPageEmit.emit();
  }

  /**
   * 返回匯率到價通知頁面
   */
  backToMain() {
    this.confirm.cancelEdit().then(
      (res) => {
        this.navgator.popTo('exchangeRateNotice');
      },
      (errObj) => {

      }
    );
  }

}
