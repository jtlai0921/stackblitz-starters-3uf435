import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

/**
 * [API] 通知訂閱on/off及相關資料查詢服務類別
 */
@Injectable()
export class NotifyListInqService {

    constructor(
        public telegram : TelegramService
    ) {}

    /**
     * 取得通知訂閱on/off及相關資料 API CCMPTX000174Rq
     */
    public notifyListInq() {
        // 取得指定BodyRq-Data並設定參數
        const request =  this.telegram.GetRequstParam('CCMPTX000174Rq');

        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法取得通知訂閱相關資料
                        reject(res);
                    } else {
                        // 取得通知訂閱相關資料
                        resolve(res['NotifyInfoList']);
                    }
                }, 
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
