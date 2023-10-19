
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Console } from '@angular/core/src/console';
import { PopupService } from '../../service/global/popup.service';
import { DateTimeService } from '../../service/global/daettime.service';

@Component({
  selector: 'app-datefilter',
  templateUrl: './dateFilter.component.html'
})
export class DateFilterComponent implements OnChanges {

  defaultPage = true;
  selectPage = false;
  default_value;
  dateType = [];
  today;
  selectedDateFrom: any;
  selectedDateTo: any;
  returnData;
  dateOptionBlock;
  optionArray;
  filterKey;


  /**
   * source => 原始資料
   * viewData = {  => 畫面顯示資料
   *    default_value:{
   *      dateType: 'ColDate',
   *      startDate: '2011/01/01',
   *      endDate: '2011/01/31'
   *    },
   *    timeOption:[
   *      { name: '半年', select: false, type: '6M' },
   *      { name: '一週', select: false, type: '1W' },
   *      { name: '兩天', select: false, type: '2D' },
   *      { name: '三年', select: false, type: '3Y' }
   *    ], => 選項Array ex. 3M => 三個月, 6M => 半年, 1Y => 一年, 1W => 一週 依此類推
   *    type:'',  => past => 過去時間/ future => 未來時間
   *    extend:{  => // 多個日期可以選擇
   *      flag: false,  => // 顯示或不顯示
   *      option: [  => // 選項Array
   *        { name: '到期日', value: 'ColDate' },
   *        { name: '託收日', value: 'MaturityDate' },
   *      ]
   *    }
   * }
   */

  @Input() source: any;
  @Input() view: any;
  @Output() filterData: EventEmitter<any> = new EventEmitter();
  @Output() closeBtnFlag: EventEmitter<any> = new EventEmitter();

  constructor(
    private dateTime: DateTimeService,
    public pop: PopupService
  ) {
  }

  ngOnChanges(): void {
    let Today = new Date();
    this.today = Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate();
    this.getData();
  }

  getData() {
    console.log('dateFilter source', this.source);
    console.log('dateFilter view', this.view);
    console.log('dateFilter filterKey', this.filterKey);
    if (typeof this.view == 'object') {

      if (this.view.hasOwnProperty('default_value')) {
        if (this.view.default_value.hasOwnProperty('startDate')) {
          this.selectedDateFrom = this.view.default_value.startDate;
        } else {
          this.selectedDateFrom = "";
        }

        if (this.view.default_value.hasOwnProperty('endDate')) {
          this.selectedDateTo = this.view.default_value.endDate;
        } else {
          this.selectedDateTo = "";
        }

        //起訖日必須皆有值
        if(!this.selectedDateTo || !this.selectedDateFrom){
          this.view.default_value.startDate = "";
          this.view.default_value.endDate = "";
          this.selectedDateFrom = "";
          this.selectedDateTo = "";          
        }

        if (this.view.default_value.hasOwnProperty('dateType')) {
          this.filterKey = this.view.default_value['dateType'];
          this.view.dateOption.forEach(dateItem => {
            if (this.view.default_value.dateType == dateItem.value) {
              this.default_value = dateItem.name;
            }
          });
        }
      } else {
        this.selectedDateFrom = this.today;
        this.selectedDateTo = this.today;
      }

      if (this.view.hasOwnProperty('timeOption')) {
        this.dateType = this.view.timeOption;
        this.dateType.forEach((item, i) => {
          let num = '';
          let type = '';
          let calcObj = {};
          num = item.type.substring(0, item.type.length - 1);
          type = item.type.substring(item.type.length, item.type.length - 1);
          calcObj['num'] = num;
          calcObj['type'] = type;
          item['calcObj'] = calcObj;
          if (item.select) {
            this.SelectDateType(item);
          }
        });
      }



      if (this.view.hasOwnProperty('dateOption')) {
        if (this.view.dateOption.length > 1) {
          this.dateOptionBlock = true;
        } else {
          this.dateOptionBlock = false;
        }
        this.optionArray = this.view.dateOption;
      }
      this.returnFilterData();
    }
  }

  PopDatePicker(type) {
    let datepicDefalult;
    if (type == 'start') {
      datepicDefalult = this.selectedDateFrom == "" ? this.today : this.selectedDateFrom;
    } else {
      datepicDefalult = this.selectedDateTo == "" ? this.today : this.selectedDateTo;;
    }
    this.pop.setDatePicker({
      status: true,
      datepicDefalult: datepicDefalult, //預設值
      maxDate: type == 'start' && this.selectedDateTo ? this.selectedDateTo : null,
      minDate: type != 'start' && this.selectedDateFrom ? this.selectedDateFrom : null,
      event: (seleted) => {
        console.log('Selected Date', seleted);
        if (type == 'start') {
          this.selectedDateFrom = seleted;
          this.view.default_value.startDate = this.selectedDateFrom;
        } else if (type == 'end') {
          this.selectedDateTo = seleted;
          this.view.default_value.endDate = this.selectedDateTo;
        }
        //選擇日期 清除上方選擇
        this.dateType.forEach(date => {
          date['select'] = false;
        });
        this.returnFilterData();
      }
    });

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
    this.getSearchDate(item['calcObj']);
  }


  /**
   * 取得查詢日期參數
   */
  getSearchDate(type: String) {
    let date = new Date();
    if (this.view['type'] == 'past') {
      this.selectedDateTo = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
      this.view.default_value.endDate = this.selectedDateTo;
      switch (type['type']) {
        // 年
        case 'Y':
          date.setFullYear(date.getFullYear() - parseFloat(type['num']));
          break;
        // 月
        case 'M':
          date.setMonth(date.getMonth() - parseFloat(type['num']));
          break;
        // 週
        case 'W':
          date.setDate(date.getDate() - type['num'] * 7);
          break;
        // 天
        case 'D':
          date.setDate(date.getDate() - parseFloat(type['num']));
          break;
        default:
          break;
      }
      this.selectedDateFrom = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
      this.view.default_value.startDate = this.selectedDateFrom;
    } else if (this.view['type'] == 'future') {

      this.selectedDateFrom = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
      this.view.default_value.startDate = this.selectedDateFrom;
      switch (type['type']) {
        // 年
        case 'Y':
          date.setFullYear(date.getFullYear() + parseFloat(type['num']));
          break;
        // 月
        case 'M':
          date.setMonth(date.getMonth() + parseFloat(type['num']));
          break;
        // 週
        case 'W':
          date.setDate(date.getDate() + type['num'] * 7);
          break;
        // 天
        case 'D':
          date.setDate(date.getDate() + parseFloat(type['num']));
          break;
        default:
          break;
      }

      this.selectedDateTo = this.dateTime.datetimeFormat(+date, 'yyyy/MM/dd');
      this.view.default_value.endDate = this.selectedDateTo;
    }
    this.returnFilterData();
  }


  /**
   * 日期選項按鈕
   */
  onOptionClick() {
    this.defaultPage = false;
    this.selectPage = true;
    this.closeBtnFlag.emit(false);
  }

  /**
   * 日期選項頁返回鍵
   */
  onBackClick() {
    this.defaultPage = true;
    this.selectPage = false;
    this.closeBtnFlag.emit(true);
  }

  onFilterClick(option) {
    this.filterKey = option.value;
    this.default_value = option.name;
    this.view.default_value.dateType = option.value;
    this.returnFilterData();
  }

  returnFilterData(){
    if (this.selectedDateFrom == "" || this.selectedDateTo == "") {
      this.returnData = {};
      this.filterData.emit(this.returnData);
      return;
    }
    this.returnData = {
      [this.filterKey]: { 'rangeDate': this.selectedDateFrom + '-' + this.selectedDateTo },
      "selectedDateFrom": this.selectedDateFrom,
      "selectedDateTo": this.selectedDateTo,
      "selectrdDateOption":this.filterKey,
      "filter":{ [this.filterKey]: { 'rangeDate': this.selectedDateFrom + '-' + this.selectedDateTo } }
    }
    this.filterData.emit(this.returnData);
  }
}




