/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { DeviceService } from '../cordova/device.service';
import { networkStateService } from '../cordova/networkState.service';
import { LocalStorageService } from '../global/localStorage.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { Config } from '../../../../assets/configuration/config';
import { LanguageSetting } from '../../../../assets/configuration/languageArea';
import { PreferredLanguageService } from '../cordova/globalization.servics'
import { PushService } from '../cordova/push.service';
import { JsonpModule } from '@angular/http';

@Injectable()
export class StartService {
  public offline = Config.OFFLINE;
  public nativeOpen = Config.NATIVE_OPEN;
  constructor(
    public device: DeviceService,
    public network: networkStateService,
    public storage: LocalStorageService,
    public _preferredLanguageService: PreferredLanguageService,
    public _pushService: PushService,
    public _langTransService: LangTransService
  ) { }

  /**
   * 語系設定
   */
  public setAppLang(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.nativeOpen) {
          this._preferredLanguageService.getPreferredLanguage().then(
          (s) => {
            let langStr = JSON.stringify(s).replace('-','').replace('"','').replace('"','');
            console.log('[StartService-取Device語系] 取得語系成功：', langStr);
            var deviceLang = this.storage.get('Commonlang');
            if (typeof deviceLang != 'undefined' && deviceLang != '')
            {
              console.log('[StartService-取Device語系] 已設定過，直接使用全機語系：',deviceLang);
              resolve(true);
            }else
            {
              console.log('[StartService-取Device語系] 未設定過，設定全機語系：',langStr);
              this.storage.set('Commonlang',langStr);
              deviceLang = this.storage.get('Commonlang');
              this.storage.set('Commonlang',deviceLang.replace('/"/g',''));
              resolve(true);
            }
          },
          (e) => {
            reject('語系取得 error');
          }
        );
      } else {
        var deviceLang = this.storage.get('Commonlang');
        if (deviceLang == null || typeof deviceLang == 'undefined' || deviceLang == '') {
          console.log('[取Device語系] 不使用plugin, 使用zhTW');
          this.storage.set('Commonlang', "zhTW");
        }
        resolve(true);
      }
    });
  }

  /**
   * 裝置初始事件 檢查Device/檢查 網路連線 註冊推播事件
   * @param key 查詢條件
  */
  public AppStart() {
    return new Promise((resolve, reject) => {
      if (this.offline) {
        resolve(true);
        return;
      }
      if (!this.getDeviceInfo(resolve, reject)) {
        return;
      }
      this.registPushToken(resolve, reject);
    });
  }

  private registPushToken(resolve, reject) {
    // 檢查網路連線
    console.log('[StartService-網路連線] 網路連線狀態：', this.network.ConnectStatus()); 
    if (!this.network.IsConnect()) {
      // 無網路狀態時
      console.log('[StartService-推播註冊] 無網路狀態時，終止推播註冊作業');
      resolve(true);
      return;
    }

    const success = (token) => {
      // 推播註冊成功
      console.log('[StartService-推播註冊] 推播註冊成功，Token：', token);
      this.storage.set('pushtoken',token);
      resolve(true);
    };
    const error = (err) => {
      // 推播註冊失敗
      console.log('[StartService-推播註冊] 推播註冊失敗', err);
      reject(err);
    };
    this._pushService.RegistPushToken().then(success, error);
  }

  private getDeviceInfo(resolve, reject) {
    //取得裝置資訊
    var deviceInfo = this.device.getDeviceInfo();
    var devideId = this.device.getDeviceInfo('uuid');
    console.log('[StartService-設備資訊] Check DeviceId', devideId); //檢查Device
    console.log('[StartService-設備資訊] Check DeviceInfo', deviceInfo, JSON.stringify(deviceInfo)); //檢查Device
    if (deviceInfo == undefined || devideId == undefined) {
      reject('[StartService-設備資訊]：deviceInfo / devideId 取得失敗');
      return false;
    }
    this.storage.set('deviceInfo', deviceInfo);
    this.storage.set('devideId', devideId);
    return true;
  }
}
