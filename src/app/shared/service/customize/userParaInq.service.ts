import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { KEY_USER_PARA } from '../../../../assets/configuration/userParaKey';
import { LocalStorageService } from '../global/localStorage.service';

/**
 * [API] 用戶參數查詢服務類別
 * 
 * [Id 參數識別代碼表]
 * S001_idUser  語系設定
 * S002_idUser  幣別設定
 */
@Injectable()
export class UserParaInqService {

    constructor(
        public telegram : TelegramService,
        public storage : LocalStorageService
    ) {}

    /**
     * 查詢用戶參數 API CCMPTX000186Rq
     * @param Id 參數識別碼
     */
    public userParaInq(Id:string) {
        // 取得並設定參數
        const request =  this.telegram.GetRequstParam('CCMPTX000186Rq');
        request['Id'] = Id;
        // 打api
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法取得遠端使用者設定參數
                        reject(res);
                    } else {
                        // 取得遠端使用者相關設定參數陣列
                        resolve(res['UserParaList']);                      
                    }
                }, 
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
