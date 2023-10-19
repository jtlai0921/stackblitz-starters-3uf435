import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit,ViewChild,NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../../shared/service/global/layout.service';
// import { GetAcctSummInqService } from '../../../shared/service/customize/getAcctsumminq.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { TDSummInqRqService } from '../../../shared/service/customize/TDSummInqRq.service';
import { LangTransService } from 'src/app/shared/pipe/langTransPipe/lang-trans.service';
import { AcctSummPlusInqService } from '../../../shared/service/customize/acctSummPlusInq.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';

import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { SearchFilterService } from '../../../shared/component/public/search-filter.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { KEY_CURRENCY_PARA } from '../../../../assets/configuration/userParaKey';
import { SortByService } from '../../../shared/service/global/sortby.service';
import { SearchComponent } from '../../../shared/component/public/search.component';


@Component({
  selector: 'app-deposit-summary',
  templateUrl: './deposit-summary.component.html',
  styleUrls: ['./deposit-summary.component.css']
})


export class DepositSummaryComponent implements OnInit, AfterViewInit {

  /**
   * 參數設定
   */
  @Output() toDetailPage: EventEmitter<any> = new EventEmitter;
  @Input() homeReq: any; // 由總覽頁過來的設定
  @ViewChild(SearchComponent)
  private searchComponent: SearchComponent;

  public depositData;
  // public depositData;
  public selCompanyName = 'DEPOSITSUMMARY.ALL_COMPANY';
  public selCustomerId = '0';

  public selectedData;
  public showData = []; // 畫面呈現的data
  public selectedOption = '0';
  public selectedCountry = 'GL';
  public depositSumPage = true;
  public depositDetailPage = false;
  public loanSumPage = false;
  public tabClass = 'active_1';
  public detailReq;
  public formWho = 'deposit_summary';
  public dateTime; //當前時間
  public temp = { AcctCurrency: "", AcctType: "" };  //filter暫存篩選條件
  public isSave = false;
  public source = [];
  public filterArray = ['AcctNo','CustomerId','AcctName','BranchName']; //搜尋Bar條件扣帳帳號，所屬統編，所屬公司名，扣帳銀行名稱

  //幣別CSS
  public tagStyle = "currency";

  //query pop
  public filterBlock = false;

  // 公司選單資料陣列
  public companyListData;


  reloadShowData;
  reloadSelCustomerId;


  constructor(
    public layout: LayoutService,
    private acctSummPlusInq: AcctSummPlusInqService,
    private tdSummaryService: TDSummInqRqService,
    private langTransService: LangTransService,
    public router: Router,
    public popup: PopupService,
    public route: ActivatedRoute,
    private dateformat: DateTimeService,
    private searchFilter: SearchFilterService,
    private storage: LocalStorageService,
    private functionList: FunctionListService,
    public sort: SortByService,
    private zone:NgZone
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.DEPOSIT_DETAIL'
    });
  }


  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.dateTime = this.dateformat.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss'); //設置當前時間
        //下拉reload要保留原本資料
        this.reloadShowData = this.showData;
        this.reloadSelCustomerId = this.selCustomerId;

        this.getData();
      }
    });
  }

  //從首頁過來時 下拉跟篩選的處理
  homeInq() {
    if (this.homeReq != undefined) {
      var trueIndex = this.companyListData.findIndex((item)=>{
        return item.checked;
      })
      var index = 0;
      if (this.homeReq.companyType == "Country") {
        this.onCountryChange(this.homeReq.country)
        index = this.companyListData.findIndex((item)=>{
          return item.type == 'country' && item.original.country == this.homeReq.country
        })
      } else if (this.homeReq.companyType == "Customer") {
        this.onCompanyChange(this.homeReq.country,this.homeReq.company)
        index = this.companyListData.findIndex((item)=>{
          return item.type == 'company' 
          && item.original.company == this.homeReq.company
          && item.original.country == this.homeReq.country
        })
      }
      this.companyListData[trueIndex].checked = false;
      this.companyListData[index].checked = true;
      this.selCustomerId = this.homeReq.company;
      this.selCompanyName = this.companyListData[index].desc;

      if (this.homeReq.product != undefined && this.homeReq.product != "") {
        Object.assign(this.filterObj, { AcctType: this.homeReq.product })
        this.viewProductNameData.default_value = this.homeReq.product;
      }
      if (this.homeReq.currency != undefined && this.homeReq.currency != "") {
        Object.assign(this.filterObj, { AcctCurrency: this.homeReq.currency })
        this.viewCurrencyData.default_value = this.homeReq.currency;
      }
      this.doFilter();
      this.homeReq = undefined;
    }
  }

  ngOnInit() {
    this.getData();
    this.dateTime = this.dateformat.datetimeFormat(Date.now(), 'yyyy/MM/dd hh:mm:ss'); //設置當前時間
  }

   /**
   * 頁面input搜尋
   */
  public search_result_data;
  search_result(filter) {
    //console.log('search_result_data >>>>', filter);
    this.showData = filter
    this.LoadPage(true);
    //this.pagerData = filter
  }

  getData() {
    
    this.showData = [];
    //初始化篩選
    this.filterObj = {};
    this.resetFilter();
    //初始化搜尋
    this.searchComponent.searchkey = "";
    var cur = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
    if (cur == "" || cur == undefined) {
      cur = "TWD";
    }
    this.acctSummPlusInq.acctSummPlusInq(cur).then(
      (res) => {
        // 清單取得成功
        console.log("[存款概要頁][API] acctSummPlusInq success", JSON.parse(JSON.stringify(res)));

        // 過濾非定存帳戶可用餘額、帳戶餘額均為0之資料
        let filterAcctSummList = res['AcctSummList'].filter(data => 
          data['AcctType'] == "T" || 
          (data['AcctType'] != "T" && data['AvailBalance'] != "0" && data['CurBalance'] != "0")
        );
        res['AcctSummList'] = filterAcctSummList;
        console.log("[存款概要頁][API] filter res", res);

        //初始化產品別
        let data = this.modify(res);

        // 公司選單數據
        this.companyListData = this.sort.sortCompanyList(res['AcctSummList'], 
          {
            keyCountry: "Country",
            keyCompanyId: "CustomerId",
            keyCompanyName: "CustomerName",
            showAll: true,
            allDesc: 'DEPOSITSUMMARY.ALL_COMPANY'
          }
        );

        // this.selCompanyName = 'DEPOSITSUMMARY.ALL_COMPANY';

        console.log("[存款概要頁] companyListData", this.companyListData);

        this.depositData = data['depositData'];

        this.selectedData = JSON.parse(JSON.stringify(this.depositData['list']));
        this.source = JSON.parse(JSON.stringify(this.depositData['list']));
        this.getTDSummary();
      },
      (error) => {
        console.log('acctSummPlusInq error', error);
        let ResultCode = error['Result'] ? error['Result'] : error['HeaderRs']['Result'];

        //ERROR_125為查無匯率資料，不跳POP
        if(ResultCode == "125"){
          
        }else{
          // 顯示錯誤訊息
          this.popup.setConfirm({
            content: this.langTransService.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')'
          });
        }
        
        this.pagerData = [];
        // 關閉Loading畫面
        this.popup.setLoading(false);
      }
    )
  }



  setDetailFlag() {
    this.showData.forEach(element => {
      if (element.AcctType != "T" && element.AcctType != "SD") {
        element.detailFlag = this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY)
      } else if (element.AcctType == "SD") {
        element.detailFlag = this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY_ST)
      } else {
        element.detailFlag = false;
      }
    });
  }
  /**
   * [API] Summary of Term Deposits 定存
   */
  getTDSummary() {
    return new Promise((resolve, reject) => {
      var cur = this.storage.get(KEY_CURRENCY_PARA.SELECTED_CURRENCY);
      if (cur == "" || cur == undefined) {
        cur = "TWD";
      }
      this.tdSummaryService.getTDSummary({ Currency: cur }).then(
        (tdSummary_res) => {
          console.log('[STEP] getTDSummary', tdSummary_res);
          // 清單取得成功
          this.depositData = this.ALLandTmodify(tdSummary_res['TDAcctList']);

          this.selectedData = JSON.parse(JSON.stringify(this.depositData['list']));

          this.setDetailFlag();
          this.initView();
          resolve(tdSummary_res);
        },
        (tdDetail_err) => {
          var tempArr = [];
          for(var i = 0;i<this.depositData['list'].length;i++){
            if("T" !== this.depositData['list'][i].AcctType){
              tempArr.push(this.depositData['list'][i]);
            } 
          }
          this.depositData['list'] = tempArr;
          this.selectedData = JSON.parse(JSON.stringify(this.depositData['list']));
          this.source = JSON.parse(JSON.stringify(this.depositData['list']));
          this.setDetailFlag();
          this.initView();
          reject(tdDetail_err);
        }
      );
    });
    
  }

  initView() {
    this.showData = this.selectedData;

    //reloadShowData儲存下拉reload值，如果有值表示是從下拉reload進入拿取之前的值
    if(this.reloadShowData){
      //顯示資料
      this.showData = this.reloadShowData;
      //篩選器出現條件資料
      this.selectedData = this.showData;
    }

    this.LoadPage();
    this.setFilterData();
    this.homeInq();

    // 關閉Loading畫面
    this.popup.setLoading(false);
  }

  groupAcctOfT(data) {
    let newObj = {};
    let count;
    data['list'].forEach(item => {
      if (item.AcctType == 'T') {
        if (newObj[item.CustomerId] == undefined) {
          newObj[item.CustomerId] = { Tdata: [item], AcctType: 'T', openFlag: true, AcctTypeCH: item.AcctTypeCH, Country: item.Country,forIndex: "T_"+item.Country+"_"+item.CustomerId };
          count = 1;
        } else {
          newObj[item.CustomerId]['Tdata'].push(item);
          count = count + 1;
          if (count > 3) {
            newObj[item.CustomerId]['openFlag'] = false;
          }
        }
      }
    });
    data['list'].forEach((item, i) => {
      if (item.AcctType == 'T') {
        data['list'].splice(i, newObj[item.CustomerId]['Tdata'].length, newObj[item.CustomerId]);
      }
    });
    return data;
  }


  /**
   * 處理定存資料
   * 以電文183回傳之定存資料為基礎，補充201電文之定存資料
   */
  ALLandTmodify(data) {
    //完整之定存資料
    let TCompleteArray = [];

    //201比對183資料，符合的相加在一起再挑出來
    this.depositData['list'].forEach(((item, i) => {
      data.forEach(Titem => {
        if (item.AcctNo.trim() == Titem.AcctNo.trim() && item.AcctType == 'T') {
          this.depositData['list']
          TCompleteArray.push(Object.assign(item, Titem));
        }
      });
      this.depositData['list'][i]['openFlag'] = false;
    }));

    //儲存沒有定存資料之201
    let tempArray = [];


    //去掉201裡面定存資料
    this.depositData['list'].forEach(((item, i) => {
      if(item.AcctType != 'T'){
        tempArray.push(item);
      }
    }));

    //將完整之定存資料添加回去
    TCompleteArray.forEach(item =>{
      tempArray.push(item);
    })

    
    this.depositData['list'] = tempArray;


    // 定存group
    let finalModifyData = this.groupAcctOfT(this.depositData);
    return finalModifyData;
  }

  onCountryChange(e) {
    console.log('[存款概要頁] onCountryChange code =', e);
    this.selectedCountry = e;
    this.selectedOption = e;
    let changeData = [];
    if (e == "GL") {
      changeData = JSON.parse(JSON.stringify(this.depositData['list']));
    } else {
      this.depositData['list'].forEach(item => {
        if (item.Country == e) {
          changeData.push(item);
        }
      });
    }
    console.log('[存款概要頁] onCountryChange showData', this.selectedData);
    this.selectedData = changeData;
  }

  onCompanyChange(country,id) {
    let changeData = [];
    let sorceData = JSON.parse(JSON.stringify(this.depositData['list']));
    sorceData.forEach(item => {
      if (item.Country == country || country == 'GL') {
        if (item.CustomerId == id) {
          changeData.push(item);
        } else if (id == '0') {
          changeData.push(item);
          //處理定存group
        } else if (item.Tdata == undefined ? "" : item.Tdata[0].CustomerId == id) {
          changeData.push(item);
        }
      }
    });
    console.log('[存款概要頁] onCompanyChange showData', this.selectedData);
    this.selectedData = changeData;
  }

  onCardClick(e) {
    if (e.AcctType == "T") {
      if (!this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY_TD)) {
        this.popup.setConfirm({
          content: 'MENU.NO_PERMISSION' // 無法進入該功能，請確認您的權限
        });
        return;
      }
    } else if (e.AcctType == "SD") {
      if (!this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY_ST)) {
        this.popup.setConfirm({
          content: 'MENU.NO_PERMISSION' // 無法進入該功能，請確認您的權限
        });
        return;
      }
    } 
    else {
      if (!this.functionList.checkHasFunction(FunctionListService.ACCT_ACTIVITY)) {
        this.popup.setConfirm({
          content: 'MENU.NO_PERMISSION' // 無法進入該功能，請確認您的權限
        });
        return;
      }
    }
    this.toDetailPage.emit(e);
  }

  onCollapseClick(e, i) {
    this.showData[i].openFlag = !e;
  }

  /**
   * 篩選器Popup開關控制
   */
  detailFiler() {
    // Open Filter Popup [TODO!!!]
    this.popup.setDepositSummary({
      event: (selectedValue) => {
        console.log(selectedValue);
      }
    });
  }

  /**
   * 開啟下拉選單
   */
  onCompanyClick() {
    console.log("[存款概要頁] onCompanyClick list =", this.companyListData);


    //下拉reload儲存設定檢查
    if(this.reloadSelCustomerId){
      this.companyListData.forEach(item=>{
        if(item.original.company == this.reloadSelCustomerId){
          item.checked = true;
        }else{
          item.checked = false;
        }
      })
    }

    this.popup.setCheckList({
      data: this.companyListData,
      type: 'radio',
      event: (result) => {
        console.log("[存款概要頁] onCompanyClick result =", result);
        this.showData = [];
        //初始化篩選
        this.filterObj = {};
        this.resetFilter()
        //初始化搜尋
        this.searchComponent.searchkey = "";
        this.selectedData = [];
        if (result.type == "all") {
          // 所有公司
          this.selectedCountry = "GL";
          this.selCustomerId = "";
          this.onCountryChange("GL");
        }
        else if (result.type == "country") {
          // 所有地區
          this.selectedCountry = result['original']['country'];
          this.selCustomerId = result['original']['country'];
          this.onCountryChange(result['original']['country']);
        } else {
          // 指定公司
          this.selectedCountry = "GL";
          this.selCustomerId = result['original']['company'];
          this.onCompanyChange(result['original']['country'],result['original']['company']);
        }
        this.selCompanyName = result['desc'];

        //將下拉結果設定於搜尋中
        this.source = this.selectedData;
        this.searchComponent.source = this.selectedData;
        this.searchComponent.Submit();
      }
    });
  }



  //觸底更新handler
  public pager = 0;      //目前顯示筆數
  public pagerAdd = 20;   //每次增加筆數
  public pagerData = undefined; //顯示資料筆數
  public showLoad = false;//顯示下方載入更多
  LoadPage(reset?) {
    this.zone.run(()=>{
      if (this.pagerData == undefined) {
        this.pagerData = [];
      }
      if (reset) {
        this.pager = 0;
        this.showLoad = true;
      }
      if (this.showData.length > this.pager + this.pagerAdd) {
        this.pager += this.pagerAdd;
        this.pagerData = this.showData.slice(0, this.pager);
        this.showLoad = true;
      } else {
        this.pagerData = this.showData;
        this.showLoad = false;
      }
    })
  }

  modify(data) {

    let depositData = {
      'list': [],
      'curOrder': {},
      'countryOrder': {}
    };

    data['AcctSummList'].forEach(item => {
      switch (item.AcctType) {
        case 'S':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.S';
          item['AcctTypeNum'] = '1';
          depositData.list.push(item);
          break;

        case 'C':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.C';
          item['AcctTypeNum'] = '2';
          depositData.list.push(item);
          break;

        case 'T':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.T';
          item['AcctTypeNum'] = '3';
          depositData.list.push(item);
          break;

        case 'SD':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.SD';
          item['AcctTypeNum'] = '4';
          depositData.list.push(item);
          break;

        case 'SE':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.SE';
          item['AcctTypeNum'] = '5';
          depositData.list.push(item);
          break;

        case 'O':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.O';
          item['AcctTypeNum'] = '6';
          depositData.list.push(item);
          break;

        case 'OD':
          item['AcctTypeCH'] = 'DEPOSITSUMMARY.OD';
          item['AcctTypeNum'] = '7';
          depositData.list.push(item);
          break;

        default:
          break;
      }
      item.forIndex = item.AcctType + "_" + item.Country+ "_" + item.CustomerId + "_" + item.AcctCurrency + "_"+ item.AcctNo 
    });

    depositData['curOrder'] = this.sortByCur(depositData['list']);
    depositData['countryOrder'] = this.sortByCountry(depositData['list']);
    depositData['list'] = this.sortByModify(depositData['list'], depositData['countryOrder'], depositData['curOrder']);

    data['depositData'] = depositData;
    return data;
  }

  /**
   * 辨別不重複更新的 ngFor
   * @param index 
   * @param item 
   */
  trackByFn(index, item) {
    return index;
  }
  /**
   * 幣別排序Array
   * 排序為，該國網銀本幣排第一個，TWD第二，其餘依字母先後排序
   * @param sortCurData
   */
  sortByCur(sortCurData) {
    let currency = {};
    let curOrder = [];
    sortCurData.forEach(item => {
      if (currency[item.AcctCurrency] == undefined) {
        currency[item.AcctCurrency] = [item.AcctCurrency];
      }
    });
    curOrder = Object.keys(currency);
    curOrder = curOrder.sort(function (a, b) {
      return a > b ? 1 : -1;
    });

    let twIndex = curOrder.indexOf('TWD');
    curOrder.splice(twIndex, 1);
    curOrder.unshift('TWD');
    return curOrder;
  }

  /**
   * 幣別排序Array
   * 排序為，第一個為GL全球'、第二個是登入之網銀國別、第三個是台灣，其餘依照首位字母由A至Z排
   * @param sortCountryData
   */
  sortByCountry(sortCountryData) {
    let country = {};
    let countryOrder = [];

    sortCountryData.forEach(item => {
      var index_ = countryOrder.findIndex(sub_item => {
        return item.Country == sub_item.Country
      })
      if (item && index_ === -1) {
        countryOrder.push({ Type: "Country", Value: item.Country });
      }
    });

    sortCountryData.forEach(item => {
      if (country[item.Country] == undefined) {
        country[item.Country] = [item.Country];
      }
    });
    countryOrder = Object.keys(country);
    countryOrder = countryOrder.sort(function (a, b) {
      return a > b ? 1 : -1;
    });

    let twIndex = countryOrder.indexOf('TW');
    countryOrder.splice(twIndex, 1);
    countryOrder.unshift('TW');
    countryOrder.unshift('GL');
    return countryOrder;
  }

  /**
   * 資料排序 
   * ‘全站邏輯’：國別>統編+公司名稱>產品別>幣別
   * @param sortByData 
   * @param countryOrder 國別排序順序Object
   * @param curOrder 幣別排序順序Object
   */
  sortByModify(sortByData, countryOrder, curOrder) {

    let countrySort = {};
    let curSort = {};
    countryOrder.forEach((country, i) => {
      countrySort[country] = i + 1;
    });

    curOrder.forEach((cur, i) => {
      curSort[cur] = i + 1;
    });


    var countrySortKeys = Object.keys(countrySort);

    var finalData = sortByData.filter(item => {
      return (countrySortKeys.indexOf(item['Country']) > -1)
    });

    finalData.sort((a, b) => {
      if (a['Country'] != b['Country']) {
        return countrySort[a['Country']] - countrySort[b['Country']];
      } else if (a['CustomerId'] != b['CustomerId']) {
        return a.CustomerId > b.CustomerId ? 1 : -1;
      } else if (a['AcctType'] != b['AcctType']) {
        return a.AcctTypeNum > b.AcctTypeNum ? 1 : -1;
      } else {
        return curSort[a['AcctCurrency']] - curSort[b['AcctCurrency']];
      }
    });

    return finalData;
  }


  public viewCountryData = { title: 'DEPOSITSUMMARY.COUNTRY', default_value: '', option: [] };
  public viewCurrencyData = { title: 'DEPOSITSUMMARY.CURRENCY', default_value: '', option: [] };
  public viewProductNameData = { title: 'DEPOSITSUMMARY.PRODUCT', default_value: '', option: [] };
  public filterObj = {};

  //篩選相關參數設定
  setFilterData() {
    this.viewCountryData.option = [];
    this.viewCurrencyData.option = [];
    this.viewProductNameData.option = [];

    this.selectedData.forEach(item => {
      if (item['Country'] && (this.viewCountryData.option.findIndex((_c) => { return _c.value == item['Country'] })) == -1) {
        this.viewCountryData.option.push({ name: item['Country'], value: item['Country'] });
      }
      if (item['AcctCurrency'] && (this.viewCurrencyData.option.findIndex((_c) => { return _c.value == item['AcctCurrency'] })) == -1) {
        this.viewCurrencyData.option.push({ name: item['AcctCurrency'], value: item['AcctCurrency'] });
      }
      if (item['AcctType'] && (this.viewProductNameData.option.findIndex((_c) => { return _c.value == item['AcctType'] })) == -1) {
        this.viewProductNameData.option.push({ name: item['AcctTypeCH'], value: item['AcctType'] });
      }
    });

  }

  resetFilter() {
    if(this.depositData == undefined){
      return;
    }
    let tempData = JSON.parse(JSON.stringify(this.depositData['list']));
    let currencyArr = [];
    let ProductNameDataArr = [];

    this.filterObj = {};
    tempData.forEach(item => {
      if (item['AcctCurrency'] && (currencyArr.findIndex((_c) => { return _c.value == item['AcctCurrency'] })) == -1) {
        currencyArr.push({ name: item['AcctCurrency'], value: item['AcctCurrency'] });
      }
      if (item['AcctType'] && (ProductNameDataArr.findIndex((_c) => { return _c.value == item['AcctType'] })) == -1) {
        ProductNameDataArr.push({ name: item['AcctTypeCH'], value: item['AcctType'] });
      }
    });
    this.viewCurrencyData = {
      default_value: '',
      option: currencyArr,
      title: 'DEPOSITSUMMARY.CURRENCY'
    }
    this.viewProductNameData = {
      default_value: '',
      option: ProductNameDataArr,
      title: 'DEPOSITSUMMARY.PRODUCT'
    }
  }

  /**
   * 根據原資料做篩選
   */
  onFilterClick() {
    this.doFilter();
    this.filterSwitch();
  }

  doFilter(){
    this.isSave = true;
    this.popup.setLoading(true);
    
    this.handleTData();
    this.source = this.showData;
    this.searchComponent.source = this.showData;
    this.searchComponent.Submit();
    this.popup.setLoading(false);
  }
  
  
  filterSwitch() {
    this.filterBlock = !this.filterBlock;
    if (this.filterBlock) {
      this.setFilterData();
      //若篩選套用更新暫篩選條件
      if (this.isSave) {
        this.temp = { AcctCurrency: this.filterObj['AcctCurrency'], AcctType: this.filterObj['AcctType'] }
        this.isSave = false;
      }
    }
  }
  result(e) {
    console.log("[存款概要頁] filter result", e);
    this.filterObj = Object.assign(this.filterObj, e);

    if (e.hasOwnProperty("Country")) {
      this.viewCountryData.default_value = e['Country'];
    }
      
    if (e.hasOwnProperty("AcctCurrency")) {
      this.viewCurrencyData.default_value = e['AcctCurrency'];
    }
      
    if (e.hasOwnProperty("AcctType")) {
      this.viewProductNameData.default_value = e['AcctType'];
    }
  }
  closePop() {
    console.log("[存款概要頁] closePop this.temp", this.temp);
    this.result(this.temp)
    this.viewCurrencyData.default_value = this.temp['AcctCurrency']
    this.viewProductNameData.default_value = this.temp['AcctType']
    this.filterBlock = !this.filterBlock;
  }


  //處理定存group資料並篩選
  handleTData() {
    this.showData = this.selectedData;
    //把定存group拆開用來篩選
    this.showData.forEach(data => {
      if (data.Tdata != undefined) {
        data.Tdata.forEach(element => {
          this.showData.push(element);
        });
      }
    });

    this.showData = this.searchFilter.FilterData(this.showData, this.filterObj, true, true);

    console.log("DepositSummaryComponent FilterResult = ", this.showData);

    //如果為定存就組成group
    let hasGroup = false;
    this.showData.forEach((element, i) => {
      if (element.AcctType == "T") {
        hasGroup = true;
      }
    });
    if (hasGroup) {
      let newObj = {};
      let count;
      this.showData.forEach(item => {
        if (item.AcctType == 'T') {
          if (newObj[item.CustomerId] == undefined) {
            newObj[item.CustomerId] = { Tdata: [item], AcctType: 'T', openFlag: true, AcctTypeCH: item.AcctTypeCH, Country: item.Country };
            count = 1;
          } else {
            newObj[item.CustomerId]['Tdata'].push(item);
            count = count + 1;
            if (count > 3) {
              newObj[item.CustomerId]['openFlag'] = false;
            }
          }
        }
      });

      //處理server回來重複的group資料
      let shortSave = [];
      this.showData.forEach(element => {
        if (element.AcctType == 'T' && element.Tdata == undefined) {
          shortSave.push(element);
        } else if (element.AcctType != 'T') {
          shortSave.push(element);
        }
      });

      this.showData = shortSave;

      this.showData.forEach((item, i) => {
        if (item.AcctType == 'T') {
          this.showData.splice(i, newObj[item.CustomerId]['Tdata'].length, newObj[item.CustomerId]);
        }
      });
    }
    //結束組成group
  }
}



