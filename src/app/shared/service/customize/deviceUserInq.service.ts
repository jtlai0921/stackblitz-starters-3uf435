import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { TelegramService } from '../../telegram/telegram.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

/**
 * [API] 裝置之所有綁定使用者查詢服務類別
 */
@Injectable()
export class DeviceUserInqService {
  
    constructor(
        private telegram: TelegramService,
        private router: Router,
        private location: Location,
        private storage: LocalStorageService,
        private popup: PopupService,
        private langTransService: LangTransService
    ) {}
                
    deviceUserList: any;
    
    /**
     * 查詢與設備綁定的使用者清單 CCMPTX000185Rq
     */
    public deviceUserInq() {
        let value = {};
        return new Promise((resolve, reject) => {
            const requset =  this.telegram.GetRequstParam('CCMPTX000185Rq');
            this.telegram.GetRespone(requset).then(
                (res) => {
                    if (!res['UserDataList'] || res['Result'] !== 4001) {
                        // 取得失敗
                        this.errorMessage('', res);                        
                        reject(res);
                    } else {
                        // 取得成功
                        if(res['UserDataList'].length === 0){
                            this.errorMessage('empty');
                        } else {
                            this.deviceUserList = res['UserDataList'];
                        }                        
                        resolve(this.deviceUserList);
                    }
                }, 
                (err) => {
                    // [ErrorCode:13] 查無資料
                    if (err['HeaderRs']['Result'] === 13) {
                        this.errorMessage('empty');                        
                        // 回傳空物件                       
                        resolve(value);                    
                    } else {
                        this.errorMessage('failed', err);                        
                        reject(err);
                    }                   
                }
            );              
        });
    }

    /**
     * 錯誤通知訊息
     */
    private errorMessage(type: string, err?: any) {
        if (type === 'empty') {
            this.popup.setConfirm({
                content: this.langTransService.instant('OTP.POP_ERROR_13'), // 查無資料
                event: () => {
                    this.errorRouter();
                }
            });
        } else if (type === 'failed'){
            this.popup.setConfirm({
                content: this.langTransService.instant('OTP.POP_ERROR_OTHER') + '(' + err['HeaderRs']['Result'] + ')', // 無法取得資料，請聯絡客服！
                event: () => {
                    this.errorRouter();
                }
            });
        } else {
            this.popup.setConfirm({
                content: this.langTransService.instant('OTP.POP_ERROR_OTHER') + '(' + err['Result'] + ')', // 無法取得資料，請聯絡客服！
                event: () => {
                    this.errorRouter();
                }
            });
        }
    }

    /**
     * 錯誤通知訊息 導頁控制
     */
    private errorRouter() {
        let loginStatus = this.storage.get('isLogin');
        if(loginStatus) {
            this.location.back()
        } else {
            this.router.navigate(['/login']);
        }  
    }

    public IsOneUser(){
        if(!this.checkHasValue()){
            return false;
        }else if(this.deviceUserList.length == 1){
            return true;
        }
        return false;
    }

    public getFisrtUser(){
        if(!this.checkHasValue()){
            return undefined;
        }
        return this.deviceUserList[0];
    }

    public getUserCount(){
        if(!this.checkHasValue()){
            return 0;
        }
        return this.deviceUserList.length;
    }

    public checkUser(userId,customerId,country){
        if(!this.checkHasValue()){
            return false;
        }
        var result = false
        this.deviceUserList.forEach(element => {
            if(element["UserId"] == userId 
            && element["CustomerId"] == customerId
            && element["Country"] == country){
                result = true;
            }
        });
        return result;
    }

    public getUser(userId,customerId){
        if(!this.checkHasValue()){
            return undefined;
        }
        var user = undefined;
        this.deviceUserList.forEach(element => {
            if(element["UserId"] == userId && element["CustomerId"] == customerId){
                user =  element;
            }
        });
        return user;
    }

    private checkHasValue(){
        console.error('checkHasValue this deviceUserList',this.deviceUserList);
        if(this.deviceUserList == null || this.deviceUserList == undefined){
            console.error('checkHasValue 1',this.deviceUserList);
            return false;
        }
        if(this.deviceUserList == undefined){
            console.error('checkHasValue 2',this.deviceUserList);
            return false;
        }
        return true;
    }


}
