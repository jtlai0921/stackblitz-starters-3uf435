/**
 * 各期帳單查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { CheckService } from '@template/check/check.service';
import { CacheService } from '@systems/system/cache/cache.service';
import { HistoryBillService } from './history-bill-main.service';

@Injectable()

export class CardOverviewService {
    /**
     * 參數處理
     */
    // 選擇信卡期間
    // private setCacheName = {
    //     'list': 'select-card-month'
    // };
    // // 各期帳單查詢
    // private setCacheCardName = {
    //     'list': 'history-bill'
    // };
    // // 未出帳消費查詢
    // private setUnpaidCacheName = {
    //     'list': 'unpaid-bill'
    // };

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private _historyBillService: HistoryBillService
    ) {
    }

    getUnpaidData(reqData?, paginator?, option?: object): Promise<any> {
        return this._historyBillService.getUnpaidData(reqData).then(
            (success) => {
                this._logger.log("getUnpaidData, success", success);
                return Promise.resolve(success);
            },
            (errorObj) => {
                this._logger.log("getUnpaidData, errorObj", errorObj);
                return Promise.reject(errorObj);
            }
        );
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}