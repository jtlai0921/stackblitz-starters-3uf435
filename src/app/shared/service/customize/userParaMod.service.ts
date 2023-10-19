import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { KEY_USER_PARA } from "../../../../assets/configuration/userParaKey";
import { LocalStorageService } from '../global/localStorage.service';

/**
 * [API] 用戶參數異動服務類別
 * 
 * [Id 參數識別代碼表]
 * S001_idUser  語系設定
 * S002_idUser  幣別設定
 * S003_idUser  通知設定
 */
@Injectable()
export class UserParaModService {
  
    constructor(
        public telegram : TelegramService, 
        public storage : LocalStorageService
    ) {}

    /**
     * 修改/刪除用戶參數 API CCMPTX000179Rq
     * @param ParaMods 用戶參數內容 
     * 參數內容格式：{"Id":"[參數識別碼]", "Action":"[M=修改]/[D=刪除]", "Value":"[參數內容]"}
     */
    public userParaMod(ParaMods:object[]) {
        // 取得並設定參數
        const request =  this.telegram.GetRequstParam('CCMPTX000179Rq');
        request['ParaModList'] = ParaMods;
        // 打api
        return this.telegram.GetRespone(request);
    }

    /**
     * 更新遠端使用者相關設定
     * @param id 參數識別碼
     * @param value 參數內容值
     */
    public updateUserPara(id:string, value) {
        
        let ParaMod = {};
        ParaMod['Id'] = id;
        ParaMod['Action'] = "M";
        ParaMod['Value'] = typeof value == 'string' ? value : JSON.stringify(value);
        console.log('[ParaMod]', ParaMod);
        return this.userParaMod([ParaMod]);
    }

    /**
     * 更新複數筆遠端使用者相關設定
     * @param paraPairs 參數鍵值對陣列
     */
    public updateUserParas(paraPairs:object[]) {
        let ParaMods = [];
        let ParaMod;
        paraPairs.forEach(paraPair => {
            ParaMod = {};
            ParaMod['Id'] = paraPair['id'];
            ParaMod['Action'] = "M";
            ParaMod['Value'] = paraPair['value'];
            ParaMods.push(ParaMod);
        });
        return this.userParaMod(ParaMods);
    }

    /**
     * 刪除遠端使用者相關設定
     * @param id 參數識別碼
     */
    public deleteUserPara(id:string) {
        let ParaMod = {};
        ParaMod['Id'] = id;
        ParaMod['Action'] = "D";
        console.log('[ParaMod]', ParaMod);
        return this.userParaMod([ParaMod]);
    }

    /**
     * 刪除複數筆遠端使用者相關設定
     * @param ids 參數識別碼陣列
     */
    public deleteUserParas(ids:string[]) {
        let ParaMods = [];
        let ParaMod;
        ids.forEach(id => {
            ParaMod = {};
            ParaMod['Id'] = id;
            ParaMod['Action'] = "D";
            ParaMods.push(ParaMod);
        });
        return this.userParaMod(ParaMods);
    }
}
