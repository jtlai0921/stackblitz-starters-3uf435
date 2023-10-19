import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
// using ame2eea.js
declare var ame2eea;

/**
 * [API] E2EE參數查詢服務類別
 */
@Injectable()
export class E2eeParaInqService {

    private oaepHashAlgo = "SHA-1";

    constructor(
        public telegram : TelegramService
    ) {}

    /**
     * 取得E2EE參數 API CCMPTX000216Rq
     * @param Country 登入國別
     */
    public e2eeParaInq(Country:number) {
        // 取得指定BodyRq-Data並設定參數
        const request =  this.telegram.GetRequstParam('CCMPTX000216Rq');
        request['Country'] = Country;

        // 呼叫API
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(request).then(
                (res) => {
                    // 取得end-to-end encryption相關參數
                    resolve(res);
                }, 
                (err) => {
                    reject(err);
                }
            );
        });
    }

    /**
     * 驗證密碼加密演算
     * @param country 國別代碼
     * @param password 密碼明文
     */
    public encryptPin(country, password) {
        return new Promise((resolve, reject) => {
            this.e2eeParaInq(country).then(
                (res) => {
                    // 成功取得E2EE相關參數
                    let e2eeSessionId = res['E2EESessionId'];
                    let e2eePublickey = res['E2EEPublickey'];
                    let e2eeRandNum = res['E2EERandNum'];
                    try {
                        // E2EE演算
                        let rPin = ame2eea.encryptPinForAM(
                            e2eeSessionId,
                            e2eePublickey,
                            e2eeRandNum,
                            password,
                            this.oaepHashAlgo
                        );
                        console.log('[E2EE] encryptPinForAM success', rPin);
                        resolve(res['E2EESessionId'] + "|" + rPin);
                    } catch (e) {
                        console.log('[E2EE] encryptPinForAM error', e);
                        // E2EE演算錯誤
                        reject('e2ee encryptPinForAM error');
                    }
                },
                (err) => {
                    // 無法取得E2EE相關參數
                    reject('e2eeParaInq api error');
                }
            );
        });
    }

    /**
     * 變更密碼加密演算
     * @param country 國別代碼
     * @param oldPassword 舊密碼明文
     * @param newPassword 新密碼明文
     */
    public encryptChangePin(country, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            this.e2eeParaInq(country).then(
                (res) => {
                    // 成功取得E2EE相關參數
                    let e2eeSessionId = res['E2EESessionId'];
                    let e2eePublickey = res['E2EEPublickey'];
                    let e2eeRandNum = res['E2EERandNum'];
                    try {
                        // E2EE演算
                        let rPin = ame2eea.encryptChangePinForAM(
                            e2eeSessionId,
                            e2eePublickey,
                            e2eeRandNum,
                            oldPassword,
                            newPassword,
                            this.oaepHashAlgo
                        );
                        console.log('[E2EE] encryptChangePinForAM success', rPin);
                        resolve(res['E2EESessionId'] + "|" + rPin);
                    } catch (e) {
                        console.log('[E2EE] encryptChangePinForAM error', e);
                        // E2EE演算錯誤
                        reject('e2ee encryptChangePinForAM error');
                    }
                },
                (err) => {
                    // 無法取得E2EE相關參數
                    reject('e2eeParaInq api error');
                }
            );
        });
    }
}
