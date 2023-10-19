import { Injectable ,EventEmitter } from '@angular/core';
import { CTBC_PlugIn } from './_interface'
import { Config } from '../../../../assets/configuration/config';
declare var window;
/**
 * 訊息推播服務
 */
@Injectable()
export class PushService {

    public IsDirectNitification = false;
    public RedirectToNitification:EventEmitter<boolean> = new EventEmitter();
    public pushEntity;
    constructor() {}

    /**
     * 推播註冊
     */
    public RegistPushToken() {
        return new Promise((resolve,reject) => {
            // 推播初始化
            this.pushEntity = window['PushNotification'].init({
                android: {}
                // TODO: iOS
            });

            // 註冊事件
            this.pushEntity.on('registration', function(data) {
                console.log('[Push registration]', data);
                resolve(data['registrationId']);
            });

            // 推播接收事件
            this.pushEntity.on('notification', (data) => {
                 /**
                 * 發送時經由PlugIn觸發推播方法
                 * 發送物件內包含 data : { "content-available": "1" } -> 會觸發兩次
                 * 發送物件內包含 "content＿available": "1" 與data同級  -> 會觸發ㄧ次：ok
                 * 回傳物件判斷 
                 * coldstart : true (app尚未啟動) | false (app啟動中)
                 * foreground : true (app在前臺) | false (app 關閉或是背景))
                 * https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/PAYLOAD.md#push-message-arrives-with-app-in-background
                 */
                console.log('[Push notification]', data);
                // if(data.hasOwnProperty('additionalData') && data['additionalData'].hasOwnProperty('foreground')){
                //     if(!data['additionalData']['foreground']){
                        
                //         //app尚未啟動
                //         if(data['additionalData']['coldstart']){
                //             this.IsDirectNitification = true;
                //         }else{
                //             this.RedirectToNitification.emit(true);
                //         }
                //     }
                // }
                
            });

            // 錯誤事件
            this.pushEntity.on('error', function(error) {
                console.log('[Push error]', error);
                reject(error);
            });

            // 推播註冊timeout事件
            setTimeout(() => {
                reject("register push token timeout");
            }, Config.pushRegisterTimeout);
        });
    }

     /**
     * 是否由推播開啟app 呼叫後重設
     */
    public IsPushOpen(){
        var bool = this.IsDirectNitification;
        this.IsDirectNitification = false;
        return bool;
    }
}
