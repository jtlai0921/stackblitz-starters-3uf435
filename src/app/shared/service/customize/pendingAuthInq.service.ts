import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

/**
 * [API] 授權查詢服務類別
 */
@Injectable()
export class PendingAuthInqService {

    private tempAuth;

    constructor(
        public telegram : TelegramService
    ) {}

    /**
     * 查詢授權資料 API CCMPTX000199Rq
     * @param Category 資料類別(空值/P:待授權; M:我的授權; O:其他授權;)
     * @param LastSeq 上次查詢資料中，最後一筆資料的流水號
     * @param LastMaxSeq 全資料中，最新一筆資料的流水號
     */
    public pendingAuthInq(Category: string, LastSeq?: string, LastMaxSeq?: string) {
        // 相關查詢參數
        let lastSeq = LastSeq ? LastSeq : "";
        let maxSeq = LastMaxSeq ? LastMaxSeq : "";
        // 暫存陣列初始化
        this.tempAuth = [];
        return this.continuePendingAuthInq(lastSeq, maxSeq, Category);
    }

    /**
     * 接續查詢授權資料
     * @param LastSeq 上次查詢資料中，最後一筆資料的流水號
     * @param LastMaxSeq 全資料中，最新一筆資料的流水號
     * @param Category 資料類別(空值/P:待授權; M:我的授權; O:其他授權;)
     */
    private continuePendingAuthInq(LastSeq: string, LastMaxSeq: string, Category: string) {
        // 取得指定BodyRq-Data並設定參數
        const request = this.telegram.GetRequstParam('CCMPTX000199Rq');
        request['LastSeq'] = LastSeq;
        request['LastMaxSeq'] = LastMaxSeq;
        request['Category'] = Category;

        let resLastMaxSeq;
        let resContinued;
        let resLastSeq;
        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] != 4001) {
                        // 無法取得待授權資料
                        reject(res);
                    } else {
                        // 取得待授權資料
                        resLastMaxSeq = res['LastMaxSeq'];
                        resContinued = res['Continued'];
                        console.log('[API] pendingAuthInq Continued =', resContinued, ', LastMaxSeq =', resLastMaxSeq);
                        let pendingAuthList = res['PendingAuthList'] ? res['PendingAuthList'] : [];
                        let listLength = pendingAuthList.length;
                        console.log('[API] pendingAuthInq PendingAuthList length =', listLength);
                        this.tempAuth = this.tempAuth.concat(pendingAuthList);

                        if (res['Continued'] == 1) {
                            // 執行接續查詢
                            resLastSeq = pendingAuthList[listLength - 1]['TxnSeq'];
                            console.log('[API] pendingAuthInq last TxnSeq =', resLastSeq);
                            this.continuePendingAuthInq(resLastSeq, resLastMaxSeq, Category).then(
                                (_res) => { resolve(this.tempAuth); },
                                (_err) => { reject(_err); }
                            );
                        } else if (res['Continued'] == 0) {
                            // 終止接續查詢
                            console.log('[API] pendingAuthInq final length =', this.tempAuth.length);
                            resolve(this.tempAuth);
                        } else {
                            // 資料內容不符規格邏輯
                            reject(res);
                        }
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
