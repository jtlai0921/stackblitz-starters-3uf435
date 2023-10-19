/**
 * 倒數計時
 */
import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PopupService } from './popup.service';
import { Config } from '../../../../assets/configuration/config';
import { DoLogoutService } from '../customize/do-logout.service';
import { LocalStorageService } from './localStorage.service'
import { LayoutService } from '../../service/global/layout.service';
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';


declare var windows: any;
@Injectable({
    providedIn: 'root',
})
export class TimerService {
    public timeEnd: EventEmitter<boolean> = new EventEmitter();
    public timePopClick: EventEmitter<boolean> = new EventEmitter();
    //單一實例化
    private static _instance: TimerService;
    private default_sec = Config.LOGIN_TIMEOUT;
    public total_sec = Config.LOGIN_TIMEOUT;
    public alert_sec = Config.LOGIN_ALERT;
    constructor(
        private popup: PopupService,
        private ngzone: NgZone,
        //private logout : DoLogoutService,
        private layout: LayoutService,
        public router: Router,
        public storage: LocalStorageService,
        public lang: LangTransService,
    ) {
        return TimerService._instance = TimerService._instance || this;
    }
    /**
     * 登入後啟動計時10 分鐘 3分鐘發出提醒
     */
    public timerStart = () => {
        this.total_sec = this.default_sec;
        //點擊事件重置倒數秒數
        this.ngzone.runOutsideAngular(() => {
            var body = document.getElementsByTagName("BODY")[0];
            body.addEventListener('touchstart', this.touchEvent);
            this.timerCount();
        });
    }
    private timerCount = () => {
        //console.log('Timer Count',this.total_sec);
        var isLogin = this.storage.get("isLogin");
        if (!isLogin) {
            this.ngzone.run(() => {
                this.total_sec = this.default_sec;
                var body = document.getElementsByTagName("BODY")[0];
                body.removeEventListener('touchstart', this.touchEvent);
            });
        } else {
            setTimeout(() => {
                //console.log('total=' + this.total_sec + "_" + this.alert_sec);
                if (this.total_sec > 0) {
                    if (this.total_sec / 60 < 11 && this.total_sec % 60 == 0) {
                        var body = document.getElementsByTagName("BODY")[0];
                        body.removeEventListener('touchstart', this.touchEvent);
                        let temp = this.total_sec / 60
                        //您已閒置一段時間，將再N分鐘登出
                        this.ngzone.run(() => {
                            if (temp > 1) {
                                this.popup.setConfirm({
                                    content: this.lang.instant('LOGINOUT.TIMEOUT').replace("[#minute]", temp.toString()),
                                    event: (ok) => {
                                        //這裡通知有訂閱timePopClick值的人，要動作
                                        this.timePopClick.emit(true);
                                        //把秒數變回Default
                                        this.total_sec = this.default_sec;
                                        var body = document.getElementsByTagName("BODY")[0];
                                        body.addEventListener('touchstart', this.touchEvent);
                                    }
                                });
                            }
                            else if (temp <= 1) {
                                this.popup.setConfirm({
                                    content: this.lang.instant('LOGINOUT.CONTINUE'),    //您已閒置一段時間，繼續使用？
                                    checkTxt: this.lang.instant('LOGINOUT.CONFIRM'),    //繼續使用
                                    cancelTxt: this.lang.instant('LOGINOUT.LOGINOUT'),   //立即登出
                                    event: () => {
                                        //這裡通知有訂閱timePopClick值的人，要動作
                                        this.timePopClick.emit(true);
                                        //把秒數變回Default
                                        this.total_sec = this.default_sec;
                                        var body = document.getElementsByTagName("BODY")[0];
                                        body.addEventListener('touchstart', this.touchEvent);
                                    },
                                    errEvent: () => {
                                        //登出事件
                                        this.timeEnd.emit(true);
                                    }
                                })
                            }
                        });
                    }
                    this.total_sec--;
                    this.timerCount();
                } else {
                    //這邊補登出事件
                    console.log('Timer End');
                    this.timeEnd.emit(true);
                }
            }, 1000);
        }
    };
    private touchEvent = (event) => {
        console.log('loginTimeOut touchstart e', event);
        this.total_sec = this.default_sec;
    }

    public timeOut() {
        this.timeEnd.emit(true);
    }
}

