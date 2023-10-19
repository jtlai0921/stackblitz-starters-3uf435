/**
 * app控制 pause、resume事件
 */
import { Injectable, NgZone } from '@angular/core';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Logger } from '@systems/system/logger/logger.service';
// --- lib --- //
import { Timer } from '@lib/timer/timer.class';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { AuthService } from '@systems/system/auth/auth.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { AutoLogoutService } from '@template/msg/auto-logout/auto-logout.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
// --- show --- //
import { AlertService } from '@template/msg/alert/alert.service';
import { ConfirmService } from '@template/msg/confirm/confirm.service';

@Injectable({
    // 全ＡＰＰ只有一個
    providedIn: 'root'
})
export class AppCtrlService {
    redirectUrl: string;
    private autoLogoutTimer: Timer;
    private pauseTime: number; // 移入背景時間
    private timeOut: number;
    private subscriptDisableNativeReturn: any; // android實體返回控制
    private disableNativeReturn = false;
    private hasAndroidBackDialog = false;

    telegramSubject: Subject<any> = new Subject<any>(); // 維持連線時間控制
    logoutEventSubject: Subject<any> = new Subject<any>();
    changeLogin: Subject<any> = new Subject<any>();
    changeLogout: Subject<any> = new Subject<any>();

    constructor(
        private zone: NgZone,
        private router: Router,
        private _logger: Logger,
        // --- lib --- //
        private auth: AuthService,
        private autoLogoutTimeBomb: AutoLogoutService,
        private session: SessionStorageService,
        private navgator: NavgatorService,
        private headerCtrl: HeaderCtrlService,
        // --- show --- //
        private alert: AlertService,
        private confirm: ConfirmService
    ) {
        document.addEventListener('pause', () => {
            this._logger.log('[STEP] APP on pause');
            this.onPauseHandler();
        }, false);

        document.addEventListener('resume', () => {
            this._logger.log('[STEP] APP on resume');
            this.onResumeHandler();
        }, false);

        this.telegramSubject.subscribe(() => { this.resetTimer(); });

        this.subscriptDisableNativeReturn = this.headerCtrl.disableNativeReturnSubject.subscribe((disable: boolean) => {
            this.disableNativeReturn = disable;
        });
    }

    changeToLogin() {
        this.initTimer();
        this.changeLogin.next();
    }

    changeToLogout() {
        this.changeLogout.next();
    }

    /**
     * 初始化登出倒數
     */
    private initTimer() {
        const self = this;
        this.timeOut = (!this.auth.getTimeOut()) ? environment.AUTOLOGOUT_TIME : parseFloat(this.auth.getTimeOut()) * 60;
        const deadline = this.timeOut - environment.WARNING_BEFORE_LOGOUT_TIME;
        if (!this.autoLogoutTimer) {
            this.autoLogoutTimer = new Timer(deadline, () => {
                self.ctrlWarningIdle(environment.WARNING_BEFORE_LOGOUT_TIME);
            });
        }
    }

    /**
     * 背景事件控制
     */
    private onPauseHandler() {
        this.clearAutoLogout();
        if (this.auth.checkIsLoggedIn()) {
            this.zone.run(() => {
                this.pauseTime = new Date().getTime();
                this.autoLogoutTimer.stop();
            });
        }
    }

    clearAutoLogout() {
        if (this.autoLogoutTimeBomb.isOpened()) {
            this.autoLogoutTimeBomb.destroy();
        }
    }

    private onResumeHandler() {
        if (this.auth.checkIsLoggedIn()) {
            this.zone.run(() => {
                const now = new Date().getTime();
                const backgroundTime = Math.round((now - this.pauseTime) / 1000);
                const deadline = this.timeOut;
                const warningTime = environment.WARNING_BEFORE_LOGOUT_TIME;
                if (!!this.autoLogoutTimer) {
                    const t = this.autoLogoutTimer.getTime();
                    const idleTime = t + backgroundTime;
                    // 更新閒置時間
                    this.autoLogoutTimer.setTime(idleTime);
                    this.autoLogoutTimer.resume();
                    const remainingTime = deadline - idleTime;  // 剩餘時間
                    if (remainingTime <= 0) {
                        // 已超過時間登出提示，發登出電文
                        this.ctrlLogoutPop();
                    } else if (remainingTime <= warningTime) {
                        // 已到了要提示登出的時間
                        this.ctrlWarningIdle(remainingTime);
                    }
                    //  else {
                    //   // 還在有效時間內
                    // }
                } else {
                    // 已登入但無計時? 此狀態不該出現
                    // 提示已超過時間登出，發登出電文
                    this.ctrlLogoutPop();
                }
            });
        }
    }

    /**
     * 登出提示
     */
    ctrlWarningIdle(deadline: number) {
        if (this.auth.checkIsLoggedIn()) {
            this.ctrlAutoLogout().then((isOpened) => {
                if (!isOpened) {
                    this.autoLogoutTimeBomb.show(deadline)
                        .then(() => this.keepLogin())
                        .catch(() => this.logout());
                }
            });
        }
    }

    /**
     * 登出提示: 自動登出
     */
    private ctrlLogoutPop() {
        this.alert.show('POPUP.LOGIN.AUTOLOGOUT').then(() => {
            this.logout();
        });
    }

    /**
     * 登出提示控制
     */
    private ctrlAutoLogout(deadline?: number): Promise<any> {
        let isOpened = (this.autoLogoutTimeBomb.isOpened()) ? true : false;
        if (isOpened) {
            this.autoLogoutTimeBomb.destroy();
        }
        return Promise.resolve(isOpened);
    }

    /**
     * 保持登入
     */
    keepLogin() {
        // this.f1000103.send({}, { background: true });
        // 請求api

        this.resetTimer();
    }

    /**
     * 登出
     */
    logout() {
        this.logoutEventSubject.next();
    }

    /**
     * 登出清除暫存
     */
    logoutClear() {
        this.headerCtrl.closePopup();
        this.changeToLogout();
        this.auth.logoutClearAuthData();
        this.stopTimer();
        this.clearAutoLogout();
        this.navgator.home();
    }

    /**
     * 登入後導頁
     */
    redirectAfterLogin() {
        let path = 'user-home';
        // 共同行銷Ｓtart

        // let refuseMarkingType = this.getUserInfo().refuseMarkingType;
        // if (refuseMarkingType == '0') {
        //     this.navgator.push('commonMarket', { fnctId: 'L' });
        //     return;
        // }
        // 共同行銷End

        if (!!this.redirectUrl) {
            // const header = this.navgator.getHeader();
            const args = this.redirectUrl.split('?');
            path = args[0];
            this.redirectUrl = null;
            this.router.navigate([path]);
            return;
            // this.headerCtrl.setOption(header);
            // if (args.length > 1) {
            //     const param = CommonUtil.uriToJson(args[1]);
            //     this.router.navigate([path], { queryParams: param });
            // } else {
            //     this.router.navigate([path]);
            // }
            // return;
        }
        const redirect = this.session.get('redirect');
        if (!!redirect) {
            this.session.remove('redirect');
            this.session.remove('redirectToOld');
            path = redirect;
            this.navgator.push(path);
            return;
        }
        // const redirectToOld = this.session.get('redirectToOld');
        // if (!!redirectToOld) {
        //     window.location.replace(redirectToOld);
        //     this.session.remove('redirectToOld');
        // }

        this.navgator.push(path);
    }

    /**
     * Android返回鍵動作
     * _render.listen 不能執行
     */
    onReturnBtn() {
        if (!!this.disableNativeReturn || !!sessionStorage.disableNativeReturn) {
            return;
            // } else if (!!sessionStorage.scanCameraOn) {
            //   // 掃描相機開啟時只關掉相機
            //   this.navgator.displayScanBox(false);
            //   return;
        } else {
            this.zone.run(() => {
                const path = this.navgator.getLastPath();
                if (!path || path === '' || path === 'home') {
                    if (!!this.hasAndroidBackDialog) {
                        return;
                    }
                    this.hasAndroidBackDialog = true;
                    this.confirm.show('POPUP.RETURN.EXIT_APP', { title: 'POPUP.RETURN.EXIT_APP_TITLE' }).then(() => {
                        // this.exitApp.exit();
                        this.hasAndroidBackDialog = false;
                    }).catch(() => this.hasAndroidBackDialog = false);
                } else if (path === 'user-home') {
                    if (!!this.hasAndroidBackDialog) {
                        return;
                    }
                    this.hasAndroidBackDialog = true;
                    this.confirm.show('POPUP.RETURN.LOGOUT', { title: 'POPUP.RETURN.LOGOUT_TITLE' }).then(() => {
                        // this.auth.logout();
                        this.hasAndroidBackDialog = false;
                    }).catch(() => this.hasAndroidBackDialog = false);
                } else {
                    // 點左側選單
                    this.headerCtrl.onLeftClickEvent(true);
                }
            });
        }
    }

    // --------------------------------------------------------------------------------------------
    // ___________.__                              
    // \__    ___/|__| _____   _____   ___________ 
    //   |    |   |  |/     \ /     \_/ __ \_  __ \
    //   |    |   |  |  Y Y  \  Y Y  \  ___/|  | \/
    //   |____|   |__|__|_|  /__|_|  /\___  >__|   
    //                     \/      \/     \/     
    // --------------------------------------------------------------------------------------------

    /**
     * 維持連線計時器
     */
    maintainConnectTimer() {
        this.telegramSubject.next();
    }

    /**
     * 重設計時
     */
    resetTimer() {
        if (!!this.autoLogoutTimer) {
            this.autoLogoutTimer.restart();
        }
    }

    /**
     * 停止計時
     */
    stopTimer() {
        if (!!this.autoLogoutTimer) {
            this.autoLogoutTimer.stop();
            delete this.autoLogoutTimer;
        }
    }

}