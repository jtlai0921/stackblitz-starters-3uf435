/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import {Config} from '../../../../assets/configuration/config'
declare var window: any; // HiTrust Cordova Plugin：com-hitrust-plugin-devic
declare var hitrust: any; // HiTrust Cordova Plugin：com-hitrust-plugin-devic

@Injectable()
export class DeviceService {
    /**
     * 參數設定
     */
    constructor() {}

    /**
     * 取得cordova device資訊
     */
    public getDeviceInfo(key:string = '') {
        let data = {};
        if(Config.NATIVE_OPEN){
            if (typeof hitrust.device !== 'undefined') {
                data = hitrust.device;
            }else{
                console.log('Get Deive ID Error!');
            }
        }else{
            data = {
                "available": true,
                "platform": "Android",
                "version": "8.0.0",
                "uuid": "f6c7e981c6a63dd4",
                "cordova": "7.0.0",
                "model": "ASUS_Z017DA",
                "manufacturer": "asus",
                "isVirtual": false,
                "serial": "GBAZCY02B168VUN",
                "appinfo": {
                    "identifier": "com.hitrust.ctbc.app",
                    "name": "CTBC_APP",
                    "version": "1.0.0"
                },
                "hostname": ""
            };
        }

        if(key != ''){
          return data[key];
        }else{
          return data;
        }
    }

}
