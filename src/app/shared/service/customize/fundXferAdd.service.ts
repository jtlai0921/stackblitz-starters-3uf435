import { Injectable, NgZone } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';
import { PopupService } from '../global/popup.service';
import { WbcService } from '../cordova/wbc.service';
import { HexadecimalService } from '../global/hexadecimal.service';
import { PINBlockService } from '../cordova/pinBlock.service';
import { E2eeParaInqService } from './e2eeParaInq.service';
import { Config } from '../../../../assets/configuration/config';

@Injectable()
export class FundXferAddService {

    constructor(
        private zone: NgZone,
        public telegram: TelegramService,
        public router: Router,
        public routeAct: ActivatedRoute,
        public storage: LocalStorageService,
        public popup: PopupService,
        public pinBlock: PINBlockService,
        public wbc: WbcService,
        public hex: HexadecimalService,
        public e2ee: E2eeParaInqService
    ) {

    }

    /**
    * 密碼加密
    * * @param password 密碼
    */
    private passwordEncrypt(password) {
        var keyIndex = this.storage.get("keyIndex");
        let country = this.storage.get("Area");
        /*
         * 2019/04/25 ArnoChang
         * 固定密碼加密流程調整：
         * 新增End-to-End Encryption演算處理
         * 保留PIN Block處理用於緩衝過渡期
         * 兩者不相互影響，由獨立之電文欄位上傳
         */
        return Promise.all([
            // PINBlock + WBC
            new Promise((resolve, reject) => {
                // 啟用舊版加密
                if (Config.pinBlockEncryption) {
                    // PINBlock處理
                    this.pinBlock.pin_block(password).then(
                        (pinBlock_res) => {
                            console.log('[FundXferAddService] passwordEncrypt PINBlock success', pinBlock_res);
                            // WBC加密演算處理
                            this.wbc.encrypt(pinBlock_res, keyIndex).then(
                                (wbc_res) => {
                                    console.log('[FundXferAddService] passwordEncrypt PINBlock WBC success');
                                    // 回傳密碼密文
                                    resolve({ pinBlock: this.hex.hextoBase64(wbc_res) });
                                }, 
                                (wbc_err) => {
                                    console.log('[FundXferAddService] passwordEncrypt PINBlock WBC error', wbc_err);
                                    reject("PINBlock WBC-Encrypting failed");
                                }
                            );
                        }, 
                        (pinBlock_err) => {
                            console.log('[FundXferAddService] passwordEncrypt PINBlock error', pinBlock_err);
                            reject("PINBlock-Encrypting failed");
                        }
                    );
                } 
                // 不啟用舊版加密
                else {
                    // 回傳空值
                    resolve({ pinBlock: "" });
                }
            }),
            // E2EE + WBC
            new Promise((resolve, reject) => {
                console.log('[FundXferAddService] passwordEncrypt E2EE country =', country);
                // E2EE加密演算處理
                this.e2ee.encryptPin(country, password).then(
                    (e2ee_res) => {
                        console.log('[FundXferAddService] passwordEncrypt E2EE success', e2ee_res);
                        let plainText = this.hex.utf8ToHex(e2ee_res);
                        // WBC加密演算處理
                        this.wbc.encrypt(plainText, keyIndex).then(
                            (wbc_res) => {
                                console.log('[FundXferAddService] passwordEncrypt E2EE WBC success');
                                // 回傳密碼密文
                                resolve({ e2ee: this.hex.hextoBase64(wbc_res) });
                            },
                            (wbc_err) => {
                                console.log('[FundXferAddService] passwordEncrypt E2EE WBC error', wbc_err);
                                reject("E2EE WBC-Encrypting failed");
                            }
                        );
                    },
                    (e2ee_err) => {
                        console.log('[FundXferAddService] passwordEncrypt e2ee error', e2ee_err);
                        reject("E2EE-Encrypting failed");
                    }
                );
            })
        ]);
    }
    private showMsg(msg) {
        this.popup.setConfirm({
            content: msg,
            event: () => { }
        });
    }



    public fundXferAdd(reqObject, Password: string, AuthType: string) {
        return new Promise((resolve, reject) => {
            // 取得並設定參數
            const requset = this.telegram.GetRequstParam('CCMPTX000195Rq');
            Object.keys(reqObject).forEach(key => {
                console.log(reqObject[key]);
                console.log(reqObject[key].length);
                requset[key] = reqObject[key];
            });
            
            if (AuthType == "0") {
                //正常登入
                this.passwordEncrypt(Password).then(
                    (encrypted_success) => {
                        console.log('password-encryption all promises success', encrypted_success);
                        encrypted_success.forEach(data => {
                            if (data.hasOwnProperty("pinBlock"))
                                requset['UserPIN'] = data['pinBlock'];
                            if (data.hasOwnProperty("e2ee"))
                                requset['UserPINE2EE'] = data['e2ee'];
                        });
                        requset['AuthType'] = +AuthType;
                        this.sendApi(requset).then(resolve, reject);
                    }, 
                    (encrypted_error) => {
                        console.log('password-encryption any promises error:', encrypted_error);
                        // 控制關閉Loading畫面
                        this.popup.setLoading(false);
                        // 顯示錯誤訊息
                        this.showMsg("LOGINOUT.ERROR_ENCRYPT_PWD_FAILED");
                    }
                );
            } else {
                //快速登入
                var hexString = this.hex.utf8ToHex(Password);
                var keyIndex = this.storage.get("keyIndex");
                this.wbc.encrypt(hexString, keyIndex).then((wbc_res) => {
                    requset['UserPIN'] = this.hex.hextoBase64(wbc_res);
                    requset['AuthType'] = +AuthType;
                    this.zone.run(() => {
                        this.sendApi(requset).then(resolve, reject);
                    })
                }, (wbc_err) => {
                    console.log("wbc_err", wbc_err);
                    // 控制關閉Loading畫面
                    this.popup.setLoading(false);
                    this.showMsg("BTN.ERROR"); // 錯誤
                })
            }
        })
    }
    sendApi(requset) {
        //打api 若需重複取得資料 邏輯加在這邊!
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(requset).then(
                (res) => {
                    resolve(res);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
}
