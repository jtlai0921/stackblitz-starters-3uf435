/**
 * 各期帳單查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { CheckService } from '@template/check/check.service';
import { CacheService } from '@systems/system/cache/cache.service';
import { Subject } from 'rxjs/internal/Subject';
import { SPEC12010301ApiService } from '@api/spec12/spec12010301/spec12010301-api.service';
import { SPEC12010302ApiService } from '@api/spec12/spec12010302/spec12010302-api.service';
import { SPEC12010401ApiService } from '@api/spec12/spec12010401/spec12010401-api.service';

@Injectable()

export class HistoryBillService {
    /**
     * 參數處理
     */
    // 選擇信卡期間
    private setCacheName = {
        'list': 'select-card-month'
    };
    // 各期帳單查詢
    private setCacheCardName = {
        'list': 'history-bill'
    };
    // 未出帳消費查詢
    private setUnpaidCacheName = {
        'list': 'unpaid-bill'
    };
    // 近期帳單查詢
    private setNowpaidCacheName = {
        'list': 'nowpaid-bill'
    }

    expandSubject: Subject<any> = new Subject<any>();
    hasYearList = []; // 存年月,判斷該年分是否出現過(有此筆資料)

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private spec12010301: SPEC12010301ApiService,
        private spec12010302: SPEC12010302ApiService,
        private spec12010401: SPEC12010401ApiService
    ) {
    }

    /**
     * 控制展開收合事件
     * @param checkFinish 
     */
    changeExpandSubject(checkFinish: boolean) {
        this.expandSubject.next(checkFinish);
    }


    /**
     * 刪除cache
     * @param type 指定刪除類別
     *  detail: 本金明細查詢
     *  interest: 利息明細查詢
     * @param acctObj 指定刪除明細
     *  iron 指定刪除單一明細
     */
    removeAllCache(type?: string, acctObj?: object) {
        if (typeof type == 'undefined') {
            type = this.setCacheName.list;
        }
        this._cacheService.removeGroup(type);
    }

    /**
     * 取得近期帳單資料
     * @param reqData 
     * @param option 
     */
    async getNowBillData(reqData?, option?: object): Promise<any> {
        this._logger.log("into getNowBillData, reqData:", reqData);
        // 回傳物件
        let output = {
            status: false,
            selectMonth: '', // EX: 2020-0720
            monthStr: '', // EX: 07
            curBal: '', // 應繳總金額
            minPay: '', // 最低應繳金額
            dueDate: '', // 繳款截止日
            billData: {}
        };
        let cache_main_key = this.setNowpaidCacheName.list;
        let cache_sub_key = [];
        const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, 1, [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);
        try {
            const billMonth = await this.getBillMonthData(reqData, option);
            this._logger.log("getNowBillData, billMonth:", billMonth);
            let monthObj = billMonth['rangeData'][0];
            if (monthObj.hasOwnProperty('selectedMonth')) {
                output.selectMonth = monthObj.selectedMonth;
                output.monthStr = monthObj.selectedMonth.substring(4, 6);
            }
            let setData = {
                selectedMonth: output.selectMonth
            };
            const billObj = await this.getBillData(setData, option);
            this._logger.log("getNowBillData, billObj:", billObj);
            let billData = billObj['infoData'];
            output.billData = billData;
            output.curBal = billData.curBal;
            output.minPay = billData.minPay;
            output.dueDate = billData.dueDate;
            output.status = true;
            //-- 整理好回傳物件後, 建立cache --
            this._cacheService.save(cache_key, output, cache_option);
            this._logger.log("cache_option:", cache_option);
            this._logger.log("getNowBillData, output:", output);
            return Promise.resolve(output);
        } catch (exceptionObj) {
            console.log("7777777 exceptionObj");
            output.status = false;
            return Promise.reject(output);
        }
    }

    /**
     * 信用卡帳單查詢(月份)
     * @param reqObj 請求資料
     * @param paginator 分頁物件
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

        // let actId = this._formateService.checkField(reqData, 'accountId');
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

    /**
     * 各期帳單查詢 spec12010302
     * @param reqData 請求資料
     * @param paginator  分頁
     * @param option 模式設定
     */
    getBillData(reqData?, option?: object) {
        this._logger.log("into getBillData, reqData:", reqData);
        let cache_main_key = this.setCacheCardName.list;
        let selectedMonth = this._formateService.checkField(reqData, 'selectedMonth');
        let cache_sub_key = [selectedMonth];
        const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, 1, [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);
        this._logger.log("cache_option:", cache_option);

        // 信卡帳單查詢
        return this.spec12010302.getData(reqData, option).then(
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

    /**
     * 未出帳消費查詢 spec12010401
     * @param reqData 請求資料
     * @param paginator  分頁
     * @param option 模式設定
     */
    getUnpaidData(reqData?, option?: object) {
        this._logger.log("into getBillData, reqData:", reqData);
        let cache_main_key = this.setUnpaidCacheName.list;
        let cache_sub_key = [];
        const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, 1, [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);
        this._logger.log("cache_option:", cache_option);

        // 信卡帳單查詢
        return this.spec12010401.getData(reqData, option).then(
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

    // 處理顯示主層的月份(2個字): EX: 12
    formateMonthStr(setData) {
        let output = '';
        // 如果日期有 '-', EX: 2020-07
        if (setData.indexOf('-') >= 0) {
            let temp = setData.split('-');
            let len = temp.length;
            output = temp[len - 1]; // 放最後一個
        } else {
            let len = setData.length;
            output = setData.substring(4, len);
        }
        return output;
    }


    /**
     * 資料排序
     * @param setData 需處理的資料
     * @param formateObj 規格
     * formateObj: { sort: '_sort', reverse: 'DESC' }
     * => sort: 想排序之欄位，EX: remitId 帳戶編號
     * => reverse: 想排序之方式，EX: DESC 遞減  
     */
    formateSortData(setData, formateObj) {
        this._logger.step('ForeignIrDeposit', "setData/formateObj:", setData, formateObj);
        let output = this._formateService.transArraySort(setData, formateObj);
        this._logger.step('ForeignIrDeposit', output);
        return output;
    }

    // 重製列表顯示年月標題資料
    resetHasYearList() {
        this.hasYearList = [];
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}




