import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { LocalStorageService } from '../global/localStorage.service'
import { Config } from '../../../../assets/configuration/config';
import { SQLlightService } from '../cordova/sqllight/sqllight.service';
/**
 * [API] 系統公告服務類別
 */
@Injectable()
export class GetAnnouncementService {

    private tempAnnou;

    constructor(
        public telegram: TelegramService,
        public storage: LocalStorageService,
        public sql : SQLlightService
    ) {

    }

    /**
     * CCMPTX000003Rq
     * 取得所有系統公告
     * @param Country 地區國別
     * @param Locale 使用語系
     */
    public getAllAnnouncement(Country?: string, Locale?: string) {
        //取得並設定參數
        const request = this.telegram.GetRequstParam('CCMPTX000003Rq');
        request['Country'] = Country ? Country : this.storage.get('Area');
        request['Locale'] = Locale ? Locale : this.storage.get('Commonlang');
        request['BulletinId'] = "";

        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (res['AnnouncementList']) {
                        console.log('[API] getAnnouncement success length =', res['AnnouncementList'].length);
                        this.tempAnnou = res['AnnouncementList'];
                        this.mergeAnnouncement(this.tempAnnou, Country, Locale);
                        resolve(true); 
                    }
                    else {
                        console.log('[API] getAnnouncement failed', res);
                        reject(res);
                    }
                },
                (err) => {
                    console.log('[API] getAnnouncement failed', err);
                    reject(err);
                }
            );
        });
    }

    /**
     * 取得系統公告
     */
    public getAnnouncement(Country?: string, Locale?: string, BulletinId?: string) {
        // 相關查詢參數
        let country = Country ? Country : this.storage.get('Area');
        let locale = Locale ? Locale : this.storage.get('Commonlang');
        // 取得最後一筆公告識別碼
        let lastIdRecord = this.storage.get('LastBulletinId') instanceof Object ? this.storage.get('LastBulletinId') : {};
        let lastBulletinId = lastIdRecord ? lastIdRecord[country + "_" + locale] : undefined;
        let bulletinId = BulletinId ? BulletinId : (lastBulletinId ? lastBulletinId : '');
        // 暫存陣列初始化
        this.tempAnnou = [];
        return this.getRemoteAnnouncement(country, locale, bulletinId);
    }
    
    /**
     * 取得遠端中台之最新公告 API CCMPTX000003Rq
     * @param Country 
     * @param Locale 
     * @param BulletinId 
     */
    private getRemoteAnnouncement(Country: string, Locale: string, BulletinId: string) {
        //取得並設定參數
        const request = this.telegram.GetRequstParam('CCMPTX000003Rq');
        request['Country'] = Country;
        request['Locale'] = Locale;
        request['BulletinId'] = BulletinId;

        let annouList;
        let lastBulletinId;
        //打api
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (res['AnnouncementList']) {
                        console.log('[API] getAnnouncement remote length =', res['AnnouncementList'].length);
                        Array.prototype.push.apply(this.tempAnnou, res['AnnouncementList']);
                        if (res['AnnouncementList'].length < 20) {
                            // 終止接續查詢
                            this.mergeAnnouncement(this.tempAnnou, Country, Locale);
                            resolve(true);
                        } 
                        else {
                            // 執行接續查詢
                            annouList = res['AnnouncementList'];
                            lastBulletinId = annouList[annouList.length - 1]['BulletinId'];
                            this.getRemoteAnnouncement(Country, Locale, lastBulletinId).then(
                                (_res) => { resolve(true) },
                                (_err) => { reject(_err); }
                            );
                        }
                    }
                },
                (error) => {
                    console.log('[API] getAnnouncement', error);
                    this.mergeAnnouncement(this.tempAnnou, Country, Locale);
                    reject(error);
                }
            );
        });
      
    }

    /**
     * 整合公告資料數據
     * @param remoteData 遠端數據
     * @param country 國家地區
     * @param locale 使用語系
     */
    private mergeAnnouncement(remoteData, country, locale) {
        console.log('[API] getAnnouncement total remote length =', remoteData.length);
        
        // 增加公告紀錄對應之地區與語系
        remoteData.forEach(data => {
            data['Area'] = country;
            data['Lang'] = locale;
        });
        let localData = remoteData;

        // if (!Config.NATIVE_OPEN) {
        //     this.storage.set('Announce', localData);
        //     // 紀錄最新一筆公告識別碼
        //     this.updateLastIdRecord(remoteData, country, locale);
        // } else {
        //     this.sql.insert('Announce', localData).then(
        //         (_res) => {
        //             console.log('Announce 儲存成功',_res);
        //             // 紀錄最新一筆公告識別碼
        //             this.updateLastIdRecord(remoteData, country, locale);
        //         },
        //         (_err) => {
        //             console.log('Announce 儲存失敗',_err);
        //         }
        //     );
        // }

        // 完全覆寫掉手機端公告資料
        this.storage.set('Announce', localData);
    }

    /**
     * 更新最後一筆公告識別碼紀錄
     * @param remoteData 最新公告數據
     * @param country 國家地區
     * @param locale 使用語系
     */
    private updateLastIdRecord(remoteData, country, locale) {
        if (remoteData.length == 0)
            return;

        // 取得最後一筆公告識別碼紀錄
        let lastIdRecord = this.storage.get('LastBulletinId') instanceof Object ? this.storage.get('LastBulletinId') : {};
        lastIdRecord[country + "_" + locale] = remoteData[remoteData.length - 1]['BulletinId'];
        this.storage.set('LastBulletinId', lastIdRecord);
    }

    /**
    * 取得記錄在資料庫內之系統公告
    * @param country 地區
    * @param locale 語系
    */
    public getStorageAnnouncement(country, locale) {
        //若有語系國別條件加這邊
        return new Promise((resolve, reject) => {
            // if (!Config.NATIVE_OPEN) {
            //     var data = this.storage.get('Announce');
            //     if (data) {
            //         resolve(data);
            //     } else {
            //         reject('No Data!');
            //     }
            // } else {
            //     this.sql.select('Announce', { 'Area': country, 'Lang': locale }).then(
            //         (_res) => {
            //             console.log('Announce 查詢成功',_res);
            //             resolve(_res);
            //         },
            //         (_err) => {
            //             console.log('Announce 查詢失敗',_err);
            //             reject(_err);
            //         }
            //     );
            // }

            var data = this.storage.get('Announce');
            if (data) {
                resolve(data);
            } else {
                reject('No Data!');
            }
        });
    }
}
