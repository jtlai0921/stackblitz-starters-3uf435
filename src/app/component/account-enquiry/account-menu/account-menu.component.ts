import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit {

  @Output() menuType: EventEmitter<any> = new EventEmitter;
  tabIndex: number;

  constructor() { }

  ngOnInit() {
  }

  onMenuClick(menu) {
    switch (menu) {
      // 存款概要
      case 'depositSumPage':
        this.tabIndex = 0;
        break;

      // 存款明細
      case 'depositDetailPage':
        this.tabIndex = 1;
        break;

      // 放款概要
      case 'loanSumPage':
        this.tabIndex = 2;
        break;

      // 匯款查詢
      case 'inquiryPage':
        this.tabIndex = 3;
        break;

      // 票據查詢
      case 'billColPage':
        this.tabIndex = 4;
        break;

      // 交易紀錄
      case 'transPage':
        this.tabIndex = 5;
        break;

      default:
        break;
    }
    this.menuType.emit(menu);
  }

  getActive(index) {
    if (this.tabIndex == index) {
      return "active"
    }
    return "";
  }

}
