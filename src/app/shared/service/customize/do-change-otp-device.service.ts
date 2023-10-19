import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

@Injectable({
  providedIn: 'root'
})
export class DoChangeOtpDeviceService {

  constructor(
    private telegram: TelegramService,
    private popup: PopupService,
    private langTransService: LangTransService
  ) { }

  /**
   * 變更目前使用的裝置為OTP設備的上行電文 CCMPTX000075Rq
   */
  public doChangeOtpDevice() {
    // 取得並設定參數
    let value = {};
    const request = this.telegram.GetRequstParam('CCMPTX000075Rq');
    // Call API
    return new Promise((resolve, reject) => {
      this.telegram.GetRespone(request).then(
        (res) => {
          if (!res || res['Result'] !== 4001) {             
            // 變更OTP設備失敗
            this.popup.setConfirm({
              content: this.langTransService.instant('OTP.DEVICE_CHANGE_INTERNET_CHECK') + '(' + res['Result'] + ')', // 裝置切換失敗，請確認您的網路連線，或稍後再試！！
              event: () => { }
            });
            reject(res);
          } else {
            // 取得成功
            resolve(res);
          }
        }, 
        (err) => {
          this.popup.setConfirm({
            content: this.langTransService.instant('OTP.DEVICE_CHANGE_INTERNET_CHECK') + '(' + err['HeaderRs']['Result'] + ')', // 裝置切換失敗，請確認您的網路連線，或稍後再試！！
          });
          reject(err);                             
        }
      );              
    });
  }
}
