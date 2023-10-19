/**
 * 存款明細(活支存)
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';


@Injectable({
    providedIn: 'root'
  })
export class CASAActivityInqService {

    constructor(
        public telegram: TelegramService,
        private popup: PopupService,
        private langTransService: LangTransService
    ) { }

    /**
     * [API] 取得活支存明細之上行電文 CCMPTX000180Rq
     * @param requestObj 
     * requestObj = {
     *  'Currency': '', 要檢視的幣別
     *  'Country': '', 帳戶國別
     *  'CustomerId': '', 帳戶統編
     *  'AcctNo': '', 帳戶號碼
     *  'AcctCur': '', 帳戶幣別
     *  'TrnType': '', 資料種類(1:交易明細 2:代收明細 3:對帳單明細)
     *  'DateFrom': '', 查詢區間起始日
     *  'DateTo': '' 查詢區間迄日
     * }
     */
    public getCASAActivity(requestObj: Object) {
        // 取得並設定參數
        let value = {};
        const request = this.telegram.GetRequstParam('CCMPTX000180Rq');
        // request['Currency'] = requestObj['Currency'];
        request['Country'] = requestObj['Country'];
        request['CustomerId'] = requestObj['CustomerId'];
        request['AcctNo'] = requestObj['AcctNo'];
        request['AcctCur'] = requestObj['AcctCur'];
        request['TrnType'] = requestObj['TrnType'];
        request['DateFrom'] = requestObj['DateFrom'];
        request['DateTo'] = requestObj['DateTo'];
        
        // Call API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] !== 4001) {
                        reject(res);
                    } else {
                        // 取得成功
                        resolve(res);
                    }
                }, 
                (err) => {
                        reject(err);
                }
            );              
        });
    }
}