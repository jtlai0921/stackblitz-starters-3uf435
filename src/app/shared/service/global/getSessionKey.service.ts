import { Injectable } from '@angular/core';
import { DeviceService } from '../cordova/device.service';
import { LocalStorageService } from './localStorage.service';
import { Config } from '../../../../assets/configuration/config';
import { SecurytyService } from './security.service';
import { DateTimeService } from './daettime.service';
import { Http, Response } from '@angular/http';
import { GetWayUrlService } from './getwayUrl.service';
import { WbcService } from '../cordova/wbc.service';
import { HexadecimalService } from './hexadecimal.service';
import { PopupService } from '../global/popup.service';
import { networkStateService } from '../../service/cordova/networkState.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';

/**
 * SessionKey服務
 */
@Injectable()
export class GetSessionKeyService {

  constructor(
    private http: Http,
    public storage: LocalStorageService,
    public security: SecurytyService,
    public dateformat: DateTimeService,
    public device: DeviceService,
    public geturl: GetWayUrlService,
    public wbc: WbcService,
    public hex: HexadecimalService,
    public popup: PopupService,
    public network:networkStateService,
    public langTrans:LangTransService
  ) {
  }
  private sessionKey = '';
  private keyIndex = '';

  /**
   * 取得SessionKey
   * @param key 查詢條件
   */
  public getKey() {
    console.log('[GetSessionKeyService] getKey', this.sessionKey);
    return new Promise((resolve, reject) => {
      if (this.sessionKey != '') {
        resolve(this.sessionKey);
      } else {
        this.initEvent().then((res) => {
          resolve(this.sessionKey);
        }, (error) => {
          reject(error);
        });
      }
    });
  }
  /**
   * 重新取得取得SessionKey
   * @param key 查詢條件
   */
  public RegetKey() {
    this.sessionKey = '';
    return new Promise((resolve, reject) => {
      //加入驗證網路是否通
      if (!this.network.IsConnect()) {
        reject({ ResultMsg: this.langTrans.instant('BTN.NET_ERROR') });
      }
      this.initEvent().then((res) => {
        resolve(res);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
  * 取得KeyIndex
  */
  public getKeyIndex() {
    console.log('[GetSessionKeyService] getKeyIndex', this.keyIndex);
    return new Promise((resolve, reject) => {
      if (this.keyIndex != '') {
        resolve(this.keyIndex);
      } else {
        this.initEvent().then((res) => {
          resolve(this.keyIndex);
        }, (error) => {
          reject(error);
        });
      }
    });
  }

  public setKey(sessionKey) {
    this.sessionKey = sessionKey;
    if (Config.OFFLINE) {
      return;
    }
    console.log('[GetSessionKeyService] setKey', this.sessionKey);
    const error = (err) => { };
    const success = (res) => { };
    this.decryptSessionKey(sessionKey).then(success, error);
  }
  public setKeyIndex(keyIndex) {
    this.keyIndex = keyIndex;
    this.storage.set("keyIndex", this.keyIndex.toString());
    console.log('[GetSessionKeyService] setKeyIndex', this.keyIndex);
  }
  /**
   * 初始事件
   */
  private initEvent() {

    return new Promise((resolve, reject) => {
      const apiReq = this.getRequest('CCMPTX000001Rq');
      if (!Config.OFFLINE) {

        this.geturl.getUrl().then(
          (baseUrl: string) => {
            console.log('[GetSessionKeyService POST]', baseUrl, apiReq);
            this.http.post(baseUrl, apiReq).toPromise().then(
              (res: Response) => {
                try {
                  console.log('[GetSessionKeyService] GetSessionKey Responese Success', res);
                  const resultJson = res.json();
                  if (resultJson['HeaderRs']['Result'] === 4001) {
                    let resStr = resultJson['BodyRs']['Data'];
                    let KeyObj = JSON.parse(this.security.Base64Decode(resStr));

                    // 儲存keyIndex值
                    this.setKeyIndex(KeyObj['KeyIndex'])
                    let timeOffSet = KeyObj['TimeOffSet'];
                    //處理時間
                    if (timeOffSet > 60000 || timeOffSet < -60000) {
                      this.popup.setConfirm({
                        content: this.langTrans.instant("ERROR.ERROR_time"), // 校正時間
                        event: () => { }
                      });
                    }
                    this.decryptSessionKey(KeyObj['SessionKey']).then(resolve, reject);
                  } else {
                    //Error Handle
                    console.log('[GetSessionKeyService] GetSessionKey Responese Fail', resultJson);
                    reject(res);
                  }
                } catch (catchError) {
                  console.error("[GetSessionKeyService] catchError", catchError)
                  reject({ "HeaderRs": { "Result": "reject" } })
                }
              },
              (error: Response) => {
                try {
                  console.log('[GetSessionKeyService] GetSessionKey Responese Error', error.json());
                  reject(error.json())
                } catch (catchError) {
                  console.error("[GetSessionKeyService] catchError", catchError)
                  reject({ "HeaderRs": { "Result": "reject" } })
                }
              }
            );
          }, (_error) => {
            console.log('[GetSessionKeyService] GetWayUrl Error', _error);
            reject(_error);
          }
        );


      } else {
        this.sessionKey = "h8ozN9p25c/HQWqa+Isej2PlX4WODbBzccpqzdok0u8=";
        this.keyIndex = "12345678";
        resolve(this.sessionKey);
      }
    });
  }

  private getRequest(requestId: string) {
    let pushtoken = this.storage.get("pushtoken");
    let bodyRqData = {};
    bodyRqData['TxnId'] = requestId;
    bodyRqData['PushToken'] = pushtoken;
    bodyRqData['APPVersion'] = this.device.getDeviceInfo('appinfo')['version'];
    bodyRqData['ContentVersion'] = Config.WWW_VERSION;

    let BodyRq = this.security.Base64Encode(JSON.stringify(bodyRqData));
    let timeFormat = this.dateformat.datetimeFormat(Date.now(), 'yyyyMMddhhmmss')

    let apiRequest = {
      "HeaderRq": {
        "Type": 0,
        "AppId": "MPASS",
        "Manufacturer": this.device.getDeviceInfo('manufacturer'),
        "Model": this.device.getDeviceInfo('model'),
        "DeviceId": this.device.getDeviceInfo('uuid'),
        "TxnId": requestId,
        "Language": 0,
        "Timestamp": timeFormat,
        "RqUID": timeFormat,
        "Version": "2"
      },
      "BodyRq": {
        "DataType": 0,
        "Data": BodyRq
      }
    };
    return apiRequest;
  }


  private decryptSessionKey(sessionKey) {
    return new Promise((resolve, reject) => {
      // sessionKey密文字串編碼由Base64轉換為Hex
      let hexKeyCipher = this.hex.base64toHex(sessionKey);
      console.log('[GetSessionKeyService] [sessionKey cipher] Hex', hexKeyCipher);
      // 呼叫WBC演算解密sessionKey密文
      this.wbc.decrypt(hexKeyCipher, +this.keyIndex).then(
        (wbc_res: string) => {
          console.log('[GetSessionKeyService] [WBC decrypt] result', wbc_res);
          // WBC解密成功
          /**
          * 2018/07/19 ArnoChang
          * SessionKey數據經WEB解密後之處理：
          * 1) 截取解密明文前128個字元，即去除填充字元
          * 2) 前項字串以Hexadecimal編碼解碼
          * 3) 前項位元組陣列以UTF-8編碼字串化
          */
          let keyHex_1 = wbc_res.substr(0, 128);
          console.log('[GetSessionKeyService] [sessionKey] hex_1', keyHex_1);
          let keyHex_2 = this.hex.hexToUtf8(keyHex_1);
          console.log('[GetSessionKeyService] [sessionKey] hex_2', keyHex_2);
          // sessionKey字串編碼由Hex轉換成Base64並儲存
          this.sessionKey = this.hex.hextoBase64(keyHex_2);
          console.log('[GetSessionKeyService] [sessionKey] Base64', this.sessionKey);
          this.storage.set('SessionKey', this.sessionKey);
          resolve(this.sessionKey);
        },
        (wbc_err) => {
          // WBC解密失敗
          console.warn('[GetSessionKeyService] [WBC decrypt] error', wbc_err);
          reject(wbc_err);
        }
      );
    })

  }
}
