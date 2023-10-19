/**
 * 環狀圖
 */
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
declare var Chart: any;

@Component({
    selector: 'app-chart-doughnut',
    templateUrl: './chart-doughnut.component.html',
    styleUrls: []
})

export class ChartDoughnutComponent implements OnInit, AfterViewInit {
    @Input() setData: any;
    chart: any;

    constructor(
        private _logger: Logger
    ) { }

    ngOnInit() {
        this._logger.log("into FundInvestHealthyAnalysisComponent, setData:", this.setData);
        this.doChart();
    }

    ngAfterViewInit() {
        this._logger.log("into ngAfterViewInit");
    }

    // 繪製環狀圖 (目前資料先寫死,中台傳入筆數非固定,選色上為隨機? 待補)
    doChart() {
        this._logger.log("into doChart");
        let ctx = document.getElementById("myChart");
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['其他比例', '平衡型比例', '股票型比例', '貨幣型比例'],
                datasets: [{
                    // label: '# of Tomatoes',
                    data: [15, 50, 26, 9],
                    backgroundColor: [
                        '#ffa3bd',
                        '#a6dbff',
                        '#ffffb5',
                        '#c2e8e6'
                    ],
                    borderColor: [
                        '#ff4d85',
                        '#3a81f0',
                        '#ffc961',
                        '#36c0c2'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // 關閉比例說明區塊
                legend: {
                    display: false
                },
                //cutoutPercentage: 40,
                responsive: false,

            }
        });
    }

}