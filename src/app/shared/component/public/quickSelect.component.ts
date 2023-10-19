
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-quickselect',
  templateUrl: './quickSelect.component.html'
})
export class QuickSelectComponent implements OnChanges {

  defaultPage = true;
  selectPage = false;
  title;
  default_value;
  optionArray = [];
  quickSelectPage = true;

  /**
   * source => 原始資料
   * viewData = {  => 畫面顯示資料
   *    title:'',  ex. 國別
   *    default_value:'',  ex. 'Taiwan,Japan'
   *    option:[
   *      { name:'', value:'' }
   *    ]  => 選項Array
   *    type: 'single' => 單選, 預設為多選
   * }
   * filterKey => 要篩選的欄位
   */

  @Input() source: any;
  @Input() view: any;
  @Input() filterKey: any;
  @Input() tagStyle: any;
  @Output() filterData: EventEmitter<any> = new EventEmitter();

  constructor(
  ) {
  }

  ngOnChanges() {
    this.getData();
  }

  getData() {
    console.log("tagStyle == " + this.tagStyle);
    console.log('quickSelect source', this.source);
    console.log('quickSelect view', this.view);
    console.log('quickSelect filterKey', this.filterKey);
    this.optionArray = [];
    if (typeof this.view == 'object') {
      if (this.view.hasOwnProperty('title')) {
        this.title = this.view.title;
      }
      if (this.view.hasOwnProperty('option') && this.view.option.length != 0) {
        this.view.option.forEach((totleItem, i) => {
          this.optionArray.push({ name: totleItem.name, selected: false, value: totleItem.value })
          if (this.view.hasOwnProperty('default_value') && this.view.default_value != '' && this.view.default_value != undefined) {
            console.log("this.view['default_value'] = "+this.view['default_value'])
            this.optionArray[i].selected = false; // 先將所有產品別按鈕設為false
            let arr = this.view['default_value'].split(","); 
            arr.forEach((element) =>{          
              if (element == totleItem.value) {
                this.optionArray[i].selected = true;
              }
            })
          }
        });
      } else {
        this.quickSelectPage = false;
      }
      let filter = {};
      filter[this.filterKey] = this.view['default_value'];
      this.filterData.emit(filter);
    }

  }

  onOptionClick(option) {
    let dataArr = [];
    let data;
    let filter = {};
    if (this.view.hasOwnProperty('type') && this.view['type'] == 'single') { //單選
      this.optionArray.forEach(item => {
        if (item.name == option) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        if (item.selected) {
          dataArr.push(item.value);
        }
      })
    } else { //複選
      this.optionArray.forEach(item => {
        if (item.name == option) {
          item.selected = !item.selected;
        }
        if (item.selected) {
          dataArr.push(item.value);
        }
      })
    }

    data = dataArr.join();
    filter[this.filterKey] = data;
    this.filterData.emit(filter);
  }

}




