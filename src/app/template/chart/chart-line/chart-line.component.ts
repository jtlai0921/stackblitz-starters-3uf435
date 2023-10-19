/**
 * chart.js套件 走勢圖
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { ChartLineService } from './chart-line.service';
declare var Chart: any;

@Component({
    selector: 'app-chart-line',
    templateUrl: './chart-line.component.html',
    styleUrls: [],

})
export class ChartLineComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() setData; // 帶入 買匯,賣匯array
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    line: any;

    constructor(
        private _logger: Logger,
        private _mainService: ChartLineService
    ) {
    }


    ngOnInit() {
        this._logger.log("into ngOnInit");
    }

    ngOnChanges() {
        this._logger.log("into ngOnChanges, setData:", this.setData);
        this.doLine();
    }

    doLine() {
        this._logger.log("into doLine");
        // 防呆處理
        if(this.setData.length == 0) {
            this.onErrorPageData(this.setData); 
        }
        let formateData = this._mainService.doFormateData(this.setData);

        // rateData
        var config = {
            type: 'line',
            data: {
                labels: formateData.dateData,
                datasets: [{
                    label: "買匯",
                    // 買匯
                    backgroundColor: '#ffba80',
                    borderColor: '#ffba80',
                    data: formateData.buyData,
                    fill: false,
                    borderWidth: '2',
                    pointRadius: '',
                }, {
                    label: "賣匯",
                    // 賣匯
                    fill: false,
                    backgroundColor: '#ff7d94',
                    borderColor: '#ff7d94',
                    data: formateData.sellData,
                    borderWidth: '2',
                    pointRadius: '',
                }]
            },
            options: {
                // 控制rwd版面
                responsive: true,
                maintainAspectRatio: false,
                // 控制hover顯示框
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    axis: 'x'
                },
                // 指標移動跟隨顯示
                hover: {
                    mode: 'index',
                    intersect: false,
                    axis: 'x'
                },
                // label 說明樣式
                legend: {
                    display: true,
                    align: 'end',
                    // position: 'bottom', // 位置
                    labels: {
                        fontColor: '#333',
                        usePointStyle: true,
                        boxWidth: 5,
                        boxHeight: 5
                    }
                },
                // x,y軸設定
                scales: {
                    xAxes: [{
                        display: true,
                        // 決定是否顯示x軸名稱與資料
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        },
                        // x軸隔線是否顯示
                        gridLines: {
                            display: false,
                            offsetGridLines: true
                        }
                    }],
                    yAxes: [{
                        display: true,
                        // 決定是否顯示y軸名稱與資料
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        },
                        gridLines: {
                            display: true
                        }
                    }]
                }
            }
        };

        var ctx = document.getElementById("canvas");
        this.line = new Chart(ctx, config);
        this._logger.log("has new Chart");
    }

    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'chart-line',
            'type': 'back',
            'data': item
        };
        this._logger.log("date-range-search onBackPageData, output:", output);
        this.backPageEmit.emit(output);
    }

    onErrorPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'chart-line',
            'type': 'back',
            'data': item
        };
        this.errorPageEmit.emit(output);
    }

}

