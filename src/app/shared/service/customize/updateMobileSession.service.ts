import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import {TimerService} from '../global/timer.service';
import {PopupService} from '../global/popup.service';
/**
 * [API] 更新MobileSession CCMPTX000209Rq
 */
@Injectable()
export class UpdateMobileSessionService {

    public _suscribe;
    constructor(
        private telegram: TelegramService,   
        private popup:PopupService,     
        public timer : TimerService,
    ) {
        //訂閱在timer的點擊事件，若有點擊視窗內的確認，則發一次updateMobileSession
        this._suscribe = this.timer.timePopClick.subscribe((()=>{
            console.log('timePopClick');
            this.updateMobileSession();
          }));
     }

    
    public updateMobileSession() {
        console.log("[UpdateMobileSessionService] TelegramService.reqCount =", TelegramService.reqCount);
        if (TelegramService.reqCount == 0) {
            this.popup.setLoading(true);
            const request = this.telegram.GetRequstParam('CCMPTX000209Rq'); 
            this.telegram.GetRespone(request).then(()=>{
                this.popup.setLoading(false);
            },()=>{
                this.popup.setLoading(false);
            });
        }
    }
}
