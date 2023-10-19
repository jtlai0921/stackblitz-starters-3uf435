import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
// for Attribute Directives
import { DatePipe } from '@angular/common';
import { DateTimeService } from '../../service/global/daettime.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import {PopupService} from '../../service/global/popup.service'

@Component({
  selector: 'app-pop-datepicker',
  templateUrl: './datepicker-pop.component.html',
  styleUrls: ['./datepicker-pop.component.css']
})


export class DatepickerPopComponent implements OnInit {
  /**
   * 參數設定
   */
  // == private == //

  // Private fields
  private _subscribe;
  public isOpen = false;
  private defaultDateFrom;
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
  public weekArray = [];
  public dateArray = [];
  public selectedYear;
  public selectedMonth;
  public selectedDate;
  public selectedDay;

  constructor(
    private popup : PopupService,
    private langTransService: LangTransService,
    private dateTime: DateTimeService,
  ) {
    console.log('PopConfirmComponent constructor');
    this._subscribe = this.popup.datepickerSetting.subscribe(
      (setting:object) => {
        var min = "";
        var max = "";
         this.isOpen = (setting.hasOwnProperty('status')) ? setting['status'] : true;
         if (setting != null) {
          this.onSelectedEvent = setting['event'] || null;
          this.defaultDateFrom =  (setting.hasOwnProperty('datepicDefalult')) ? new Date(setting['datepicDefalult']): null;
          max =  (setting.hasOwnProperty('maxDate')) ? setting['maxDate']:null;
          min =  (setting.hasOwnProperty('minDate')) ? setting['minDate']:null;
        }
        //不給最大最小日期則以今天正五年 負二十年
        // Init limit date
        if(min !=null && min !=""){
          this.today = new Date(min);
        }else{
          this.today= new Date();
          this.today.setFullYear(this.today.getFullYear() - 20);
        }

        if(max !=null && max !=""){
          this.maxDay = new Date(max);
        }else{
          this.maxDay= new Date();
          this.maxDay.setFullYear(this.maxDay.getFullYear() + 5);
        }
        
        if (this.defaultDateFrom == null || this.defaultDateFrom < this.today) {
          this.defaultDateFrom = this.today;
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

        this.selectedDay = {"Year":this.defaultDateFrom.getFullYear()
        ,"Month":this.defaultDateFrom.getMonth()+1
        ,"Date":this.defaultDateFrom.getDate()}
      }
    );
  }

  ngOnInit() {

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
    for(var i = 0;i<7;i++){
      this.weekArray.push("POPUP_TRANSQUERY.WEEK"+i.toString())
    }

    // Init date options
    this.dateArray = [];
    var startDate = this.today.getFullYear() == this.selectedYear && this.today.getMonth() == this.selectedMonth ? this.today.getDate() : 1;
    var endDate = this.maxDay.getFullYear() == this.selectedYear && this.maxDay.getMonth() == this.selectedMonth ? this.maxDay.getDate() : 100;
    var dateCounter = new Date(this.selectedYear, this.selectedMonth, 1);
    for (let index = 0; index < dateCounter.getDay(); index++) {
      this.dateArray[this.dateArray.length] = {
        display: "",
        enable: false
      }
    }
    while (dateCounter.getMonth() == month) {
      var date = dateCounter.getDate();
      this.dateArray[this.dateArray.length] = {
        value: date,
        display: date,
        enable: date >= startDate && date <= endDate,
        today: dateCounter.getFullYear() == this.defaultDateFrom.getFullYear() &&
          dateCounter.getMonth() == this.defaultDateFrom.getMonth() &&
          date == this.defaultDateFrom.getDate()
      };
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
      // Storage selected date
      this.onDateSelected(dateItem.value);

      // Callback selected event
      const date = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      var resultDate = this.dateTime.datetimeFormat(+date.getTime(), 'yyyy/MM/dd')
      this.callbackSelectedEvent(resultDate);

      this.selectedDay = {"Year":this.selectedYear
        ,"Month":this.selectedMonth+1
        ,"Date":this.selectedDate}
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
      var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      newDate = new Date(newDate.setMonth(newDate.getMonth() + 1));
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
  onNextYearClick(){
    if (this.hasNextYear()) {
      var newDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDate);
      newDate = new Date(newDate.setFullYear(newDate.getFullYear() + 1));
      this.onYearSelected(newDate.getFullYear());
      this.onMonthSelected(newDate.getMonth());
    }
  }

  hasPreviousYear() {
    return this.selectedYear > this.today.getFullYear()
  }
  hasNextYear() {
    return this.selectedYear < this.maxDay.getFullYear()
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

  /**
   * Callback selected event
   * @param dateSeleted 日期
   */
  callbackSelectedEvent(dateSeleted) {
    if (this.onSelectedEvent != null) {
      this.onSelectedEvent(dateSeleted);
    }
  }

  /**
   * On cancel button clicked
   */
  onCancelClick() {
    this.isOpen = false;
  }

}
