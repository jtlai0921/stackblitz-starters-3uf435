/**
 * 首頁上選單
 */
import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../global/localStorage.service';
import { Router } from '@angular/router';

@Injectable()
export class LayoutService {
  public headerUpdated: EventEmitter<boolean> = new EventEmitter();
  public menuUpdated: EventEmitter<boolean> = new EventEmitter();
  public footerUpdated: EventEmitter<boolean> = new EventEmitter();
  public footerSourceUpdate: EventEmitter<boolean> = new EventEmitter();
  public footerCheckUpdate: EventEmitter<boolean> = new EventEmitter();
  public backEventTrigger: EventEmitter<boolean> = new EventEmitter();
  public backEventClear: EventEmitter<boolean> = new EventEmitter();

  MenuStatus = false;
  FooterStatus = false;

  constructor(
    private storage: LocalStorageService,
    private route: Router
  ) {

  }
  checkFooterUpdate(setting:any){
    this.footerCheckUpdate.emit(setting);
  }
  updateFooterSource() {
    this.footerSourceUpdate.emit();
  }
  setHeaderStatus(setting: any) {
    this.headerUpdated.emit(setting);
  }
  setMenuStatus(Isopen: boolean) {
    this.MenuStatus = Isopen;
    this.menuUpdated.emit(this.MenuStatus);
  }
  setFooterStatus(Isopen: boolean) {
    var isLogin = this.storage.get('isLogin');
    if (!isLogin) {
      Isopen = false;
    }
    this.FooterStatus = Isopen;
    this.footerUpdated.emit(this.FooterStatus);
  }
  //註冊登入後導向頁面
  RegistLoginRedirect() {
    this.storage.set('redirectUrl', this.route.url);
  }
  //取得註冊登入後導向頁面 ps:取得後會消除紀錄
  getLogInRedirect() {
    const url = this.storage.get('redirectUrl') || '';
    this.storage.remove('redirectUrl');
    return url;
  }
  //返回登入頁
  redirectLogin() {
    this.route.navigate(['/login']);
  }
  //共用網址導向方法
  urlRedirect(url, param = {}) {
    this.route.navigate([url], { queryParams: param });
  }
  // 觸發上一頁事件
  triggerBackEvent() {
    this.backEventTrigger.emit();
  }
  // 清空所有上一頁事件
  clearBackEvent() {
    this.backEventClear.emit();
  }
}