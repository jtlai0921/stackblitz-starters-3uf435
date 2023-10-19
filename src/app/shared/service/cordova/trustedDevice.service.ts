import { Injectable } from '@angular/core';
import { Config } from '../../../../assets/configuration/config';

declare var window;
/**
 * WBC加解密服務
 */
@Injectable()
export class TrustedDeviceService {
    
    /**
     * 參數設定
     */
    constructor(
    ) {}

    /**
     * root檢查
     */
    public isTrusted() {
        return new Promise((resolve, reject) => {
            // 成功對應處理函式
            const successCallback = (res)=>{resolve(res);};
            // 錯誤對應處理函式
            const errorCallBack = (err)=>{reject(err);};
            if(!Config.NATIVE_OPEN){
                resolve(true)
                return;
            }
            window.trustedDevice.isTrusted(successCallback, errorCallBack);
        });
    }
}
