import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

@Injectable({
  providedIn: 'root'
})
export class AcctSummPlusInqService {

  constructor(
    public telegram: TelegramService,
    private popup: PopupService,
    private langTransService: LangTransService
    ) {

  }

  public loading = true;
  /**
   * 帳戶概要上行電文(一次取回所有關聯戶)
   * @param currency 要檢視的幣別
   */
  public acctSummPlusInq(currency: string) {
    // 取得並設定參數
    let value = {};
    const request = this.telegram.GetRequstParam('CCMPTX000201Rq');
    request["Currency"] = currency;

    // Call API
    return new Promise((resolve, reject) => {
        this.telegram.GetRespone(request).then(
            (res) => {
                if (!res || res['Result'] !== 4001) {
                    reject(res);
                } else {
                    // 取得成功
                    resolve(res);
                }
            }, 
            (err) => {
                    reject(err);
            }
        );              
    });              
  }
}
