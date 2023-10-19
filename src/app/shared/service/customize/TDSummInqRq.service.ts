/**
 * 存款明細(定存)
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable({
    providedIn: 'root'
  })
export class TDSummInqRqService {

    constructor(
        public telegram: TelegramService
    ) { }

    /**
     * [API] 取得定存概要之上行電文 CCMPTX000183Rq
     * @param requestObj 
     * requestObj = {
     *  'Country': '', 帳戶國別
     *  'CustomerId': '', 帳戶統編
     * }
     */
    public getTDSummary(requestObj: Object) {
        // 取得並設定參數
        let value = {};
        const request = this.telegram.GetRequstParam('CCMPTX000183Rq');       
        request['Currency'] = requestObj['Currency'];

        // Call API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] !== 4001) {
                        // 取得失敗
                        reject(res);
                    } else {
                        // 取得成功
                        resolve(res);
                    }
                }, 
                (err) => {
                    // [ErrorCode:13] 查無資料
                    if (err['HeaderRs']['Result'] === 13) {
                        // 回傳空物件
                        resolve(value);
                    } else {
                        reject(err);
                    }                   
                }
            );              
        });
    }
}
