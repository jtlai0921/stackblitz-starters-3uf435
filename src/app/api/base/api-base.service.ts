/**
 * API連線 基本class
 */
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Logger } from '@systems/system/logger/logger.service';
// -- Options -- //
import { TelegramOption } from './options/telegram-option';
import { ApiRequestOption } from './options/api-request-option';
import { ApiResponseOption } from './options/api-response-option';
import { HandleErrorOptions } from '@systems/handle-error/handlerror-options';
import { ERROR_CODE_LIST } from '@conf/error/error_code';
// -- Service -- //
import { TelegramService } from './telegram.service';
import { AppCtrlService } from '@systems/system/app-ctrl/app-ctrl.service';
// import { AuthService } from '@systems/system/auth/auth.service';
// -- Other Library -- //
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FormateService } from '@template/formate/formate.service';
import { CheckService } from '@template/check/check.service';
import { CacheService } from '@systems/system/cache/cache.service';
import { LoadingService } from '@pages/layout/loading/loading.service';

// import { JsonConvertUtil } from '@shared/util/json-convert-util';
// import { SystemError } from '@conf/error/system-error';
// import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Injectable()
export class ApiBaseService {
    protected serviceId: string; // API Name: optimization 模式的className會被改變
    private errorCodeList: object;

    /**
     * 建構
     */
    constructor(
        protected _logger: Logger,
        protected telegram: TelegramService,
        protected errorHandler: HandleErrorService,
        // protected auth: AuthService,
        protected appCtrl: AppCtrlService,
        protected loading: LoadingService,
        protected _formateService: FormateService,
        protected _checkService: CheckService,
        protected _cacheService: CacheService
    ) {
        // 設定API名稱
        this.setApiName();
    }

    /**
     * 傳送資料
     * @param set_data 
     * @param option 
     */
    protected send(set_data: ApiRequestOption, set_option?: object): Promise<any> {
        this._logger.step('Telegram', 'ApiBase', 'Send Start', set_data, set_option);
        let option = new TelegramOption();
        option = { ...set_option, ...option };

        // loading 
        this.ctrlLoading(true, option.background);
        // 載入cache
        let cache_index = '';
        if (!!option.useCache) {
            let set_req = set_data.getRequest();
            let cache_index_list = [this.serviceId, JSON.stringify(set_data.getData()), JSON.stringify(set_data.getPaginator())];
            cache_index = cache_index_list.join(':');
            const cache_data = this._cacheService.load(cache_index);
            if (!!cache_data) {
                return Promise.resolve(cache_data);
            }
        }
        this.appCtrl.maintainConnectTimer(); // 維持local連線

        return this.telegram.send(this.serviceId, set_data, option)
            .then((returnDataDecryptRes: ApiResponseOption) => {
                this._logger.step('Telegram', 'ApiBase', 'Send End Res', this._formateService.transClone(returnDataDecryptRes));

                this.ctrlLoading(false, option.background);
                if (!!option.useCache) {
                    let res_data = returnDataDecryptRes.getAllData();
                    let cacheOption = this._formateService.checkObjectList(option, 'cacheOption');
                    this._cacheService.save(cache_index, res_data, cacheOption);
                }
                return Promise.resolve(returnDataDecryptRes);
            })
            .catch((errorObj: HandleErrorOptions) => {
                this._logger.step('Telegram', 'ApiBase', 'Send End Error', this._formateService.transClone(errorObj));
                this.ctrlLoading(false, option.background);
                return Promise.reject(errorObj);
            });
    }

    /**
     * 回傳錯誤事件
     * @param set_data 
     */
    protected returnError(set_data: object, errorCode?: string): Promise<HandleErrorOptions> {
        return this.errorHandler.returnError(set_data, errorCode);
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 不能透過className設定API的serviceId名稱！
     * optimization 模式的className會被改變
     */
    private setApiName(): void {
        if (!this.serviceId) {
            this._logger.error('Telegram', 'ApiBase setApiName', 'ignor serviceId!!', this.serviceId);
            this.serviceId = '';
        }
        const output = this.serviceId.toLocaleUpperCase();
        this.serviceId = output;
        this._logger.step('Telegram', 'ApiBase setApiName', output, this.serviceId);
    }

    /**
     * 控制loading頁面
     * @param open true 開啟, false 關閉
     * @param background true:背景發送, false:啟動loading
     */
    private ctrlLoading(open: boolean, background?: boolean) {
        this._logger.step('TelegramBase', 'ctrlLoading', open, this.serviceId);
        if (!!background) {
            // 背景模式不處理
            return false;
        }
        // [TODO:] 關閉異常!!!
        if (open) {
            // this.loading.show(this.serviceId);
        } else {
            // this.loading.hide(this.serviceId);
        }

    }

}
