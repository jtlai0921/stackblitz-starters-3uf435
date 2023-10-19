/**
 * 帳戶總覽
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
/**
 * [API]
 */
@Injectable()
export class GetAcctOverviewInqService {
    public loading = true;
    constructor(
        public telegram: TelegramService
    ) { }

    /**
     * 取得帳戶總覽 CCMPTX000187Rq
     */
    public getAcctOverviewInqService(Currency: string) {
        //取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000187Rq');
        requset['Currency'] = Currency;
        //打api
        return this.telegram.GetRespone(requset);
    }
}
