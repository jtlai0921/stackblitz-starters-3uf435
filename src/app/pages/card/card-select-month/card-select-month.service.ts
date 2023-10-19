/**
 * 信卡選擇月份(各期帳單)
 * 
 * 
 * 
 *
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { CacheService } from '@systems/system/cache/cache.service';
import { SPEC12010301ApiService } from '@api/spec12/spec12010301/spec12010301-api.service';

@Injectable()

export class CardSelectMonthService {
    /**
     * 
     */
    private setCacheName = {
        'list': 'history-bill-main'
    };

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _cacheService: CacheService,
        private spec12010301: SPEC12010301ApiService,
    ) {
    }

    /**
     * 信用卡帳單查詢(月份)
     * @param reqObj 請求資料
     * @param option 模式設定
     */
    getBillMonthData(reqData?, option?: object): Promise<any> {
        this._logger.log("into getBillMonthData, reqData:", reqData);
        // let check_id = this._formateService.checkField(reqData, 'searchType');
        // let start_date = this._formateService.checkField(reqData, 'startDate');
        // let end_date = this._formateService.checkField(reqData, 'endDate');
        // tslint:disable-next-line:radix
        // let page = parseInt(this._formateService.checkField(paginator, 'pageNumber'));
        // let sort = this._formateService.checkField(paginator, 'sortDirection');
        // if (check_id === '') {
        //     return Promise.reject({
        //         title: 'ERROR.TITLE',
        //         content: 'ERROR.DATA_FORMAT_ERROR'
        //     });
        // }
        // let check_date = this.getDateSet(check_id);
        // let check_data = this._checkService.checkDateRange([start_date, end_date], check_date);
        // if (!check_data.status) {
        //     return Promise.reject({
        //         title: 'ERROR.TITLE',
        //         content: check_data.errorMsg.join('')
        //     });
        // }

        // let actId = this._formateService.checkField(reqData, 'selectedMonth');
        // let ccy = this._formateService.checkField(reqData, 'currency');

        let cache_main_key = this.setCacheName.list;
        let cache_sub_key = [];
        const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, 1, [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);
        this._logger.log("cache_option:", cache_option);

        // 信用卡帳單查詢(月份)
        return this.spec12010301.getData(reqData, option).then(
            (sucessObj) => {
                this._logger.log("send api success, success:", sucessObj);
                this._cacheService.save(cache_key, sucessObj, cache_option);
                return Promise.resolve(sucessObj);
            },
            (failedObj) => {
                this._logger.log("send api failed, failed:", failedObj);
                return Promise.reject(failedObj);
            }
        );
    }

    // 設定預設帳號資訊
    setDefaultInfo(setData, defaultMonth) {
        this._logger.log("into setDefaultInfo, setData:", setData);
        this._logger.log("into setDefaultInfo, defaultMonth:", defaultMonth);
        let output = {
            selectedMonth: '',
            selectedMonthDesc: ''
        };
        setData.forEach(item => {
            if (item['selectedMonth'] == defaultMonth) {
                output.selectedMonth = item['selectedMonth'];
                output.selectedMonthDesc = item['selectedMonthDesc'];
            }
        });
        // 防呆 起碼回傳進來的帳號
        if (output.selectedMonth == '' || typeof output.selectedMonth == 'undefined' || output.selectedMonth == null) {
            output.selectedMonth = defaultMonth;
        }
        this._logger.log("into setDefaultInfo, output:", output);
        return output;
    }
}
