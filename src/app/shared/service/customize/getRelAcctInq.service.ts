/**
 * 關聯帳戶查詢
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

/**
 * [API]
 */
@Injectable()
export class GetRelAcctInqService {

    constructor(
        public telegram: TelegramService,
        private langTransService: LangTransService,
        public popup: PopupService
    ) { }

    /**
     * 取得關聯帳戶查詢 CCMPTX000193Rq
     */
    public getRelAcctInq() {
        //取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000193Rq');
        //打api
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(requset).then(
                (res) => {
                    if (!res || (res['Result'] !== 4001 && res['Result'] !== 0)) {
                        // 取得失敗
                        this.popup.setConfirm({
                            content: this.langTransService.instant('AGREEDACCOUNT.POP_ERROR_OTHER') + '(' + res['Result'] + ')', // 無法取得資料，請聯絡客服！
                        });
                        reject(res);
                    } else {
                        // 取得成功
                        resolve(res);
                    }
                }, 
                (err) => {
                    // 特殊錯誤
                    if (typeof err['HeaderRs']['Result'] === "string") {
                        // 回傳空物件
                        this.popup.setConfirm({
                            content: err['HeaderRs']['Result']
                        });
                        reject(err);              
                    } else {
                        this.popup.setConfirm({
                            content: this.langTransService.instant('AGREEDACCOUNT.POP_ERROR_OTHER') + '(' + err['HeaderRs']['Result'] + ')', // 無法取得資料，請聯絡客服！
                        });
                        reject(err);
                    }                   
                }
            );  
        });
    }

    modify(data) {

        let country = {};

        data['AcctList'].forEach(item => {
            switch (item.AcctType) {
                case 'S':
                    item['AcctTypeCH'] = '活存';
                    item['AcctTypeNum'] = '1';
                    break;

                case 'C':
                    item['AcctTypeCH'] = '支存';
                    item['AcctTypeNum'] = '3';
                    break;

                case 'T':
                    item['AcctTypeCH'] = '定存';
                    item['AcctTypeNum'] = '2';
                    break;

                case 'SD':
                    item['AcctTypeCH'] = '結構型';
                    item['AcctTypeNum'] = '4';
                    break;

                case 'SE':
                    break;

                case 'L':
                    break;

                case 'O':
                    break;

                case 'OD':
                    break;

                default:
                    break;
            }

            if (country[item.Country] == undefined) {
                country[item.Country] = [item];
            } else {
                country[item.Country].push(item);
            }

        });

        data['AcctList'] = data['AcctList'].sort(function (a, b) {
            if (a.Country === b.Country) {
                if (a.CustomerId === b.CustomerId) {
                    if (a.AcctNo === b.AcctNo) {
                        return a.AcctTypeNum - b.AcctTypeNum;
                    }
                    return a.AcctNo > b.AcctNo ? 1 : -1;
                }
                return a.CustomerId > b.CustomerId ? 1 : -1;
            }
            return a.Country > b.Country ? 1 : -1;
        });


        return data;
    }

}
