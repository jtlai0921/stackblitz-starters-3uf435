
import { Component } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { DateTimeService } from '../../service/global/daettime.service';

@Component({
  selector: 'app-pop-depositSummary',
  templateUrl: './pop-depositSummary.component.html'
})
export class PopDepositSummaryComponent {

  /**
   * 參數設定
   */
  private _subscribe: any;
  private onSelectedEvent;
  isOpen: any;
  today: any;

  // == 國別 == //
  selectedCountry: any; // 國別
  searchCountry = [
    { name: 'Taiwan', value: 'Taiwan' }, // Taiwan
    { name: 'HongKong', value: 'HongKong' }, // HongKong
    { name: 'Japan', value: 'Japan' }, // Japan
    { name: 'USA', value: 'USA' }, // USA
    { name: 'India', value: 'India' }, // India
    { name: 'Vietnam', value: 'Vietnam' }, // Vietnam
    { name: 'China', value: 'China' } // China
  ];

  // == 幣別 == //
  currencyType = [
    { name: 'TWD', select: true, type: 'TWD' }, // TWD
    { name: 'USD', select: false, type: 'USD' }, // USD
    { name: 'HKD', select: false, type: 'HKD' }, // HKD
    { name: 'JPY', select: false, type: 'JPY' }, // JPY
    { name: 'EUR', select: false, type: 'EUR' }, // EUR
    { name: 'GBP', select: false, type: 'GBP' }, // GBP
    { name: 'AUD', select: false, type: 'AUD' }, // AUD
    { name: 'ZUR', select: false, type: 'ZUR' }, // ZUR
  ];
  selectedCurrency: any; // 幣別

  // == 產品別 == //
  productType = [
    { name: '活存', select: true, type: 'S' }, // 活存
    { name: '支存', select: false, type: 'T' }, // 支存
    { name: '定存', select: false, type: 'D' }, // 定存
    { name: '結構型', select: false, type: 'SD' } // 結構型
  ];
  selectedProduct: any; // 產品別

  // == 期別 == //
  lengthType = [
    { name: '1月', select: true, type: '1月' }, // 1月
    { name: '1年', select: false, type: '1年' } // 1年
  ];
  selectedLength: any; // 期別
 
  // == 狀態 == //
  selectedStatus: any; // 狀態
  searchStatus = [
    { name: '交易成功', value: '1' }, // 交易成功
    { name: '交易失敗', value: '2' } // 交易失敗
  ];

  // == 日期 == //
  dateType = [
    { name: '一週', select: false, type: '1' }, // 一週
    { name: '一月', select: true, type: '2' }, // 一月
    { name: '三月', select: false, type: '3' }, // 三月
    { name: '半年', select: false, type: '4' }, // 半年
    { name: '一年', select: false, type: '5' } // 一年
  ];
  selectedDateFrom: any;
  selectedDateTo: any;

  // == 到期日 == //
  maturityType = [
    { name: '半年', select: true, type: '1' }, // 半年
    { name: '一年', select: false, type: '2' }, // 一年
    { name: '兩年', select: false, type: '3' }, // 兩年
    { name: '三年', select: false, type: '4' } // 三年
  ];
  selectedMaturityFrom: any;
  selectedMaturityTo: any;
  
  // == 交易類型 及 扣帳入帳 == //
  selectedTransactionType: any; // 交易類型
  transactionType = [
    { name: '扣帳', value: 'D' }, // 扣帳
    { name: '入帳', value: 'C' }, // 入帳
  ];
  dAmntFrom: any; // 扣帳金額_起
  dAmntTo: any; // 扣帳金額_到
  cAmntFrom: any; // 入帳金額_起
  cAmntTo: any; // 入帳金額_到

  constructor(
    private popup: PopupService,
    private dateTime: DateTimeService,
    private langTransService: LangTransService,
  ) {
    console.log('PopDepositSummaryComponent constructor');
    this._subscribe = this.popup.depositSummarySetting.subscribe(
      (setting: object) => {
        this.isOpen = true;
        this.selectedCountry = setting['selectedCountry'] || '1';
        this.selectedCurrency = setting['selectedCurrency'] || '1';
        this.selectedProduct = setting['selectedProduct'] || '1';
        this.selectedLength = setting['selectedLength'] || '1';
        this.selectedStatus = setting['selectedStatus'] || '1';
        this.selectedMaturityFrom = setting['selectedMaturityFrom'] || '';
        this.selectedMaturityTo = setting['selectedMaturityTo'] || '';
        this.selectedDateFrom = setting['selectedDateFrom'] || '';
        this.selectedDateTo = setting['selectedDateTo'] || '';        
        this.selectedTransactionType = setting['selectedTransactionType'] || 'D';
        this.dAmntFrom = setting['dAmntFrom'] || '0';
        this.dAmntTo = setting['dAmntTo'] || '1';
        this.cAmntFrom = setting['cAmntFrom'] || '0';
        this.cAmntTo = setting['cAmntTo'] || '1';
        this.onSelectedEvent = setting["event"] || null;

        this.today = new Date();
        this.getSearchDate('2');
        this.getMaturityDate('1');
      }
    );
  }

  ngOninit() {}

  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }

  /**
   * On date picker button clicked
   * @param type Button type: form/to
   */
  onDatePickerButtonClick(type) {
    this.popup.setDatePicker({
      status: true,
      datepicDefalult: this.dateTime.datetimeFormat(+this.today.getTime(), 'yyyy/MM/dd'),
      event: (seleted) => {
        if (type == 'from') {
          this.selectedDateFrom = seleted;
        } else if (type == 'to') {
          this.selectedDateTo = seleted;
        }
      }
    });
  }

  /**
   * On cancel button clicked
   */
  onCancelClick() {
    this.isOpen = false;
  }

  /**
   * On submit button clicked
   */
  onSubmitClick() {      
    // D AmntFrom
    if (!this.dAmntFrom.match(/^\d+$/g)) {
      this.popup.setConfirm({
        content: '扣帳金額範圍起始值應為純數字' // 扣帳金額範圍起始值應為純數字
      });
      return;
    }
    // D AmntTo
    if (!this.dAmntTo.match(/^\d+$/g)) {
      this.popup.setConfirm({
        content: '扣帳金額範圍末值應為純數字' // 扣帳金額範圍末值應為純數字
      });
      return;
    }
    // C AmntFrom
    if (!this.cAmntFrom.match(/^\d+$/g)) {
      this.popup.setConfirm({
        content: '入帳金額範圍起始值應為純數字' // 入帳金額範圍起始值應為純數字
      });
      return;
    }
    // C AmntTo
    if (!this.cAmntTo.match(/^\d+$/g)) {
      this.popup.setConfirm({
        content: '入帳金額範圍末值應為純數字' // 入帳金額範圍末值應為純數字
      });
      return;
    }
    
    // DateFrom
    if (!this.selectedDateFrom.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/g)) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_FROM_FORMAT_INVALID' // 起日日期格式錯誤
      });
      return;
    }
    if (this.selectedDateFrom == null || this.selectedDateFrom.length == 0) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_FROM_EMPTY' // 請選擇起日
      });
      return;
    }   
    const dateFrom = new Date(this.selectedDateFrom);
    if (isNaN(dateFrom.valueOf())) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_FROM_EMPTY' // 請選擇起日
      });
      return;
    }

    // DateTo
    if (!this.selectedDateTo.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/g)) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_FORMAT_INVALID" // 迄日日期格式錯誤
      });
      return;
    }
    if (this.selectedDateTo == null || this.selectedDateTo.length == 0) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_EMPTY" // 請選擇迄日
      });
      return;
    }   
    const dateTo = new Date(this.selectedDateTo);
    if (isNaN(dateTo.valueOf())) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_EMPTY" // 請選擇迄日
      });
      return;
    }

    // DateTo vs. DateFrom
    if (dateTo < dateFrom) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_BEFORE_DATE_FROM" // 迄日必須大於起日
      });
      return;
    }

    // Callback selected event
    this.onSelectedEvent({
      Country: this.selectedCountry,
      Currency: this.selectedCurrency,
      Product: this.selectedProduct,
      Length: this.selectedLength,
      Status: this.selectedStatus,
      MaturityFrom: this.selectedMaturityFrom,
      MaturityTo: this.selectedMaturityTo,
      DateFrom: this.selectedDateFrom,
      DateTo: this.selectedDateTo,
      DebitCredit: this.selectedTransactionType,
      dAmntFrom: (+this.dAmntFrom * 10000).toString(),
      dAmntTo: (+this.dAmntTo * 10000).toString(),
      cAmntFrom: (+this.cAmntFrom * 10000).toString(),
      cAmntTo: (+this.cAmntTo * 10000).toString()
    });
    // Dismiss popup
    this.isOpen = false;
  }

  /**
   * 篩選參數設定
   * @param item 選定項目
   */
  SelectType(type: String, item: any){
    switch (type) {
      // 幣別
      case 'currency':
        this.currencyType.forEach(currencyItem => {
          currencyItem['select'] = false;
        });
        this.selectedCurrency = item['type'];
        break;
      // 產品別
      case 'product':
        this.productType.forEach(productItem => {
          productItem['select'] = false;
        });
        this.selectedProduct = item['type'];
        break;
      // 期別
      case 'length':
        this.lengthType.forEach(lengthItem => {
          lengthItem['select'] = false;
        });
        this.selectedLength = item['type'];
        break;
      // 日期
      case 'date':
        this.dateType.forEach(dateItem => {
          dateItem['select'] = false;
        });
        this.getSearchDate(item['type']);
        break;
      // 到期日
      case 'maturity':
        this.maturityType.forEach(maturityItem => {
          maturityItem['select'] = false;
          this.getMaturityDate(item['type']);
        });
        break;
      default:
        break;
    }
    item.select = !item.select;
  }

  /**
   * 取得查詢日期參數
   */
  getSearchDate(type: String) {
    let date = new Date();
    let month;
    month = (date.getMonth() + 1);        
    this.selectedDateTo = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
    switch (type) {
      // 一週
      case '1':
        date.setDate(date.getDate() - 7);
        break;
      // 一月
      case '2':
        date.setMonth(date.getMonth() - 1);
        break;
      // 三月
      case '3':
        date.setMonth(date.getMonth() - 3);
        break;
      // 半年
      case '4':
        date.setMonth(date.getMonth() - 6);
        break;
      // 一年
      case '5':
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        break;
    }
    month = (date.getMonth() + 1);        
    this.selectedDateFrom = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
  }

  /**
   * 取得到期日參數
   */
  getMaturityDate(type: String) {
    let date = new Date();
    let month;
    month = (date.getMonth() + 1);        
    this.selectedMaturityTo = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
    switch (type) {
      // 半年
      case '1':
        date.setMonth(date.getMonth() - 6);
        break;
      // 一年
      case '2':
        date.setFullYear(date.getFullYear() - 1);
        break;
      // 兩年
      case '3':
        date.setFullYear(date.getFullYear() - 2);
        break;
      // 三年
      case '4':
        date.setFullYear(date.getFullYear() - 3);
        break;
      default:
        break;
    }
    month = (date.getMonth() + 1);        
    this.selectedMaturityFrom = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
  }

}




