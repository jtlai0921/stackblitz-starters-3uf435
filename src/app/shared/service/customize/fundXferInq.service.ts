/**
 * 約定轉帳交易查詢
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

@Injectable({
    providedIn: 'root'
  })
export class FundXferInqService {

    constructor(
        public telegram: TelegramService,
        private popup: PopupService,
        private langTransService: LangTransService
    ) { }

    /**
     * [API] 取得約定轉帳交易之上行電文 CCMPTX000196Rq
     * @param requestObj 
     * requsetObj = {
     *  'TxnId': '', 
     *  'PayerAcctNo': '', 轉出帳號X(16)
     *  'PayeeAcctNo': '', 轉入帳號X(16)
     *  'DebitCur': '', 轉出幣別X(3)
     *  'CreditCur': '', 轉入幣別X(3)
     *  'Amount': '', 轉帳金額 9(15,2)總長15含小數點
     *  'Memo': '', 備註X(16)算byte長度
     *  'BankId': '', 轉入行庫X(3)
     *  'TxnType': '', *交易種類X(1) 0:ALL 1:即時/預約 2:預約週期
     *  'PeriodType': '', 期別X(1) M:每月 W:每周
     *  'PeriodValue': '', 期別值9(2) 99:ALL 1-31 (PeriodType=M) 0-6 (PeriodType=W,0=Sunday)
     *  'DateFrom': '', 交易日起日X(8) yyyyMMdd
     *  'DateTo': '', 交易日迄日X(8) yyyyMMdd
     *  'BatchId': '', 交易序號X(36)
     *  'LastBatchId': '' 最後一筆BatchId，當資料有多頁時使用X(36)
     * }
     */
    public getFundXfer(requestObj: Object) {
        // 取得並設定參數
        let value = {};
        const request = this.telegram.GetRequstParam('CCMPTX000196Rq');
        request['PayerAcctNo'] = '';
        request['PayeeAcctNo'] = '';
        request['DebitCur'] = '';
        request['CreditCur'] = '';
        request['Amount'] = '';
        request['Memo'] = '';
        request['BankId'] = '';
        request['TxnType'] = 'ALL';
        request['PeriodType'] = '';
        request['PeriodValue'] = '';
        request['DateFrom'] = '';
        request['DateTo'] = '';
        request['BatchId'] = '';
        request['LastBatchId'] = '';

        // requset['PayerAcctNo'] = requestObj['PayerAcctNo'];
        // requset['PayeeAcctNo'] = requestObj['PayeeAcctNo'];
        // requset['DebitCur'] = requestObj['DebitCur'];
        // requset['CreditCur'] = requestObj['CreditCur'];
        // requset['Amount'] = requestObj['Amount'];
        // requset['Memo'] = requestObj['Memo'];
        // requset['BankId'] = requestObj['BankId'];
        // requset['TxnType'] = requestObj['TxnType'];
        // requset['PeriodType'] = requestObj['PeriodType'];
        // requset['PeriodValue'] = requestObj['PeriodValue'];
        // requset['DateFrom'] = requestObj['DateFrom'];
        // requset['DateTo'] = requestObj['DateTo'];
        // requset['BatchId'] = requestObj['BatchId'];
        // requset['LastBatchId'] = requestObj['LastBatchId'];
    
        // Call API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    if (!res || res['Result'] !== 4001) {
                        // 取得失敗
                        this.popup.setConfirm({
                            content: this.langTransService.instant('DEPOSITDETAIL.POP_ERROR_OTHER') + '(' + res['Result'] + ')', // 無法取得資料，請聯絡客服！
                        });
                        reject(res);
                    } else {
                        // 取得成功
                        resolve(res);
                    }
                }, 
                (err) => {
                    // [ErrorCode:13] 查無資料
                    if (err['HeaderRs']['Result'] === 13) {
                        // 回傳空物件
                        this.popup.setConfirm({
                            content: this.langTransService.instant('DEPOSITDETAIL.POP_ERROR_13'), // 查無資料
                        });
                        resolve(value);                    
                    } else {
                        this.popup.setConfirm({
                            content: this.langTransService.instant('DEPOSITDETAIL.POP_ERROR_OTHER') + '(' + err['HeaderRs']['Result'] + ')', // 無法取得資料，請聯絡客服！
                        });
                        reject(err);
                    }                   
                }
            );              
        });
    }
}
