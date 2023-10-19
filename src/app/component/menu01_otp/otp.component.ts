import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { DoChangeOtpDeviceService } from '../../shared/service/customize/do-change-otp-device.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { DeviceUserInqService } from '../../shared/service/customize/deviceUserInq.service';
import { networkStateService } from '../../shared/service/cordova/networkState.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css', './otp.circle.component.css']
})

export class OtpComponent implements OnInit, OnDestroy {

  /**
   * 參數設定
   */
  networkStatus = this.network.IsConnect(); // 網路連線狀態
  loginStatus = this.storage.get('isLogin'); // 登入狀態
  routerData = ''; // 導頁進入口判斷參數
  deviceUserData = []; // 使用者資料
  isMultipleUsers = false; // 多位使用者
  disableUserList = false; // 控制使用者選單是否可點選
  selOTPName = '';
  selectId = 0; // 使用者選取事件之索引值
  deviceStatus: any; // OTP裝置可使用狀態
  doOtpNumber: any;
  doOtpSpec: any;
  startTime: any;
  CompanyID: any;
  UserAccount: any;

  otpNumber = '-------';
  counterString: any = '0';
  counterProgress: String;
  counterEnd = 60;
  counterCurrent: number = 0;
  timeoutController;
  buttonClass = 'div_reset';

  constructor(
    private layout: LayoutService,
    private popup: PopupService,
    private idGate: IDGateService,
    private network: networkStateService,
    private deviceUsers: DeviceUserInqService,
    private doOtpDevice: DoChangeOtpDeviceService,
    private storage: LocalStorageService,
    public route: ActivatedRoute,
    private router: Router,
    private langTrans: LangTransService
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'OTP.TITLE',
      rightIcon: false
    })
    this.layout.checkFooterUpdate(this.router.url.substr(0,this.router.url.indexOf('?')) || this.router.url);

    if (!this.loginStatus) {
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }
  }

  ngOnInit() {
    //時間參數不同就執行ngOnInit()
    this.route.queryParams.subscribe(params => {
      this.CompanyID = this.storage.get('CompanyID');
      this.UserAccount = this.storage.get('UserAccount');
      this.route.queryParams.subscribe(params => {
        this.routerData = params ? params['type'] : '';
      });

      // 恢復先前OTP紀錄
      if (this.restorePreviousOTP()) {
        // 開始接續倒數
        clearTimeout(this.timeoutController);
        this.continueCounter(true);

        // 設定裝置使用者選單
        this.setOtpView(true);

        return;
      }

      // == 取得使用者數量 == //
      if (this.networkStatus) {
        // 有網路
        // 取得中台裝置使用者清單，執行OTP頁面初始化作業
        this.getDeviceUserInq();
      } else {
        // 無網路
        // 取用手機端備存之裝置使用者清單
        this.deviceUserData = this.storage.get('DeviceUserData');
        console.log("[產生OTP頁] localStorage deviceUserData", this.deviceUserData);
        this.popup.setConfirm({
          content: 'OTP.CHECK_NETWORK', // 請確認網路連線以取得最新資訊！
          event: () => {
            /**
             * 有連線取得OTP過的設備顯示OTP，沒取得過則不顯示跳回login
             */
            if(this.deviceUserData){
              this.setOtpView();
            }else{
              this.router.navigate(['/login']);
            }
          }
        });
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.popup.setLoading(false);
    }, 1000);
  }

  ngOnDestroy() {
    // 離開頁面時，清除倒數程序
    clearTimeout(this.timeoutController);
  }

  /**
   * [API]取得與設備綁定的使用者清單
   */
  getDeviceUserInq() {
    console.log('[產生OTP頁] getDeviceUserList');
    return new Promise((resolve, reject) => {
      this.deviceUsers.deviceUserInq().then(
        (deviceUserList_res) => {
          console.log('[產生OTP頁][API] deviceUserInq success', deviceUserList_res);
          this.deviceUserData = JSON.parse(JSON.stringify(deviceUserList_res));
          this.storage.set('DeviceUserData', this.deviceUserData);
          this.setOtpView();
          // 關閉Loading畫面
          this.popup.setLoading(false);
          resolve(deviceUserList_res);
        },
        (deviceUserList_err) => {
          // 關閉Loading畫面
          this.popup.setLoading(false);
          reject(deviceUserList_err);
        }
      );
    });
  }

  /**
   * 畫面設定 依使用者數量
   * @param restore 是否為恢復先前OTP流程
   */
  setOtpView(restore?:boolean) {
    if (this.deviceUserData.length > 1) {
      // 使用者為多位
      this.isMultipleUsers = true;
      console.log('[產生OTP頁] This device has multiple users.');
      // == OTP頁面 == //

      this.deviceUserData.sort((a, b) => {
        if (a['CustomerId'] != b['CustomerId']) {
          return a.CustomerId > b.CustomerId ? 1 : -1;
        }
      })
      let index;
      
      if (restore) {
        // 恢復先前OTP紀錄，選取至該產生使用者
        for (let i = 0; i < this.deviceUserData.length; i++) {
          if(this.storage.get("otpTemp")['userId'] == this.deviceUserData[i].UserId){
            index = i;
          }
        }
      }
      else if(this.loginStatus == true){
        //如果已經登入，則預設為現在使用者
        for (let i = 0; i < this.deviceUserData.length; i++) {
          if(this.storage.get("userName") == this.deviceUserData[i].UserId){
            index = i;
          }
        }
      }
      else{
        //取得上次按產生otp之使用者，並設為otp下拉預設值
        if (this.storage.get("OtpLastUserUserId") && this.storage.get("OtpLastUserCustomerId")) {
          for (let i = 0; i < this.deviceUserData.length; i++) {
            if (this.deviceUserData[i].SystemId == "SPETrust" && this.deviceUserData[i].CustomerId == this.storage.get("OtpLastUserCustomerId") && this.deviceUserData[i].UserId == this.storage.get("OtpLastUserUserId")) {
              console.log("執行")
              index = i;
              break;
            }
          }
        }
        //取得上次登入之使用者，並設為otp下拉預設值
        if (!index) {
          for (let i = 0; i < this.deviceUserData.length; i++) {
            if (this.deviceUserData[i].SystemId == "SPETrust" && this.deviceUserData[i].CustomerId == this.CompanyID && this.deviceUserData[i].UserId == this.UserAccount) {
              index = i
              break;
            }
          }
        }
      }

      this.selectId = index ? index : 0; // 皆非OtpDevice時 預設使用者一
      this.changeselOTPName(this.selectId);
    } else {
      // 使用者為一位
      console.log('[產生OTP頁] This device has only one user.');
      this.selectId = 0;
      if (!restore)
        this.onOTPClick();
    }
  }

  /**
   * [API]變更目前使用的裝置為OTP設備
   */
  doChangeOTPDevice(dataIndex) {
    console.log('[產生OTP頁] doChangeOTPDevice');
    // 無登入狀態
    if (!this.loginStatus) {
      this.popup.setConfirm({
        content: 'OTP.NOT_OTP_CHANGE', // 不是OTP設備，請登入後做切換，謝謝。
        event: () => {
          this.router.navigate(['/login'], { queryParams: { 'type': 'otpPage' } });
        }
      })
      return;
    }

    // Check ChangeOTPDevice API work
    return new Promise((resolve, reject) => {
      this.doOtpDevice.doChangeOtpDevice().then(
        (doChange_res) => {        
          // 變更OTP設備成功

          // 手動更新deviceUser紀錄
          this.deviceUserData[dataIndex]['OTPDevice'] = "Y";
          this.storage.set('DeviceUserData', this.deviceUserData);

          // 產生OTP碼
          this.onOTPClick();
          resolve(doChange_res);
        },
        (doChange_err) => {
          reject(doChange_err);
        }
      );
    });
  }

  /**
   * 產生OTP 多位使用者
   * @param selectedItem 選取的資料
   */
  onMultiOtpClick(selectedItem) {
    console.log('[產生OTP頁] Generate OTP Number of Multiple users case', selectedItem);
    this.selectId = selectedItem;
    this.onOTPClick();
  }

  /**
   * 產生OTP
   */
  onOTPClick() {
    // 當前OTP倒數秒數大於30秒時，不允許重置OTP
    if (this.counterCurrent > 30) {
      return;
    }

    // 檢查此裝置是否為選定之使用者的OTP裝置
    console.log('[產生OTP頁] selected deviceUser', this.deviceUserData[this.selectId]);
    if (this.deviceUserData[this.selectId]['OTPDevice'] !== 'Y') {
      // 嘗試取得OTP裝置權限
      this.doChangeOTPDevice(this.selectId);
      return;
    }

    // == 呼叫SDK IdGate.generateOTP 產生OTP號碼 == //
    // 檢核IdGate.generateOTP
    this.idGate.generateOTP().then(
      (res) => {
        this.doOtpNumber = res;

        let timestamp = Date.now();

        // 倒數剩餘秒數設定60秒
        this.doOtpSpec = 60;
        console.log('[產生OTP頁] Get IdGate.generateOTP successfully', this.doOtpNumber);

        // iDGate回傳OTP號碼為空值
        if (this.doOtpNumber === '' || typeof this.doOtpNumber === 'undefined') {
          this.otpNumber = '-------';
          this.popup.setConfirm({
            content: 'OTP.GET_OTPNUM_FAILED', // 無法取得OTP相關數據，或稍後再試或錯誤代碼訊息！
            event: () => { }
          });
          this.isMultipleUsers = false;
          return;
        }
        //取得產生otp成功之使用者統編及代碼
        this.storage.set("OtpLastUserUserId", this.deviceUserData[this.selectId].UserId);
        this.storage.set("OtpLastUserCustomerId", this.deviceUserData[this.selectId].CustomerId)
        // 成功取得OTP號碼與剩餘秒數
        this.otpNumber = this.doOtpNumber;

        // 暫存OTP數據
        let otpTemp = {};
        otpTemp['number'] = this.otpNumber;
        otpTemp['timestamp'] = timestamp;
        otpTemp['userId'] = this.deviceUserData[this.selectId].UserId;
        this.storage.set("otpTemp", otpTemp);
        console.log("[產生OTP頁] otpTemp", otpTemp);

        this.startCounter();
      },
      (err) => {
        console.log('generateOTP err', err);
        // IdGate.generateOTP失敗
        this.popup.setConfirm({
          content: 'OTP.OTP_ERROR_AGAIN', // 無法產生OTP號碼，請重新啟動APP！！
          event: () => { }
        });
        this.isMultipleUsers = false;
      }
    );
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

  /**
   * 開始倒計時
   */
  startCounter() {
    // 通常OTP初始化
    this.startTime = Date.now();
    this.disableUserList = true;
    this.buttonClass = "div_reset_disable";

    clearTimeout(this.timeoutController);
    this.continueCounter(true);
  }

  /**
   * 繼續倒計時
   * @param isInitCounter 是否為首次呼叫倒計時
   */
  continueCounter(isInitCounter?: Boolean) {
    var style;
    var current = this.doOtpSpec;
    var end = this.counterEnd;
    var nowTime = Date.now();
    var time = 60 - Math.floor(((nowTime - this.startTime)/1000));
    current = time < current  ? time : current;
    current = current < 0 ? 0 : current;
    if (isInitCounter && current > 0) {
      this.timeoutController = setTimeout(() => {
        this.continueCounter(isInitCounter);
      }, 1000);
    }
    this.doOtpSpec -= 1;

    if (current > 0) {
      style = "c100";
    } else {
      style = "c100 timeout";
      this.otpNumber = '-------';
      clearTimeout(this.timeoutController);
    }

    // OTP倒數至45秒時，重新解鎖使用者選單
    if (this.disableUserList && current == 45)
      this.disableUserList = false;

    // OTP倒數至30秒時，重新解鎖產生OTP按鈕
    if (current == 30) {
      this.buttonClass = "div_reset";
    }
    this.counterCurrent = current;
    this.counterEnd = end;
    this.counterProgress = style + " p" + Math.max(Math.min(Math.floor((this.counterCurrent / this.counterEnd) * 100), 100), 0);
    this.counterString = Math.max(Math.ceil(current), 0) // 秒
  }

  /**
   * [前端事件綁定] 變更使用者選單選取項目
   */
  onUserListChange() {
    // OTP清除
    this.otpNumber = '-------';
    this.counterString = "0" // 0秒
    this.counterCurrent = 0;
    this.counterProgress = "c100 timeout p0";
    clearTimeout(this.timeoutController);
    // 解鎖產生OTP按鈕
    this.buttonClass = "div_reset";
    // 清除暫存OTP紀錄
    this.storage.remove("otpTemp");
  }

  changeselOTPName(index) {
    if (this.loginStatus) {
      this.selOTPName = '(' + this.langTrans.instant("countryCode." + this.deviceUserData[index].Country) + ')' + this.deviceUserData[index].CustomerId + '-' + this.deviceUserData[index].UserId;
    } else {
      this.selOTPName = '(' + this.langTrans.instant("countryCode." + this.deviceUserData[index].Country) + ')' + this.deviceUserData[index].CustomerId + '-' + this.transMask(this.deviceUserData[index].UserId);
    }
  }


  getSelOTPName(index) {
    let selName;
    if (this.loginStatus) {
      selName = '(' + this.langTrans.instant("countryCode." + this.deviceUserData[index].Country) + ')' + this.deviceUserData[index].CustomerId + '-' + this.deviceUserData[index].UserId;
    } else {
      selName = '(' + this.langTrans.instant("countryCode." + this.deviceUserData[index].Country) + ')' + this.deviceUserData[index].CustomerId + '-' + this.transMask(this.deviceUserData[index].UserId);
    }
    return selName;
  }

  onSelOTPClick() {
    console.log("[產生OTP頁] onSelOTPClick", this.doOtpSpec);
    
    console.log("[產生OTP頁] onSelOTPClick disableUserList =", this.disableUserList);
    if (this.disableUserList)
      return;

    let newArr = [];
    this.deviceUserData.forEach((item, i) => {
      if (this.selectId == i)
        newArr.push({
          desc: this.getSelOTPName(i),
          value: item.UserId,
          index: i,
          checked: true
        });
      else
        newArr.push({
          desc: this.getSelOTPName(i),
          value: item.UserId,
          index: i,
          checked: false
        });
    });
    
    this.popup.setCheckList({
      // title: this.langTransService.instant(''), // 
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.selOTPName = result['desc'];
        this.selectId = result.index;
        this.changeselOTPName(result.index);
        this.onUserListChange();
      }
    });
  }

  /**
   * 判斷恢復先前OTP暫存紀錄
   */
  private restorePreviousOTP() {
    console.log("[產生OTP頁] restorePreviousOTP");

    // 取得備存裝置使用者清單數據
    this.deviceUserData = this.storage.get('DeviceUserData');


    // 取得暫存OTP數據
    let otpTemp = this.storage.get("otpTemp");
    console.log("[產生OTP頁] previous otpTemp", otpTemp);

    if (!otpTemp)
      return false;

    let timestamp = parseInt(otpTemp['timestamp']);
    let now = Date.now();
    console.log("[產生OTP頁] ", now, " - ", timestamp, " = ", now - timestamp);
    let passSecs = Math.floor((now - timestamp) / 1000);
    console.log("[產生OTP頁] pass seconds =", passSecs);

    // 先前OTP已失效
    if (passSecs >= 60) {
      // 清除暫存OTP紀錄
      this.storage.remove("otpTemp");
      return false;
    }
      
    // 恢復相關OTP參數
    this.startTime = timestamp;
    this.otpNumber = otpTemp['number'];
    this.doOtpSpec = 60 - passSecs;
    this.disableUserList = (this.doOtpSpec > 45);
    this.buttonClass = this.doOtpSpec <= 30 ? "div_reset" : "div_reset_disable";

    return true;
  }
}