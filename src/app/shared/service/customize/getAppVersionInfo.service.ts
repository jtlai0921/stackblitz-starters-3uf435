/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import {TelegramService} from '../../telegram/telegram.service';
@Injectable()
export class GetAppVersionInfoService {

    constructor(
        public telegram : TelegramService
    ) {}
    /**
     * 取得App目前版本與最早允許版本 CCMPTX000002Rq
     */
    public getVersion() {
        //取得並設定參數
        const requset =  this.telegram.GetRequstParam('CCMPTX000002Rq');
        //打api
        return this.telegram.GetRespone(requset);
    }
}
