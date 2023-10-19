import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

/**
 * [API] 匯率查詢服務類別
 */
@Injectable()
export class ForExRateDetailsInqService {

    constructor(
        public telegram : TelegramService,
        private popup: PopupService,
        private langTransService: LangTransService
    ) {}

    /**
     * 查詢匯率資料 API CCMPTX000202Rq
     * @param Country 國別
     */
    public forExRateDetailsInq(Country:string) {
        // 取得指定BodyRq-Data並設定參數
        let value = {};
        const request =  this.telegram.GetRequstParam('CCMPTX000202Rq');
        request['Country'] = Country;
        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法取得匯率資料
                        reject(res);
                    } else {
                        // 取得匯率資料
                        resolve(res['ForExRateDetailsList']);
                    }
                }, 
                (err) => {
                    // [ErrorCode:13] 查無資料
                    if (err['HeaderRs']['Result'] === 13) {
                        // 回傳空物件
                        // this.popup.setConfirm({
                        //     content: this.langTransService.instant('DEPOSITDETAIL.POP_ERROR_13'), // 查無資料
                        // });
                        resolve(value);                    
                    } else {
                        // this.popup.setConfirm({
                        //     content: this.langTransService.instant('DEPOSITDETAIL.POP_ERROR_OTHER') + '(' + err['HeaderRs']['Result'] + ')', // 無法取得資料，請聯絡客服！
                        // });
                        reject(err);
                    }                   
                }
            );
        });
    }

    /**
     * 取得幣別匯率轉換表
     * @param country 國別
     */
    public getExRateTable(country:string) {
        return new Promise((resolve, reject) => {
            this.forExRateDetailsInq(country).then(
                (res) => {
                    console.log('[API] forExRateDetailsInq success', res);
                    resolve(this.convertExRateData(res));
                }, 
                (err) => {
                    console.log('[API] forExRateDetailsInq error', err);
                    reject(err);
                }
            );
        });
    }

    /**
     * 產生約當幣別匯率表
     * @param dataArray 幣別匯率數據
     */
    private convertExRateData(dataArray) {
        let exRateTable = {};
        let sourceCurr;
        let targetCurr;
        let exRateEntity;
        dataArray.forEach(data => {
            // 僅取用即期匯率數據
            if (data['RateType'] == "S") {
                sourceCurr = data['CurCodeFrom'];
                targetCurr = data['CurCodeTo'];

                exRateEntity = exRateTable[targetCurr] ? exRateTable[targetCurr] : {};
                exRateEntity[sourceCurr] = parseFloat(data['BuyRate']);
                exRateTable[targetCurr] = exRateEntity;

                exRateEntity = exRateTable[sourceCurr] ? exRateTable[sourceCurr] : {};
                exRateEntity[targetCurr] = 1/parseFloat(data['SellRate']);
                exRateTable[sourceCurr] = exRateEntity;
            }
        });

        // 取得本地幣別匯率資料
        let keys = Object.keys(exRateTable);
        let length = 0;
        let max = 0;
        let localCurr;
        keys.forEach(key => { 
            length = Object.keys(exRateTable[key]).length;
            if (max < length) {
                max = length;
                localCurr = key;
            }
            exRateTable[key][key] = 1;
        });
        console.log('[API] forExRateDetailsInq convertExRateData localCurr =', localCurr);

        // Cartesian product
        let localExRateEntity = exRateTable[localCurr];
        let localKeys = Object.keys(localExRateEntity);
        keys.forEach(key => {
            localKeys.forEach(localKey => {
                if (exRateTable[key][localKey])
                    return;
                exRateTable[key][localKey] = exRateTable[key][localCurr] * localExRateEntity[localKey];
            });
        })

        // 幣別匯率轉換總表
        return exRateTable;
    }
}
