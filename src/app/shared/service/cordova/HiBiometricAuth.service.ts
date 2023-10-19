/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { Config } from '../../../../assets/configuration/config'
declare var window: any; // HiTrust Cordova Plugin：com-hitrust-plugin-devic

@Injectable()
export class HiBiometricAuthService {
    /**
     * 參數設定
     */
    constructor(
        
    ) { }

    public startIdentify(title) {
        console.log("快速登入-啟用生物辨識");
        return new Promise((resolve, reject) => {
            this.getBiometricStatus_(title).then(resolve, reject);
        });
    }

    /**
    * 檢查是否支援生物辨識
    */
    public getBiometricStatus_(title) {
        return new Promise((resolve, reject) => {
            const success = (res) => {
                console.log("快速登入-支援生物辨識");
                var type = res["dev_type"];
                this.identifyByBiometric_(type,title).then(resolve, reject);
            };
            const error = (err) => {
                reject(err)
            };
            window.HiBiometricAuth.getBiometricStatus(success, error);
        });
    }

    /**
     * 啟動生物辨識
     */
    public identifyByBiometric_(type,title) {
        return new Promise((resolve, reject) => {
            const success = (res) => {
                console.log("快速登入-生物辨識成功");
                res["dev_type"] = type;
                resolve(res);
            };
            const error = (err) => { reject(err) };
            window.HiBiometricAuth.identifyByBiometric(success, error,title , true);
        });
    }


    /**
    * 檢查是否支援生物辨識
    */
    public getBiometricStatus() {
        return new Promise((resolve, reject) => {
            window.HiBiometricAuth.getBiometricStatus(resolve, reject);
        });
    }

    /**
    * 啟動生物辨識
    */
    public identifyByBiometric(title) {
        return new Promise((resolve, reject) => {
            window.HiBiometricAuth.identifyByBiometric(resolve, reject, title, false);
        });
    }
}
