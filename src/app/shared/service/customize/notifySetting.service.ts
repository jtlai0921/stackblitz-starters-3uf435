import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';

/**
 * [API] 裝置之所有綁定使用者查詢服務類別
 */
@Injectable()
export class NotifySettingService {
  
    constructor(
        public telegram : TelegramService,
        public router :Router,
        public routeAct :ActivatedRoute,
        public storage : LocalStorageService
    ) {}
                
   
    AuthNotifyKey = "{0}_auth_notify";
    // TBA  待授權
    // Auth 授權完成
    // DBA 預約到期 未授權前一天
    getAuth_notify(){
        return {"TBA":"0","Auth":"0","DBA":"0"}
    }
    // SP  止付
    // DBP 預約付款前一天
    // TR 交易結果
    AccNotifyKey = "{0}_acc_notify";
    getAcc_notify(){
        return {"SP":"","DBP":"","TR":""}
    }

    // CE  憑證到期
    UseNotifyKey = "{0}_use_notify";
    getUse_notify(){
        return {"CE":""}
    }
}
