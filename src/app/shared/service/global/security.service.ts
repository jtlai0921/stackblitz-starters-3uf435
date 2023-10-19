import { Injectable } from '@angular/core';
import { Base64Service } from './base64.service';
import { CiperService } from '../cordova/cipher.service';
import { DeviceService } from '../cordova/device.service';
import { Config } from '../../../../assets/configuration/config'
//using aes.js
declare var aesjs;
/**
 *　加解密處理
 */
@Injectable()
export class SecurytyService {
  
    constructor(
      public base64 : Base64Service,
      public ciper : CiperService,
      //public getSessionkey : GetSessionKeyService
      public device : DeviceService
    ) { }
    /**
     * Base64 Encode
     * @param param Decode String
     */
    public Base64Encode(param: string) {
      let DecodeObj = this.base64.encode(param);
      if(DecodeObj.status){
          return DecodeObj.value;
      }else{
        console.error('Base64Encode Error',DecodeObj);
        return '';
      }
    }

    /**
     * Base64 Decpde
     * @param param Encode String
     */
    public Base64Decode(param: string) {
      let EncodeObj = this.base64.decode(param);
      if(EncodeObj.status){
          return EncodeObj.value;
      }else{
        console.error('Base64Decode Error',EncodeObj);
        return '';
      }
    }

    /**
     * 資料數據加密
     * @param param 明文字串
     * @param sessionkey 演算金鑰
     */
    public ciperEncode(param: string,sessionkey:string) {
      console.log('[ciperEncode]：',param);
      return new Promise((resolve,reject)=>{
        // 3DES
        // this.ciper.encryptBy3DES(param,sessionkey).then(
        //   (res)=>{resolve(res);},
        //   (error)=>{reject(error)}
        // );

        // AES256-GCM
        this.ciper.encryptByAESGCM(param, sessionkey, this.device.getDeviceInfo('uuid')).then(
          (res) => {resolve(res);},
          (err) => {reject(err)}
        );
      });
    }
    
    /**
     * 資料數據解密
     * @param param 密文字串
     * @param sessionkey 演算金鑰
     */
    public ciperDecode(param: string,sessionkey:string) {
      console.log('[ciperDecode]：',param);
      return new Promise((resolve,reject)=>{
        // 3DES
        // this.ciper.decrtpyBy3DES(param,sessionkey).then(
        //   (res)=>{
        //     resolve(res);
        //   },
        //   (error)=>{reject(error)}
        // );

        // AES256-GCM
        this.ciper.decryptByAESGCM(param, sessionkey, this.device.getDeviceInfo('uuid')).then(
          (res) => {resolve(res);},
          (err) => {reject(err)}
        );
      });
    }

    //https://github.com/ricmoo/aes-js

    // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    private AES_key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    // private AES_key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    //  /**
    //  * 設定key 測試模式用預設值，正式模式用deviceId 轉
    //  */   
    public generateKey(){
      if(Config.NATIVE_OPEN){
        var id = this.device.getDeviceInfo('uuid');
        if(id.length > 16){
          id = id.substring(0,16);
        }else if(id.length < 16){
            var _diff = 16 - id.length;
            for(var i = 0 ; i<_diff;i++){
              id += '0';
            }
        }

        this.AES_key = this.toUTF8Array(id);
        
      }else{
        return this.AES_key;
      }
     
    }
     /**
     * AES加密
     * @param text 原文
     */
    public aesEncode(text: string) {
      var textBytes = aesjs.utils.utf8.toBytes(text);
      var aesCtr = new aesjs.ModeOfOperation.ctr(this.AES_key, new aesjs.Counter(5));
      var encryptedBytes = aesCtr.encrypt(textBytes);
      var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      return encryptedHex;
    }
    /**
     * AES解密
     * @param text 加密字串
     */
    public aesDecode(hexstr: string) {
      var HexStrBytes = aesjs.utils.hex.toBytes(hexstr);
      var aesCtr = new aesjs.ModeOfOperation.ctr(this.AES_key, new aesjs.Counter(5));
      var decryptedBytes = aesCtr.decrypt(HexStrBytes);
      var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
      return decryptedText;
    }

    /**
     * AES金鑰加密
     * @param text 原文
     * @param keyStr 金鑰位元組陣列
     */
    public aesEncodeByKey(text: string, key) {
      var textBytes = aesjs.utils.utf8.toBytes(text);
      var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      var encryptedBytes = aesCtr.encrypt(textBytes);
      var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      return encryptedHex;
    }

    /**
     * AES金鑰解密
     * @param hexstr 密文
     * @param keyStr 金鑰位元組陣列
     */
    public aesDecodeByKey(hexstr: string, key) {
      var HexStrBytes = aesjs.utils.hex.toBytes(hexstr);
      var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      var decryptedBytes = aesCtr.decrypt(HexStrBytes);
      var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
      return decryptedText;
    }

     /**
     * string To  128-bit key
     * @param text 加密字串
     */
    public toUTF8Array(str: string) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
          var charcode = str.charCodeAt(i);
          if (charcode < 0x80) utf8.push(charcode);
          else if (charcode < 0x800) {
              utf8.push(0xc0 | (charcode >> 6), 
                        0x80 | (charcode & 0x3f));
          }
          else if (charcode < 0xd800 || charcode >= 0xe000) {
              utf8.push(0xe0 | (charcode >> 12), 
                        0x80 | ((charcode>>6) & 0x3f), 
                        0x80 | (charcode & 0x3f));
          }
          // surrogate pair
          else {
              i++;
              // UTF-16 encodes 0x10000-0x10FFFF by
              // subtracting 0x10000 and splitting the
              // 20 bits of 0x0-0xFFFFF into two halves
              charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                        | (str.charCodeAt(i) & 0x3ff));
              utf8.push(0xf0 | (charcode >>18), 
                        0x80 | ((charcode>>12) & 0x3f), 
                        0x80 | ((charcode>>6) & 0x3f), 
                        0x80 | (charcode & 0x3f));
          }
      }
      return utf8;
    }
}