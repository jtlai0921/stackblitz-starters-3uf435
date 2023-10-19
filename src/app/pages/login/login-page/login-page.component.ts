import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { LoginService } from '../shared/login.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
// import { FtLoginService } from '../shared/ftlogin.service';
// import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { AlertService } from '@template/msg/alert/alert.service';
// import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { logger } from '@util/log-util';
// import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
// import { SecurityService } from '@pages/security/shared/service/security.service';
import { environment } from '@environments/environment';
import { CacheService } from '@systems/system/cache/cache.service';
import { Logger } from '@systems/system/logger/logger.service';
import { FundInvestHealthyRoutingModule } from '@pages/fund/fund-invest-healthy/fund-invest-healthy-routing.module';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: []
})
export class LoginPageComponent implements OnInit, OnDestroy {
  // 登入資訊
  loginRemember = {
    userData: {
      custId: '',
      userId: ''
    },
    rememberMe: { // 記住我 0 關閉 1 啟用
      remcust: '0',
      remuser: '0'
    },
    ftlogin: {
      type: '', // 預設登入方式：圖形鎖(pattern) or 生物辨識(biometric) or 一般登入(pwdlogin)
      fastlogin: '0', // 是否快速登入 0 關閉 1 啟用
      pay_setting: '0', // 生物辨識付款
      hasPatternLock: '0', // 是否有圖形鎖綁定
      patterLoginErrorCount: '', // 圖形鎖登入錯誤次數
      payPattern: '0', // 圖形密碼台灣Pay交易
      patternDeviceId: '' // 圖形密碼啟用時的裝置id
    }
  };

  // 看見我資訊
  seeObj = {
    seeuser: false,
    seepswd: false,
  };

  custId = '';
  userId = '';
  pswd = '';

  invalid_custId = false;
  invalid_userId = false;
  invalid_pswd = false;
  
  constructor(
    private localStorageService: LocalStorageService,
    private _logger: Logger,
    private loginService: LoginService,
    private errorHandler: HandleErrorService
  ) { 
    // 取用 登入資訊Storage
    const tempRem = this.localStorageService.getObj('Remember');
    if (tempRem !== null && tempRem.hasOwnProperty('userData') &&
          tempRem.hasOwnProperty('rememberMe') &&
          tempRem.hasOwnProperty('ftlogin')) {
            this.loginRemember = tempRem;
            this.common();
      // this.tcbb.fastAESDecode([tempRem.userData.custId, tempRem.userData.userId])
      //   .then((res_Dncode) => {
      //     tempRem.userData = res_Dncode;
      //     this.loginRemember = tempRem;
      //     return Promise.resolve();
      //   }, (error_Dncode) => {
      //     logger.debug('error_Dncode', error_Dncode);
      //     return Promise.resolve();
      //   }
      //   ).then((res_compare) => {
      //     // 取用 快入登入資訊Storage
      //     const tempFtData = this.localStorageService.getObj('Compare');
      //     if (tempFtData !== null && tempFtData.hasOwnProperty('comparecustId') && tempFtData.hasOwnProperty('compareuserId')) {
      //       this.tcbb.fastAESDecode([tempFtData.comparecustId, tempFtData.compareuserId]).then(
      //         (res_Dncode) => {
      //           tempFtData.comparecustId = res_Dncode.custId;
      //           tempFtData.compareuserId = res_Dncode.userId;
      //           this.ftloginRemember = tempFtData;
      //           this.common();
      //         },
      //         (error_Dncode) => {
      //           this.common();
      //           logger.debug('error_Dncode', error_Dncode);
      //         }
      //       );
      //     } else {
      //       this.common();
      //     }
      //   }, (error_compare) => {
      //     logger.debug('error_compare', error_compare);
      //   });
    }

  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    
  }

  /**
   * localStorage 一般流程合併
   */
  common() {
    // 一般登入是否有記住我
    if (this.loginRemember.rememberMe.remcust === '1' && this.loginRemember.userData.custId !== '') {
      this.custId = this.loginRemember.userData.custId;
    } else {
      this.loginRemember.rememberMe.remcust = '0';
    }

    if (this.loginRemember.rememberMe.remuser === '1' && this.loginRemember.userData.userId !== '') {
      this.userId = this.loginRemember.userData.userId;
    } else {
      this.loginRemember.rememberMe.remuser = '0';
    }

    

    // this.loginForm.setValue({ custId: custId, userId: userId, pwd: '' });

    // // 是否啟動快速登入 0 關閉 1 啟用
    // if (this.loginRemember.ftlogin.fastlogin === '1' && this.loginRemember.ftlogin.type === 'biometric') {
    //   // 快速登入開啟為生物辨識
    //   let cancelFastLogin = this.localStorageService.get('cancelFastLogin'); // 生物辨識錯五次自動解除生物辨識與圖形鎖
    //   if (!!cancelFastLogin && cancelFastLogin == '1') {
    //     return false; // 已lock不處理
    //   }
    //   if (!environment.ONLINE && !environment.NATIVE) {
    //     // 開發使用
    //     this.errorHandler.handleError({
    //       type: 'confirm',
    //       title: 'ERROR.INFO_TITLE',
    //       content: '[測試]確定要立即使用快速登入'
    //     }).then(
    //       () => {
    //         this.fastLogin();
    //       },
    //       () => {
    //         // no do
    //       }
    //     );
    //   } else {
    //     this.fastLogin();
    //   }
    // } else if (this.loginRemember.ftlogin.hasPatternLock === '1' && this.loginRemember.ftlogin.type === 'pattern') { // 直接切到圖形鎖登入畫面
    //   this.patternLogin();
    // }
  }

  /**
   * 一般登入
   */
  async loginMethod() {
    if (!this.custId || this.custId == '') {
      this.invalid_custId = true;
    } else {
      this.invalid_custId = false;
    }

    if (!this.userId || this.userId == '') {
      this.invalid_userId = true;
    } else {
      this.invalid_userId = false;
    }

    if (!this.pswd || this.pswd == '') {
      this.invalid_pswd = true;
    } else {
      this.invalid_pswd = false;
    }

    if (this.invalid_custId || this.invalid_userId || this.invalid_pswd) {
      return false;
    }

    let output = {
      custId: this.custId,
      userId: this.userId,
      pswd: this.pswd
    };

    this.loginService.login(output).then(
      (res) => {
        this.loginRemember.userData.custId = this.custId;
        this.loginRemember.userData.userId = this.userId;
        const copy = Object.assign({}, this.loginRemember);
        this.localStorageService.setObj('Remember', copy);
        this.loginService.doAfterLogin(res, output);
      },
      (err) => {
        this._logger.error("login page err", err);
        this.errorHandler.handleError({
          type: 'alert',
          title: '提醒您',
          content: '登入密碼錯誤'
        });
      }
    );

    // if (this.loginForm.invalid) {
    //   // tslint:disable-next-line:forin
    //   for (const key in this.loginForm.controls) {
    //     logger.warn('this.loginForm', this.loginForm);
    //     this.loginForm.controls[key].markAsTouched();
    //   }
    //   return;
    // }

    // this.loginService.login(this.loginForm.value).then(
    //   (res) => {
    //     this.loginRemember.userData.custId = this.loginForm.value.custId;
    //     this.loginRemember.userData.userId = this.loginForm.value.userId;
    //     // 加密儲存到localStorage
    //     this.tcbb.fastAESEncode([this.loginRemember.userData.custId, this.loginRemember.userData.userId]).then(
    //       (res_Encode) => {
    //         // 有錯五次快速登入，將localStorage的快速登入設為0
    //         let cancelFastLogin = this.localStorageService.get('cancelFastLogin');
    //         if (!!cancelFastLogin && cancelFastLogin === '1') {
    //           this.loginRemember.ftlogin.fastlogin = '0';
    //         }

    //         this.loginRemember.ftlogin.patterLoginErrorCount = '0'; // 圖形鎖錯誤次數 = 0
    //         this.loginRemember.ftlogin.type = 'pwdlogin';
    //         const copy = Object.assign({}, this.loginRemember);
    //         copy.userData = res_Encode;
    //         this.localStorageService.setObj('Remember', copy);
    //         if (this.goPatternLock) { // 轉至設定圖形鎖
    //           this.navgator.push('security_patternlock_preface', 'fromLogin');
    //         } else if (!this.showFt) {
    //           const copyFT = Object.assign({}, this.ftloginRemember);
    //           copyFT.comparecustId = res_Encode.custId;
    //           copyFT.compareuserId = res_Encode.userId;
    //           this.localStorageService.setObj('Compare', copyFT);
    //           // 註冊頁
    //           this.navgator.push('security_ftlogin_agree', 'fromLogin');
    //         } else {
    //           this.loginService.doAfterLogin(res, this.loginForm.value);
    //         }
    //       },
    //       (error_Encode) => {
    //         logger.debug('error_Encode', error_Encode);
    //       }
    //     );
    //   },
    //   (error) => {
    //     logger.debug('loginMethod error', error);
    //     this.errorObj = error;
    //     this.errorHandler.handleError(error);
    //     // this.alert.show(error.content, { title: '錯誤' }).then(res => { });
    //   }
    // );
  }

  /**
   * 切換input 密碼與文字切換
   * @param type 類別
   */
  switchSee(type) {
    switch (type) {
      case 'seeuser':
        this.seeObj.seeuser = !this.seeObj.seeuser;
        break;

      case 'seepswd':
        this.seeObj.seepswd = !this.seeObj.seepswd;
        break;
    }
  }

  /**
   * 記住我開關
   */
  remember() {
    if (this.loginRemember.rememberMe.remcust === '0') {
      this.loginRemember.rememberMe.remcust = '1';
    } else {
      this.loginRemember.rememberMe.remcust = '0';
    }
  }

}
