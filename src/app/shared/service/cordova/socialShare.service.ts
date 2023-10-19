import { Injectable } from '@angular/core';
import { Config } from '../../../../assets/configuration/config';
import { CTBC_PlugIn } from './_interface';

/**
 * APP社群功能分享服務
 */
@Injectable()
export class SocialShareService {

    constructor(
    ) {      
    }

    /**
     * 分享訊息
     */
    public shareMessage(message, subject) {
        return new Promise((resolve, reject) => {
            // 成功對應處理函式
            const successCallback = (res) => {resolve(res);};
            // 錯誤對應處理函式
            const errorCallBack = (err)=>{reject(err);};

            // 分享內容參數
            let options = {
                "message": message,
                "subject": subject
            };
            console.log('[share] options', options);
            if (Config.NATIVE_OPEN) {
                CTBC_PlugIn.SocialShare.shareWithOptions(options, successCallback, errorCallBack);
            } else {
                // 模擬分享成功
                resolve("Simulate-Mode");
                // 模擬分享成功
                // reject("Simulate-Mode");
            }
        });
    }
}