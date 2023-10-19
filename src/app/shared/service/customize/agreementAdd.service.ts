import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

/**
 * [API] 同意書紀錄服務類別
 */
@Injectable()
export class AgreementAddService {

    constructor(
        public telegram : TelegramService
    ) {}

    /**
     * 發送同意書同意紀錄 API CCMPTX000210Rq
     * @param Agreement 同意書類型(1:圖形鎖; 2：生物辨識登入條款; 3：個資)
     * @param Content 內容
     */
    public agreemnetAdd(Agreement: number, Content: string) {
        // 取得指定BodyRq-Data並設定參數
        const request = this.telegram.GetRequstParam('CCMPTX000210Rq');
        request['Agreement'] = Agreement;
        request['Content'] = Content;

        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    resolve(res);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
