import { Injectable } from '@angular/core';
import { SPEC02010201ApiService } from '@api/spec02/spec02010201/spec02010201-api.service';
import { AuthService } from '@systems/system/auth/auth.service';
import { AppCtrlService } from '@systems/system/app-ctrl/app-ctrl.service';

@Injectable()
export class LogoutService {
    
    constructor(
        private spec02010201: SPEC02010201ApiService,
        private auth: AuthService,
        private appCtrl: AppCtrlService
    ) {
        this.appCtrl.logoutEventSubject.subscribe(() => { this.logout(); });
    }

    /**
     * 登出
     */
    logout() {
        let custId = this.auth.getCustId();
        let output = {
            "custId": custId
        };
        this.appCtrl.logoutClear();

        this.spec02010201.logout(output, {background: true});
    }

}
