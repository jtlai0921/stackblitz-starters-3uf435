/**
 * 各期帳單及未出帳消費查詢(主控)
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { HistoryBillService } from '@pages/card/shared/history-bill-main.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FormateService } from '@template/formate/formate.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history-bill-main',
  templateUrl: './history-bill-main.component.html',
  styleUrls: []
})

export class HistoryBillMainComponent implements OnInit {
  billMonthData = []; // 帳單月份資料
  hasDetail = false; // 是否取得帳單資料，未取得,不進入列表component顯示
  unPaidStr = { 'selectedMonth': 'unPaid', 'selectedMonthDesc': '未出帳消費' };
  expandFlag: boolean; // 是否全部展開
  // private subjectObj: any;
  nowPage = 'detail'; // detail:交易明細, billInfo:帳單資訊, unPaid:未出帳消費
  billType = ''; // 類別， unPaid: 未出帳消費, 空:各期帳單
  // 給子層下隻api request需要
  selectMonthData = {
    selectedMonth: '',
    selectedMonthDesc: ''
  };
  data: any; // 各期帳單資料
  infoData: any; // 各期帳單資訊
  cardData: any; // 信用卡資料(swiper)
  monthStr = ''; // 顯示主層的月份(2個字): EX: 12 
  swiperChangeData: any; // 滑動信卡切換資料用
  // 未出帳消費相關
  unpaidData: any; // 未出帳消費資訊
  payData: any; // 本期繳款紀錄資料
  consumeData: any; // 本期消費紀錄資料
  unCardData: any; // 信用卡資料(swiper 未出帳)
  unSwiperData: any; // 滑動信卡切換資料用(未出帳)
  showCardPay = false; // 是否顯示繳卡費按鈕
  urlType = ''; // 紀錄url後參數,判斷顯示哪個頁面


  constructor(
    private logger: Logger,
    private mainService: HistoryBillService,
    private handleError: HandleErrorService,
    private _formateService: FormateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.logger.log("into HistoryBillMainComponent 11111");
    // 近來先判斷,導入此頁為 各期帳單or未出帳消費,去做對應顯示
    this.route.queryParams.subscribe(params => {
      this.logger.log("into route.queryParams 1111111111111111111111111", params);
      if (params.hasOwnProperty('type') && params.type !== '') {
         // 若是未出帳消費,去帶入 app-card-select-month 預設顯示值
        if(params.type == 'unPaid') {
          // 未出帳消費
          this.billType = 'unPaid';
          this.selectMonthData = {
            selectedMonth: 'unPaid',
            selectedMonthDesc: ''
          };
        } else {
          // 各期帳單
          this.billType = 'detail';
          this.selectMonthData = {
            selectedMonth: '',
            selectedMonthDesc: ''
          };
        }
      } 
    });
  }

  /**
   * 
   * @param type 
   */
  onSelectTag(type) {
    // 交易明細
    if (type == 'detail') {
      this.nowPage = 'detail';
      this.showCardPay = false;
      // 帳單資訊
    } else {
      this.nowPage = 'billInfo';
      if(!!this.infoData['printBarCode']) {
        this.showCardPay = true;
      } else {
        this.showCardPay = false;
      }
    }
  }

  /**
   * 點擊繳卡費
   */
  onCardPay() {
    this.logger.log("into onCardPay");
  }

  // 取得各期帳單 spec12010302
  getBillData(setData) {
    this.hasDetail = false; // 發api or 重發api 就先不顯示資料，回成功在顯示 
    this.logger.log("into getBillData");
    let reqData = {
      selectedMonth: setData.selectedMonth
    };
    this.logger.log("getBillData, reqData:", reqData);
    this.mainService.getBillData(reqData).then(
      (result) => {
        this.logger.log("success, result:", this._formateService.transClone(result));
        this.data = result.data;
        this.infoData = result.infoData;
        this.cardData = result.cardData;
        this.swiperChangeData = result.swiperChangeData;
        // this.oldInfo = this.infoData;
        this.logger.log("getBillData success, data:", this.data);
        this.logger.log("getBillData success, infoData:", this.infoData);
        this.logger.log("getBillData success, cardData:", this.cardData);
        this.hasDetail = true; // 取得帳單資訊，才進入detail頁面
      },
      (errorObj) => {
        this.logger.log("error, errorObj:", errorObj);
        this.hasDetail = false;
        this.handleError.handleError(errorObj);
      }
    );
  }

  // 取得未出帳消費資料 spec12010401
  getUnpaidData(setData) {
    this.logger.log("into getUnpaidData, setData:", setData);
    this.hasDetail = false; // 發api or 重發api 就先不顯示資料，回成功在顯示
    this.mainService.getUnpaidData(setData).then(
      (result) => {
        this.logger.log("success, result:", this._formateService.transClone(result));
        this.payData = result.data; // 本期繳款紀錄資料
        this.consumeData = result.consumeData; // 本期消費紀錄資料
        this.unpaidData = result.infoData; // 未出帳消費資訊
        this.unCardData = result.cardData; // 信用卡資料(swiper 未出帳)
        this.unSwiperData = result.cardSwiperData; // 滑動信卡切換資料用(未出帳)
        this.hasDetail = true; // 取得帳單資訊，才進入detail頁面
      },
      (errorObj) => {
        this.logger.log("error, errorObj:", errorObj);
        this.hasDetail = false;
        this.handleError.handleError(errorObj);
      }
    );
  }

  /**
   * 月份回傳(準備查詢交易明細)
   * @param e
   */
  onMonthBackEvent(e) {
    this.logger.log('History-Bill', 'onMonthBackEvent', e);
    if (e.hasOwnProperty('data')) {
      // 紀錄月份回傳資訊(發送spec12010302使用)
      let change_month = this._formateService.checkObjectList(e, 'data.selectedMonth');
      let change_monthDesc = this._formateService.checkObjectList(e, 'data.selectedMonthDesc');
      if (change_month == this.selectMonthData.selectedMonth && change_monthDesc == this.selectMonthData.selectedMonthDesc) {
        return false;
      }
      this.selectMonthData.selectedMonth = change_month;
      this.selectMonthData.selectedMonthDesc = change_monthDesc;
      // 處理顯示主層的月份(2個字): EX: 12 
      this.monthStr = this.mainService.formateMonthStr(this.selectMonthData.selectedMonth);
      this.logger.log("monthStr:", this.monthStr);

      // 未出帳消費
      if (change_month == 'unPaid') {
        this.logger.log("into is unPaid");
        this.logger.log("send spec12010401 consumption"); // 發未出帳消費API
        this.nowPage = 'unPaid'; // 切換至未出帳消費查詢頁
        this.getUnpaidData({});
        // 各期帳單查詢
      } else {
        this.logger.log("into not unPaid");
        this.nowPage = 'detail'; // 切換至 交易明細(預設)
        this.getBillData(this.selectMonthData); // 發各期帳單API
      }
    } else {
      this.logger.log("get monthData error");
    }
  }

  /**
   * 月份錯誤回傳
   * @param e
   */
  onMonthErrorEvent(e) {
    this.logger.log('History-Bill', 'onMonthErrorEvent', e);
    let errorObj = {};
    if (e.hasOwnProperty('data')) {
      errorObj = e.data;
      errorObj['type'] = 'message';
      this.handleError.handleError(errorObj);
    }
  }
}
