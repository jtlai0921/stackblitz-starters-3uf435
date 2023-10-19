/**
 * 貸款本息攤還試算Service
 */
import { Injectable } from '@angular/core';
import { CacheService } from '@systems/system/cache/cache.service';
import { FormateService } from '@template/formate/formate.service';
import { Logger } from '@systems/system/logger/logger.service';

@Injectable()

export class LoanCalculatorService {
    /**
     * 參數處理
     */

    constructor(
        private _cacheService: CacheService,
        private _formateService: FormateService,
        private logger: Logger
    ) {

    }

    /**
     * 貸款本息攤還試算
     * 發電文取得資料
     */
    public getData(option?: object): Promise<any> {
        // const cache_key = 'exchange-rate-history';
        // const cache_data = this._cacheService.checkCacheData(cache_key, option);
        // if (cache_data) {
        //     return Promise.resolve(cache_data);
        // }
        
        return this.specxxx1(option).then(
            (successObj) => {
                // let cache_option = this._cacheService.getCacheSet(cache_key);
                // this._cacheService.save(cache_key, successObj, cache_option);
                return Promise.resolve(successObj);
            },
            (errObj) => {
                return Promise.reject(errObj);
            }
        );
    }
    
    private specxxx1(option): Promise<any> {
        let headerObj = {
            "apiId": "SPEC000001",
            "requestId": "",
            "responseTime": "",
            "lang": "TW",
            "TXRETFLG": "0",
            "ERRORCODE": "",
            "ERRORMSG": ""
        };
        let resData2 = {};
        let resData = {
            loanAmount: "30000",
            repaymentMethod: "本息平均攤還",
            totalPayment: "36000",
            totalInterestPayable: "6000",
            rowData: [{
                duration: "first",
                month: "3",
                rate: "20.00",
                principal: "15000",
                durationInterestPayable: "3000",
                durationPayment: "18000",
                monthlyPayment: "6000",
            },
            {
                duration: "second",
                month: "2",
                rate: "20.00",
                principal: "10000",
                durationInterestPayable: "2000",
                durationPayment: "12000",
                monthlyPayment: "6000",
            },
            {
                duration: "third",
                month: "1",
                rate: "20.00",
                principal: "5000",
                durationInterestPayable: "1000",
                durationPayment: "6000",
                monthlyPayment: "6000",
            }]
        };

        let output: any = {
            responseTime: '', // 查詢回應時間
            loanAmount: '',
            repaymentMethod: '',
            totalPayment: '',
            totalInterestPayable: '',
            data: [],
            list: {}
        };
        output.responseTime = this._formateService.checkField(headerObj, 'responseTime');
        output.loanAmount = this._formateService.checkField(resData, 'loanAmount');
        output.repaymentMethod = this._formateService.checkField(resData, 'repaymentMethod');
        output.totalPayment = this._formateService.checkField(resData, 'totalPayment');
        output.totalInterestPayable = this._formateService.checkField(resData, 'totalInterestPayable');
        let modify_data = this._formateService.checkObjectList(resData, 'rowData');
        let today = new Date().toLocaleDateString();
        let today_time = new Date(today).getTime();
        if (modify_data) {
            output.data = modify_data;
            output.data.forEach(item => {
                // 需要資料整理
                let sub_list = {
                    duration: this._formateService.checkField(item, 'duration'),
                    month: this._formateService.checkField(item, 'month'),
                    rate: this._formateService.checkField(item, 'rate'),
                    principal: this._formateService.checkField(item, 'principal'),
                    durationInterestPayable: this._formateService.checkField(item, 'durationInterestPayable'),
                    durationPayment: this._formateService.checkField(item, 'durationPayment'),
                    monthlyPayment: this._formateService.checkField(item, 'monthlyPayment')
                };
                output.list[sub_list.duration] = sub_list;
            });
        }
        if (output.data.length < 1) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.EMPTY',
                data: output,
            });
        }

        return Promise.resolve(output);
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}