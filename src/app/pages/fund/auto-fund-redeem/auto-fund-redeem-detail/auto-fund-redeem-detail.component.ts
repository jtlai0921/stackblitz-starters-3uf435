/**
 * 理財妙管家
 */
import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { DepositAccountDetailService } from '@pages/deposit/shared/deposit-account-detail.service';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { AutoFundRedeemService } from '@pages/fund/shared/auto-fund-redeem.service';

@Component({
  selector: 'app-auto-fund-redeem-detail',
  templateUrl: './auto-fund-redeem-detail.component.html',
  styleUrls: []
})

export class FundRedeemDetailComponent implements OnInit, OnChanges, OnDestroy , AfterViewInit{
  @Input() setData: any; //api 05030102 request
  @Input() sort: string; //是否開啟排序 DESC遞減，ASC遞增，''不排序
  @Input() page: string | number = 1; //當下頁數
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  infoData: any = {}; //SPEC05030102 存款帳戶明細查詢(資訊)
  listData: any = []; //SPEC05030102 存款帳戶明細查詢(明細)
  // totalData: any = {}; //SPEC05030102 存款帳戶明細查詢(總計相關)
  showData = false;
  // expandFlag: boolean; //是否全部展開
  private nowSort = '';
  private isFirstInit = true; // true 是第一次近來
  private nowSearch = '';
  private subjectObj: any;
  // private _logger: Logger
  // godetail =false; // 控制頁面顯示
  contentData = {}; // 選擇的明細資料


  constructor(
    private AutoFundRedeemService : AutoFundRedeemService,
    // private _handleError: HandleErrorService,
    private _logger: Logger,
    // private _formateService: FormateService
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService
  ) { }

  ngOnInit() {
    console.log("into ngOnInit");
    //test
    // this._logger.error('go3333');
    // this._headerCtrl.setLeftBtnClick(() => {
    //   this.onLeftBtnClick();
    //   });
    //控制展開監聽
    // this.subjectObj = this._mainService.expandSubject.subscribe((value: any) => {
    //   this.expandFlag = value;
    // });
    
    this.doInit();
  }
  //testgodetil
  clickdetail(item){
    this._logger.log("into onGoDetail, item:", item);
    this.contentData = item;
    let output = {
      'infoData': this.infoData,
      'listData': this.listData,
      'contentData': this.contentData,
      'godetail': true
    };

    console.log("clickdetail, output:",output);
    this.backPageEmit.emit(output);
    // this.godetail = true;
  }

  ngAfterViewInit() {
    let el = document.getElementById('aaa');
    console.log('aaa', el);
  }

  //排序參數有改變，就觸發ngOnChanges去變更排序
  ngOnChanges() {
    this._logger.log("ngOnChanges into IrDetailComponent, setData:", this.setData);
    this._logger.log("ngOnChanges into IrDetailComponent, sort:", this.sort);
    console.log("into ngOnChanges");
    this.doInit();
  }

  ngOnDestroy() {
    //刪除監聽物件
    // this.subjectObj.unsubscribe();
  }

/**
     * 子層返回事件(接收第三層)
     * @param e
     */
    onPageBackEvent(e) {
      // this._headerCtrl.setLeftBtnClick(() => {
      //   this.navgator.pop();
      //   });
      this._logger.log('Deposit', 'onPageBackEvent', e);
      this._logger.log('fund', 'onPageBackEvent, detail back', e);
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
      // this.godetail = false;
      // 列表頁返回
      // if (page === 'list-page' && pageType == 'back') {
      //     this._logger.log("onPageBackEvent back, tmp_data:", tmp_data);
      //     let infoData = this._formateServcie.checkObjectList(tmp_data, 'infoData');
      //     // 設定頁面資料，若為第一頁
      //     if (this.pageCounter == 1) {
      //         this._logger.log("onPageBackEvent back, pageCounter == 1");
      //         if (tmp_data.hasOwnProperty('dataTime')) {
      //             this.dataTime = tmp_data['dataTime'];
      //         }
      //         // 之後須改版為下方註解
      //         if (tmp_data.hasOwnProperty('page_info')) {
      //             this.totalPages = tmp_data['page_info']['totalPages']; // 總頁數只拿一次
      //             this._logger.log("totalPages:", this.totalPages, tmp_data);
      //         }
      //     }
      //     return false;
      // }
  }


  /**
   * 重新設定page data 子層返回事件  (回傳第一層)
   * @param item
   */
  onBackPageData(item) {
    let output = {
      'page': 'list-page',
      'type': 'back',
      'data': item,
    };
    this._logger.log("intoooooooo onBackPageData, output:", output);
    this.backPageEmit.emit(output);
  }

/**
* 重新設定page data 子層返回事件
* @param item
*/
onErrorPageData(item) {
  let output = {
    'page': 'list-page',
    'type': 'back',
    'data': item
  };
  this._logger.step('Deposit', 'detail back', item);
  this._logger.log("into onErrorPageData, output:", output);
  this.errorPageEmit.emit(output);
}


  //初始化事件
  private doInit() {
    // this.isFirstInit = false;
    this._logger.log("ngOnInit into IrDetailComponent, setData:", this.setData);
    this._logger.log("ngOnInit into IrDetailComponent, sort:", this.sort);
    // console.log("doInit ,ccc:",ccc);
    // //塞request
    let reqData = {
    //   'searchType': this._formateService.checkField(this.setData, 'id'), //ex: 7D
    //   'accountId': this._formateService.checkField(this.setData, 'accountId'),
    //   'currency': this._formateService.checkField(this.setData, 'currency'),
    //   'startDate': this._formateService.checkField(this.setData, 'startDate'),
    //   'endDate': this._formateService.checkField(this.setData, 'endDate'),
    };
    this.nowSort = (this.sort) ? this.sort : '';
    // //處理頁數
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString());
    }

    // 檢核是否查資料
    let check_research = this.checkReSearch(reqData);
    if (!check_research) {
      this._logger.log("AccountDetail", "no search");
      return false;
    }
      this._logger.log("ready to send api");
      this.showData = false;
      this.listData = [];
    //   //Api SPEC05030102-存款帳戶明細查詢(明細)
      this.getListData(reqData, this.page, this.sort);
  }

  //Api SPEC05030102-存款帳戶明細
  private getListData(reqData, page, sort?: string) {
    let paginator = {
      // pageSize: '20',
      pageNumber: page.toString(),
      // sortColName: 'txDate',
      sortDirection: sort
    };
    let option = {};
    console.log("getListData, paginator:",paginator);
    this.AutoFundRedeemService.getListData(reqData, paginator, option).then(
      (result) => {
        this.infoData = result.infoData;
        this.listData = result.data;
        // this.totalData = result.totalData;
        this.showData = true;
        this._logger.log("getListData success, infoData:", this.infoData);
        this.onBackPageData(result); //回傳總計資訊給父層顯示
      },
      (errorObj) => {
        this._logger.log("getListData error, errorObj:", errorObj);
        errorObj['type'] = 'message';
        this.showData = false;
        this.onErrorPageData(errorObj); //將錯誤資訊給父層
      }
    );
  }


  /**
   * 依功能調整檢核是否查資料
   * @param reqData 
   */
  private checkReSearch(reqData) {
    let new_search = [this.sort,this.page].join('_');
    console.log("new_search:",new_search);
    if (new_search == this.nowSearch) {
      console.log("new_search == this.nowSearch");
      // 欄位相同不重查
      return false;
    }
    this.nowSearch = new_search;
    console.log("new_search != this.nowSearch");
    return true;
  }
   //test
    /**
  * Header左側按鈕點擊事件
  */
//   onLeftBtnClick(){
//   this._logger.log("co ococoo oc ococo oc oco co ");
//   this.backPageEmit.emit();
// }
}