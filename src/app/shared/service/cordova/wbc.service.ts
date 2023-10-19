import { Injectable } from '@angular/core';
import { CTBC_PlugIn } from './_interface';
import { DeviceService } from './device.service';
import { Config } from '../../../../assets/configuration/config';

/**
 * WBC加解密服務
 */
@Injectable()
export class WbcService {
    
    /**
     * 參數設定
     */
    constructor(
        public device : DeviceService
    ) {}

    /**
     * WBC加密演算
     * @param plainText 明文字串(十六進位制編碼)
     * @param keyIndex 演算金鑰序號
     */
    public encrypt(plainText, keyIndex) {
        return new Promise((resolve, reject) => {
            // 成功對應處理函式
            const successCallback = (res)=>{resolve(res);};
            // 錯誤對應處理函式
            const errorCallBack = (err)=>{reject(err);};
            /**
             * 2018/07/23 ArnoChang
             * 輸入參數說明：JSON格式字串
             * (1) keyIndex[int]: 演算金鑰序號，為取得現行sessionKey時，由[API]getSessionKey所回傳之KeyIndex參數
             * (2) deviceId[string]: 裝置識別代號
             * (3) plainText[string]: 明文字串，須為十六進位制編碼字串
             * 回傳輸出說明：string
             * (1) success: 加密後之密文字串，為十六進位制編碼字串
             * (2) error: exception message
             */
            let Param : object = [{"keyIndex" : keyIndex, "deviceId" : this.device.getDeviceInfo('uuid'), "plainText" : plainText}];
            console.log("[WBC encrypt] Param", Param);
            if(!Config.NATIVE_OPEN){
                resolve("12345678")
                return;
            }
            CTBC_PlugIn.Wbc.aesEncrypt(successCallback, errorCallBack, Param);
        });
    }

    /**
     * WBC解密演算
     * @param cipherText 密文字串(十六進位制編碼)
     * @param keyIndex 演算金鑰序號
     */
    public decrypt(cipherText:string, keyIndex:number) {
        return new Promise((resolve, reject) => {
            // 成功對應處理函式
            const successCallback = (res)=>{resolve(res);};
            // 錯誤對應處理函式
            const errorCallBack = (err)=>{reject(err);};
            /**
             * 2018/07/17 ArnoChang
             * 輸入參數說明：JSON格式字串
             * (1) keyIndex[int]: 演算金鑰序號，須與加密時使用之序號相同，序號來源為[API]getSessionKey
             * (2) deviceId[string]: 裝置識別代號
             * (3) cipherText[string]: 密文字串，須為十六進位制編碼字串
             * 回傳輸出說明：string
             * (1) success: 解密後之明文字串，為十六進位制編碼字串(目前含填充字元)
             * (2) error: exception message
             */
            let Param : object = [{"keyIndex" : keyIndex, "deviceId" : this.device.getDeviceInfo('uuid'), "cipherText" : cipherText}];
            console.log("[WBC decrypt] Param", Param);
            if(!Config.NATIVE_OPEN){
                resolve("12345678")
                return;
            }
            CTBC_PlugIn.Wbc.aesDecrypt(successCallback, errorCallBack, Param);
        });
    }
}
