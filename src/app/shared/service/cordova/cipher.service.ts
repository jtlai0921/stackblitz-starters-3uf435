import { Injectable } from '@angular/core';
import { CTBC_PlugIn } from './_interface';

/**
 * 資料數據加解密演算服務
 */
@Injectable()
export class CiperService {
    /**
     * 參數設定
     */
    constructor() {}

    /**
     * 3DES 解密
     */
    public decrtpyBy3DES(Param:String,SessionKey:string) {
       
        return new Promise((resolve, reject) => {

            // success callback
            const successCallback = function(successObj){
            console.log('[decrtpyBy3DES] success!',successObj);
            //successObj = successObj.replace('\u003d\n','=');
            //console.log('decrtpyBy3DES replace',successObj);
            var resObj = successObj;// JSON.parse(successObj);
            if(resObj['type'] == '0000'){
                resolve(resObj['message']);
            }else{
                reject(resObj);
            }
          };
            // error callback
            const errorCallback = function(errorObj){
              console.log('[decrtpyBy3DES] fail!', errorObj,typeof errorObj);
              reject(errorObj);
          }
          CTBC_PlugIn.Cipher.decryptBy3DES(successCallback,errorCallback,Param,SessionKey);
      });
    }
    /**
     * 3DES 解密
     */
    public encryptBy3DES(Param:String,SessionKey:string) {
       
        return new Promise((resolve, reject) => {
            // success callback
            const successCallback = function(successObj){
                console.log('[encrtpyBy3DES] success!',successObj);
                var resObj = successObj;
                if(resObj['type'] == '0000'){
                    resolve(resObj['message']);
                }else{
                    reject(resObj);
                }
          };
            // error callback
            const errorCallback = function(errorObj){
              console.log('[encryptBy3DES] fail!', errorObj);
              reject(errorObj);
          }
          CTBC_PlugIn.Cipher.encryptBy3DES(successCallback,errorCallback,Param,SessionKey);
         });
    }

    /**
     * AES256-GCM 解密
     * @param cipherText 密文字串
     * @param sessionKey 演算金鑰
     * @param aad 附加驗證訊息字串
     */
    public decryptByAESGCM(cipherText:string, sessionKey:string, aad:string) {
        return new Promise((resolve, reject) => {
            // success callback
            const successCallback = function(successObj) {
                console.log('[decryptByAESGCM] success!', successObj);
                var resObj = successObj;
                if (resObj['type'] == '0000') {
                    resolve(resObj['message']);
                } else {
                    reject(resObj);
                }
            };
            // error callback
            const errorCallback = function(errorObj) {
                console.log('[decryptByAESGCM] failed!', errorObj);
                reject(errorObj);
            }
            CTBC_PlugIn.Cipher.decryptByAESGCM(successCallback, errorCallback, cipherText, sessionKey, aad);
        });
    }

    /**
     * AES256-GCM 加密
     * @param plainText 明文字串
     * @param sessionKey 演算金鑰
     * @param aad 附加驗證訊息字串
     */
    public encryptByAESGCM(plainText:string, sessionKey:string, aad:string) {
        return new Promise((resolve, reject) => {
            // success callback
            const successCallback = function(successObj) {
                console.log('[encryptByAESGCM] success!', successObj);
                var resObj = successObj;
                if (resObj['type'] == '0000') {
                    resolve(resObj['message']);
                } else {
                    reject(resObj);
                }
            };
            // error callback
            const errorCallback = function(errorObj) {
                console.log('[encryptByAESGCM] failed!', errorObj);
                reject(errorObj);
            }
            CTBC_PlugIn.Cipher.encryptByAESGCM(successCallback, errorCallback, plainText, sessionKey, aad);
        });
    }
}
