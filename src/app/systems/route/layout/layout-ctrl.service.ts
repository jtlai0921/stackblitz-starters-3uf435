/**
 * 畫面控制
 */
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { Logger } from '@systems/system/logger/logger.service';
import { HeaderCtrlService } from './header/header-ctrl.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { FooterCtrlService } from './footer/footer-ctrl.service';
import { FormateService } from '@template/formate/formate.service';
import { ROUTING_DEFAULT_PATH } from '@conf/menu/routing-path';
import { SessionStorageService } from '@lib/storage/session-storage.service';

@Injectable({
    // 全ＡＰＰ只有一個
    providedIn: 'root'
})
export class LayoutCtrlService {
    private haveLoad = false;

    constructor(
        private router: Router,
        private _logger: Logger,
        private _formateService: FormateService,
        private headerCtrl: HeaderCtrlService,
        private navgator: NavgatorService,
        private footerCtrl: FooterCtrlService,
        private session: SessionStorageService
    ) {
    }

    /**
     * init event
     * router subscribe全APP僅能一個
     */
    init() {
        if (this.haveLoad) {
            return false;
        }
        this.router.events.subscribe((val) => {
            // 轉址結束事件
            this._setRouteChange(val);
        });
        this.haveLoad = true;
    }


    /**
     * route 轉址結束事件
     * @param val 
     */
    private _setRouteChange(val) {
        if (val instanceof NavigationEnd) {
            // this._logger.log('NavigationEnd', val);
            let urlAfterRedirects = this._formateService.checkField(val, 'urlAfterRedirects');
            if (typeof urlAfterRedirects != 'string') {
                urlAfterRedirects = '';
            }
            urlAfterRedirects = urlAfterRedirects.replace('/', '');
            let last_path = this.navgator.getLastPath();
            // this._logger.log('NavigationEnd', last_path);

            // 啟動執行沒有跑預設頁面(正式應該不會，之後再說)
            if (!environment.ONLINE) {
                if (last_path == '' && urlAfterRedirects != ROUTING_DEFAULT_PATH) {
                    let history = this.session.getObj('history') || [];
                    let history_path = 'home';
                    if (history.length > 0) {
                      const pathIndex = history.length - 1;
                      history_path = history[pathIndex];
                    }
                    this.navgator.pushHistory(history_path);
                } else if (last_path == '' && urlAfterRedirects == ROUTING_DEFAULT_PATH){
                    this.navgator.setRoot(''); // 清空重來
                }
            }
            let set_header = this.navgator.getHeader();
            let set_footer = this.navgator.getFooter();

            this.headerCtrl.setOption(set_header, true);
            this.footerCtrl.setFooterOption(set_footer);
        }
    }

}