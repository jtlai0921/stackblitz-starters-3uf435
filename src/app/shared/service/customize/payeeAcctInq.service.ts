/**
 * 裝置資料
 */
import { Injectable, NgZone } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

/**
 * [API] 國內託收票據查詢
 */
@Injectable()
export class PayeeAcctInqService {

    constructor(
        public telegram: TelegramService,
        private langTransService: LangTransService,
        public popup: PopupService,
        
    ) { }

    public payeeAcctInq() {
        const requset = this.telegram.GetRequstParam('CCMPTX000194Rq');
        // Call API
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

    res = {
        "PayeeAcctList": [
            {
                "Country": "TW",
                "CustomerId": "16085840",
                "CustomerType": "C",
                "AcctNo": "123456789",
                "AcctName": "中信",
                "OBUDBU": "Ｏ",
                "FunctionList": "[]",
                "BankCode": "2",
                "BankName": "中國信託",
                "BankCodeType": "2",
                "CurCodeList": ["TWD","USD"],
                "MaxAmt": "10000",
                "ChargeType": "SHA"
            },
            {
                "Country": "TW",
                "CustomerId": "16085840",
                "CustomerType": "C",
                "AcctNo": "123456790",
                "AcctName": "中信",
                "OBUDBU": "Ｏ",
                "FunctionList": "[]",
                "BankCode": "2",
                "BankName": "中國信託",
                "BankCodeType": "2",
                "CurCodeList": ["TWD","USD"],
                "MaxAmt": "20000",
                "ChargeType": "OUR"
            },
            {
                "Country": "TW",
                "CustomerId": "",
                "CustomerType": "P",
                "AcctNo": "123456791",
                "AcctName": "中信",
                "OBUDBU": "Ｏ",
                "FunctionList": "[]",
                "BankCode": "2",
                "BankName": "陳XX",
                "BankCodeType": "2",
                "CurCodeList": ["TWD","USD"],
                "MaxAmt": "30000",
                "ChargeType": "BEN"
            },
            {
                "Country": "TW",
                "CustomerId": "",
                "CustomerType": "P",
                "AcctNo": "123456792",
                "AcctName": "中信",
                "OBUDBU": "Ｏ",
                "FunctionList": "[]",
                "BankCode": "2",
                "BankName": "林XX",
                "BankCodeType": "1",
                "CurCodeList": ["TWD","USD"],
                "MaxAmt": "40000",
                "ChargeType": "SHA"
            }
        ]
    };

}
