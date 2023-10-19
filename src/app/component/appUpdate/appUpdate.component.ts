import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64Service } from '../../shared/service/global/base64.service';
import { HexadecimalService } from '../../shared/service/global/hexadecimal.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { ContentVerInqService } from '../../shared/service/customize/contentVerInq.service';
import { ContentDownloadService } from '../../shared/service/customize/contentDownload.service';
import { DeviceService } from '../../shared/service/cordova/device.service';
import { FileService } from '../../shared/service/cordova/file.service';
import { WbcService } from '../../shared/service/cordova/wbc.service';
import { ZipService } from '../../shared/service/cordova/zip.service';
import { Config } from '../../../assets/configuration/config';
import { tryParse } from 'selenium-webdriver/http';

@Component({
    selector: 'app-update',
    templateUrl: './appUpdate.component.html',
    styleUrls: ['./appUpdate.component.css']

})
export class AppUpdateComponent implements OnInit, OnDestroy {

    public localContentVer = Config.WWW_VERSION;
    public signAlgorithm = "sha256";

    private verInfo;
    private contentFiles;
    private downloadList;
    private dirList;
    private localFileList;
    private delFileList;
    private StartError;
    private step = {
        start: { percent: 1 },
        queryVer: { percent: 7, msg: "APP_CONTENT_UPDATE.STEP_QUERY_VERSION" },
        compareVer: { percent: 16, msg: "APP_CONTENT_UPDATE.STEP_COMPARE_VERSION" },
        download: { percent: 50, msg: "APP_CONTENT_UPDATE.STEP_DOWNLOAD" },
        storage: { percent: 79, msg: "APP_CONTENT_UPDATE.STEP_STORAGE" },
        update: { percent: 90, msg: "APP_CONTENT_UPDATE.STEP_UPDATE" },
        delete: { percent: 98, msg: "APP_CONTENT_UPDATE.STEP_DELETE" },
        finish: { msg: "APP_CONTENT_UPDATE.STEP_FINISH" },
        noNeed: { msg: "APP_CONTENT_UPDATE.STEP_NO_NEED" },
        error: { msg: "APP_CONTENT_UPDATE.STEP_ERROR" }
    }
    private downloadCount = 0;
    private downloadTotal;

    private page;
    private index;

    // 畫面顯示資訊
    public appVersion;
    public contentVersion = Config.WWW_VERSION;

    constructor(
        private storage: LocalStorageService,
        private popup: PopupService,
        private contentVerInq: ContentVerInqService,
        private contentDownload: ContentDownloadService,
        private base64: Base64Service,
        private file: FileService,
        private zip: ZipService,
        private hex: HexadecimalService,
        private wbc: WbcService,
        public device: DeviceService,
        private route: ActivatedRoute,
        private router: Router,
        private ngzone: NgZone,
    ) {
        this.dirList = this.file.getDirList();
        this.appVersion = device.getDeviceInfo("appinfo")['version'];
    }

    ngOnInit() {

        let ele = document.getElementById('mainboad');
        ele.classList.add('noPaddingTop');

        // 取得來源頁面相關參數
        this.route.queryParams.subscribe(param => {
            this.page = param['page'];
            this.index = param['index'];
            this.StartError = param['StartError'];
        });
        console.log('[APP更新頁] initial page =', this.page, ', index =', this.index);

        /**
         * 2018/10/31 ArnoChang
         * [應急處理] 
         * cordova-plugin-zip update.js須修正content初始化功能
         * 現況為了不大規模重新安裝APP
         * 故於此處補實作content初始化功能修正步驟
         */
        localStorage.setItem('nativeVer', this.device.getDeviceInfo("appinfo")['version']);

        // 開始APP更新作業
        this.getContentVer();
    }

    
  ngOnDestroy(){
    let ele = document.getElementById('mainboad');
    ele.classList.remove('noPaddingTop');
  }

    /**
     * 取得APP版本更新資訊
     */
    getContentVer() {
        this.updateProgress(this.step.start.percent, this.step.queryVer.msg);
        this.contentVerInq.contentVerInq().then(
            (res) => {
                console.log('[APP更新頁][API] contentVerInq success', res);
                // 比對手機端APP版本紀錄和版本更新資訊
                this.verInfo = res;
                this.compareContentVer();
            },
            (err) => {
                console.log('[APP更新頁][API] contentVerInq error', err);
                this.breakAppUpdateError();
            }
        );
    }

    /**
     * 比對APP版本更新內容
     */
    compareContentVer() {
        this.updateProgress(this.step.queryVer.percent, this.step.compareVer.msg);
        console.log('[APP更新頁] compareContentVer local =', this.localContentVer, ', current =', this.verInfo['CurrentVer'], ', last =', this.verInfo['LastVer']);
        
        // 版本號比對作業
        let mode;
        try {
            let localVer = parseInt(this.localContentVer);
            let currentVer = parseInt(this.verInfo['CurrentVer']);
            let lastVer = parseInt(this.verInfo['LastVer']);

            if (localVer >= currentVer)
                mode = "NO_UPDATE";
            else if (localVer < lastVer)
                mode = "COMPLETE";
            else 
                mode = "PATCH";

            console.log('[APP更新頁] compareContentVer update-mode =', mode);
        } catch (error) {
            console.log('[APP更新頁] compareContentVer error', error);
            this.breakAppUpdateError();
            return;
        }
        
        let fileList;
        this.delFileList = [];
        // 版本無須更新
        if (mode == "NO_UPDATE") {
            // this.finishAppUpdate(this.step.noNeed.msg);
            // 無須更新時不顯示任何訊息，直接回到原啟動作業流程
            this.router.navigate(['/' + this.page], { queryParams: { page: 'update', index: this.index, StartError: this.StartError } });
            return;
        }
        // 差異更新模式
        else if (mode == "PATCH") {
            console.log('[APP更新頁] compareContentVer PARTIAL-update mode');
            fileList = this.verInfo['PatchPackage'];
        }
        // 完整更新模式
        else {
            console.log('[APP更新頁] compareContentVer COMPLETE-update mode');
            fileList = this.verInfo['CompletePackage'];
        }
        this.delFileList = this.verInfo['DelFiles'];

        // 下載所需之更新檔
        this.startDownload(fileList);
    }

    /**
     * 開始更新檔下載作業
     * @param fileList 更新檔清單
     */
    startDownload(fileList) {
        this.updateProgress(this.step.compareVer.percent, this.step.download.msg);

        // 取額需下載檔案總數
        this.downloadTotal = fileList.length;
        // 取得所有須下載檔案名稱
        this.contentFiles = [];
        this.downloadList = [];
        this.localFileList = [];
        let localFile;
        fileList.forEach(fileInfo => {
            // 手機端檔案清單
            localFile = {};
            localFile['path'] = this.dirList.cacheDirectory + fileInfo['FileName'];
            localFile['sum'] = fileInfo['CheckSum'];
            localFile['algorithm'] = this.signAlgorithm;
            this.localFileList.push(localFile);
            // 下載清單
            this.downloadList.push(fileInfo['FileName']);
        });

        // 下載所有檔案
        console.log('[APP更新頁] startDownload downloadList', this.downloadList);
        this.downloadContentFile(0).then(
            (all_success) => {
                console.log('[APP更新頁] download all success', all_success);
                // 將所有更新檔資料儲存到手機實體空間
                this.storageContentFile();
            },
            (any_failed) => {
                console.log('[APP更新頁] download any failed', any_failed);
                this.breakAppUpdateError();
            }
        );
    }

    /**
     * 下載APP更新檔案
     * @param index 更新檔清單序列號
     */
    downloadContentFile(index) {
        let fileName = this.downloadList[index];
        console.log('[APP更新頁][API] contentDownload index =', index, ', fileName =', fileName);

        return new Promise((resolve, reject) => {
            this.contentDownload.contentDownload(fileName).then(
                (res) => {
                    console.log('[APP更新頁][API] contentDownload success');
                    // 暫存更新檔案內容
                    let file = {};
                    file['name'] = fileName;
                    file['data'] = res;
                    this.contentFiles.push(file);

                    // 依照下載完成數，更新進度條
                    this.downloadCount++;
                    let addPercent = Math.round((this.step.download.percent - this.step.compareVer.percent) * this.downloadCount / this.downloadTotal);
                    this.updateProgress(this.step.compareVer.percent + addPercent, this.step.download.msg);

                    index++;

                    // 所有下載完成
                    if (index == this.downloadList.length) {
                        resolve(true);
                        return;
                    }

                    // 繼續下載剩餘檔案
                    this.downloadContentFile(index).then(
                        (_res) => { resolve(true) },
                        (_err) => { reject(_err); }
                    );
                },
                (err) => {
                    console.log('[APP更新頁][API] contentDownload error', err);
                    reject(fileName);
                }
            );
        });
    }

    /**
     * 儲存APP更新檔案至手機實體空間
     */
    storageContentFile() {
        this.updateProgress(this.step.download.percent, this.step.storage.msg);
        console.log('[APP更新頁] storageContentFile count =', this.contentFiles.length);
        let storageTotal = this.contentFiles.length;
        let storageCount = 0;
        let errorCount = 0;
        let addPercent = 0;

        let fileName;
        let blobData;
        this.contentFiles.forEach((file, index) => {
            // 數據base64編碼解碼後BLOB化
            blobData = this.base64.base64ToBlob(file.data, "application/octet-stream");
            // 暫存檔案至手機端APP檔案暫存目錄
            this.file.writeFile(this.dirList.cacheDirectory, file.name, blobData,
                (success) => {
                    // 儲存檔案成功
                    storageCount++;
                    // 依照儲存完成數，更新進度條
                    addPercent = Math.round((this.step.storage.percent - this.step.download.percent) * storageCount / storageTotal);
                    this.updateProgress(this.step.download.percent + addPercent, this.step.storage.msg);

                    // 確認為最後一個分割檔
                    if ((storageCount + errorCount) == this.contentFiles.length) {
                        console.log('[APP更新頁] storageContentFile finished, storageCount =', storageCount, ', errorCount =', errorCount);
                        // 任一檔案儲存發生錯誤，終止更新作業
                        if (errorCount > 0) {
                            this.breakAppUpdateError();
                            return;
                        }

                        // 等待1秒後，繼續後續作業
                        setTimeout(() => {
                            // 更新APP內容
                            this.updateContent();
                        }, 1000);
                    }
                },
                (error) => {
                    // 儲存檔案失敗
                    error++;
                    // 確認為最後一個分割檔時，終止更新作業
                    if ((storageCount + errorCount) == this.contentFiles.length) {
                        console.log('[APP更新頁] storageContentFile finished, storageCount =', storageCount, ', errorCount =', errorCount);
                        this.breakAppUpdateError();
                    }
                }
            );
        });
    }

    /**
     * 更新APP內容
     */
    updateContent() {
        this.updateProgress(this.step.storage.percent, this.step.update.msg);
        console.log('[APP更新頁] updateContent localFileList', this.localFileList);
        let targetDir = this.dirList.dataDirectory + "www";
        console.log('[APP更新頁] updateContent targetDir =', targetDir);
        let cipherHex = this.hex.base64toHex(this.verInfo['PassPhase']);
        let keyIndex = this.verInfo['KeyIndex'];

        // 解壓縮密碼密文解密
        this.wbc.decrypt(cipherHex, keyIndex).then(
            (wbc_res) => {
                console.log('[APP更新頁] updateContent zip password wbc decrypt success', wbc_res);
                let pwdHex_1 = this.hex.hexToUtf8(wbc_res);
                console.log('[APP更新頁] updateContent zip password hex decrypt-first success', pwdHex_1);
                let pwdHex_2 = this.hex.hexToUtf8(pwdHex_1);
                console.log('[APP更新頁] updateContent zip password hex decrypt-second success', pwdHex_2);
                // 分割檔合併、解壓縮
                let addPercent;
                let numerator;
                let denominator;
                this.zip.unzipDividedFiles(this.localFileList, targetDir, pwdHex_2, true,
                    (unzip_res) => {
                        if (unzip_res == 0) {
                            // 解壓縮成功
                            console.log('[APP更新頁] updateContent unzip success', unzip_res);
                            // 更新作業完成後，刪除指定檔案
                            this.deleteContentFiles();
                        } else {
                            // 解壓縮失敗
                            console.log('[APP更新頁] updateContent unzip error', unzip_res);
                            this.breakAppUpdateError();
                        }
                    },
                    (progress) => {
                        // 解壓縮進度更新
                        console.log('[APP更新頁] updateContent unzip progress', progress);
                        numerator = progress['loaded'] ? progress['loaded'] : 0;
                        denominator = progress['total'] ? progress['total'] : 1;
                        addPercent = Math.round((this.step.update.percent - this.step.storage.percent) * numerator / denominator);
                        this.updateProgress(this.step.storage.percent + addPercent, this.step.update.msg);
                    });
            },
            (wbc_err) => {
                console.log('[APP更新頁] updateContent zip password wbc decrypt error', wbc_err);
                this.breakAppUpdateError();
            }
        );
    }

    /**
     * 刪除指定APP內容檔案
     */
    deleteContentFiles() {
        this.updateProgress(this.step.update.percent, this.step.delete.msg);
        console.log('[APP更新頁] deleteContentFiles delFileList', this.delFileList);

        if (!this.delFileList || this.delFileList.length == 0) {
            // 完成APP更新作業所有步驟
            this.finishAppUpdate();
            return;
        }

        this.zip.deleteFiles(this.delFileList).then(
            (res) => {
                // 刪除成功
                console.log('[APP更新頁] deleteContentFiles success', res);
                // 刪除檔案完成，APP更新作業結束
                this.finishAppUpdate();
            },
            (err) => {
                // 刪除失敗
                console.log('[APP更新頁] deleteContentFiles error', err);
                this.breakAppUpdateError();
            }
        );
    }

    /**
     * 更新顯示進度條
     * @param currentPercent 當前進度百分比
     * @param msg 提示訊息內容
     */
    updateProgress(currentPercent, msg?) {
        this.ngzone.run(() => {
            // this.popup.setPercentage({
            //     status: true,
            //     content: msg,
            //     percent: currentPercent, 
            // });
        });
    }

    /**
     * APP更新作業完成
     * @param msg 提示訊息內容
     */
    finishAppUpdate(msg?) {
        console.log('[APP更新頁] finishAppUpdate');
        this.ngzone.run(() => {
            // this.popup.setPercentage({
            //     status: true,
            //     content: msg ? msg : this.step.finish.msg,
            //     percent: 100, 
            //     checkTxt: 'APP_CONTENT_UPDATE.BTN_CONFIRM',
            //     event: () => {
            //         // 回到來源頁面
            //         console.log('[APP更新頁] finished and return');
            //         this.router.navigate(['/' + this.page], {queryParams: {page: 'update', index: this.index,StartError:this.StartError}});
            //     }
            // });

            // this.popup.setConfirm({
            //     content: msg ? msg : this.step.finish.msg,
            //     event: () => {
            //         // 回到來源頁面
            //         console.log('[APP更新頁] finished and return');
            //         this.router.navigate(['/' + this.page], { queryParams: { page: 'update', index: this.index, StartError: this.StartError } });
            //     }
            // });

            // 返回到Loader以重新載入APP
            location.replace(this.dirList.applicationDirectory + "www/index.html");
        });
    }

    /**
     * APP更新發生錯誤，終止作業
     */
    breakAppUpdateError() {
        console.log('[APP更新頁] breakAppUpdateError');
        this.ngzone.run(() => {
            // this.popup.setPercentage({
            //     status: true,
            //     content: this.step.error.msg,
            //     percent: 100, 
            //     checkTxt: 'APP_CONTENT_UPDATE.BTN_CONFIRM',
            //     event: () => {
            //         // 回到來源頁面
            //         console.log('[APP更新頁] error break and return');
            //         this.StartError = true;
            //         this.router.navigate(['/' + this.page], {queryParams: {page: 'update', index: this.index,StartError:this.StartError}});
            //     }
            // });
            this.popup.setConfirm({
                content: 'APP_CONTENT_UPDATE.STEP_ERROR',
                event: () => {
                    // 回到來源頁面
                    console.log('[APP更新頁] error break and return');
                    this.router.navigate(['/' + this.page], { queryParams: { page: 'update', index: this.index, StartError: this.StartError } });
                }
            });
        });
    }
}