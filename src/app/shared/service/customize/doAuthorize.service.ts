import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { LocalStorageService } from '../global/localStorage.service';
import { IDGateService } from '../cordova/IdGete.service';
import { PINBlockService } from '../cordova/pinBlock.service';
import { HexadecimalService } from '../global/hexadecimal.service';
import { WbcService } from '../cordova/wbc.service';
import { DeviceService } from '../cordova/device.service';
import { E2eeParaInqService } from './e2eeParaInq.service';
import { Config } from '../../../../assets/configuration/config';

/**
 * [API] 交易授權服務類別
 */
@Injectable()
export class DoAuthorizeService {

    constructor(
        public telegram: TelegramService,
        public storage: LocalStorageService,
        public idGate: IDGateService,
        public pinBlock: PINBlockService,
        public hex: HexadecimalService,
        public wbc: WbcService,
        public device: DeviceService,
        public e2ee: E2eeParaInqService
    ) { }

    /**
     * 授權交易 API CCMPTX000015Rq
     * @param ChannelId 通路識別碼
     * @param TxnNo 交易識別碼
     * @param ValueDate 交易日期(yyyyMMdd)
     * @param AuthLevel 授權層級
     * @param Action 動作(0:approve; 1:reject; 2:approve overdue transaction)
     * @param Reason 退件原因
     * @param AuthType 使用者驗證模式
     * @param UserPIN 使用者登入密碼
     * @param OverDueDate 逾期授權交易日期(yyyyMdd)
     */
    public doAuthorize(ChannelId: string, TxnNo: string, ValueDate: number, AuthLevel: number, Action: number, Reason: string, AuthType: string, UserPIN: string, OverDueDate: string) {
        // 取得指定BodyRq-Data並設定參數
        const request = this.telegram.GetRequstParam('CCMPTX000015Rq');
        request['ChannelId'] = ChannelId;
        request['TxnNo'] = TxnNo;
        request['ValueDate'] = ValueDate;
        request['AuthLevel'] = AuthLevel;
        request['Action'] = Action;
        // 原因為空值時，預設輸入一個空白字元
        request['Reason'] = (!Reason || Reason == "") ? " " : Reason;
        request['AuthType'] = +AuthType;
        request['OverDueDate'] = OverDueDate;

        return new Promise((resolve, reject) => {
            // 取得密碼值
            this.getUserPIN(UserPIN, AuthType).then(
                (userPin_res) => {
                    userPin_res.forEach(userPin => {
                        // 快速驗證密文
                        if (userPin.hasOwnProperty("quick"))
                            request['UserPIN'] = userPin['quick'];
                        // 舊制密碼密文
                        if (userPin.hasOwnProperty("pinBlock"))
                            request['UserPIN'] = userPin['pinBlock'];
                        // 新制密碼密文
                        if (userPin.hasOwnProperty("e2ee"))
                            request['UserPINE2EE'] = userPin['e2ee'];
                    });
                    // 取得簽章值
                    this.getSignValue(ChannelId, TxnNo, AuthLevel, Action).then(
                        (signValue_res) => {
                            request['SignValue'] = signValue_res;
                            // 呼叫API
                            this.telegram.GetRespone(request).then(
                                // TODO: 確認交易授權失敗時的error code儲存在header? body?
                                (res) => {
                                    if (!res || res['Result'] != 4001) {
                                        // 授權交易操作失敗
                                        reject(res);
                                    } else {
                                        // 授權交易操作成功
                                        resolve(res);
                                    }
                                },
                                (err) => {
                                    reject(err);
                                }
                            );
                        },
                        (signValue_err) => {
                            reject(signValue_err);
                        }
                    );
                },
                (userPin_err) => {
                    reject(userPin_err);
                }
            );
        });
    }

    /**
     * 產生簽章值
     * @param channelId 通路識別碼
     * @param txnNo 交易識別碼
     * @param authLevel 授權層級
     * @param action 動作(0:approve; 1:reject; 2:approve overdue transaction)
     */
    private getSignValue(channelId: string, txnNo: string, authLevel: number, action: number) {
        /**
         * 2018/11/12 ArnoChang
         * 簽章值規格說明
         * (1) [普通授權操作] 原始資料字串[data]：channelId + "|" + txnNo + "|" + authLevel
         *     [逾期授權操作] 原始資料字串[data]："B|" + channelId + "|" + txnNo + "|" + authLevel
         * (2) 呼叫iDGate Plugin函式：generateSignatureOTP(data)
         * (3) 回傳值格式：OTP[7],ESN[6],UTC[yyyyMMddhhmmss]
         */

        let data;
        if (action == 2)
            data = "B|" + channelId + "|" + txnNo + "|" + authLevel;
        else
            data = channelId + "|" + txnNo + "|" + authLevel;
        console.log('[DoAuthorizeService] getSignValue data =', data);

        return new Promise((resolve, reject) => {
            this.idGate.genSignatureOTP(data).then(
                (idGate_res) => {
                    console.log('[DoAuthorizeService] getSignValue sign =', idGate_res);
                    resolve(idGate_res);
                },
                (idGate_err) => {
                    console.log('[DoAuthorizeService] getSignValue error', idGate_err);
                    reject(idGate_err);
                }
            );
        });

    }

    /**
     * 產生登入密碼加密值
     * @param userPIN 使用者登入密碼
     * @param authType 密碼驗證模式
     */
    private getUserPIN(userPIN: string, authType: string) {
        /*
         * 2018/11/12 ArnoChang
         * 密碼值規格說明
         * [快速交易驗證模式]
         * (1) 呼叫iDGate Plugin函式：generateSignatureOTP(deviceId)
         * (2) 上述結果經WBC加密演算
         * (3) 密文字串重新以Base64編碼輸出
         * 
         * [手動輸入密碼模式]
         * (1) 原始密碼字串經PINBlock處理
         * (2) 上述結果經WBC加密演算
         * (3) 密文字串重新以Base64編碼輸出
         * 
         * 
         * 2019/04/24 ArnoChang
         * 手動輸入密碼模式增加新制加密演算法
         * [舊制] 原始密碼字串經PINBlock處理
         * [新制] 原始密碼字串以E2EE加密演算處理
         */
        if (authType !== "0") {
            console.log('[DoAuthorizeService] getUserPIN 快速交易驗證模式');
            // 快速交易驗證模式
            return new Promise<Array<object>>((resolve, reject) => {
                this.idGate.generateSignatureOTP().then(
                    (idGate_res) => {
                        console.log('[DoAuthorizeService] getUserPIN idGate signOTP =', idGate_res);
                        var hexString = this.hex.utf8ToHex(idGate_res);
                        var keyIndex = this.storage.get("keyIndex");
                        this.wbc.encrypt(hexString, keyIndex).then((wbc_res) => {
                            console.log('[DoAuthorizeService] getUserPIN idGate WBC cipher_hex =', wbc_res);
                            let cipher = this.hex.hextoBase64(wbc_res);
                            console.log('[DoAuthorizeService] getUserPIN idGate WBC cipher_base64 =', cipher);
                            resolve([{ quick: cipher }]);
                        }, (wbc_err) => {
                            console.log('[DoAuthorizeService] getUserPIN WBC error', wbc_err);
                            reject(wbc_err);
                        })
                    },
                    (idGate_err) => {
                        console.log('[DoAuthorizeService] getUserPIN idGate error', idGate_err);
                        reject(idGate_err);
                    }
                );
            });
        } else {
            console.log('[DoAuthorizeService] getUserPIN 手動輸入密碼模式');
            let keyIndex = this.storage.get('keyIndex');
            // 手輸密碼驗證模式
            return Promise.all([
                // PINBlock + WBC
                new Promise((resolve, reject) => {
                    // 啟用舊版加密
                    if (Config.pinBlockEncryption) {
                        // PINBlock處理
                        this.pinBlock.pin_block(userPIN).then(
                            (pinBlock_res) => {
                                console.log('[DoAuthorizeService] getUserPIN PINBlock success', pinBlock_res);
                                // WBC加密演算處理
                                this.wbc.encrypt(pinBlock_res, keyIndex).then(
                                    (wbc_res) => {
                                        console.log('[DoAuthorizeService] getUserPIN PINBlock WBC success');
                                        console.log('[DoAuthorizeService] getUserPIN PINBlock WBC cipher_hex =', wbc_res);
                                        let cipher = this.hex.hextoBase64(wbc_res);
                                        console.log('[DoAuthorizeService] getUserPIN PINBlock WBC cipher_base64 =', cipher);
                                        // 回傳密碼密文
                                        resolve({ pinBlock: cipher });
                                    },
                                    (wbc_err) => {
                                        console.log('[DoAuthorizeService] getUserPIN PINBlock WBC error', wbc_err);
                                        reject("PINBlock WBC-encrypting failed");
                                    }
                                );
                            },
                            (pinBlock_err) => {
                                console.log('[DoAuthorizeService] getUserPIN PINBlock error', pinBlock_err);
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
                    // 取得登入國家代碼
                    let country = this.storage.get("Area");
                    console.log('[DoAuthorizeService] getUserPIN E2EE country =', country);
                    // E2EE加密演算處理
                    this.e2ee.encryptPin(country, userPIN).then(
                        (e2ee_res) => {
                            console.log('[DoAuthorizeService] getUserPIN E2EE success', e2ee_res);
                            let plainText = this.hex.utf8ToHex(e2ee_res);
                            // WBC加密演算處理
                            this.wbc.encrypt(plainText, keyIndex).then(
                                (wbc_res) => {
                                    console.log('[DoAuthorizeService] getUserPIN E2EE WBC success');
                                    console.log('[DoAuthorizeService] getUserPIN E2EE WBC cipher_hex =', wbc_res);
                                    let cipher = this.hex.hextoBase64(wbc_res);
                                    console.log('[DoAuthorizeService] getUserPIN E2EE WBC cipher_base64 =', cipher);
                                    // 回傳密碼密文
                                    resolve({ e2ee: cipher });
                                },
                                (wbc_err) => {
                                    console.log('[DoAuthorizeService] getUserPIN E2EE WBC error', wbc_err);
                                    reject("E2EE WBC-Encrypting failed");
                                }
                            );
                        },
                        (e2ee_err) => {
                            console.log('[DoAuthorizeService] getUserPIN E2EE error', e2ee_err);
                            reject("E2EE-Encrypting failed");
                        }
                    );
                }),            
            ]); 
        }
    }

}
