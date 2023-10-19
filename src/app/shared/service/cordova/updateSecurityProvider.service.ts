/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { CTBC_PlugIn } from './_interface';
import {Config} from '../../../../assets/configuration/config'
declare var window: any; // HiTrust Cordova Plugin：com-hitrust-plugin-devic
declare var hitrust: any; // HiTrust Cordova Plugin：com-hitrust-plugin-devic

@Injectable()
export class UpdateSecurityProvider {
    /**
     * 參數設定
     */
    constructor() {}

    /**
     * 取得cordova device資訊
     */
    public update() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve(true)
                return;
            }
            var userAgent = navigator.userAgent || navigator.vendor || window.opera
            if (/android/i.test(userAgent)) {
                CTBC_PlugIn.SecurityProviderPlugin.update(resolve,reject);
            }
        });
       
    }

}
