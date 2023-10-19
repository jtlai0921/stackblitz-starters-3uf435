
import { Component, NgZone } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { DateTimeService } from '../../service/global/daettime.service';

@Component({
  selector: 'app-pop-depositDetial',
  templateUrl: './pop-depositDetial.component.html'
})
export class PopDepositDetialComponent {

  /**
   * 參數設定
   */
  private _subscribe: any;
  private onSelectedEvent;
  isOpen: any;
  today: any;
  selectedDateFrom: any;
  selectedDateFromValue: any;
  selectedDateTo: any;
  selectedDateToValue: any;
  // searchDate = {}; // 查詢日期參數值
  dateType = [];
  selectedType: any; // 查詢類別
  searchType = [
    { name: 'DEPOSITDETAIL.TRANS_DETAIL', value: '1' }, // 交易明細
    { name: 'DEPOSITDETAIL.COLLECTION_DETAIL', value: '2' }, // 代收明細
    { name: 'DEPOSITDETAIL.BANK_STATEMENT', value: '3' }, // 對帳單明細
  ];
  selectedTransactionType: any; // 交易類型
  selectedTransactionName: any; // 交易類型
  transactionType = [
    { name: 'DEPOSITSUMMARY.DEBITUNG_AMOUNT', value: 'D' }, // 扣帳
    { name: 'DEPOSITSUMMARY.PAYEE_AMOUNT', value: 'C' }, // 入帳
  ];
  dAmntFrom: any; // 扣帳金額_起
  dAmntTo: any; // 扣帳金額_到
  cAmntFrom: any; // 入帳金額_起
  cAmntTo: any; // 入帳金額_到

  searchTypePage = true;
  TransTypePage = true;


  constructor(
    private popup: PopupService,
    private dateTime: DateTimeService,
    private langTransService: LangTransService,
    private zone: NgZone
  ) {
    console.log('PopDepositDetialComponent constructor');
    this._subscribe = this.popup.depositDetialSetting.subscribe(
      (setting: object) => {
        this.zone.run(() => {
          this.isOpen = setting.hasOwnProperty("status") ? setting["status"] : true;
          if(!this.isOpen){
            return;
          }
          var selectedValue = setting.hasOwnProperty("selectedValue") ? setting['selectedValue'] : {};
          this.dateType = selectedValue.hasOwnProperty("DateType") ? selectedValue['DateType'] : this.getDefaultDateType();
          this.selectedDateFrom = selectedValue.hasOwnProperty("SelectedDateFrom") ? selectedValue['SelectedDateFrom'] : '';
          this.selectedDateTo = selectedValue.hasOwnProperty("SelectedDateTo") ? selectedValue['SelectedDateTo'] : '';
          this.selectedType = selectedValue.hasOwnProperty("TrnType") ? selectedValue['TrnType'] : '1';
          this.selectedTransactionType = selectedValue.hasOwnProperty("DebitCredit") ? selectedValue['DebitCredit'] : 'D';
          this.dAmntFrom = selectedValue.hasOwnProperty("dAmntFrom_") ? selectedValue['dAmntFrom_'] : '';
          this.dAmntTo = selectedValue.hasOwnProperty("dAmntTo_") ? selectedValue['dAmntTo_'] : '';
          this.cAmntFrom = selectedValue.hasOwnProperty("cAmntFrom_") ? selectedValue['cAmntFrom_'] : '';
          this.cAmntTo = selectedValue.hasOwnProperty("cAmntTo_") ? selectedValue['cAmntTo_'] : '';
          this.onSelectedEvent = setting['event'] || null;
          this.today = new Date();

          this.dateType.forEach(element => {
            if (element.select) {
              this.getSearchDate(element.type);
            }
          });

          this.transactionType.forEach(item => {
            if (item.value == this.selectedTransactionType) {
              this.selectedTransactionName = item.name;
            }
          })
        })
      }
    );
  }

  ngOninit() {

  }

  getDefaultDateType() {
    return [
      { name: 'TRANSACTION.ONEWEEK', select: false, type: '1' }, // 一週
      { name: 'TRANSACTION.ONEMONTH', select: true, type: '2' }, // 一月
      { name: 'TRANSACTION.THREEMONTH', select: false, type: '3' }, // 三月
      { name: 'TRANSACTION.HALFYEAR', select: false, type: '4' }, // 半年
      { name: 'TRANSACTION.ONEYEAR', select: false, type: '5' } // 一年
    ]
  }

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
        this.dateType.forEach(element => {
          element.select = false;
        });
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
   * 重設按鈕
   */
  onResetClick() {
    this.selectedDateFrom = '';
    this.selectedDateTo = '';
    this.selectedType = '1';
    this.selectedTransactionType = 'D';
    this.dAmntFrom = '';
    this.dAmntTo = '';
    this.cAmntFrom = '';
    this.cAmntTo = '';
    this.selectedTransactionName = this.transactionType[0]["name"];
    this.dateType.forEach(element => {
      element.select = element.type == 2;
    });
    this.getSearchDate('2');

  }

  /**
   * On submit button clicked
   */
  onSubmitClick() {

    if (this.selectedTransactionType == "D") {

      // D AmntFrom
      if (!this.dAmntFrom.match(/^\d+$/g)) {
        //都沒輸入才給過
        if (this.dAmntFrom != "" || this.dAmntTo != "") {
          this.popup.setConfirm({
            content: '扣帳金額範圍起始值應為純數字' // 扣帳金額範圍起始值應為純數字
          });
          return;
        }
      }
      // D AmntTo
      if (!this.dAmntTo.match(/^\d+$/g)) {
        if (this.dAmntFrom != "" || this.dAmntTo != "") {
          this.popup.setConfirm({
            content: '扣帳金額範圍末值應為純數字' // 扣帳金額範圍末值應為純數字
          });
          return;
        }
      }
      this.cAmntFrom = "";
      this.cAmntTo = "";
    } else if (this.selectedTransactionType == "C") {
      // C AmntFrom
      if (!this.cAmntFrom.match(/^\d+$/g)) {
        if (this.cAmntFrom != "" || this.cAmntTo != "") {
          this.popup.setConfirm({
            content: '入帳金額範圍起始值應為純數字' // 入帳金額範圍起始值應為純數字
          });
          return;
        }
      }
      // C AmntTo
      if (!this.cAmntTo.match(/^\d+$/g)) {
        if (this.cAmntFrom != "" || this.cAmntTo != "") {
          this.popup.setConfirm({
            content: '入帳金額範圍末值應為純數字' // 入帳金額範圍末值應為純數字
          });
          return;
        }
      }
      this.dAmntFrom = "";
      this.dAmntTo = "";
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
        content: 'POPUP_TRANSQUERY.DATE_TO_FORMAT_INVALID' // 迄日日期格式錯誤
      });
      return;
    }
    if (this.selectedDateTo == null || this.selectedDateTo.length == 0) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_TO_EMPTY' // 請選擇迄日
      });
      return;
    }
    const dateTo = new Date(this.selectedDateTo);
    if (isNaN(dateTo.valueOf())) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_TO_EMPTY' // 請選擇迄日
      });
      return;
    }

    // DateTo vs. DateFrom
    if (dateTo < dateFrom) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_TO_BEFORE_DATE_FROM' // 迄日必須大於起日
      });
      return;
    }
    var re = new RegExp('/', 'g');
    // Callback selected event
    this.onSelectedEvent({
      DateType: this.dateType,
      DateFrom: this.selectedDateFrom.replace(re, ''),
      DateTo: this.selectedDateTo.replace(re, ''),
      SelectedDateFrom: this.selectedDateFrom,
      SelectedDateTo: this.selectedDateTo,
      TrnType: this.selectedType,
      DebitCredit: this.selectedTransactionType,
      dAmntFrom_: this.dAmntFrom ? this.dAmntFrom.toString() : "",
      dAmntTo_: this.dAmntTo ? this.dAmntTo.toString() : "",
      cAmntFrom_: this.cAmntFrom ? this.cAmntFrom.toString() : "",
      cAmntTo_: this.cAmntTo ? this.cAmntTo.toString() : "",
      dAmntFrom: this.dAmntFrom ? (+this.dAmntFrom * 10000).toString() : "",
      dAmntTo: this.dAmntTo ? (+this.dAmntTo * 10000).toString() : "",
      cAmntFrom: this.cAmntFrom ? (+this.cAmntFrom * 10000).toString() : "",
      cAmntTo: this.cAmntTo ? (+this.cAmntTo * 10000).toString() : ""
    });

    // Dismiss popup
    this.isOpen = false;
  }


  /**
   * 日期篩選
   * @param item 選定項目
   */
  SelectDateType(item) {
    this.dateType.forEach(date => {
      date['select'] = false;
    });
    item.select = !item.select;
    this.getSearchDate(item['type']);
  }

  /**
   * 取得查詢日期參數
   */
  getSearchDate(type: String) {
    let date = new Date();
    let month;
    month = (date.getMonth() + 1);
    // this.searchDate['DateTo'] = date.getFullYear().toString() + (month.length == 2 ? month.toString() : '0' + month.toString()) + date.getDate().toString();
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
    // this.searchDate['DateFrom'] = date.getFullYear().toString() + (month.length == 2 ? month.toString() : '0' + month.toString()) + date.getDate().toString();
    this.selectedDateFrom = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
  }

  /**
   * 查詢類別 切頁
   */
  onClickSearchItem(e) {
    this.searchTypePage = true;
    this.selectedType = e;
  }

  /**
   * 交易類型 切頁
   */
  onClickTransItem(e) {
    this.selectedTransactionType = e;
    this.transactionType.forEach(item => {
      if (item.value == this.selectedTransactionType) {
        this.selectedTransactionName = item.name;
      }
    })
  }
}




