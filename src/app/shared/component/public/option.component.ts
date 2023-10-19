
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html'
})
export class OptionComponent implements OnChanges {

  defaultPage = true;
  selectPage = false;
  title;
  default_value = 'BTN.SELECT_PLEASE';
  optionArray;
  returnData;

  /**
   * source => 原始資料
   * viewData = {  => 畫面顯示資料
   *    title:'',  ex. 國別
   *    default_value:'',  ex. Taiwan
   *    option:[
   *      { name:'', value:'' }
   *    ]  => 選項Array
   * }
   * filterKey => 要篩選的欄位
   */

  @Input() source: any;
  @Input() view: any;
  @Input() filterKey: any;
  @Output() filterData: EventEmitter<any> = new EventEmitter();
  @Output() closeBtnFlag: EventEmitter<any> = new EventEmitter();

  //example For view 
  // view = {
  //   title : '',
  //   default_value : '',
  //   option : [{name:'',value:''}]
  // }


  constructor(
  ) {
  }


  ngOnChanges(): void {
    this.getData();
  }

  getData() {
    // console.log('option source', this.source);
    console.log('option view', this.view);
    console.log('option filterKey', this.filterKey);
    if (typeof this.view == 'object') {
      if (this.view.hasOwnProperty('title')) {
        this.title = this.view.title;
      }
      if (this.view.hasOwnProperty('default_value') && this.view.default_value != undefined && this.view.default_value != '') {
        this.view.option.forEach(optionItem => {
          if (optionItem.value == this.view.default_value) {
            this.default_value = optionItem.name;
            this.returnData = { [this.filterKey]: optionItem.value };
          }
        });
      } else {
        this.default_value = 'BTN.SELECT_PLEASE';
        this.returnData = { [this.filterKey]: '' };
      }
      if (this.view.hasOwnProperty('option') && this.view.option.length != 0) {
        this.optionArray = this.view.option;
      } else {
        this.defaultPage = false;
        this.selectPage = false;
      }
    }
    this.filterData.emit(this.returnData);
  }

  onOptionClick() {
    this.defaultPage = false;
    this.selectPage = true;
    this.closeBtnFlag.emit(false);
  }

  onFilterClick(option) {
    this.returnData = { [this.filterKey]: option.value };
    this.default_value = option.name;
    this.filterData.emit(this.returnData);
  }

  onBackClick() {
    this.defaultPage = true;
    this.selectPage = false;
    this.closeBtnFlag.emit(true);
  }
}




