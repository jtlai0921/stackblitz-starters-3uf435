/**
 * 變更使用者代號
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable({
    providedIn: 'root'
  })
export class UserIDModService {

    constructor(
        public telegram: TelegramService
    ) { }

    /**
     * [API] 變更使用者代號上行電文 CCMPTX000204Rq
     * @param newuserid => 新使用者帳號
     */
    public getUserIDMod(newuserid: Object) {
        // 取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000204Rq');       
        requset['NewUserId'] = newuserid;

        // Call API
        return this.telegram.GetRespone(requset);
    }
}
