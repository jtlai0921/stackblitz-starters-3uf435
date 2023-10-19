/**
 * 全部功能選單
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { FooterCtrlService } from '@systems/route/layout/footer/footer-ctrl.service';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { LEFT_MENU } from '@conf/menu/left-menu';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { LogoutService } from '@pages/login/shared/logout.service';
import { AppCtrlService } from '@systems/system/app-ctrl/app-ctrl.service';
import { DeviceService } from '@lib/device/device.service';
import { FormateService } from '@template/formate/formate.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: []
})
export class MenuComponent implements OnInit {
    is_login = false;
    is_open = false;
    menuData = LEFT_MENU;
    appversion: string;
    private oldHeaderOpt = '';
    private haveDoClick = false;
    // ==== subscript object ==== //
    private subscriptionOpenMenuChange: any;
    private subscriptionLogin: any;
    private subscriptionLogout: any;

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private errorHandler: HandleErrorService,
        private appCtrl: AppCtrlService,
        private logoutService: LogoutService,
        private footerCtrl: FooterCtrlService,
        private _headerCtrl: HeaderCtrlService,
        private navgator: NavgatorService,
        private device: DeviceService
    ) { }

    ngOnInit() {
        this.subscriptionLogin = this.appCtrl.changeLogin.subscribe((value: any) => {
            this.is_login = true;
        });

        this.subscriptionLogout = this.appCtrl.changeLogout.subscribe((value: any) => {
            this.is_login = false;
        });

        this.subscriptionOpenMenuChange = this.footerCtrl.openMenuChange.subscribe((value: any) => {
            this.is_open = value;
            this.checkOpen();
        });

        this.device.devicesInfo().then(
            (deviceInfo) => {
              if (deviceInfo.hasOwnProperty('appinfo') && !!deviceInfo.appinfo) {
                this.appversion = deviceInfo.appinfo.version + '(' + deviceInfo.appinfo.subVersion + ')';
              }
            }
          );

    }


    /**
     * 選單事件
     * @param menu 選單
     */
    onGoEvent(menu) {
        if (typeof menu !== 'object' || !menu || !menu.hasOwnProperty('url')) {
            this.errorHandler.handleError({
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
            return false;
        }
        this.haveDoClick = true;
        this.navgator.push(menu.url);
    }

    /**
     * 登出按鈕點擊
     */
    logoutBtnClick() {
        this.logoutService.logout();
    }

    /**
     * 檢查開啟狀態
     */
    private checkOpen() {
        if (!!this.is_open) {
            // 開啟
            this.oldHeaderOpt = this.navgator.getHeader();
            this._logger.error('HeaderCtrl', 'set header');
            this._headerCtrl.setOption({
                'headerClass': 'header_menu'
            });
            this.haveDoClick = false;

        } else if (!this.is_open && !this.haveDoClick) {
            // 關閉 且 非點選功能
            // reset header
            let set_header = {
                'headerClass': this._formateService.checkField(this.oldHeaderOpt, 'headerClass')
            };
            this._headerCtrl.setOption(set_header);
        }
    }


}
