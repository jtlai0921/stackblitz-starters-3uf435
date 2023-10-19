import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable({
  providedIn: 'root'
})
export class LoanSummInqService {
  public loading = true;
  constructor(private telegram: TelegramService) { 
    
  }
  
  /**
   * 取得放款明細
   * @param currency 要檢視的幣別
   */
  public loanSummInq(currency: string) {
    // 取得並設定參數
    const requset = this.telegram.GetRequstParam('CCMPTX000188Rq');
    requset["Currency"] = currency;

    // Call API
    return this.telegram.GetRespone(requset);
  }
}
