/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { SecurytyService } from './security.service';
import { HexadecimalService } from './hexadecimal.service';
import { WbcService } from '../cordova/wbc.service';
import { DeviceService } from '../cordova/device.service';
import { Config } from '../../../../assets/configuration/config';
// using sha512.js
declare var sha384;

const KEY_USER_CONFIGURATION = "UserConfiguration";

@Injectable()
export class LocalStorageService {

    public static aesByte:any;

    private skipList = [
        "Commonlang",
        "isLogin",
        "hasNewNotification"
    ];

    constructor(
        private security: SecurytyService,
        private hex: HexadecimalService,
        private wbc: WbcService,
        private device: DeviceService
    ) {
       var data = localStorage.getItem('data');
       if(data == null) {
           localStorage.setItem('data', JSON.stringify({}));
       }
    }

    /**
     * 取得裝狀資訊
     * @param key 查詢條件
     */
    public get(key: string = '') {
      var storage = JSON.parse(localStorage.getItem('data'));
     // console.log('get storage',storage);
      if(key == ''){
        return storage;
      }else{
          if (storage[key]) {
            if (this.skipList.includes(key)) {
                return JSON.parse(storage[key]);
            } else {
                return JSON.parse(this.security.aesDecodeByKey(storage[key], LocalStorageService.aesByte));
            }
          }
          else
            return storage[key];
      }
    }

    /**
     * 設定暫存項目
     * @param key key
     * @param value value
     */
    public set(key: string,value:any) {
        if(typeof key != 'undefined' &&　key != '' && typeof value != 'undefined'){
            var storage = JSON.parse(localStorage.getItem('data'));

            if (this.skipList.includes(key))
                storage[key] = JSON.stringify(value);
            else
                storage[key] = this.security.aesEncodeByKey(JSON.stringify(value), LocalStorageService.aesByte);

        //    console.log('set storage',storage);
            localStorage.setItem('data', JSON.stringify(storage));
        }
    }

    /**
     * 清除所有暫存
     */
    public clearAll() {
        localStorage.setItem('data', JSON.stringify({}));
    }

    /**
     * 清除暫存
     * @param key key
     */
    public remove(key: string) {
        var storage = JSON.parse(localStorage.getItem('data'));
        //console.log('get storage',storage);
        if(key != ''){
          if(typeof storage[key] != 'undefined'){
            delete storage[key];
            localStorage.setItem('data', JSON.stringify(storage));
          }
        }
    }

    /**
     * Get all user configuration
     * @returns All user configuration
     */
    public getAllUserConfigurationMap() {
        var configurationMap = this.get(KEY_USER_CONFIGURATION);
        if (configurationMap == null) {
          configurationMap = {};
          this.set(KEY_USER_CONFIGURATION, configurationMap);
        }
        return configurationMap;
    }

    /**
     * Get current user configuration
     * @returns User configuration
     */
    public getUserConfigurations() {
        var idUser = this.get("idUser");
        var allUserConfigurationMap = this.getAllUserConfigurationMap();
        var configuration = allUserConfigurationMap[idUser];
        if (configuration == null) {
          configuration = {};
          allUserConfigurationMap[idUser] = configuration;
          this.set(KEY_USER_CONFIGURATION, allUserConfigurationMap);
        }
        return configuration;
    }

    /**
     * Storage current user configuration
     * @param userConfiguration New configuration
     */
    public updateUserConfigurations(userConfiguration) {
        var idUser = this.get("idUser");
        var allUserConfigurationMap = this.getAllUserConfigurationMap();
        allUserConfigurationMap[idUser] = userConfiguration;
        this.set(KEY_USER_CONFIGURATION, allUserConfigurationMap);
    }
    
    /**
     * Get user configuration of key
     * @param key Target key
     */
    public getConfig(key: string) {
        if (key == null || key.length == 0) {
            return null;
        } else {
            return this.getUserConfigurations()[key];
        }
    }

    /**
     * Set user configuration of key
     * @param key Target key
     * @param value New value
     */
    public setConfig(key: string, value: any) {
        if (key == null || key.length == 0) {
            return;
        } else {
            var configuration = this.getUserConfigurations();
            configuration[key] = value;
            this.updateUserConfigurations(configuration);
        }
    }
    
    /**
     * 準備啟動localStorage加解密機制
     */
    public prepareLocalStorage() {
        console.log('[local storage] prepareLocalStorage start');
        return new Promise((resolve, reject) => {
            // APP程式已取得過金鑰
            if (LocalStorageService.aesByte) {
                console.log('[local storage] local storage prepared already.');
                resolve('do nothing');
                return;
            }

            // 執行取得金鑰作業
            if (Config.NATIVE_OPEN) {
                try {
                    let lskIndex = localStorage.getItem('lskIndex');
                    console.log('[local storage] lskIndex =', lskIndex);
                    let lskString = localStorage.getItem('lskString');
                    console.log('[local storage] lskString =', lskString);

                    if (lskIndex && lskString) {
                        let deviceShaByte = this.hex.hexToBytes(sha384(this.device.getDeviceInfo('uuid')));
                        let kXorByte = this.hex.hexToBytes(lskString);
                        let kWbcHex = this.hex.bytesToHex(this.hex.xor(kXorByte, deviceShaByte));
                        this.wbc.decrypt(kWbcHex, +lskIndex).then(
                            (success) => {
                                console.log('[local storage] wbc decrypt success');
                                LocalStorageService.aesByte = this.hex.hexToBytes(success);
                                resolve('start local storage');
                            },
                            (error) => {
                                console.log('[local storage] wbc decrypt error', error);
                                reject(error);
                            }
                        )
                    }
                    else {
                        let kIndex = Math.floor(Math.random() * Math.pow(10, 10) + 1).toString();
                        let kByte = new Uint8Array(32);
                        window.crypto.getRandomValues(kByte);
                        LocalStorageService.aesByte = kByte;

                        let kHex = this.hex.bytesToHex(kByte);
                        this.wbc.encrypt(kHex, kIndex).then(
                            (success) => {
                                console.log('[local storage] wbc encrypt success', success); 
                                let kWbcByte = this.hex.hexToBytes(success);
                                let deviceShaByte = this.hex.hexToBytes(sha384(this.device.getDeviceInfo('uuid')));
                                let kXorByte = this.hex.xor(kWbcByte, deviceShaByte);
                                let kXorHex = this.hex.bytesToHex(kXorByte);
                                
                                localStorage.setItem('lskIndex', kIndex);
                                localStorage.setItem('lskString', kXorHex);
                                resolve("initialize local storage");
                            },
                            (error) => {
                                console.log('[local storage] wbc encrypt error', error);
                                reject(error);
                            }
                        );
                    }
                } catch (e) {
                    console.error('[local storage] prepareLocalStorage error', e);
                    reject(e);
                }
            } else {
                LocalStorageService.aesByte = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
                resolve('Simulate-Mode');
            }
        });
    }
}
