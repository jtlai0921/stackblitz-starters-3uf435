/**
 * 基金單筆申購
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
import { SPEC00040101ApiService } from '@api/spec00/spec00040101/spec00040101-api.service';
import { SPEC00040801ApiService } from '@api/spec00/spec00040801/spec00040801-api.service';

@Injectable()

export class SelectAccountService {
    /**
     * 
     */

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _cacheService: CacheService,
        private spec00040101: SPEC00040101ApiService,
        private spec00040801: SPEC00040801ApiService
    ) {
    }

    /**
     * 取得帳號資訊
     * @param reqData 
     */
    getAcctData(reqData?: object, type?: string, option?: object): Promise<any> {
        this._logger.log("into getAcctData, reqData:", reqData);
        // let token = this.getToken();
        // 紀錄cache
        let cache_main_key = 'select-account';
        let cache_sub_key = [type];
        // tslint:disable-next-line:radix
        const cache_check = this._cacheService.checkPaginatorCach(cache_main_key, 1,
         [], option, null, { sub_key: cache_sub_key });
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        let cache_option = this._cacheService.getCacheSet(cache_key);
        cache_option.groupList.push(cache_main_key);
        // 發貸款特規 貸款帳戶
        if (type == 'loan') {
            this._logger.log("cache_option:", cache_option);
            this._logger.log("ready to send loan account api");
            // 2020/08/10 依照中台改為統一發同一支api
            return this.spec00040801.getData({}).then(
                (sucessObj) => {
                    this._logger.log("send 00040801 api success, success:", sucessObj);
                    this._cacheService.save(cache_key, sucessObj, cache_option);
                    return Promise.resolve(sucessObj);
                },
                (failedObj) => {
                    this._logger.log("send 00040801 api failed, failed:", failedObj);
                    return Promise.reject(failedObj);
                }
            );
            // 其餘情況都發 帳號查詢 
        } else {
            this._logger.log("ready to send nornal account api");
            return this.spec00040101.getData({}).then(
                (sucessObj) => {
                    this._logger.log("send 00040101 api success, success:", sucessObj);
                    this._cacheService.save(cache_key, sucessObj, cache_option);
                    return Promise.resolve(sucessObj);
                },
                (failedObj) => {
                    this._logger.log("send 00040101 api failed, failed:", failedObj);
                    return Promise.reject(failedObj);
                }
            );
        }
    }

    // 設定預設帳號資訊
    setDefaultInfo(setData, defaultAcct) {
        this._logger.log("into setDefaultInfo, setData:", setData);
        this._logger.log("into setDefaultInfo, defaultAcct:", defaultAcct);
        let output = {
            accountId: '',
            currencyCode: ''
        };
        setData.forEach(item => {
            if (item['accountId'] == defaultAcct) {
                output.accountId = item['accountId'];
                output.currencyCode = item['currencyCode'];
            }
        });
        // 防呆 起碼回傳進來的帳號
        if (output.accountId == '' || typeof output.accountId == 'undefined' || output.accountId == null) {
            output.accountId = defaultAcct;
        }
        this._logger.log("into setDefaultInfo, output:", output);
        return output;
    }
}
