import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

/**
 * [API] 放款明細查詢服務類別
 */
@Injectable()
export class LoanAcctDetailsInqService {

  constructor(public telegram: TelegramService) { 
    
  }

  /**
   * 查詢放款明細 API CCMPTX000200Rq
   * @param Currency 幣別
   * @param Country 帳戶國別
   * @param CustomerId 帳戶統編
   * @param OBUDBU D:DBO; O:OBU
   * @param AcctNo 帳號
   * @param HostType 資料來源
   */
  public LoanAcctDetailsInq(Currency:string, Country:string, CustomerId:string, OBUDBU:string, AcctNo:string, HostType:string) {
    // 取得並設定參數
    const request = this.telegram.GetRequstParam('CCMPTX000200Rq');
    request["Currency"] = Currency;
    request["Country"] = Country;
    request["CustomerId"] = CustomerId;
    request["OBUDBU"] = OBUDBU;
    request["AcctNo"] = AcctNo;
    request["HostType"] = HostType;

    // Call API
    return new Promise((resolve, reject) => {
      this.telegram.GetRespone(request).then(
        (res) => {
          if (!res || res['Result'] != 4001) {
            // 取得放款明細結果失敗
            reject(res);
          } else {
            // 取得放款明細結果成功
            resolve(res);
          }
        },
        (err) => {
          // 取得放款明細時發生錯誤
          reject(err);
        }
      );
    });
  }
}
