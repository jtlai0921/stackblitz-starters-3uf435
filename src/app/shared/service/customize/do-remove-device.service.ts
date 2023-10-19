import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';

@Injectable({
  providedIn: 'root'
})
export class DoRemoveDeviceService {

  constructor(public telegram: TelegramService) {
    
  }

  /**
   * 刪除已註冊設備的上行電文 CCMPTX000012Rq
   * @param deviceData 設備資料，參考getDeviceList說明
   * @param manufacturer 製造商
   * @param model 型號
   * @param deviceId 設備識別碼
   * @param appId APP代碼
   */
  public doRemoveDevice(deviceData: String, manufacturer: String, model: String, deviceId: String, appId: String) {
    // 取得並設定參數
    const requset = this.telegram.GetRequstParam('CCMPTX000012Rq');
    requset['DeviceData'] = deviceData;
    requset['Manufacturer'] = manufacturer;
    requset['Model'] = model;
    requset['DeviceId'] = deviceId;
    requset['AppId'] = appId;

    // Call API
    return this.telegram.GetRespone(requset);
  }
}
