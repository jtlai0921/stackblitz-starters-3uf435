import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { GetNotificationService } from '../../shared/service/customize/getNotification.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { Setting } from '../../shared/pipe/publicPipe/custom/setting';
import { CurrencyPipe } from '../../shared/pipe/publicPipe/currency.pipe';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, AfterViewInit {

    public KEY_NOTIFICATION = "Notification";
    public KEY_NOTIFICATION_LAST_SEQ = "lastNotifySeq";
    public KEYS_NOTIFICATION_CATEGORY = [];

    public pageType = ''; // 頁面控制
    public dataArray; // 顯示通知訊息資料
    public content = []; // 顯示通知訊息資料暫存

    private idUser; // 使用者識別代碼
    private userNotification; // 使用者通知訊息資料
    private remoteNotificationList; // 新通知訊息暫存暫列

    // 通知類別訊息頁相關參數
    public type; // 通知類別
    public typeData; // 該通知類別訊息資料陣列

    public searchWord //搜尋關鍵字
    public contentArr = [] //通知訊息資料

    constructor(
        private layout: LayoutService,
        private storage: LocalStorageService,
        private getNotification: GetNotificationService,
        private popup: PopupService,
        private _langTransService: LangTransService,
        private router: Router,
        private CurrencyPipe: CurrencyPipe
    ) {
        this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
    }

    ngOnInit() {
        this.layout.setHeaderStatus({
            status: true,
            title: 'MENU.NOTICE', // 通知訊息
            rightIcon: 'noticeSetting',
            backEvent: false
        });
        // 取得當前使用者識別代碼
        this.idUser = this.storage.get("idUser");
        // 數據初始化
        this.initializeData();
        // 取得通知訊息
        this.getNotificationData();
        //若存有未登入進通知明細之記錄，登入完進入明細頁
        if (this.storage.get("notiType")) {
            let isLogin = this.storage.get("isLogin")
            if (isLogin) {
                this.onDataRowClick(this.storage.get("notiType"))
            }
            this.storage.remove("notiType");
        }
        
    }

    ngAfterViewInit() {
        console.log('Regist DropReload!')
        //註冊手勢事件 下滑Reload
        this.popup.setGestures({
            //註冊Reload事件
            'reload': () => {
                //初始化資料數據
                this.initializeData();
                this.getNotificationData();
            }
        });
    }
    //formate金額三位一逗號
    transCurrency(Amt){
        return this.CurrencyPipe.transform(Amt,-1);
    }

    /**
     * 初始化資料數據
     */
    initializeData() {
        // 清空畫面顯示資料
        this.dataArray = [];
        this.content = [];
        // 清空新通知訊息暫存資料
        this.remoteNotificationList = [];
        // 取得所有通知類別清單
        this.KEYS_NOTIFICATION_CATEGORY = Object.keys(Setting.NOTIFICATION_CATEGORY);
    }

    /**
     * 取得所有通知訊息資料
     */
    getNotificationData() {
        console.log('[通知訊息頁] getNotificationData idUser =', this.idUser);
        let lastNotifySeq = "";
        // 取得手機端保存之通知訊息
        if (this.storage.get(this.KEY_NOTIFICATION)) {
            var localNotification = this.storage.get(this.KEY_NOTIFICATION);
        }
        if (localNotification) {
            this.userNotification = localNotification[this.idUser];
        }
        // 取得目前保有之最後一筆通知訊息數據
        if (this.userNotification) {
            lastNotifySeq = this.userNotification[this.KEY_NOTIFICATION_LAST_SEQ] ? this.userNotification[this.KEY_NOTIFICATION_LAST_SEQ] : "";
        } else
            this.userNotification = {};
        lastNotifySeq = "";

        // 查詢遠端中台之通知訊息
        this.getRemoteNotificationData(lastNotifySeq);
    }

    /**
     * 查詢遠端中台之新通知訊息資料
     * @param notifySeq 接續查詢之通知訊息流水號
     */
    getRemoteNotificationData(notifySeq) {
        console.log('[通知訊息頁] getRemoteNotificationData lastNotifySeq =', notifySeq);
        this.getNotification.getNotification(notifySeq).then(
            (res) => {
                // Success: Display received notification count
                console.log('[通知訊息頁][API] getNotification success', res);
                console.log('[通知訊息頁][API] getNotification count =', res['MsgCount'], ', continue =', res['ContinueFlag']);
                let notificationList = res['NotificationList'];
                Array.prototype.push.apply(this.remoteNotificationList, notificationList);

                // 完成取得新通知訊息作業1
                if (res['ContinueFlag'] == "N" || !res['NotificationList'] || res['NotificationList'].length == 0) {
                    // 合併整理新資料與手機端資料
                    this.handleNotificationData();
                    return;
                }

                // 取得接續查詢的通知日期、流水號
                let lastNotifySeq = notificationList[notificationList.length - 1]['NotifySeq'];
                
                // 遞迴執行
                this.getRemoteNotificationData(lastNotifySeq);
            },
            (err) => {
                
                // 關閉Loading畫面
                this.popup.setLoading(false);
                // Error
                console.log('[通知訊息頁][API] getNotification error', err);
                // 使用手機端保留之資料
                this.handleDisplayData();
            }
        );
    }

    /**
     * 整理通知訊息數據
     */
    handleNotificationData() {
        // Get remote notification data count
        console.log('[通知訊息頁] handleNotificationData remote count =', this.remoteNotificationList.length);

        if (this.remoteNotificationList.length > 0) {
            // 取得新資料最後一筆數據之通知日期、流水號
            let lastNotifySeq = this.remoteNotificationList[this.remoteNotificationList.length - 1]['NotifySeq'];
            console.log('[通知訊息頁] handleNotificationData remote data lastNotifySeq =', lastNotifySeq);

            // 更新手機端之續查通知日期、流水號紀錄
            this.userNotification[this.KEY_NOTIFICATION_LAST_SEQ] = lastNotifySeq;

            // 依照訊息類別分類處理
            let category;
            this.remoteNotificationList.forEach(data => {
                category = data['Category'];
                if (!this.userNotification[category]) {
                    this.userNotification[category] = [];
                }
                if (this.userNotification[category].find(element => { return element.NotifySeq == data.NotifySeq; }) == undefined) {
                    this.userNotification[category].push(data);
                }
            });

            // 將更新完成之通知訊息數據備存於手機端
            this.updateLocalNotification();
        }

        // 轉換畫面顯示資料
        this.handleDisplayData();
    }

    /**
     * 處理畫面顯示資料
     */
    handleDisplayData() {
        // 轉換畫面顯示資料
        let categoryNotification;
        let totalLength;
        let unreadIndex;
        let dataEntity;
        this.KEYS_NOTIFICATION_CATEGORY.forEach(key => {
            categoryNotification = this.userNotification[key];

            // effect as continue
            if (!categoryNotification)
                return;

            console.log('[通知訊息頁] handleDisplayData category =', key, categoryNotification);
            dataEntity = {};
            // 通知類型
            dataEntity['type'] = key;
            // 未讀數
            totalLength = categoryNotification.length;
            unreadIndex = categoryNotification.findIndex((notification) => {
                return !notification['readed'];
            });
            dataEntity['unread'] = unreadIndex < 0 ? null : totalLength - unreadIndex;
            // 預覽摘要 TODO
            dataEntity['lastNotification'] = categoryNotification[totalLength - 1];
            this.dataArray.push(dataEntity);
        });
        //將顯示通知訊息資料存到暫存
        for (let data of this.dataArray) {
            let contents = JSON.parse(data.lastNotification.Content);
            //止付通知
            if (data.type == 1) {
                let content1 = "";
                content1 += this._langTransService.instant("NOTIFICATION.TXNTYPE_" + contents.TxnType);
                content1 += " " + (contents.DebitCur ? contents.DebitCur : "") + " " + (contents.DebitTotalAmt ? this.transCurrency(contents.DebitTotalAmt) : "")
                let temp = {
                    Tag: this._langTransService.instant("NOTIFICATION.TAG_TRADE"), //交易
                    Title: this._langTransService.instant("NOTIFICATION.CATEGORY_1"), //止付通知
                    Content: content1,
                    type: data.type,
                    unread: data.unread
                }
                this.content.push(temp)
            }
            //預約付款
            if (data.type == 2) {
                let content2 = "";
                content2 += this._langTransService.instant("NOTIFICATION.TOMORROW_EXECUTE");
                content2 += this._langTransService.instant("NOTIFICATION.TXNTYPE_" + contents.TxnType);
                content2 += this._langTransService.instant("NOTIFICATION.TRANSACTION") + "： " + (contents.DebitCur ? contents.DebitCur : "") + " " + (contents.DebitTotalAmt ? this.transCurrency(contents.DebitTotalAmt) : "")
                let temp = {
                    Tag: this._langTransService.instant("NOTIFICATION.TAG_TRADE"), //交易
                    Title: this._langTransService.instant("NOTIFICATION.CATEGORY_2"), //預約付款
                    Content: content2,
                    type: data.type,
                    unread: data.unread
                }
                this.content.push(temp)
            }
            //交易結果
            if (data.type == 3) {
                let content3 = "";
                if (contents.Result == "0000") {
                    content3 += this._langTransService.instant("NOTIFICATION.RESULT_SUCCESS");
                } else {
                    content3 += this._langTransService.instant("NOTIFICATION.RESULT_FAILED");
                }
                content3 += " ( " + this._langTransService.instant("NOTIFICATION.TXNTYPE_" + contents.TxnType) + " " + (contents.DebitCur ? contents.DebitCur : "") + " " + (contents.DebitTotalAmt ? this.transCurrency(contents.DebitTotalAmt) : "") + " )"
                let temp = {
                    Tag: this._langTransService.instant("NOTIFICATION.TAG_TRADE"), //交易
                    Title: this._langTransService.instant("NOTIFICATION.CATEGORY_3"), //交易結果
                    Content: content3,
                    type: data.type,
                    unread: data.unread
                }
                this.content.push(temp)
            }
        }
        this.contentArr = this.content;
        console.log('[通知訊息頁] handleDisplayData display dataArray', this.dataArray);


        // 畫面顯示資料排序
        this.dataArray.sort((data1, data2) => {
            // data1有未讀通知，data2均已讀
            if (data1['unread'] && !data2['unread'])
                return -1;
            // data1均已讀，data2有未讀通知
            if (!data1['unread'] && data2['unread'])
                return 1;
            // 未讀/已讀狀態相同時，比對通知日期
            return data2['lastNotification']['NotifyDate'] - data1['lastNotification']['NotifyDate'];
        });
        console.log('[通知訊息頁] handleDisplayData display-sorted dataArray', this.dataArray);
        //檢查使否有新通知，並暫存於storage
        let hasNewNotification = false;
        this.dataArray.forEach((item) =>{
            if(item.unread){
                hasNewNotification = true;
            }
        })
        this.storage.set("hasNewNotification",hasNewNotification);

        //關閉Reload Method
        this.popup.setGestures({
            'reload_close': true
        });
        // 關閉Loading畫面
        this.popup.setLoading(false);
    }

    /**
     * [前端事件綁定] 點擊通知類型項目
     * @param type 通知類別
     */
    onDataRowClick(type) {
        console.log('[通知訊息頁] onDataRowClick type =', type);
        this.typeData = this.userNotification[type];
        this.type = type;
        this.pageType = 'typePage';
        // 切換至通知類別訊息頁
        // 設定上一頁事件
        this.backNotificationPage();

    }

    /**
     * 增加通知訊息已讀戳記
     */
    addNotificationReaded() {
        // 取得使用者之指定通知類別訊息陣列
        let categoryNotification = this.userNotification[this.type];
        for (var index = (categoryNotification.length - 1); index >= 0; index--) {
            if (categoryNotification[index]['readed']) {
                console.log('[通知訊息頁] addNotificationReaded readCount =', categoryNotification.length - index - 1);
                break;
            }
            // 已讀戳記
            categoryNotification[index]['readed'] = true;
        }
        // 更新通知訊息資料
        this.userNotification[this.type] = categoryNotification;
        // 手機端數據儲存
        this.updateLocalNotification();
    }

    /**
     * 更新手機端儲存之使用者通知訊息
     */
    updateLocalNotification() {
        console.log('[通知訊息頁] updateLocalNotification', this.userNotification);
        let localNotification = this.storage.get(this.KEY_NOTIFICATION);
        if (!localNotification)
            localNotification = {};
        localNotification[this.idUser] = this.userNotification;
        this.storage.set(this.KEY_NOTIFICATION, localNotification);
    }

    /**
     * 設定上一頁事件：回到通知訊息列表頁
     */
    backNotificationPage() {
        this.layout.setHeaderStatus({
            backEvent: () => {
                this.pageType = 'list';
                this.layout.setHeaderStatus({ title: 'MENU.NOTICE' });
                setTimeout(() => {
                    //註冊手勢事件 下滑Reload
                    this.popup.setGestures({
                      //註冊Reload事件
                      'reload': () => {
                        //初始化資料數據
                        this.initializeData();
                        this.getNotificationData();
                      }
                    });
                }, 500)  
                // 通知訊息資料更新
                this.ngOnInit();
            }
        });
    }

    /**
     * [子頁回調事件] 通知類別訊息頁開啟callback：更新已讀戳記
     * @param event 事件參數
     */
    onAddReadedTagCallback(event) {
        console.log('[通知訊息頁][callback] onAddReadedTagCallback', event);
        // 更新通知訊息已讀紀錄
        this.addNotificationReaded();
    }
    //篩選功能
    filter() {
        if (this.searchWord) {
            this.contentArr = [];
            this.content.forEach((item => {
                //去除標題符號及空白
                let title = item.Title.replace(/[【】]/g, "")
                let content = item.Content.replace(/[() ：/]/g, "")
                //篩選標題或內容是否包含key值
                if (title.includes(this.searchWord) || content.includes(this.searchWord)) {
                    this.contentArr.push(item)
                }
            }))
        } else { //若searchWord為空，則重製通知訊息
            this.contentArr = this.content
        }
    }
}
