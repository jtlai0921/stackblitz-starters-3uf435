import { Injectable } from '@angular/core';
import { Config } from '../../../../assets/configuration/config';

declare var cordova;
declare var window;

/**
 * 檔案存取操作服務
 */
@Injectable()
export class FileService {

    constructor(
    ) {      
    }

    /**
     * 取得裝置上所有APP相關檔案目錄
     */
    public getDirList() {
        if (Config.NATIVE_OPEN) {
            return cordova.file;
        }
        else {
            return {
                "applicationDirectory": "file:///android_asset/",
                "applicationStorageDirectory": "file:///data/data/com.hitrust.ctbc.app/",
                "cacheDirectory": "file:///data/data/com.hitrust.ctbc.app/cache/",
                "dataDirectory": "file:///data/data/com.hitrust.ctbc.app/files/",
                "documentsDirectory": null,
                "externalApplicationStorageDirectory": "file:///storage/emulated/0/Android/data/com.hitrust.ctbc.app/",
                "externalCacheDirectory": "file:///storage/emulated/0/Android/data/com.hitrust.ctbc.app/cache/",
                "externalDataDirectory": "file:///storage/emulated/0/Android/data/com.hitrust.ctbc.app/files/",
                "externalRootDirectory": "file:///storage/emulated/0/",
                "sharedDirectory": null,
                "syncedDataDirectory": null,
                "tempDirectory": null
            };
        }
    }

    /**
     * 儲存檔案
     * @param filePath 檔案儲存目錄
     * @param fileName 檔案名稱
     * @param data 檔案內容數據
     * @param successCallback 成功對應處理函示
     * @param errorCallback 錯誤對應處理函式
     */
    public writeFile(filePath, fileName, data, successCallback?:Function, errorCallback?:Function) {
        if (Config.NATIVE_OPEN) {   
            console.log('[file] writeFile', fileName);
            // 取得裝置檔案目錄操作物件
            window.resolveLocalFileSystemURL(filePath, (dir) => {
                // console.log('[file] directory', dir);
                // 取得檔案實體操作物件
                dir.getFile(fileName, {create:true}, (fileEntry) => {
                    // console.log('[file] fileEntry', fileEntry);
                    // 檔案寫入作業
                    fileEntry.createWriter(
                        (writer) => {
                            // 寫入完成觸發事件
                            writer.onwriteend = function(event) {
                                console.log('[file]', fileName,'written success', event);
                                successCallback(event);
                            }
                            // 寫入錯誤觸發事件
                            writer.onerror = function(event) {
                                console.log('[file]', fileName, 'written failed', event);
                                errorCallback(event);
                            }
                            // 執行檔案寫入
                            writer.write(data);
                        },
                        (error) => {
                            console.log('[file] fileEntry.createWriter error', error);
                        }
                    );
                });
            });
        } else {
            // 模擬儲存成功
            successCallback("Simulate-Mode");
            // 模擬儲存失敗
            // errorCallback("Simulate-Mode");
        }
    }
}