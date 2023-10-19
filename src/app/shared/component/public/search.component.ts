
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchFilterService } from './search-filter.service'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  public searchkey = '';
  private keywork_source = [];
  private keywork_command = [];
  public focus_flag = false;
  @Input() source: any;
  @Input() column: any;
  //判斷是否為通知訊息搜尋bar
  @Input() IsNotify: boolean;
  @Output() filterData: EventEmitter<any> = new EventEmitter();

  constructor(
    private searchFilter: SearchFilterService
  ) {
    this.searchkey = '';
  }

  ngOnChanges() {

    this.keywork_source = [];
    //確認需要篩選之key值     
    var keys = [];
    if (typeof this.column == 'string') {
      keys.push(this.column);
    }
    else if (typeof this.column == 'object' && this.column.length > 0) {
      keys = this.column;
    }
    else if (keys.length == 0) {
      keys = Object.keys(this.source[0]);
    }
    // 若為通知訊息搜尋bar時執行
    if(this.IsNotify){
      this.source.forEach(element =>{
        let content = JSON.parse(element.Content);
        keys.forEach(k => {
          if (content.hasOwnProperty(k) && content[k] != "") {
            let temp = content[k]
            this.keywork_source.push(temp)
          }
        })
      })
    }else{
      this.source.forEach(element => {
        keys.forEach(k => {
          if (element.hasOwnProperty(k) && element[k] != "") {
            let temp = element[k]
            this.keywork_source.push(temp)
          }
        })
      });
    }
  }
  Submit() {
    this.keywork_command = [];
    if (this.searchkey != '') {
      this.keywork_command = this.keywork_source.filter(text => {
        return (text.toLocaleLowerCase()).indexOf(this.searchkey.toLocaleLowerCase()) > -1;
      });
    }

    this.keywork_command = this.keywork_command
      .filter((item, index, array) => {
        return array.indexOf(item) === index;
      })

    var filter = [];
    if (this.searchkey != '' && this.source) {
      filter = this.searchFilter.Filter(this.source, this.column, this.searchkey,this.IsNotify);
      this.filterData.emit(filter);
    } else {
      this.filterData.emit(this.source);
    }
  }

  onFocus() {
    console.log('onFocus');
    this.focus_flag = true;
  }
  outFocus() {
    console.log('outFocus');
    setTimeout(() => {
      this.focus_flag = false;
    }, 10);
  }
  setInput(text) {
    console.log('setInput', text);
    this.searchkey = text;
    this.Submit();
    this.keywork_command = [];
  }
}




