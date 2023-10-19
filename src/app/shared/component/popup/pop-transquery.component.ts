
import { Component } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { DateTimeService } from '../../service/global/daettime.service';

@Component({
  selector: 'app-pop-transquery',
  templateUrl: './pop-transquery.component.html'
})
export class PopTransQueryComponent {

  // Private fields
  private _subscribe;
  private txnType = '1';
  public isOpen = false;
  private NowStatus = 0;
  private defaultDateFrom;
  private defaultDateTo;
  private today;
  private maxDay;
  private onSelectedEvent;

  // Date picker
  public isPreviousMonthButtonEnable;
  public isNextMonthButtonEnable;
  public isPreviousYearButtonEnable;
  public isNextYearButtonEnable;
  public yearArray = [];
  public monthArray = [];
  public dateArray = [];
  public weekArray = [];
  public selectedYear;
  public selectedMonth;
  public selectedDate;
  public selectedDay;
  public selectedDateItem;
  // Cycle
  public memo = "";
  public selectedPeriodType = "M";
  public selectedMonthly;
  public selectedWeekly = 1;
  public selectedDateFrom;
  public selectedDateTo;
  
  isMonthChecked = false;
  isWeekChecked = false;

  constructor(
    private popup: PopupService,
    private dateTime: DateTimeService,
    private langTransService: LangTransService,
  ) {
    console.log('PopConfirmComponent constructor');
    this._subscribe = this.popup.transquerySetting.subscribe(
      (setting: object) => {
        // Init parameter
        this.defaultDateFrom = null;
        this.defaultDateTo = null;
        this.onSelectedEvent = null;
        if (setting != null) {
          if(setting["clear"]!=undefined){
             this.memo = "";
             this.selectedPeriodType = "M";
             this.selectedMonthly = undefined;
             this.selectedWeekly = 1;
             this.selectedDateFrom = undefined;
             this.selectedDateTo = undefined;
             return;
          }
          this.defaultDateFrom = setting["defaultDateFrom"];
          this.defaultDateTo = setting["defaultDateTo"];
          this.onSelectedEvent = setting["event"];
        }

        // Init limit date
        this.today = new Date();
        this.maxDay = new Date();
        this.maxDay = new Date(this.maxDay.setMonth(this.today.getMonth() + 12));
        if (this.defaultDateFrom == null) {
          this.defaultDateFrom = this.today;
        }
        if (this.defaultDateTo == null) {
          this.defaultDateTo = this.today;
        }

        // Init year options
        this.yearArray = [];
        for (let year = this.today.getFullYear(); year <= this.maxDay.getFullYear(); year++) {
          if (this.yearArray.indexOf(year) < 0) {
            this.yearArray[this.yearArray.length] = {
              value: year,
              display: year + this.langTransService.instant('POPUP_TRANSQUERY.YEAR')
            };
          }
        }

        // Select default date
        this.onYearSelected(this.defaultDateFrom.getFullYear());
        this.onMonthSelected(this.defaultDateFrom.getMonth());
        this.onDateSelected(this.defaultDateFrom.getDate());
        this.selectedDay = {
          "Year": this.defaultDateFrom.getFullYear()
          , "Month": this.defaultDateFrom.getMonth() + 1
          , "Date": this.defaultDateFrom.getDate()
        }
        // Display popup
        this.isOpen = (setting.hasOwnProperty('status')) ? setting['status'] : true;
      }
    );
  }

  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }

  /**
   * On year option item selected event
   * @param event Selected event
   */
  onYearSelectedEvent(event) {
    this.onYearSelected(this.selectedYear);
  }

  /**
   * On year selected
   * @param year Selected year
   */
  onYearSelected(year) {
    // Storage selected year
    this.selectedYear = year;

    // Init month options
    this.monthArray = [];
    const startMonth = this.today.getFullYear() == year ? this.today.getMonth() : 0;
    const endOfMonth = this.maxDay.getFullYear() == year ? this.maxDay.getMonth() : 11;
    for (let month = startMonth; month <= endOfMonth; month++) {
      if (this.monthArray.indexOf(month) < 0) {
        this.monthArray[this.monthArray.length] = {
          value: month,
          display: (month + 1) + this.langTransService.instant('POPUP_TRANSQUERY.MONTH')
        };
      }
    }

    // Check if selected month exist
    var isMonthExist = false;
    for (const monthItem of this.monthArray) {
      if (this.selectedMonth == monthItem.value) {
        isMonthExist = true;
      }
    }
    this.isPreviousYearButtonEnable = this.hasPreviousYear();
    this.isNextYearButtonEnable = this.hasNextYear();
    // Select month
    if (this.monthArray.length > 0) {
      this.onMonthSelected(isMonthExist ? this.selectedMonth : this.monthArray[0].value);
    }
  }

  /**
   * On month option item selected event
   * @param event Selected event
   */
  onMonthSelectedEvent(event) {
    this.onMonthSelected(this.selectedMonth);
  }

  /**
   * On month selected
   * @param month Selected month
   */
  onMonthSelected(month) { 

    if(this.selectedYear == this.today.getFullYear() && month < this.today.getMonth()){
      month = this.today.getMonth();
    }
    if(this.selectedYear == this.maxDay.getFullYear() && month > this.maxDay.getMonth()){
      month = this.maxDay.getMonth();
    }

    // Storage selected month
    this.selectedMonth = month;

    this.weekArray = [];
    for (var i = 0; i < 7; i++) {
      this.weekArray.push("POPUP_TRANSQUERY.WEEK" + i.toString())
    }

    // Init date options
    this.dateArray = [];
    var startDate = this.today.getFullYear() == this.selectedYear && this.today.getMonth() == this.selectedMonth ? this.today.getDate() : 1;
    var dateCounter = new Date(this.selectedYear, this.selectedMonth, 1);
    for (let index = 0; index < dateCounter.getDay(); index++) {
      this.dateArray[this.dateArray.length] = {
        display: "",
        enable: false
      }
    }
    while (dateCounter.getMonth() == month) {
      var date = dateCounter.getDate();
      var item = {
        value: date,
        display: date,
        enable: date >= startDate,
        today: dateCounter.getFullYear() == this.defaultDateFrom.getFullYear() &&
          dateCounter.getMonth() == this.defaultDateFrom.getMonth() &&
          date == this.defaultDateFrom.getDate()
      };
      this.dateArray[this.dateArray.length] = item;
      if(item.today){
        this.selectedDateItem = item;
      }
      dateCounter = new Date(dateCounter.setDate(dateCounter.getDate() + 1));
    }
    while (this.dateArray.length % 7 != 0) {
      this.dateArray[this.dateArray.length] = {
        display: "",
        enable: false
      }
    }

    // Update next/previous month button enabled
    this.isPreviousMonthButtonEnable = this.hasPreviousMonth();
    this.isNextMonthButtonEnable = this.hasNextMonth();

    // Select first day
    this.onDateSelected(1);
  }

  /**
   * On date item selected event
   * @param dateItem Selected date item
   */
  onDateSelectedEvent(dateItem) {
    if (dateItem.enable) {
      this.selectedDateItem = dateItem;
      // Storage selected date
      this.onDateSelected(dateItem.value);

      // Callback selected event
      const date = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);

      // const date = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      this.callbackSelectedEvent(date, date, "1", "M", "1", "");

      this.selectedDay = {
        "Year": this.selectedYear
        , "Month": this.selectedMonth + 1
        , "Date": this.selectedDate
      }
      // Dismiss popup
      this.isOpen = false;
    }
  }

  /**
   * On date selected
   * @param date Selected date
   */
  onDateSelected(date) {
    // Storage selected date
    this.selectedDate = date;
  }


  WeekList = [{ value: 0, key: "SUNDAY" },
  { value: 1, key: "MONDAY" },
  { value: 2, key: "TUESDAY" },
  { value: 3, key: "WEDNESDAY" },
  { value: 4, key: "THURSDAY" },
  { value: 5, key: "FRIDAY" },
  { value: 6, key: "SATURDAY" }];
  getWeekValue() {
    var value = this.selectedWeekly;
    for (var i = 0; i < this.WeekList.length; i++) {
      if (this.WeekList[i].value == value) {
        return this.langTransService.instant("POPUP_TRANSQUERY." + this.WeekList[i]["key"]);
      }
    }
  }
  onWeekChange(item) {
    this.selectedWeekly = item["value"];
    this.CloseSelect();
  }

  ShowsWeekSelect() {
    this.NowStatus = 88;
  }

  CloseSelect() {
    this.NowStatus = 0;
  }
  onNextYearClick(){
    if (this.hasNextYear()) {
      var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      newDate = new Date(newDate.setFullYear(newDate.getFullYear() + 1));
      this.onYearSelected(newDate.getFullYear());
      this.onMonthSelected(newDate.getMonth());
    }
  }
  onPreviousYearClick(){
    if (this.hasPreviousYear()) {
      var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      newDate = new Date(newDate.setFullYear(newDate.getFullYear() - 1));
      this.onYearSelected(newDate.getFullYear());
      this.onMonthSelected(newDate.getMonth());
    }
  }
  /**
   * On previous month button click
   */
  onPreviousMonthClick() {
    if (this.hasPreviousMonth()) {
      var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      newDate = new Date(newDate.setMonth(newDate.getMonth() - 1));
      this.onYearSelected(newDate.getFullYear());
      this.onMonthSelected(newDate.getMonth());
    }
  }

  /**
   * On next month button click
   */
  onNextMonthClick() {
    if (this.hasNextMonth()) {
      if(this.selectedDate == 31 && this.selectedMonth != 0){
        var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate-1);
      }
      else if(this.selectedDate > 28 && this.selectedMonth == 0){
        var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate-3);
      }else{
        var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      }
      newDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
      this.onYearSelected(newDate.getFullYear());
      this.onMonthSelected(newDate.getMonth());
    }
  }

  /**
   * Has previous month or not   
   */
  hasPreviousMonth() {
    return this.selectedYear > this.today.getFullYear() ||
      (this.selectedYear == this.today.getFullYear() && this.selectedMonth > this.today.getMonth());
  }

  /**
   * Has next month or not
   */
  hasNextMonth() {
    return this.selectedYear < this.maxDay.getFullYear() ||
      (this.selectedYear == this.maxDay.getFullYear() && this.selectedMonth < this.maxDay.getMonth());
  }
  hasPreviousYear() {
    return this.selectedYear > this.today.getFullYear()
  }
  hasNextYear() {
    return this.selectedYear < this.maxDay.getFullYear()
  }
  /**
   * Callback selected event
   * @param dateFrom 週期起日
   * @param dateTo 週期起日
   * @param txnType 交易種類(1:即時預約/2:預約週期)
   * @param periodType 期別(M:每月/W:每周)
   * @param periodValue 期別值(1-31/0-6)
   * @param memo 備註
   */
  callbackSelectedEvent(dateFrom, dateTo, txnType, periodType, periodValue, memo) {
    if (this.onSelectedEvent != null) {
      this.onSelectedEvent({
        DateFrom: dateFrom,
        DateTo: dateTo,
        TxnType: txnType,
        PeriodType: periodType,
        PeriodValue: periodValue,
        Memo: memo,
      });
    }
  }

  /**
   * On txn type button clicked
   * @param type Txn type
   */
  onTxnTypeClick(type) {
    this.txnType = type;
  }

  /**
   * On date picker button clicked
   * @param type Button type: form/to
   */
  onDatePickerButtonClick(type) {
    var defaultDate = this.dateTime.datetimeFormat(new Date().getTime(), 'yyyy/MM/dd')
    var maxDateValue = new Date();
    maxDateValue.setMonth(maxDateValue.getMonth() + 12);
    var minDateValue = new Date();
    if (type == "from") {
      defaultDate = this.dateTime.datetimeFormat(this.defaultDateFrom.getTime(), 'yyyy/MM/dd')
      maxDateValue = this.selectedDateTo == undefined ? maxDateValue : this.selectedDateTo
    } else if (type == "to") {
      defaultDate = this.dateTime.datetimeFormat(this.defaultDateTo.getTime(), 'yyyy/MM/dd')
      minDateValue = this.selectedDateFrom == undefined ? minDateValue : this.selectedDateFrom
    }
    this.popup.setDatePicker({
      status: true,
      datepicDefalult: defaultDate,
      maxDate: maxDateValue,
      minDate: minDateValue,
      event: (seleted) => {
        if (type == "from") {
          this.selectedDateFrom = seleted;
          this.defaultDateFrom  = new Date(this.selectedDateFrom);
        } else if (type == "to") {
          this.selectedDateTo = seleted;
          this.defaultDateTo = new Date(this.selectedDateTo);
        }
      }
    });
  }


  getSelectedDateToValue() {
    if (this.selectedDateTo == "" || this.selectedDateTo == undefined) {
      return this.langTransService.instant("POPUP_TRANSQUERY.DATE_TO_EMPTY");
    } else {
      return this.selectedDateTo;
    }
  }
  getSelectedDateFromValue() {
    if (this.selectedDateFrom == "" || this.selectedDateFrom == undefined) {
      return this.langTransService.instant("POPUP_TRANSQUERY.DATE_FROM_EMPTY");
    } else {
      return this.selectedDateFrom;
    }
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
    if(this.txnType == "1"){
      this.onDateSelectedEvent(this.selectedDateItem);
      return;
    }
    // Define peroid value
    var periodValue;
    if (this.isMonthChecked) {
      // Monthly
      // Check selected monthly date
      if (this.selectedMonthly == null || this.selectedMonthly.length == 0) {
        this.popup.setConfirm({
          content: 'POPUP_TRANSQUERY.MONTHLY_DATE_EMPTY'
        });
        return;
      }
      if (!this.selectedMonthly.match(/^\d+$/g)) {
        this.popup.setConfirm({
          content: 'POPUP_TRANSQUERY.MONTHLY_DATE_NUMERIC'
        });
        return;
      }
      if (parseInt(this.selectedMonthly) < 1 || parseInt(this.selectedMonthly) > 31) {
        this.popup.setConfirm({
          content: 'POPUP_TRANSQUERY.MONTHLY_DATE_RANGE_INVALID'
        });
        return;
      }
      periodValue = this.selectedMonthly;
      this.selectedPeriodType = "M";
    }
    else if (this.isWeekChecked) {
      // Weekly
      // Check selected weekly date
      if (this.selectedWeekly < 0 || this.selectedWeekly > 6) {
        this.popup.setConfirm({
          content: 'POPUP_TRANSQUERY.WEEKLY_DATE_EMPTY'
        });
        return;
      }
      periodValue = this.selectedWeekly;
      this.selectedPeriodType = "W";
    }
    else {
      // Period type error
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.PERIOD_TYPE_EMPTY'
      });
      return;
    }

    // Date from
    if (this.selectedDateFrom == null || this.selectedDateFrom.length == 0) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_FROM_EMPTY'
      });
      return;
    }
    if (!this.selectedDateFrom.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/g)) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_FROM_FORMAT_INVALID'
      });
      return;
    }
    const dateFrom = new Date(this.selectedDateFrom);
    if (isNaN(dateFrom.valueOf())) {
      this.popup.setConfirm({
        content: 'POPUP_TRANSQUERY.DATE_FROM_EMPTY'
      });
      return;
    }

    // Date to
    if (this.selectedDateTo == null || this.selectedDateTo.length == 0) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_EMPTY"
      });
      return;
    }
    if (!this.selectedDateTo.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/g)) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_FORMAT_INVALID"
      });
      return;
    }
    const dateTo = new Date(this.selectedDateTo);
    if (isNaN(dateTo.valueOf())) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_EMPTY"
      });
      return;
    }

    if (dateTo < dateFrom) {
      this.popup.setConfirm({
        content: "POPUP_TRANSQUERY.DATE_TO_BEFORE_DATE_FROM"
      });
      return;
    }

    // Callback selected event
    this.callbackSelectedEvent(dateFrom, dateTo, "2", this.selectedPeriodType, periodValue, this.memo);

    // Dismiss popup
    this.isOpen = false;
  }

  checkMonthValue(e) {
    console.log('isMonthChecked', e);
    if (this.isMonthChecked) {
      this.isWeekChecked = false;
    }
  }

  checkWeekValue(e) {
    console.log('isWeekChecked', e);
    if (this.isWeekChecked) {
      this.isMonthChecked = false;
    }
  }
}




