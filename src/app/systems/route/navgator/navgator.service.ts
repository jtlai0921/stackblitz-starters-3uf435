/**
 * 流程控制功能
 */

import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTING_PATH } from '@conf/menu/routing-path';
// import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
// import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { AlertService } from '@template/msg/alert/alert.service';
import { Sites } from '@conf/external-web';
import { InAppBrowserService } from '@lib/link/plugins/in-app-browser/in-app-browser.service';
// tslint:disable-next-line: import-blacklist
import { Subject } from 'rxjs';
import { SessionStorageService } from '@lib/storage/session-storage.service';
// import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
// import { HeaderOptions } from '@systems/layout/header/header-options';
import { Base64FileUtil } from '@util/formate/modify/base64-file-util';
import { FooterCtrlService } from '@systems/route/layout/footer/footer-ctrl.service';

@Injectable({
  // 全ＡＰＰ只有一個
  providedIn: 'root'
})
export class NavgatorService {
  // displayCloneBoxSubject: Subject<boolean> = new Subject<boolean>();
  // displayScanBoxSubject: Subject<boolean> = new Subject<boolean>();
  // scanObj: Subject<any> = new Subject<any>();
  authErrorSubject: Subject<boolean> = new Subject<boolean>();

  history: string[];
  params = {};
  urlParams = {};
  returnData = {};
  // routing_path_header = {};
  // header當前值
  // private headerData: HeaderOptions;
  // 前一頁參數設定值
  private prePageData: any = {};
  constructor(
    private logger: Logger,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private startApp: StartAppService,
    // private headerCtrl: HeaderCtrlService,
    private inAppBrowser: InAppBrowserService,
    private session: SessionStorageService,
    // private microInteraction: MicroInteractionService,
    private alert: AlertService,
    private _formateService: FormateService,
    private footerCtrl: FooterCtrlService
  ) {
    this.initHistory();
  }

  /**
   * page設定preInit時
   * 需在初始化結束後呼叫
   */
  // pageInitEnd() {
  //   this.displayCloneBox(false);
  // }

  /**
   * 設定顯示Clone畫面
   * @param display 是否顯示
   */
  // displayCloneBox(display: boolean) {
  //   this.displayCloneBoxSubject.next(display);
  // }

  /**
   * 設定顯示掃條碼畫面
   * @param display 是否顯示
   */
  // displayScanBox(display: boolean) {
  //   this.displayScanBoxSubject.next(display);
  // }

  authError() {
    this.authErrorSubject.next();
  }

  /**
   * 取得最後一頁路徑
   */
  getLastPath(): string {
    let path = '';
    if (this.history.length > 0) {
      const pathIndex = this.history.length - 1;
      path = this.history[pathIndex];
    }
    return path;
  }

  /**
   * 取得目前Header設定
   */
  getHeader() {
    const path = this.getLastPath();
    return ROUTING_PATH[path].header;
  }

  /**
   * 取得目前Footer設定
   */
  getFooter() {
    const path = this.getLastPath();
    return ROUTING_PATH[path].footer;
  }

  /**
   * 設定參數
   */
  setParams(data: any) {
    const path = this.getLastPath();
    this.params[path] = data;
  }
  /**
   * 刪除參數
   */
  deleteParams() {
    const path = this.getLastPath();
    delete this.params[path];
  }

  /**
   * 取得傳入參數
   */
  getParams() {
    if (this.history.length > 0) {
      const path = this.getLastPath();
      return this.params[path];
    }
    return null;
  }

  /**
   * 取得由後一頁返回資料
   */
  getReturnData() {
    if (this.history.length > 0) {
      const path = this.getLastPath();
      return this.returnData[path];
    }
    return null;
  }

  /**
   * 取得由URL路徑傳入資料
   */
  getQueryParams(): Observable<Params> {
    return this.activatedRoute.queryParams;
  }

  /**
   * 切換至下一頁
   * @param path 路徑
   *  
   * @param navParams 傳入下一頁的參數
   */
  push(path: string, navParams: any = {}, urlParams?: any) {
    this.footerCtrl.closeMenu();
    // if (path !== 'user_home') { this.headerCtrl.setCheckFinishStatus(true); }
    if (!path) {
      // 路徑不得為空
      this.alert.show('ERROR.PATH_NOT_EXIST', { title: 'ERROR.TITLE' });
      return;
    }
    if (path == this.getLastPath()) {
      // 路徑不得與前一頁相同
      return;
    }
    // /**
    //  * 於EPAY列表由左側選單點選合庫EPAY功能時專用，重複執行動作兩次以上時才會進入此判斷
    //  */
    // if (path == 'epay-scan' && this.getLastPath() == 'epay-scan') {
    //   return false;
    // }
    this.logger.debug('path', path);
    if (path.indexOf(':') > 0 && path.indexOf('http') === 0) {
      const target = !!navParams.target ? navParams.target : '_system';
      this.inAppBrowser.open(path, target);
      return;
    }

    if (!ROUTING_PATH[path]) {
      // 不可在Navgator內引用HandleErrorService
      this.alert.show('ERROR.PATH_NOT_EXIST', { title: 'ERROR.TITLE' });
      return;
    }

    const routingPath = ROUTING_PATH[path];
    let check_property = this._formateService.checkObjectList(routingPath, 'openType');
    if (!!check_property) {
      if (check_property == 'app') {
        this.logger.debug('app');
        // this.startApp.startApp(routingPath.url);
      } else if (check_property == 'web') {
        this.logger.debug('有進去瀏覽器');
        this.inAppBrowser.openWeb(routingPath.url, urlParams).then(
          (web) => {
            
          },
          (err) => {
            if (err.loginRequired == true) {
              this.session.set('redirect', path);
              this.push('login');
            } else {
              this.alert.show(err.msg, { title: 'ERROR.TITLE' });
            }
          }
        );
      }
      // APP open & Web open Close
      return;
    }

    this.logger.debug('push page');
    this.savePrePageSet(); // 暫存當前頁面資訊
    this.pushHistory(path); // 即將前往的路徑
    // if (routingPath.preInit) {
    //   this.displayCloneBox(true);
    // }
    if (!!navParams) {
      this.params[path] = navParams;
    }
    if (!!routingPath['urlParams'] && typeof routingPath['urlParams'] === 'object') {
      urlParams = { ...urlParams, ...routingPath['urlParams'] }; // 採用部份取代方式
    }
    if (!!urlParams) {
      this.urlParams[path] = urlParams;
    }

    // header控制 => layout ctroller
    // this.headerCtrl.setOption(routingPath.header);
    // this.routing_path_header = routingPath.header;
    this.router.navigate([routingPath.url], { queryParams: this.urlParams[path] });
  }

  /**
   * 回前一頁
   */
  pop(returnData?: any) {
    this.footerCtrl.closeMenu();
    const path = this.popHistory();
    delete this.params[path];
    delete this.urlParams[path];
    delete this.returnData[path];
    const lastPath = this.getLastPath();
    const routingPath = ROUTING_PATH[lastPath];

    this.returnData[lastPath] = returnData;
    // this.headerCtrl.setOption(routingPath.header);
    // this.routing_path_header = routingPath.header;
    this.router.navigate([routingPath.url], { queryParams: this.urlParams[lastPath] });
  }

  /**
   * 回首頁
   */
  home() {
    this.popTo('home');
  }

  /**
   * 編輯返回事件 
   */
  editBack() {
    this.popTo('home');
  }

  /**
   * 返回動作
   */
  back(...args) {
    this.pop();
  }

  /**
   * 回到前面某一頁
   * @param path 路徑
   */
  popTo(path: string) {
    this.footerCtrl.closeMenu();
    let lastPath = this.getLastPath();
    while (this.history.length && lastPath !== path) {
      delete this.params[lastPath];
      delete this.urlParams[lastPath];
      delete this.returnData[path];
      this.popHistory();
      lastPath = this.getLastPath();
    }
    if (path === 'home') {
      // this.headerCtrl.setOption(ROUTING_PATH['home'].header);
      // this.routing_path_header = ROUTING_PATH['home'].header;
      this.router.navigate([ROUTING_PATH['home'].url]);
    } else {
      // this.headerCtrl.setOption(ROUTING_PATH[lastPath].header);
      // this.routing_path_header = ROUTING_PATH[lastPath].header;
      this.router.navigate([ROUTING_PATH[lastPath].url], { queryParams: this.urlParams[lastPath] });
    }
  }

  /**
   * 切換頁面並清空記錄
   * @param path 路徑
   */
  setRoot(path: string) {
    this.history = [];
  }

  /**
   * 取得操作頁面記錄
   */
  getHistory(): string[] {
    return this.history;
  }

  /**
   * 取得操作記錄長度
   */
  getHistoryLength(): number {
    return this.history.length;
  }

  pushHistory(path) {
    this.history.push(path);
    this.saveHistory();
  }

  popHistory() {
    const path = this.history.pop();
    this.saveHistory();
    return path;
  }

  initHistory() {
    this.history = [];
    // 若有多個index.html才需要以下寫法(現行無)
    // this.history = this.session.getObj('history') || [];
  }

  saveHistory() {
    this.session.setObj('history', this.history);
  }

  /**
   * 取得前頁資訊
   */
  getPrePageSet() {
    let output = this._formateService.transClone(this.prePageData);
    return output;
  }

  /**
   * 暫存header值
   * @param option
   */
  // saveHeaderData(option: HeaderOptions) {
  //   this.headerData = this._formateService.transClone(option);
  //   if (!!option.title && option.title == 'epay') {
  //     this.headerData.title = 'FUNC.EPAY';
  //   }
  // }

  /**
   * 將當前資訊暫存為前頁資訊
   */
  private savePrePageSet() {
    let output: any = {
      path: '',
      params: {},
      urlParams: {},
      header: {},
      now_header: {} // 當前header資訊
    };
    let lastPath = this.getLastPath();
    // path
    output.path = lastPath;
    // params
    let pre_params = this.getParams();
    if (!!pre_params) {
      output.params = pre_params;
    }
    // urlParams
    if (!!this.urlParams[lastPath]) {
      output.urlParams = this._formateService.transClone(this.urlParams[lastPath]);
    }
    // header
    output.header = this.getHeader();
    // output.headerData = this._formateService.transClone(this.headerData);

    this.prePageData = output;
  }


  /**
   * 開啟PDF
   * @param pdfStr
   */
  openPDF(pdfStr: string) {
    let path = '';
    this.logger.log('pdf');
    if (pdfStr != '') {
      path = Base64FileUtil.base64ToPDF(pdfStr);
    }
    let web = this.inAppBrowser.outAppOpen(pdfStr);
    if (!web) {
      // 不可在Navgator內引用HandleErrorService
      this.alert.show('ERROR.PATH_NOT_EXIST', { title: 'ERROR.TITLE' });
    }
  }

}
