/**
 * 
 * 廣告輪播牆
 *
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { CacheService } from '@systems/system/cache/cache.service';

@Injectable()

export class AdvertService {
    /**
     * 
     */

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _cacheService: CacheService
    ) {
    }

    // 目前先寫死假資料, 欄位也不一定下方
    getAdvertData(): Promise<any> {
        return this.testApi().then(
            (success) => {
                return Promise.resolve(success);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );

    }

    private testApi(): Promise<any> {
        let output = {
            status: false,
            infoData: {},
            data: [],
            msg: ''
        };
        let jsonObj = this.testSimulate();
        output.infoData = this._formateService.checkField(jsonObj, 'resContent');
        output.data = this._formateService.checkObjectList(output.infoData, 'rowData');
        output.status = true;
        if (!output.status) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return Promise.resolve(output);
    }

    testSimulate() {
        let df_response = {
            'apiId': 'SPEC12010301',
            'token': {
                'requestId': '',
                'responseTime': '',
                'lang': ''
            },
            'resFlag': '0',
            'resMessage': {
                'errorCode': '',
                'errorMsg': ''
            },
            'resContent': {
                'rowData': [
                    { 'node': '11223', 'content': '' },
                    { 'node': '11224', 'content': '' },
                    { 'node': '11225', 'content': '' },
                    { 'node': '11226', 'content': '' },
                    { 'node': '11227', 'content': '' },
                    { 'node': '11228', 'content': '' }
                ]
            }
        };
        return df_response;
    }
}
