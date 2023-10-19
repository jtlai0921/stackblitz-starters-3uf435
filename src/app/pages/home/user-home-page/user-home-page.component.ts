/**
 * 登入後首頁
 */
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
// import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
// import { LeftMenuService } from '@core/layout/left-menu/left-menu.service';
import { CommonUtil } from '@util/common-util';
// import { PersonalInfo } from '@core/layout/header/personal-info';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { Logger } from '@systems/system/logger/logger.service';
// import { UserHomeService } from '@pages/home/shared/service/user-home.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
// import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { logger } from '@util/log-util';
import { AuthService } from '@systems/system/auth/auth.service';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: []
})

export class UserHomePageComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private _logger: Logger,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this._logger.error("check login in", this.auth.checkIsLoggedIn());
    this._logger.error("custId", this.auth.getCustId());
    this._logger.error("userId", this.auth.getUserId());
    this._logger.error("userName", this.auth.getUserName());
    this._logger.error("email", this.auth.getEmail());
    this._logger.error("phone", this.auth.getPhone());
    this._logger.error("phoneOTP", this.auth.getPhoneOtp());
    this._logger.error("role", this.auth.getRole());
    this._logger.error("idType", this.auth.getIdType());
    this._logger.error("accessToken", this.auth.getAccessToken());
    this._logger.error("refreshToken", this.auth.getRefreshToken());
    this._logger.error("timeOut", this.auth.getTimeOut());
    this._logger.error("isCardUser", this.auth.checkAllowAuth('isCardUser'));
    this._logger.error("isMobilebank", this.auth.checkAllowAuth('isMobilebank'));
    this._logger.error("nameFlag", this.auth.checkAllowAuth('nameFlag'));
    this._logger.error("nonFlag", this.auth.checkAllowAuth('nonFlag'));
    this._logger.error("fundAllow", this.auth.checkAllowAuth('fundAllow'));
    this._logger.error("transferAllow", this.auth.checkAllowAuth('transferAllow'));
    this._logger.error("isLoginCheckStrReset", this.auth.checkAllowAuth('isLoginCheckStrReset'));
    this._logger.error("id4Num", this.auth.checkAllowAuth('id4Num'));
    this._logger.error("otp", this.auth.checkAllowAuth('otp'));
    this._logger.error("fastPay", this.auth.checkAllowAuth('fastPay'));
    this._logger.error("fastPayNon", this.auth.checkAllowAuth('fastPayNon'));
    this._logger.error("deviceBind", this.auth.checkAllowAuth('deviceBind'));
  }


  ngOnDestroy() {
    
  }

  ngAfterViewInit() {
    
  }

}
