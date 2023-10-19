import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

/**
 * [API] 通知訂閱on/off及相關資料查詢服務類別
 */
@Injectable()
export class NotifyListModService {

    constructor(
        public telegram : TelegramService
    ) {}

    /**
     * 修改通知訂閱的on/off及相關資料 API CCMPTX000178Rq
     */
    public notifyModInq(productParaInfoList) {
        // 取得指定BodyRq-Data並設定參數
        const request =  this.telegram.GetRequstParam('CCMPTX000178Rq');
        request["ProductParaInfoList"] = productParaInfoList;
        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法更改通知訂閱相關資料
                        reject(res);
                    } else {
                        // 更改通知訂閱相關資料
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
