import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

@Injectable({
  providedIn: 'root'
})
export class GetDeviceListService {

  constructor(
    public telegram: TelegramService,
    private popup: PopupService,
    private langTransService: LangTransService,
  ) {

  }

  /**
   * 取得使用者所有註冊的設備列表 CCMPTX000011Rq
   */
  public getDeviceList() {
    // 取得並設定參數
    let value = {};
    const requset = this.telegram.GetRequstParam('CCMPTX000011Rq');
    // Call API
    return new Promise((resolve, reject) => {
      this.telegram.GetRespone(requset).then(
          (res) => {
              if (!res || res['Result'] !== 4001) {
                  // 取得失敗
                  this.popup.setConfirm({
                      content: this.langTransService.instant('DEVICE_MANAGE.POP_ERROR_OTHER') + '(' + res['Result'] + ')', // 無法取得資料，請聯絡客服！
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
                      content: this.langTransService.instant('DEVICE_MANAGE.POP_ERROR_13'), // 查無資料
                  });
                  resolve(value);                    
              } else {
                  this.popup.setConfirm({
                      content: this.langTransService.instant('DEVICE_MANAGE.POP_ERROR_OTHER') + '(' + err['HeaderRs']['Result'] + ')', // 無法取得資料，請聯絡客服！
                  });
                  reject(err);
              }                   
          }
      );              
  });
  }
}
