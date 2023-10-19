import { Injectable } from '@angular/core';
import { Config } from '../../../../assets/configuration/config';
import { CTBC_PlugIn } from './_interface';

/**
 * 檔案解壓縮服務
 */
@Injectable()
export class ZipService {

    constructor(
    ) {      
    }

    /**
     * 解壓縮檔案
     * @param fileName 
     * @param outputDirectory 
     * @param callback 
     * @param progressCallback 
     */
    public unzip(fileName, outputDirectory, callback, progressCallback) {
        if (Config.NATIVE_OPEN) {
            CTBC_PlugIn.Zip.unzip(fileName, outputDirectory, callback, progressCallback);
        } else {
            throw "Simulate-Mode";
        }
    }

    /**
     * 合併解壓縮分割檔案
     * @param fileInfoList 分割檔資訊陣列：[{"path":"file_path_in_device", "sum":"check_sum_from_API"}]
     * @param outputDirectory 解壓縮目標路徑
     * @param password 解壓縮密碼明文
     * @param isDeleteSourceFiles 是否刪除分割檔
     * @param callback 執行完畢對應處理函式
     * @param progressCallback 進度回報處理函式
     */
    public unzipDividedFiles(fileInfoList, outputDirectory, password, isDeleteSourceFiles, callback, progressCallback) {
        if (Config.NATIVE_OPEN) {
            CTBC_PlugIn.Zip.unzipDividedFiles(fileInfoList, outputDirectory, password, isDeleteSourceFiles, callback, progressCallback);
        } else {
            // 模擬解壓縮成功
            callback(0);
            // 模擬解壓縮失敗
            // callback("Simulate-Mode");
        }
    }

    /**
     * 刪除指定路徑檔案
     * @param filesPath 欲刪除之所有檔案路徑陣列
     */
    public deleteFiles(filesPath) {
        if (Config.NATIVE_OPEN) {
            return CTBC_PlugIn.Zip.deleteFiles(filesPath);
        } else {
            return new Promise((resolve, reject)=>{
                // 模擬解刪除成功
                // resolve();
                // 模擬解壓縮失敗
                reject();
            });
        }
    }
}