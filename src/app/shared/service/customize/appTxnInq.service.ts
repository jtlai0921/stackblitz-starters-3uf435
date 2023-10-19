import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable({
  providedIn: 'root'
})
export class AppTxnInqService {

  constructor(
    private telegram: TelegramService,
  ) {

  }

  /**
   * CCMPTX000205Rq
   * APP交易紀錄查詢
   * @param requestParameter 查詢參數
   * - txnCode APP交易紀錄查詢 (ALL：所有類型, SDT：單筆約轉, PDT：週期約轉, LRT：國內轉帳, FRT：國外轉帳, INT：自行轉帳)
   * - dateFrom 查詢交易日起日 yyyyMMdd
   * - dateTo 查詢交易日迄日 yyyyMMdd
   * - txnStatus 交易狀態
   * - payerId 付款人統編
   * - payerAcct 付款帳號
   * - txnCur 交易幣別
   * - payeeId 收款人統編
   * - payeeAcct 收款人帳號
   * - txnNo 交易序號，可使用* (wildcard)
   * - cacheId 暫存資料序號，若使用了此欄位，將不理會上列查詢條件
   * - lastTxnNo 配合CacheId使用，無值時，由暫存查詢結果的第一筆輸出
   * - lastTxnCode 配合CacheId使用，LastTxnNo有值時，此欄位也必定要有值
   */
  public appTxnInq(requestParameter) {
    // 取得並設定參數
    const requset = this.telegram.GetRequstParam('CCMPTX000205Rq');
    for (const key of Object.keys(requestParameter)) {
      requset[key] = requestParameter[key];
    }

    // Call API
    return this.telegram.GetRespone(requset);
  }
}
