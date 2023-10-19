import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable({
  providedIn: 'root'
})
export class GetDeviceUserListService {

  constructor(public telegram: TelegramService) {

  }

  /**
   * 查詢與設備綁定的使用者清單之上行電文 CCMPTX000185Rq
   */
  public getDeviceUserList(test:string) {
    // 取得並設定參數
    //取得並設定參數
    const requset =  this.telegram.GetRequstParam(test);
    requset['TxnId'] = test;
    
    // Call API
    return this.telegram.GetRespone(requset);
  }
}
