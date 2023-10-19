/**
 * 外幣兌換
 */
import { Component, OnInit } from '@angular/core';
import { twdToForeign_content, foreignToTwd_content } from '@pages/transfer/shared/notePopup-content';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';

@Component({
  selector: 'app-foreign-transfer-main',
  templateUrl: './foreign-transfer-main.component.html',
  styleUrls: []
})

export class ForeignTransferMainComponent implements OnInit {

  invalid = "";

  // 注意事項設定
  notePopupOption = {
    title: 'POPUP.NOTE.TITLE',
    content: twdToForeign_content
  };

  nowBookMark = 'buy-foreign'; // 現在分頁

  // 頁籤data
  bookmarkData = [
    {
      id: 'buy-foreign',
      name: 'FOREIGN_TRANSFER.BUY_FOREIGN_CURRENCY',
      sort: 1
    },
    {
      id: 'sell-foreign',
      name: 'FOREIGN_TRANSFER.SELL_FOREIGN_CURRENCY',
      sort: 2
    }
  ];

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

  output = {
    transOutAccountObj: {},
    transInAccountObj: {},
    chooseSellCurrencyObj: {},
    chooseBuyCurrencyObj: {},
    transOutAmount: '',
    transInAmount: '',
    referenceRate: '',
    transferType: ''
  };

  constructor(
    private _logger: Logger,
    private navgator: NavgatorService
  ) { }

  ngOnInit() {

  }

  /**
   * 頁籤選擇完返回事件
   */
  onBookMarkBack(e) {
    this.nowBookMark = e.data.id;
    this.notePopupOption.content = (this.nowBookMark == 'buy-foreign') ? twdToForeign_content : foreignToTwd_content;
  }

  /**
   * [匯率表]按鈕點擊事件
   */
  onExchangeRateTableBtnClick() {
    this.navgator.push('exchangeRate');
  }

}
