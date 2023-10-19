import { Injectable } from '@angular/core';
import { Config } from '../../../../assets/configuration/config';

declare var window;
/**
 * WBC加解密服務
 */
@Injectable()
export class PINBlockService {
    
    /**
     * 參數設定
     */
    constructor(
    ) {}

    /**
     * WBC加密演算
     * @param text 需要編碼的字串
     */
    public pin_block(text:string) {
        return new Promise((resolve, reject) => {
            // 成功對應處理函式
            const successCallback = (res)=>{resolve(res);};
            // 錯誤對應處理函式
            const errorCallBack = (err)=>{reject(err);};
            if(!Config.NATIVE_OPEN){
                resolve("12345678")
                return;
            }
            window.cordova.plugins.pinBlock.encrypt(text,successCallback, errorCallBack);
        });
    }
}
