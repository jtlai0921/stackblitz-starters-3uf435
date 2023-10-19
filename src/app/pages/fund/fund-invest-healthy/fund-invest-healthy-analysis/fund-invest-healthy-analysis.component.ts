/**
 * 投資組合分析(組合分析)
 */
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
declare var Chart: any;

@Component({
    selector: 'app-fund-invest-healthy-analysis',
    templateUrl: './fund-invest-healthy-analysis.component.html',
    styleUrls: []
})

export class FundInvestHealthyAnalysisComponent implements OnInit, AfterViewInit {
    @Input() setData: any;
    expandFlag: boolean; // 是否全部展開
    riskData: any; // 風險的PIECHART數據資料
    currencyData: any; // 幣別的PIECHAR數據資料
    regionData: any; // 產品的PIECHAR數據資料

    constructor(
        private _logger: Logger
    ) { }

    ngOnInit() {
        this._logger.log("into FundInvestHealthyAnalysisComponent, setData:", this.setData);
        this.expandFlag = false;
        this.riskData = this.setData.riskData;
        this.currencyData = this.setData.currencyData;
        this.regionData = this.setData.regionData;
    }

    ngAfterViewInit() {
        this._logger.log("into ngAfterViewInit");
    }
}