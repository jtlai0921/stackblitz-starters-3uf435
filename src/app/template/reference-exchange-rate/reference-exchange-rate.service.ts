/**
 * 參考匯率(交叉匯率)Service
 */
import { Injectable } from '@angular/core';
import { CacheService } from '@systems/system/cache/cache.service';
import { FormateService } from '@template/formate/formate.service';
import { CURRENCY_WEIGHT } from '@template/reference-exchange-rate/currency-weight'
import { NumberUtil } from '@util/formate/number/number-util';
import { Logger } from '@systems/system/logger/logger.service';

@Injectable()

export class ReferenceExchangeRateService {
    /**
     * 參數處理
     */
    private sellCurrency = ''; // 兌出幣
    private buyCurrency = ''; // 兌入幣
    private sellCurrencyWeight = ''; // 兌出幣權重
    private buyCurrencyWeight = ''; // 兌入幣權重
    private sellCurrencyBuyRate = ''; // 兌出幣買匯
    private buyCurrencySellRate = ''; // 兌入幣賣匯
    private referenceCurrencyRate = 0; // 參考匯率
    private convertRate = 0; // 轉換比值

    output = {
        msg: '',
        referenceCurrencyRate: '',
        // convertRate: '',
        weightType: '' // 1:權重大轉小 2:權重小轉大
    };

    constructor(
        private _cacheService: CacheService,
        private _formateService: FormateService,
        private logger: Logger
    ) {

    }

    /**
    * 取得參考匯率
    * @param sellCurrencyObj 兌出幣Obj
    * @param buyCurrencyObj 兌入幣Obj
    */
    public getReferenceRate(sellCurrencyObj, buyCurrencyObj): Promise<any> {
        this.sellCurrency = this._formateService.checkField(sellCurrencyObj, 'currencyCode');
        this.buyCurrency = this._formateService.checkField(buyCurrencyObj, 'currencyCode');
        this.sellCurrencyBuyRate = this._formateService.checkField(sellCurrencyObj, 'buyRate');
        this.buyCurrencySellRate = this._formateService.checkField(buyCurrencyObj, 'sellRate');

        if (!!this.sellCurrency && !!this.buyCurrency && !!this.sellCurrencyBuyRate && !!this.buyCurrencySellRate) {
            this.sellCurrencyWeight = CURRENCY_WEIGHT[this.sellCurrency].weight;
            this.buyCurrencyWeight = CURRENCY_WEIGHT[this.buyCurrency].weight;
            const sellCurrencyWeight = NumberUtil.toNumber(this.sellCurrencyWeight, 'int');
            const buyCurrencyWeight = NumberUtil.toNumber(this.buyCurrencyWeight, 'int');
            const sellCurrencyBuyRate = NumberUtil.toNumber(this.sellCurrencyBuyRate, 'float');
            const buyCurrencySellRate = NumberUtil.toNumber(this.buyCurrencySellRate, 'float');
            if (sellCurrencyWeight > buyCurrencyWeight) { // 權重小轉權重大
                this.referenceCurrencyRate = buyCurrencySellRate / sellCurrencyBuyRate;
                this.referenceCurrencyRate = Math.round(this.referenceCurrencyRate * 10000) / 10000;
                // this.convertRate = 1 / this.referenceCurrencyRate;
                // this.convertRate = Math.round(this.convertRate * 10000) / 10000;
                this.output.weightType = '2';
            } else { // 權重大轉權重小
                this.referenceCurrencyRate = sellCurrencyBuyRate / buyCurrencySellRate;
                this.referenceCurrencyRate = Math.round(this.referenceCurrencyRate * 10000) / 10000;
                // this.convertRate = this.referenceCurrencyRate;
                this.output.weightType = '1';
            }
            this.output.referenceCurrencyRate = this.referenceCurrencyRate.toString();
            // this.output.convertRate = this.convertRate.toString();
            return Promise.resolve(this.output);
        } else {
            return Promise.reject(this.output);
        }

    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}