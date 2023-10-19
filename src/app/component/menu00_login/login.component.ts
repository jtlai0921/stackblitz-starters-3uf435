import { Component, OnInit, Input, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { DoLoginService } from '../../shared/service/customize/doLogin.service';
import { HiBiometricAuthService } from '../../shared/service/cordova/HiBiometricAuth.service';
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { Config } from '../../../assets/configuration/config';
import { QuickLoginService } from '../../shared/service/customize/quickLogin.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { CheckService } from '../../shared/service/global/check.service';
import { AREA } from '../../../assets/configuration/area';
import { PushService } from '../../shared/service/cordova/push.service';
import { PatternLockService } from '../../shared/service/global/patternLock.service';

declare var PatternLock: any;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LogInComponent implements OnInit {
  public PatternLock: any;
  constructor(
    public layout: LayoutService,
    public router: Router,
    private zone: NgZone,
    public routeAct: ActivatedRoute,
    public storage: LocalStorageService,
    public doLogin: DoLoginService,
    public hiBiometricAuth: HiBiometricAuthService,
    public idGate: IDGateService,
    public popup: PopupService,
    public quickLoginService: QuickLoginService,
    private _langTransService: LangTransService,
    private _checkService: CheckService,
    private patternLockService: PatternLockService,
    public push: PushService,
    
  ) {
    console.log('constructor login');
    
    //這裡要接續一些被踢回登入頁的動作，所以要幫別人關。
    this.popup.setLoading(false);
    //若由推播開啟則轉至訊息頁
    // if(this.push.IsPushOpen()){
    //    this.router.navigate(['./notification']);
    // }
  }

  companyID = "";
  account = "";
  accountMask = "";
  accountShowFlag = true;
  password = "";
  companyIDErrorMsg = "";
  accountErrorMsg = "";
  passwordErrorMsg = "";
  nowQuickType = "";
  identifyType = "";
  patternLock = "";
  passwordPlacehodler = "";
  isCompanyIDError = false;
  isAccountError = false;
  isPasswordError = false;
  isCompanyIDVerified = false;
  isAccountVerified = false;
  isPasswordVerified = false;
  _checkbox = false;
  isPatternLock = false;
  isAllowIdentify = false;
  isAllowPatternLock = false;
  isOneUser = false;
  isDisabled = true;  //登入按鈕disabled
  DropContent //下拉內容值
  selectedOptionIndex = 0; //下拉index
  

  loginClass = "login";
  patterClasss = "hidden";
  patternFlag = false;
  pattern_error_msg = '';
  

  //Country
  countryArr;
  selectedCountry;  // PIN policy
  ngOnInit() {
    document.getElementById('accountMask').setAttribute('style', 'display: none');
    document.getElementById('accountNoMask').setAttribute('style', 'display: block');
    document.getElementsByTagName("BODY")[0].setAttribute("id", "canScroll");

    this.layout.setHeaderStatus({
      status: true,
      title: "LOGINOUT.APP_NAME", // 中信企業家
      rightIcon : "announce",
      backEvent: undefined
    });
    
    //設定StartFinish 此後皆會檢查啟動是否成功
    this.storage.set(Config.StartFinish, "YES");
    this.countryArr = [];
    AREA.forEach(element => {
      this.countryArr.push(
        { "id": element.country, "value": element.location }
      )
    });
    var isStartQuick;
    if (this.routeAct.snapshot.queryParams['type'] == "logout" ||
      this.routeAct.snapshot.queryParams['type'] == "error") {
      isStartQuick = false;
    } else {
      isStartQuick = true;
    }

    this.selectedCountry = this.storage.get('Area');
    this.PatternLock = new PatternLock('#patternHolder');
    this.checkbox = this.storage.get("LoginRemember");
    if (this.checkbox) {
      var savedCompanyID = this.storage.get("CompanyID");
      if (savedCompanyID != null && savedCompanyID.toString().length > 0) {
        this.companyID = savedCompanyID;
      }

      var savedAccount = this.storage.get("UserAccount");
      if (savedAccount != null && savedAccount.toString().length > 0) {
        this.accountMask = this.transMask(savedAccount);
        this.account = savedAccount;
        this.accountShowFlag = false;
        document.getElementById('accountMask').setAttribute('style', 'display: block');
        document.getElementById('accountNoMask').setAttribute('style', 'display: none');
      }

      var savedCountry = this.storage.get("UserCountry");
      if (savedCountry != null && savedCountry.toString().length > 0) {
        this.selectedCountry = savedCountry;
      }
    }

    console.log("檢查是否符合快登條件");
    if ( this.quickLoginService.isOneUser()
      && this.account.length > 0
      && this.companyID.toString().length > 0) {
      console.log("persofile = 1")
      this.isOneUser = true;
      this.patternLockService.setUser(this.companyID, this.account, this.selectedCountry);
      this.patternLockService.checkQuickLogin((type) => {
        this.quickLogin(type)
      }, PatternLockService.quick);
    }

    console.log('ngOnInit login');

    let passwordCheckRuleObj = this._checkService.getPasswordCheckRule();
    this.passwordPlacehodler = passwordCheckRuleObj.passwordPlacehodler;
    //取得下所索引值
    this.selectedOptionIndex = this.countryArr.findIndex((item)=>{
      return item.id == this.selectedCountry;
    });
    //設置下拉選單顯示內容
    this.DropContent = "countryCode."+this.selectedCountry;

    //this.storage.set("isAllowQuick",true);
  }

  ngAfterViewInit() {
    // 關閉Loading畫面
    this.popup.setLoading(false);
    
  }

  

  ngOnDestroy() {
    document.getElementsByTagName("BODY")[0].removeAttribute("id");
  }

  ngDoCheck() {
    this.checkLogin()
  }
  checkIdentify() {
    console.log("檢查是否符合快登條件");
    //var isAllowQuick = this.storage.get("isAllowQuick");
    if (this.account.length > 0
      && this.companyID.toString().length > 0
    ) {
      this.patternLockService.setUser(this.companyID, this.account, this.selectedCountry);
      this.patternLockService.checkQuickLogin((type) => {
        this.quickLogin(type)
      }, PatternLockService.quick).then((res)=>{
        //若沒有快登則啟動鍵盤
        if(!res){
         this.popup.setKeyboard(true)
        }else{
          this.isPasswordError = false;
        }
      })
    }
    //未輸入統編使用者代號啟動鍵盤
    else{
      this.popup.setKeyboard(true);
    } 
   }



  //執行快登
  quickLogin(type: string) {
    this.idGate.generateSignatureOTP().then(
      (res) => {
        console.log("快登密碼", res);
        console.log("執行登入");
        //快登登入成功儲存area
        this.storage.set("Area",this.selectedCountry)
        var companyID = this.companyID.toString();
        var account = this.account.toString();
        this.doLogin.doLogin(companyID, account, res.toString(), type, this.checkbox, this.selectedCountry);
      }
      , (err) => {
        this.popup.setConfirm({
          content: "LOGINOUT.LOGIN_FAIL", // 快登失敗
          event: () => { }
        });
      }
    )
  }
  
  
  Login() {
    if (this.isDisabled) {
      return;
    }
    var result = this.verifyInput();
    if (!result.isValid) {
      this.popup.setConfirm({ content: result.errorMessage }); // 輸入資訊錯誤
      return;
    }
    //登入成功儲存area
    this.storage.set("Area",this.selectedCountry)
    this.doLogin.doLogin(this.companyID, this.account, this.password, "0", this.checkbox, this.selectedCountry)
      .then(callback => {
        console.log("[登入頁] doLogin service Callback", callback);
        // 密碼登入模式，電文回應後統一清空密碼欄位值
        this.password = "";
      });
  }

  NavigateOTP() {
    this.idGate.hasPersoFile().then((resHas) => {
      if (resHas) {
        this.idGate.checkSumPersoFile().then((resCheck) => {
          if (resCheck) {
            this.router.navigate(["/otp"]);
          } else {
            this.popup.setConfirm({
              content: 'OTP.GET_OTPNUM_FAILED'
            })
          }
        }, (errCheck) => {
          this.popup.setConfirm({
            content: 'OTP.GET_OTPNUM_FAILED'
          })
        })
      } else {
        this.popup.setConfirm({
          content: 'OTP.LOGIN_FIRST'
        })
      }
    }, (errHas) => {
      this.popup.setConfirm({
        content: 'OTP.LOGIN_FIRST'
      })
    })

  }

  checkCompanyID() {
    var result = this.verifyCompanyID();
    this.isCompanyIDError = !result.isValid;
    this.isCompanyIDVerified = result.isValid;
    this.companyIDErrorMsg = result.errorMessage;
  }

  checkAccountfocusin() {
    if (!this.accountShowFlag) {
      this.account = '';
      this.accountShowFlag = true;
      document.getElementById('accountMask').setAttribute('style', 'display: none');
      document.getElementById('accountNoMask').setAttribute('style', 'display: block');
      document.getElementById('accountNoMask').focus();
    }
  }

  checkAccount() {
    var result = this.verifyAccount();
    this.isAccountError = !result.isValid;
    this.isAccountVerified = result.isValid;
    this.accountErrorMsg = result.errorMessage;
  }

  checkPassword() {
      var result = this._checkService.verifyPassword(this.password);
      this.isPasswordError = !result.isValid;
      this.isPasswordVerified = result.isValid;
      this.passwordErrorMsg = result.errorMessage;
  }
  
  checkLogin() {
    if (this.password !=  "" && this.account != "" && this.companyID != "") {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }


  @Input()
  set checkbox(value: boolean) {
    this._checkbox = value;
      this.storage.set("LoginRemember", value);
      if (!value) {
        this.storage.set("CompanyID", "");
        this.storage.set("UserAccount", "");
        this.storage.set("UserCountry", "");
      }
  }

  get checkbox(): boolean {
    return this._checkbox;
  }

  private verifyInput() {
    var result;
    result = this.verifyCompanyID();
    if (!result.isValid) {
      return result;
    }

    result = this.verifyAccount();
    if (!result.isValid) {
      return result;
    }

    result = this._checkService.verifyPassword(this.password);
    if (!result.isValid) {
      return result;
    }

    return { isValid: true };
  }
  private verifyCompanyID() {
    const companyIDString = this.companyID == null ? "" : this.companyID.toString();
    if (companyIDString.length == 0) {
      return { isValid: false, errorMessage: "LOGINOUT.ENTER_ID_NUM" }; // 請輸入統一編號
    }
    /* 2019/3/25 登入頁：統編、使用者代號及密碼欄位之檢核，皆調整為僅檢核是否有填。
    if (!companyIDString.match(/^[a-zA-Z0-9]+$/g)) {
      return { isValid: false, errorMessage: "LOGINOUT.ID_CODE_ERROR" }; // 統一編號只能包含英文字、數字
    }*/
    return { isValid: true };
  }

  private verifyAccount() {
    const accountString = this.account == null ? "" : this.account.toString();
    if (accountString.length == 0) {
      return { isValid: false, errorMessage: "LOGINOUT.ENTER_USER_CODE" }; // 請輸入使用者代號
    }
    /* 2019/3/25 登入頁：統編、使用者代號及密碼欄位之檢核，皆調整為僅檢核是否有填。
    if (!this.account.match(/^[a-zA-Z0-9]+$/g)) {
      return { isValid: false, errorMessage: "LOGINOUT.USER_CODE_ENNUM" }; // 使用者代號只能包含英文字、數字
    }
    if (accountString.length < 6) {
      return { isValid: false, errorMessage: "LOGINOUT.USER_CODE_LENGTH_ERROR_LEAST" }; // 使用者代號長度有誤，最少6個字元！
    }
    if (accountString.length > 12) {
      return { isValid: false, errorMessage: "LOGINOUT.USER_CODE_LENGTH_ERROR_MOST" }; // 使用者代號長度有誤，最多12個字元！
    }*/
    return { isValid: true };
  }


  /**
   * 使用者代號隱碼處理
   * @param tranString 使用者代號
   */
  transMask(tranString: string) {
    let leng = tranString.length;
    let num = Math.ceil(leng / 4);
    let cut = Math.floor((leng - num) / 2);
    let startStr = tranString.slice(0, cut);
    let endStr = tranString.slice((cut + num), leng);
    for (let i = 0; i < num; i++) { startStr += '*'; }
    return startStr.concat(endStr);
  }
  selectClick(){
    let newArr = [];
    this.countryArr.forEach((item, i)=>{
      if(this.selectedOptionIndex == i){
        newArr.push({
          desc: this._langTransService.instant(item.value),
          id : item.id,
          value: i,
          checked: true
        })
      }else{
        newArr.push({
          desc: this._langTransService.instant(item.value),
          id : item.id,
          value: i,
          checked: false
        })
      }
    })

    this.popup.setCheckList({
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.DropContent = result['desc'];
        this.selectedOptionIndex = result['value'];
        this.selectedCountry = result['id'];
        this.storage.set("Area", result['id']);

        //不屬於預設國家則資料清空
        if(this.selectedCountry != this.storage.get('UserCountry')){
          this.companyID = "";
          this.account = "";
          this.password = "";
          this.accountMask = "";
          this._checkbox = false;
        }else{
          this.companyID = this.storage.get("CompanyID");
          this.account = this.storage.get("UserAccount");
          this.accountMask = this.transMask(this.account);
          this._checkbox = true;
        }

    }})
  }
  //記住我點擊
  changeRememberMe(){ 
    this.checkbox = !this.checkbox;
  }
}
