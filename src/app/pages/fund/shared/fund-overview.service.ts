/**
 * 投資總覽
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { Subject } from 'rxjs/internal/Subject';
// -- library -- //
import { CacheService } from '@systems/system/cache/cache.service';
// -- api -- //
import { SPEC11010301ApiService } from '@api/spec11/spec11010301/spec11010301-api.service';

@Injectable()

export class FundOverviewService {
    /**
     * 參數處理
     */
    private setCacheName = {
        'list': 'fund-invest-healthy', // 投資組合分析
    };

    expandSubject: Subject<any> = new Subject<any>();

    constructor(
        private _logger: Logger,
        private _cacheService: CacheService,
        private spec11010301: SPEC11010301ApiService
    ) {
    }

    /**
     * 控制展開收合事件 之後再刪除
     * @param checkFinish 
     */
    changeExpandSubject(checkFinish: boolean) {
        this.expandSubject.next(checkFinish);
    }

    /**
     * 刪除cache
     * @param type 指定刪除類別
     *  deposit-demand: 活存
     *  alldetail: 所有明細
     * @param acctObj 指定刪除明細
     *  iron 指定刪除單一明細
     */
    removeAllCache(type?: string, acctObj?: object) {
        if (typeof type == 'undefined') {
            type = this.setCacheName.list;
        }
        this._cacheService.removeGroup(type);
    }

    // 取得投資合計和組合分析
    getInvestHealthy(reqData: object, option?: object) {
        this._logger.log("into getInvestHealthy, reqData:", reqData);
        let cache_key = this.setCacheName.list;
        const cache_data = this._cacheService.checkCacheData(cache_key, option);
        if (cache_data) {
            return Promise.resolve(cache_data);
        }
        return this.spec11010301.getData(reqData, option).then(
            (sucessObj) => {
                this._logger.step('Deposit', "send api success, success:", sucessObj);
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, sucessObj, cache_option);
                return Promise.resolve(sucessObj);
            },
            (failedObj) => {
                this._logger.step('Deposit', "send api failed, failed:", failedObj);
                return Promise.reject(failedObj);
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


    // =====================================================================API End
}




