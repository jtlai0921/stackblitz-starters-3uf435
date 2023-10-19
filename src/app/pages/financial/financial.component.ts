/**
 * 金融資訊選單
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: [],
    providers: []
})
export class FinancialComponent implements OnInit {
    /**
     * 參數設定
     */

    constructor(
        private _logger: Logger,
        private navgator: NavgatorService,
        private errorHandler: HandleErrorService
    ) {
        this._logger.step('Financial', 'hi');
    }

    ngOnInit() {

    }
}
