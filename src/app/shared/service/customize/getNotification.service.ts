import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

/**
 * [API] 通知訊息查詢服務類別
 */
@Injectable()
export class GetNotificationService {

    constructor(
        public telegram : TelegramService
    ) {}

    /**
     * 取得通知訊息 API CCMPTX000004Rq
     * @param NotifySeq 本地端最新一筆通知訊息的通知訊息流水號，無資料輸入空白
     */
    public getNotification(NotifySeq:number) {
        // 取得指定BodyRq-Data並設定參數
        const request =  this.telegram.GetRequstParam('CCMPTX000004Rq');
        request['NotifySeq'] = NotifySeq;

        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    // 取得通知訊息
                    resolve(res);
                }, 
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
