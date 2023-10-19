/**
 * 投資組合分析(投資合計)
 */
import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';

@Component({
    selector: 'app-fund-invest-healthy-total',
    templateUrl: './fund-invest-healthy-total.component.html',
    styleUrls: []
})

export class FundInvestHealthyTotalComponent implements OnInit {
    @Input() setData: any;
    showData: any;

    constructor(
        private _logger: Logger
    ) { }

    ngOnInit() {
        this._logger.log("into FundInvestHealthyTotalComponent, setData:", this.setData);
        this.showData = this.setData.sumupInfo;
    }

}