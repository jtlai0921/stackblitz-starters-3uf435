/**
 * footer功能選單
 */
import { Component, OnInit } from '@angular/core';
import { FooterCtrlService } from '@systems/route/layout/footer/footer-ctrl.service';
import { FooterOptions } from '@systems/route/layout/footer/footer-options';
import { FOOTER_MENU } from '@conf/menu/footer-menu';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: []
})
export class FooterComponent implements OnInit {
    options: FooterOptions;
    subscriptOption: any;
    footer_menu = FOOTER_MENU;
    is_open = false;
    showFooter = false;

    constructor(
        private footerCtrl: FooterCtrlService,
        private logger: Logger,
        private navgator: NavgatorService,
        private errorHandler: HandleErrorService
    ) {
        this.options = new FooterOptions();
        this.options.displayFooter = true;
     }

    ngOnInit() {
        this.subscriptOption = this.footerCtrl.changeFooterOption.subscribe((value: any) => {
            const defaultOption = new FooterOptions();
            this.options = { ...defaultOption, ...value };
            this._modifyFooterOptions();
          });
    }

    /**
     * [footer-menu選單]按鈕點擊事件
     * @param menu 選單
     */
    onMenuClick(menu) {
        if (menu.id == 'footer-more') {
            this.is_open = this.footerCtrl.getMenuStatus();
            if (this.is_open) {
                this.is_open = false;
                this.footerCtrl.closeMenu();
            } else {
                this.is_open = true;
                this.footerCtrl.openMenu();
            }
            return false;
        }

        if (menu.id == 'footer-home') {
            this.navgator.popTo('home');
            return false;
        }

        if (typeof menu !== 'object' || !menu || !menu.hasOwnProperty('url')) {
            this.errorHandler.handleError({
                title: 'ERROR.TITLE',
                content: 'ERROR.DEFAULT'
            });
            return false;
        }
        
        this.navgator.push(menu.url);
    }

    private _modifyFooterOptions() {
        this.showFooter = this.options.displayFooter;
    }

}
