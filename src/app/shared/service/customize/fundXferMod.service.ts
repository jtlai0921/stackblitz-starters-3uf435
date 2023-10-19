/**
 * 約定轉帳取消
 */
import { Injectable, NgZone } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { LocalStorageService } from '../global/localStorage.service';
import { PopupService } from '../global/popup.service';
import { WbcService } from '../cordova/wbc.service';
import { HexadecimalService } from '../global/hexadecimal.service';
import { PINBlockService } from '../cordova/pinBlock.service';

@Injectable({
    providedIn: 'root'
})
export class FundXferModService {

    constructor(
        public telegram: TelegramService,
        private zone: NgZone,
        public storage: LocalStorageService,
        public popup: PopupService,
        public pinBlock: PINBlockService,
        public wbc: WbcService,
        public hex: HexadecimalService,
    ) { }

    /**
     * [API] 約定轉帳取消之上行電文 CCMPTX000197Rq
     * @param requestObj 
     * requsetObj = {
     *  'TxnId': '', 
     *  'BatchId': '', 交易序號
     *  'PeriodIdList': [], (1)單筆時可省略 (2)週期時，放入要取消的PeriodId
     *  'Signature': '' IDGATE_SignatureOTP ➔ getBytes(UTF-8)➔Base64 PeriodIdList以PeriodId + | + PeriodId組合，沒有最後一個| 簽章資料為BatchId + | + PeriodIdList組合
     * }
     */
    public getFundXferMod(requestObj: Object) {
        return new Promise((resolve, reject) => {
            // 取得並設定參數
            let requset = {};
            requset = JSON.parse(JSON.stringify(this.telegram.GetRequstParam('CCMPTX000197Rq')));
            if (requestObj.hasOwnProperty('PeriodIdList')) {
                requset['PeriodIdList'] = requestObj['PeriodIdList'];
            }
            requset['BatchId'] = requestObj['BatchId'];
            requset['Signature'] = requestObj['Signature'];
            var AuthType = requestObj['AuthType'];
            var UserPIN = requestObj['UserPIN'];
            if (AuthType == "0") {
                //正常登入
                this.passwordEncrypt(UserPIN).then((res) => {
                    requset['UserPIN'] = res;
                    requset['AuthType'] = +AuthType;
                    this.sendApi(requset).then(resolve, reject);
                });
            } else {
                //快速登入
                var hexString = this.hex.utf8ToHex(UserPIN);
                var keyIndex = this.storage.get("keyIndex");
                this.wbc.encrypt(hexString, keyIndex).then((wbc_res) => {
                    requset['UserPIN'] = this.hex.hextoBase64(wbc_res);
                    requset['AuthType'] = +AuthType;
                    this.zone.run(() => {
                        this.sendApi(requset).then(resolve, reject);
                    })
                }, (wbc_err) => {
                    console.log("wbc_err", wbc_err);
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
    /**
    * 密碼加密
    * * @param password 密碼
    */
    private passwordEncrypt(password) {
        var keyIndex = this.storage.get("keyIndex");
        return new Promise((resolve, reject) => {
            this.pinBlock.pin_block(password).then((res_pinblock) => {
                this.wbc.encrypt(res_pinblock, keyIndex).then((wbc_res) => {
                    resolve(this.hex.hextoBase64(wbc_res));
                }, (wbc_err) => {
                    console.log("wbc_err", wbc_err);
                    this.showMsg("BTN.ERROR");  // 錯誤
                })
            }, (error) => {
                console.log("pin_block_res", error);
                this.showMsg("BTN.ERROR");  // 錯誤
            })
        });
    }
    private showMsg(msg) {
        this.popup.setConfirm({
            content: msg,
            event: () => { }
        });
    }
}
