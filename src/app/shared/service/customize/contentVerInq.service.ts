import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

/**
 * [API] APP更新包版本檢查服務類別
 */
@Injectable()
export class ContentVerInqService {

    constructor(
        public telegram : TelegramService,
        private popup: PopupService,
        private langTransService: LangTransService
    ) {}

    /**
     * 檢查APP更新包版本 API CCMPTX000207Rq
     */
    public contentVerInq() {
        // 取得指定BodyRq-Data並設定參數
        let value = {};
        const request =  this.telegram.GetRequstParam('CCMPTX000207Rq');
        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法取得更新包版本資訊
                        reject(res);
                    } else {
                        // 取得更新包版本資訊
                        resolve(res);
                    }
                }, 
                (err) => {
                    // [ErrorCode:13] 查無資料
                    if (err['HeaderRs']['Result'] === 13) {
                        resolve(value);                    
                    } else {
                        reject(err);
                    }
                }
            );
        });
    }
}
