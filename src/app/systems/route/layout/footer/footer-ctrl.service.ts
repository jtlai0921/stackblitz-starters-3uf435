import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FooterOptions } from './footer-options';

@Injectable({
  providedIn: 'root'
})
export class FooterCtrlService {
  changeFooterOption: Subject<any> = new Subject<any>();
  openMenuChange: Subject<any> = new Subject<any>();
  menu_is_open = false;

  constructor(
    
  ) {
    
  }

  /**
   * 設定Footer樣式
   * @param option Footer設定
   */
  setFooterOption(option) {
    this.changeFooterOption.next(option);
  }

  /**
   * 開啟menu選單
   */
  openMenu() {
    this.menu_is_open = true;
    this.openMenuChange.next(true);
  }

  /**
   * 關閉menu選單
   */
  closeMenu() {
    this.menu_is_open = false;
    this.openMenuChange.next(false);
  }

  getMenuStatus() {
    return this.menu_is_open;
  }

  /**
   * 開啟footer
   */
  openFooter() {
    let option = {
      displayFooter: true
    };
    this.changeFooterOption.next(option);
  }

  /**
   * 關閉footer
   */
  closeFooter() {
    let option = {
      displayFooter: false
    };
    this.changeFooterOption.next(option);
  }

}
