/**
 * 未出帳消費查詢
 */
import { Component, OnInit, AfterViewInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { HistoryBillService } from '@pages/card/shared/history-bill-main.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FormateService } from '@template/formate/formate.service';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
declare var Swiper: any;

@Component({
  selector: 'app-history-bill-unpaid',
  templateUrl: './history-bill-unpaid.component.html',
  styleUrls: []
})

export class HistoryBillUnpaidComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() setData: any; // 交易明細資料
  @Input() selectedMonth: string; // 選擇之年月份
  @Input() cardData: any; // 信用卡資料
  @Input() swiperChangeData: any; // 滑動信卡切換資料用 
  expandFlag: boolean; // 是否全部展開
  // private subjectObj: any;
  sort = 'DESC'; // 排序
  expandStr = 'BTN.UNFOLD';
  showData = []; // 顯示下方明細用， 會依照卡片swiper替換資料
  private swiper: any;

  constructor(
    private logger: Logger,
    private mainService: HistoryBillService,
    private handleError: HandleErrorService,
    private _formateService: FormateService,
    private _headerCtrl: HeaderCtrlService
  ) { }

  ngOnInit() {
    this.logger.log("into HistoryBillUnpaidComponent, setData:", this.setData);
    this._headerCtrl.setOption({
      'title': 'FUNC.CREDIT_CARDS.TRANSACTIONS_NOT_YET_BILLED',
      'leftBtnIcon': 'back'
    });
    this.showData = this.setData;
  }

  // 帳號有改變(selectedMonth)，就觸發ngOnChanges去重製展開預設
  ngOnChanges() {
    this.logger.log("HistoryBillUnpaidComponent, into ngOnChanges");
    this.expandStr = 'BTN.UNFOLD'; // 有切換帳號時,展開收合,排序重置預設(展開,遞減)
    this.expandFlag = false;
    this.sort = 'DESC';
    this.showData = this.setData;
    let formateObj = { sort: 'transDate', reverse: this.sort };
    let formateData = this.mainService.formateSortData(this.showData, formateObj);
    this.showData = formateData;
    // 有切換卡片or點擊排序,就重製
    this.mainService.resetHasYearList();
  }

  // 畫面產生完資料後會執行
  ngAfterViewInit() {
    // this.logger.log("into ngAfterViewInit 22222");
    // this.doSwiper();
  }

  ngOnDestroy() {
    // 刪除監聽物件
    // this.subjectObj.unsubscribe();
  }

  /**
 * 接收card-swiper.directive.ts 返回
 * @param e 
 */
  onSwiperBackEvent(e) {
    this.doSwiper();
  }

  // swiper設定
  doSwiper() {
    if (typeof Swiper != 'function') {
      this.logger.log("into swiper error");
      return false;
    }
    this.logger.log("into do swiper");
    if (!(this.swiper instanceof Swiper)) {
      this.logger.log("Swiper doEvent new swiper");
      this.swiper = new Swiper('.swiper-container_credit', {
        slidesPerView: 'auto',  // 設置slider容器能同時顯示的slides數量
        centeredSlides: true,   // 設定為true時，活動塊會居中，而不是默認狀態下的居左
        spaceBetween: 20,       // 兩個區塊間距
        pagination: {
          el: '.swiper-pagination_credit',
          clickable: true,      // 設置為true時，點擊分頁的指示點會控制Swiper切換
        },
        on: {
          // slideChange start
          slideChange: () => {
            let swiperIndex = this.swiper.activeIndex - 1; // 全部信用卡沒跑迴圈，索引值-1
            this.expandStr = 'BTN.UNFOLD'; // 有切換卡片時,展開收合,排序重置預設(展開,遞減)
            this.expandFlag = false;
            this.sort = 'DESC';
            // 當滑動到全部信卡(固定第一個 index: 0-1: -1), 塞全部信卡資料
            if (swiperIndex < 0) {
              this.showData = this.setData; // 傳全部資料
            } else {
              this.showData = this.swiperChangeData[this.cardData[swiperIndex]['cardLst']];
            }
            let formateObj = { sort: 'transDate', reverse: this.sort };
            let formateData = this.mainService.formateSortData(this.showData, formateObj);
            this.showData = formateData;
            // 有切換卡片or點擊排序,就重製
            this.mainService.resetHasYearList();
          }
          // slideChange end
        }
      });
    } else {
      this.logger.log("Swiper doEvent update");
      this.swiper.update(true);
      this.swiper.slideTo(0); // 若改變帳號切回顯示第一筆
    }
  }

  /**
   * 排序
   */
  onSort() {
    this.logger.log("into onSort");
    // 有切換卡片or點擊排序,就重製
    this.mainService.resetHasYearList();
    this.expandStr = 'BTN.UNFOLD'; // 有點擊排序就重置，展開收合預設
    this.expandFlag = false;
    if (this.sort == 'DESC') {
      this.sort = 'ASC';
    } else {
      this.sort = 'DESC';
    }
    let formateObj = { sort: 'transDate', reverse: this.sort };
    let formateData = this.mainService.formateSortData(this.showData, formateObj);
    this.showData = formateData;
  }

  defaultSort() {
    let formateObj = { sort: 'transDate', reverse: this.sort };
    let formateData = this.mainService.formateSortData(this.showData, formateObj);
    this.showData = formateData;
  }

  /**
   * 展開
   */
  onOpen() {
    if (!!this.expandFlag) {
      this.expandStr = 'BTN.UNFOLD';
      this.expandFlag = false;
    } else {
      this.expandStr = 'BTN.COLLAPSE';
      this.expandFlag = true;
    }
  }
}
