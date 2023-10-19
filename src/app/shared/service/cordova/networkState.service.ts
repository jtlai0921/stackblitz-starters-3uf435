/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { CTBC_PlugIn } from './_interface'
import {Config} from '../../../../assets/configuration/config'
@Injectable()
export class networkStateService {
    /**
     * 參數設定
     */
    constructor() {}

    /**
     * 是否連線
     */
    public IsConnect() {
        if(Config.NATIVE_OPEN){
            return CTBC_PlugIn.checkConnection();
        }else{
            return true;
        }
    }
    public ConnectStatus() {
        
        if(Config.NATIVE_OPEN){
            return CTBC_PlugIn.ConnectStatus();
        }else{
            return true;
        }
     }

}
