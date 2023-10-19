/**
 * 投資交易明細查詢(主控)
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormateService } from '@template/formate/formate.service';
import { Logger } from '@systems/system/logger/logger.service';
import { PaginatorCtrlService } from '@template/paginator/paginator-ctrl.srevice';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FundProfitLossService } from '@pages/fund/shared/fund-profit-loss.service';
import { FundProfitLossDetailComponent } from '../fund-profit-loss-detail/fund-profit-loss-detail.component';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';


@Component({
  selector: 'app-fund-profit-loss-main',
  templateUrl: './fund-profit-loss-main.component.html',
  styleUrls: []
})

export class FundProfitLossMainComponent implements OnInit {
  bookmarkData = []; // 頁籤設定
  searchBoxRule: any;
  // searchInfoData: Array<any>;
  nowPageType = ''; // 現在頁面切換
  dataTime: string; // 查詢時間
  // request
  reqData = {
    id: '',
    show: 'resultBox', // 顯示查詢結果, 'resultBox':成功, 'customBox':自訂清單, 'errorBox':錯誤畫面(白箱)
    startDate: '',
    endDate: '',
    accountId: '',
    currency: ''
  };
  showSearchBox = false; // 是否顯示自訂查詢
  customReqObj = {
    startDate: '',
    endDate: '',
    bookmark: {}
  };
  sort = 'DESC'; // 是否開啟排序 DESC遞減，ASC遞增，''不排序
  noteData: any; // 注意資訊
  // 儲存帳號資訊(用來發spec05030102)
  // acctData = {
  //     currency: '',
  //     account: ''
  // };
  // 總數相關，取子層發完API回傳
  totalData = {
    totalDramtCount: '', // 支出總筆數
    totalDramt: '', // 支出總計
    totalCramtCount: '', // 存入總筆數
    totalCramt: '' // 存入總計
  };
  showTotal = false; // 子層發送api回傳成功，才顯示總計區塊
  // expandFlag = false; // 是否全部展開
  expandStr = 'BTN.UNFOLD';

  // 分頁機制相關 Start
  pageCounter = 1; // 當前頁次
  totalPages = 0; // 全部頁面
  @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef; // 動態生成(自訂)
  @ViewChild('pageBoxToday', { read: ViewContainerRef }) pageBoxToday: ViewContainerRef; // 動態生成(今天)
  @ViewChild('pageBox3M', { read: ViewContainerRef }) pageBox3M: ViewContainerRef; // 動態生成(一週)
  @ViewChild('pageBox1M', { read: ViewContainerRef }) pageBox1M: ViewContainerRef; // 動態生成(一個月)
  private nowAppendBox: any;
  // 錯誤處理相關
  errorMsg = ''; // 顯示白箱(錯誤訊息)
  // defaultAcct = ''; // 取得預設帳號(不一定有)
  contentData: any; // 傳入詳細頁面資料
  mainPage = 'query'; // 控制主頁流程切換, 'query':查詢頁, 'content':詳細內容頁

  constructor(
    private _mainService: FundProfitLossService,
    private _formateServcie: FormateService,
    private _logger: Logger,
    private paginatorCtrl: PaginatorCtrlService,
    private _handleError: HandleErrorService,
    private  navgator: NavgatorService,
    private _headerCtrl: HeaderCtrlService,
  ) { }

  ngOnInit() {
    this._logger.log("into AccountMainComponent");
    this._initEvent();
  }

  private _initEvent() {
    this._mainService.removeAllCache();
    // 取得注意資訊
    this.noteData = this._mainService.getNoteData();
    this._logger.log("into _initEvent");
    this.bookmarkData = this._mainService.getBookmark();
    // 查詢頁面條件
    this.searchBoxRule = this._mainService.getDateSet('custom');
    // let pageData = {
    //   startDate: this.reqData['startDate'],
    //   endDate: this.reqData['endDate']
    // };
    // this.onChangePage(this.reqData.id, pageData);
    this._logger.log("_initEvent, bookmarkData:", this.bookmarkData);
  }

  /**
   * 排序
   */
  onSort() {
    this._logger.log("into onSort, nowPageType:", this.nowPageType);
    this.reqData.show = 'resultBox';
    this.errorMsg = ''; // 錯誤訊息清掉
    this._resetPage();
    if (this.sort == 'DESC') {
      this.sort = 'ASC';
    } else {
      this.sort = 'DESC';
    }
  }

  /**
   * 展開
   */
  // onOpen() {
  //     if (!!this.expandFlag) {
  //         this.expandStr = 'BTN.UNFOLD';
  //         this.expandFlag = false;
  //     } else {
  //         this.expandStr = 'BTN.COLLAPSE';
  //         this.expandFlag = true;
  //     }
  //     this._mainService.changeExpandSubject(this.expandFlag);
  // }

  /**
   * 帳號回傳(準備查詢交易明細)
   * @param e
   */
  // onAcctBackEvent(e) {
  //     this._logger.log('Deposit', 'onAcctBackEvent', e);
  //     if (e.hasOwnProperty('data')) {
  //         // 紀錄帳號回傳資訊(發送spec05030102使用)
  //         let change_act = this._formateServcie.checkObjectList(e, 'data.account');
  //         let change_currency = this._formateServcie.checkObjectList(e, 'data.currencyCode');
  //         if (change_act == this.acctData.account && change_currency == this.acctData.currency) {
  //             return false;
  //         }
  //         this.acctData.account = change_act;
  //         this.acctData.currency = change_currency;
  //     }
  //     let pageData = {
  //         search_data: {
  //             startDate: this.reqData['startDate'],
  //             endDate: this.reqData['endDate']
  //         }
  //     };
  //     this._resetPage();
  //     this.onChangePage(this.reqData.id, pageData);
  // }

  /**
   * 帳號錯誤回傳
   * @param e
   */
  // onAcctErrorEvent(e) {
  //     this._logger.log('Deposit', 'onAcctErrorEvent', e);
  //     let errorObj = {};
  //     if (e.hasOwnProperty('data')) {
  //         errorObj = e.data;
  //         errorObj['type'] = 'message';
  //         // 查無資料處理
  //         if (errorObj['content'] == 'ERROR.EMPTY_SEARCH') {
  //             this._logger.log("into errorObj['content'] == 'ERROR.EMPTY_SEARCH'");
  //             this._handleError.handleError({
  //                 type: 'dialog',
  //                 title: 'POPUP.ALERT.TITLE',
  //                 content: "ERROR.ACCOUNT_EMPTY"
  //             });
  //         } else {
  //             this._handleError.handleError(errorObj);
  //         }
  //     }
  // }

  /**
   * 頁籤回傳
   * @param e
   */
  onBookMarkBack(e) {
    this._logger.log('Deposit', 'onBookMarkBack', e);
    let page = '';
    let set_data: any;
    let set_id: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = this._formateServcie.transClone(e.page);
      }
      if (e.hasOwnProperty('data')) {
        set_data = this._formateServcie.transClone(e.data);
        if (set_data.hasOwnProperty('id')) {
          set_id = this._formateServcie.transClone(set_data.id);
        }
      }
    }

    if (set_id === 'custom') {
      this.showSearchBox = true; // 顯示自訂box
      this.showTotal = false; // 切換頁籤時，都關閉總數區塊，api發成功再顯示
      this.customReqObj.bookmark = set_data;
      this.sort = this.sort; // 判斷點擊排序，切換頁籤時，代表沒有按下排序(帶入現在的)
      this.expandStr = 'BTN.UNFOLD'; // 預設展開(顯示)
      this._resetPage(); // 切換頁籤重製頁面
      this._logger.log("into custom, set_data:", this._formateServcie.transClone(set_data));
      this._logger.log("into custom, customReqObj:", this._formateServcie.transClone(this.customReqObj));
      this.onChangePage('custom', set_data);
    } else {
      this._logger.log("into another search");
      this.sort = this.sort; // 判斷點擊排序，切換頁籤時，代表沒有按下排序(帶入現在的)
      this.expandStr = 'BTN.UNFOLD'; // 預設展開(顯示)
      this.showTotal = false; // 切換頁籤時，都關閉總數區塊，api發成功再顯示
      this._resetPage(); // 切換頁籤重製頁面
      this.onChangePage(set_id, set_data);
    }
  }

  /**
   * 切換頁面
   * @param pageType 
   * @param pageData 
   */
  onChangePage(pageType?: string, pageData?: any) {
    this._logger.log("into onChangePage, pageType:", pageType);
    this._logger.log("into onChangePage, pageData:", pageData);
    if (pageType === 'search-box') {
      //  自訂查詢表單
      this._logger.log("into pageType == search-box");
      this.nowPageType = 'custom'; // 切換自訂頁面
      this._resetPage(); //  重製頁數
      this.showSearchBox = true; // 顯示自訂box
      this.reqData.show = 'customBox'; // 是否顯示查詢結果區塊
      this.errorMsg = ''; // 錯誤訊息清掉
      pageType = 'custom';
    } else if (pageData.hasOwnProperty('search_data')) {
      // 顯示明細結果
      this._logger.log("into pageData has search_data");
      let show_deatil = 'resultBox'; // 顯示查詢結果區塊
      if (pageType === 'custom') {
        this._logger.log("into pageType == custom");
        // 例外處理
        if (this.customReqObj.startDate == '' || this.customReqObj.endDate == '') {
          // 自訂起訖設定錯誤
          this._logger.log("into customReqObj startDate,endDate error");
          // this._resetPage(); 重製頁數
          // this.reqData.show = false; //是否顯示查詢結果區塊
          this.onChangePage('search-box', pageData); // 畫面顯示搜尋頁
          return false;
        }
        pageData['search_data']['startDate'] = this.customReqObj.startDate; // customReqObj有設定過，塞入原日期
        pageData['search_data']['endDate'] = this.customReqObj.endDate;
        this._logger.log("customReqObj not empty, push date, pageData:", pageData);
      } else {
        if (pageData['startDate'] == '' || pageData['endDate'] == '') {
          // bookmark設定錯誤, 若無起迄日期時的例外處理
          this._logger.log("into pageData startDate,endDate error");
          this.onChangePage('search-box', pageData); // 畫面顯示搜尋頁
          return false;
        }
      }
      this._resetPage();
      this.showSearchBox = false; // 準備開始查詢後，隱藏搜尋欄
      // 設定reqData 呼叫子層查詢明細
      this.reqData = {
        id: pageType,
        show: show_deatil,
        startDate: pageData['search_data']['startDate'],
        endDate: pageData['search_data']['endDate'],
        accountId: 'a1123255232',
        currency: 'TWD'
      };
      this._logger.log("ready to send, reqData:", this.reqData);
      // 若取得帳號，才切換子層發送api(查詢區間)
      // if (this.acctData['account'] != '' && typeof this.acctData['account'] != 'undefined') {
      //     this._logger.log("go to search component");
          this.nowPageType = pageType;

      // }
    } else {
      // 不知道查詢區間
      this._logger.log("search_data error");
      this._handleError.handleError({
        type: 'alert',
        title: 'ERROR.TITLE',
        content: 'ERROR.EMPTY_SEARCH_INFO'
      });
      this.onChangePage('search-box', pageData); // 畫面顯示搜尋頁
    }
  }

  /**
   * 自訂表單查詢返回事件(變動查詢起訖)
   * @param e
   */
  onSearchBack(e) {
    this._logger.log("into onSearchBack, e:", e);
    this._logger.log("into onSearchBack, customReqObj:", this.customReqObj);
    let set_data: any;
    if (typeof e === 'object' && e.hasOwnProperty('data')) {
      set_data = e.data;
    }
    // req有出來後處理
    let pageData = this._formateServcie.transClone(this.customReqObj.bookmark);
    if (set_data.startDate === this.customReqObj.startDate &&
      set_data.endDate === this.customReqObj.endDate
    ) {
      // 無改變處理
      pageData['search_data']['startDate'] = this.customReqObj.startDate;
      pageData['search_data']['endDate'] = this.customReqObj.endDate;
    } else {
      // 重新查詢
      pageData['search_data']['startDate'] = set_data.startDate;
      pageData['search_data']['endDate'] = set_data.endDate;
      this.customReqObj.startDate = set_data.startDate;
      this.customReqObj.endDate = set_data.endDate;
    }
    this.onChangePage('custom', pageData);
  }

  /**
   * 重新查詢
   */
  onReStartQuery() {
    this._logger.log("into onReStartQuery");
    this.onChangePage("search-box");
  }


  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    this._logger.log("into onScrollEvent, this.reqData:", this.reqData);
    let appendBox: any;
    switch (this.nowPageType) {
      case 'today': appendBox = this.pageBoxToday; break;
      case '3M': appendBox = this.pageBox3M; break;
      case '1M': appendBox = this.pageBox1M; break;
      case 'custom': appendBox = this.pageBox; break;
    }
    if (!appendBox && this.reqData.show != 'resultBox') {
      this._logger.log('Deposit', 'stop scroll');
      return false;
    }
    this.nowAppendBox = appendBox;
    this._logger.log('Deposit', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
    this.pageCounter = next_page;
    let componentRef: any = this.paginatorCtrl.addPages(this.nowAppendBox, FundProfitLossDetailComponent);
    componentRef.instance.setData = this.reqData;
    componentRef.instance.page = next_page;
    componentRef.instance.sort = this.sort;
    componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
    componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
  }

  /**
   * 子層返回事件(分頁)
   * @param e
   */
  onPageBackEvent(e) {
    this._logger.log('Deposit', 'onPageBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        tmp_data = e.data;
      }
    }
  
    // 列表頁返回
    if (page === 'list-page' && pageType == 'back') {
      this._logger.log("onPageBackEvent back, tmp_data:", tmp_data);
      let infoData = this._formateServcie.checkObjectList(tmp_data, 'infoData');
      // this.totalData['totalCramtCount'] = infoData['totalData']['totalCramtCount'];
      // this.totalData['totalCramt'] = infoData['totalData']['totalCramt'];
      // this.totalData['totalDramtCount'] = infoData['totalData']['totalDramtCount'];
      // this.totalData['totalDramt'] = infoData['totalData']['totalDramt'];
      this.showTotal = true; // 顯示總數相關
      // 設定頁面資料，若為第一頁
      if (this.pageCounter == 1) {
        this._logger.log("onPageBackEvent back, pageCounter == 1");
        if (tmp_data.hasOwnProperty('dataTime')) {
          this.dataTime = tmp_data['dataTime'];
        }
        // 之後須改版為下方註解
        if (tmp_data.hasOwnProperty('page_info')) {
          this.totalPages = tmp_data['page_info']['totalPages']; // 總頁數只拿一次
          this._logger.log("totalPages:", this.totalPages, tmp_data);
        }
      }
      return false;
      // 前往詳細內容 detail點擊其中一筆 => main
    } else if (page === 'list-page' && pageType == 'go') {
      this.contentData = tmp_data;
      this.mainPage = 'content'; // 切換至詳細內容頁
      // 詳細內容返回 
    } else if(page === 'content' && pageType == 'back') {
      this._logger.log("into page, content-page");
      this.mainPage = 'query'; // 切換為查詢頁面
      this.pageCounter = 1;
      this._headerCtrl.setLeftBtnClick(() => {
        this.navgator.pop();
      });
    }
  }

  /**
   * 失敗回傳(分頁)
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(e) {
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
    this.reqData.show = 'errorBox';
    this.errorMsg = errorObj.content; // 給錯誤訊息
    this._logger.log("onErrorBackEvent, pageCounter:", this.pageCounter);

    switch (page) {
      case 'list-page':
        // == 分頁返回 == //
        if (this.pageCounter == 1) {
          this._logger.log("pageCounter == 1, errorObj:", errorObj);
          // 列表頁：首次近來錯誤推頁
          this.dataTime = (errorObj.hasOwnProperty('dataTime')) ? errorObj['dataTime'] : '';
          // == 2019/6/19 不alert錯誤原因(改頁面顯示) == //
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
        } else {
          this._logger.log("pageCounter !=1, errorObj:", errorObj);
          // 其他分頁錯誤顯示alert錯誤訊息
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
        }
        break;
    }
  }

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

  /**
   * 重設頁面
   */
  private _resetPage() {
    this._logger.log("into _resetPage");
    this.pageCounter = 1;
    this.totalPages = 0;
    this.dataTime = '';
    if (this.nowAppendBox) {
      this.nowAppendBox.clear();
    }
  }

}
