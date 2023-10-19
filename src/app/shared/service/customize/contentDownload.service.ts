import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

/**
 * [API] APP更新包檔案下載服務類別
 */
@Injectable()
export class ContentDownloadService {

    constructor(
        public telegram : TelegramService,
        private popup: PopupService,
        private langTransService: LangTransService
    ) {}

    /**
     * 下載APP更新包檔案 API CCMPTX000208Rq
     * @param FileName 檔案名稱
     */
    public contentDownload(FileName:string) {
        // 取得指定BodyRq-Data並設定參數
        let value = {};
        const request =  this.telegram.GetRequstParam('CCMPTX000208Rq');
        request['FileName'] = FileName;

        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法下載更新包數據
                        reject(res);
                    } else {
                        // 下載更新包數據
                        resolve(res['Content']);
                    }
                }, 
                (err) => {
                    // [ErrorCode:13] 查無資料
                    if (err['HeaderRs']['Result'] === 13) {
                        resolve(value);                    
                    } else {
                        reject(err);
                    }
                    reject(err);
                }
            );
        });
    }
}
