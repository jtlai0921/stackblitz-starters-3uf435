
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { LayoutService } from '../../shared/service/global/layout.service';

import { GetWayUrlService } from '../../shared/service/global/getwayUrl.service';
import { GetSessionKeyService } from '../../shared/service/global/getSessionKey.service';
import { GetAppVersionInfoService } from '../../shared/service/customize/getAppVersionInfo.service';
import { GetAnnouncementService } from '../../shared/service/customize/getAnnouncement.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { StartService } from '../../shared/service/customize/start.service';
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { TrustedDeviceService } from '../../shared/service/cordova/trustedDevice.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { VerifyServer } from '../../shared/service/cordova/verifyServer.service';
import { SQLlightService } from '../../shared/service/cordova/sqllight/sqllight.service';
import { networkStateService } from '../../shared/service/cordova/networkState.service';
import { Config } from '../../../assets/configuration/config';
import { DeviceService } from '../../shared/service/cordova/device.service';
import { UpdateSecurityProvider } from '../../shared/service/cordova/updateSecurityProvider.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
declare var window;
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit, OnDestroy {
  public appVersion;
  public contentVersion = Config.WWW_VERSION;
  constructor(
    public router: Router,
    public menuSet: LayoutService,
    public appstart: StartService,
    public getWayUrl: GetWayUrlService,
    public sessionkey: GetSessionKeyService,
    public getversion: GetAppVersionInfoService,
    public announcementService: GetAnnouncementService,
    public IDGate: IDGateService,
    public storage: LocalStorageService,
    public trustedDevice: TrustedDeviceService,
    public popup: PopupService,
    public verifyServer: VerifyServer,
    public device: DeviceService,
    private route: ActivatedRoute,
    private network: networkStateService,
    private sql: SQLlightService,
    private securityProvider: UpdateSecurityProvider,
    private langTran: LangTransService
  ) {
    this.menuSet.setHeaderStatus(false);
    this.index = -1;
    this.appVersion = device.getDeviceInfo("appinfo")['version'];
  }

  private sqllight: String = "SQL";
  private AppLang: String = "AppLang";
  private IsTrust: String = "IsTrust";
  private AppStart: String = "AppStart";
  private GetUrl: String = "GetUrl";
  private VerifyGetUrlServer: String = "VerifyGetUrlServer";
  private GetSessionKey: String = "GetSessionKey";
  private GetAppVersion: String = "GetAppVersion";
  private AppContentUpdate: String = "AppContentUpdate";
  private CheckArea: String = "CheckArea";
  private CheckAnnouncement: String = "CheckAnnouncement";
  private VerifyServe: String = "VerifyServe";
  private StartError: boolean = false;

  private functionList: Array<String> =
    [
      this.sqllight,
      this.AppLang,
      this.IsTrust,
      this.AppStart,
      this.VerifyServe,
      this.GetUrl,
      this.VerifyGetUrlServer,
      this.GetSessionKey,
      this.GetAppVersion,
      this.AppContentUpdate,
      this.CheckArea,
      this.CheckAnnouncement];

  ngOnInit() {
    let ele = document.getElementById('mainboad');
    ele.classList.add('noPaddingTop');
    // 準備localStorage加解密機制
    this.storage.prepareLocalStorage().then(
      (localStorageReady) => {
        console.log('[local storage] prepare finished:', localStorageReady);
        let page;
        // 由APP內容更新返回啟動流程
        this.route.queryParams.subscribe(param => {
          console.log("update", param)
          page = param['page'];
          if (page == "update") {
            this.index = parseInt(param['index']);
            this.StartError = param['StartError'];
          }
        });
        console.log('[啟動頁 StartError]', this.StartError);
        this.storage.set(Config.StartErrorKey, "");
        this.storage.set(Config.StartFinish, "");
        const success = (res) => {

        };
        const error = (err) => {
          console.log('app ', err);
          this.showMsgAndExit(err);
        };

        // 從取得地區資料接續啟動流程
        if (page == "update") {
          this.doNext().then(success, error);
          return;
        }

        this.storage.set("DemoLoginType", "0");
        this.storage.set('isLogin', false);

        console.log("[啟動頁]", Config.OFFLINE == true ? "電文模式：模擬模式" : "電文模式：連線模式");
        console.log("[啟動頁]", Config.NATIVE_OPEN == true ? "Plugin模式：使用plugin" : "Plugin模式：不使用plugin");

        /*this.popup.setPercentage({
          status: true,
          content: 'STARTAPP.INITIALIZE', // 初始化中
          percent: '0',
        })*/

        document.getElementById("loader").style.display = "none";
        this.doNext().then(success, error);
    },
    (localStorageFailed) => {
      this.popup.setConfirm({
        content: 'STARTAPP.RELOAD'
      });
    }
  );
  }

  ngOnDestroy() {
    let ele = document.getElementById('mainboad');
    ele.classList.remove('noPaddingTop');
  }


  getUrl() {
    console.log('[啟動頁] 準備取得URL');
    return new Promise((resolve, reject) => {
      const success = (baseUrl) => {
        console.log('[啟動頁] 取得URL成功：', baseUrl);
        this.doNext().then(resolve, reject);
      };
      const error = (err) => {
        console.log('[啟動頁] 取得URL失敗：', err);
        this.StartError = true;
        console.log('[啟動頁 StartError]', this.StartError);
        this.doNext().then(resolve, reject);
      };
      this.getWayUrl.FirstGetUrl().then(success, error);
    })

  }

  getSessionKey() {
    console.log('[啟動頁] 準備取得GetSessionKey');
    return new Promise((resolve, reject) => {
      const success = (key_res) => {
        console.log('[啟動頁] 取得GetSessionKey成功：', key_res);
        this.doNext().then(resolve, reject);
      };
      const error = (err) => {
        console.log('[啟動頁] 取得GetSessionKey失敗：', err);
        this.StartError = true;
        console.log('[啟動頁 StartError]', this.StartError);
        this.doNext().then(resolve, reject);
      };
      this.sessionkey.getKey().then(success, error)
    })
  }

  getAppVersion() {
    console.log('[啟動頁] 取得APP版本');
    return new Promise((resolve, reject) => {
      const success = (version_res) => {
        var versionObj = version_res;
        var nowVersion = this.appVersion.split('\.');
        var current = versionObj['Current'].split('\.');
        var min = versionObj['Minimum'].split('\.');
        console.log('[啟動頁] now version:' + this.appVersion + ' current version' + versionObj['Current'] + ' Minimum version' + versionObj['Minimum']);
        for (var i = 0; i < nowVersion.length; i++) {
          if (parseInt(nowVersion[i]) > parseInt(min[i])) {
            break;
          } else if (parseInt(nowVersion[i]) < parseInt(min[i])) {
            console.log('[啟動頁] 版本小於最小允許範圍，強制更新&Restart!');
            this.popup.setConfirm({
              content: "STARTAPP.MUST_UPDATE", // 強制更新
              checkTxt: "STARTAPP.UPDATE", // 更新
              keepOpen: true,
              event: () => {
                this.goStore();
              }
            });
            return;
          }
        }

        for (var i = 0; i < nowVersion.length; i++) {
          if (parseInt(nowVersion[i]) < parseInt(current[i])) {
            console.log('[啟動頁] 版本在允許範圍內，提示更新');
            /*this.popup.setPercentage({
              status: false
            })*/
            this.popup.setConfirm({
              content: "STARTAPP.LATEST_VERSION_UPDATE", // 有最新版本可以更新！！
              checkTxt: "STARTAPP.UPDATE", // 更新
              cancelTxt: "STARTAPP.CONTINUE", // 繼續
              event: () => {
                this.goStore();
              },
              errEvent: () => {
                this.doNext().then(success, error);
              }
            });
            return;
          } else if (parseInt(nowVersion[i]) > parseInt(current[i])) {
            break;
          }
        }
        console.log('[啟動頁] 版本一致');
        this.doNext().then(success, error);
      };
      const error = (err) => {
        console.log('[啟動頁] getVersioninfo Error', err);
        this.StartError = true;
        console.log('[啟動頁 StartError]', this.StartError);
        this.doNext().then(success, error);
      };
      this.getversion.getVersion().then(success, error);
    })
  }

  goStore() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android/i.test(userAgent)) {
      // 2019/04/11 ArnoChang 緊急修正startApp無法開啟store之問題
      window.open("https://play.google.com/store/apps/details?id=com.chinatrust.mpass");
      // window.startApp.set({ "action": "ACTION_VIEW", "uri": "https://play.google.com/store/apps/details?id=" + "com.chinatrust.mpass" }).start()
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.startApp.set("itms-apps://itunes.apple.com/app/" + "id1118299749").start()
    }
    //navigator['app'].exitApp();
  }


  appLang() {
    console.log('[啟動頁] 準備取得Device語系成功');
    return new Promise((resolve, reject) => {
      const success = (start_res) => {
        console.log('[啟動頁] 取得Device語系成功', start_res);
        this.doNext().then(resolve, reject);
      };
      const error = (err) => {
        console.log('[啟動頁] 取得Device語系失敗', err);
        reject(err);
      };
      this.appstart.setAppLang().then(success, error)
    })
  }
  verifyGetUrlServer() {
    return new Promise((resolve, reject) => {
      this.getWayUrl.getUrl().then((res) => {
        this.doVerifyServer(res).then(resolve, reject);
      }, (err) => {
        this.doNext().then(resolve, reject);
      })
    })
  }
  appStart() {
    return new Promise((resolve, reject) => {
      try {
        this.securityProvider.update();
      } catch (error) {
        console.log('[appStart] SecurityProvider error', error);
      }

      if (!this.network.IsConnect()) {
        this.StartError = true;
        this.index = this.functionList.length - 3;
        this.popup.setConfirm({
          content: "STARTAPP.ERROR_NET"
        })
        this.doNext().then(resolve, reject);
        return;
      }
      const success = (start_res) => {
        console.log('[啟動頁] appStart Ready!', start_res);
        this.doNext().then(resolve, reject);
      };
      const error = (err) => {
        console.log('[啟動頁] appStart Error', err);
        // 錯誤訊息
        let errMsg = this.langTran.instant("ERROR.ERROR_9997") + "(9997)";
        reject(errMsg);
      };
      this.appstart.AppStart().then(success, error)
    })
  }

  checkArea() {
    var areaCode = this.storage.get('Area');
    console.log('[啟動頁] 判斷是否首次啟用');
    // console.log('[STEP] GETWAYURL');
    if (typeof areaCode != 'undefined' && areaCode != '') {
      console.log('[啟動頁] 非首次啟用 > 取得公告資訊');
      this.doNext();
    } else {
      console.log('[啟動頁] 是首次啟用 > 進入預設區域頁');
      this.storage.set(Config.StartErrorKey, this.StartError);
      this.router.navigate(['/location']);
      //this.hidePercentage();
    }
  }

  checkAnnouncement() {

    this.getAnnouncement().then(
      (ans_res) => {
        console.log('[啟動頁 StartError]', this.StartError);
        this.storage.set(Config.StartErrorKey, this.StartError);
        //console.log('ans_res',ans_res);
        //this.hidePercentage();
        if (!this.storage.get('tour')) {
          this.router.navigate(['/tour']);
        } else {
          this.router.navigate(['/login']);
        }
        this.showTimeLog();
      },
      (ans_err) => {
        console.log('[啟動頁] 公告訊息取得失敗', ans_err);
        console.log('[啟動頁 StartError]', this.StartError);
        this.storage.set(Config.StartErrorKey, this.StartError);
        //this.hidePercentage();
        if (!this.storage.get('tour')) {
          this.router.navigate(['/tour']);
        } else {
          this.router.navigate(['/login']);
        }
        this.showTimeLog();
      }
    );
  }

  isTrust() {
    return new Promise((resolve, reject) => {
      const success = (res) => {
        console.log('[啟動頁] isTrust Ready!', res);
        if (res) {
          console.log('[啟動頁] 裝置可被信任', res);
          this.doNext().then(resolve, reject);
        } else {
          this.showMsgAndExit("STARTAPP.NOT_TRUST");
        }
      };
      const error = (err) => {
        this.showMsgAndExit("STARTAPP.NOT_TRUST");
      };
      this.trustedDevice.isTrusted().then(success, error);
    })
  }



  index: number;
  preTime: Date;
  preStatus;
  doNext() {
    return new Promise((resolve, reject) => {
      this.index += 1
      if (this.index < 0 || this.index >= this.functionList.length) {
        return;
      }
      var percent = ((this.index + 1) / this.functionList.length) * 100
      var status = ""
      var fun = this.functionList[this.index];
      this.showTimeLog();
      this.preTime = new Date();
      switch (fun) {
        case this.sqllight:
          //status = "STARTAPP.SQL"; //sql資料表建置
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.sqlset().then(resolve, reject);
          break;
        case this.AppLang:
          //status = "STARTAPP.LANG_INITIALIZE" // 語系初始化
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.appLang().then(resolve, reject);
          break;
        case this.IsTrust:
          //status = "STARTAPP.CHECK_TRUST_DEVICE" // 檢查是否為可信任裝置
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.isTrust().then(resolve, reject);;
          break;
        case this.AppStart:
          //status = "STARTAPP.APPLICATION_INITIALIZE" // 應用程式初始化
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.appStart().then(resolve, reject);;
          break;
        case this.GetUrl:
          //status = "STARTAPP.GET_CONNECT_INFO" // 取得連線資訊
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.getUrl().then(resolve, reject);;
          break;
        case this.VerifyServe:
          //status = "STARTAPP.VERIFY_SERVE" // 驗證網址
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.doVerifyServer(Config.URL).then(resolve, reject);
          break;
        case this.VerifyGetUrlServer:
          //status = "STARTAPP.VERIFY_SERVE" // 驗證網址
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.verifyGetUrlServer().then(resolve, reject);
          break;
        case this.GetSessionKey:
          //status = "STARTAPP.GET_SESSION" // 取得Session
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.getSessionKey().then(resolve, reject);;
          break;
        case this.GetAppVersion:
          //status = "STARTAPP.CHECK_VERSION_INFO" // 檢查版本資訊
          //this.preStatus = status;
          //this.showPercentage(status, percent);
          this.getAppVersion().then(resolve, reject);;
          break;
        case this.AppContentUpdate:
          this.router.navigate(["/update"], { queryParams: { page: 'start', index: this.index, StartError: this.StartError } }); // APP內容更新
          break;
        case this.CheckArea:
          //status = "STARTAPP.CHECK_AREA" // 檢查地區
          //this.preStatus = status;
          //this.showPercentage(status, 100);
          this.checkArea();
          break;
        case this.CheckAnnouncement:
          //status = "STARTAPP.GET_ANNOUNCE" // 取得公告
          //this.preStatus = status;
          //this.showPercentage(status, 100);
          this.checkAnnouncement();
          break;
      }


    });
  }
  showTimeLog() {
    if (this.preTime != undefined) {
      var now = new Date();
      var diff = now.getTime() - this.preTime.getTime()
      console.log("[啟動頁] ", this.preStatus, "花費時間:", diff)
    }
  }

  doVerifyServer(URL) {
    return new Promise((resolve, reject) => {
      const success = (res) => {
        console.log('[啟動頁] verify Server Ready!', res);
        this.doNext().then(resolve, reject);
      };
      const error = (err) => {
        console.log('[啟動頁] verify Server Error!', err);
        this.StartError = true;
        console.log('[啟動頁 StartError]', this.StartError);
        this.showMsgAndExit("STARTAPP.ERROR_OTHER");
        //this.doNext().then(resolve, reject);
      };
      this.verifyServer.doVerifyServer(URL).then(success, error);
    });
  }

  /* 進度條，11月若看到我請清一下註解 showPercentage(content, percent) {
    percent = Math.floor(percent)
    this.popup.setPercentage({
      status: true,
      content: content,
      percent: percent.toString(),
    })
  }
  hidePercentage() {
    this.popup.setPercentage({
      status: false
    })
  }*/
  getContentInfo() {
    console.log('[啟動頁] 讀取CONTEN INFO');
  }

  getAnnouncement() {
    console.log('[啟動頁] getAnnouncement');
    //統計未讀取的公告比數顯示於公告/儲存公告事項
    return new Promise((resolve, reject) => {
      this.announcementService.getAllAnnouncement(this.storage.get('area'), this.storage.get('Commonlang')).then(
        (announcement_res) => {
          console.log('[啟動頁] Announcement downloaded & Saved', announcement_res);
          resolve(announcement_res);
        },
        (announcement_err) => {
          console.log('[啟動頁] getAnnouncement Error', announcement_err);
          reject(announcement_err);
        }
      );
    });

  }

  showMsgAndExit(Msg) {
    this.popup.setConfirm({
      content: Msg,
      event: () => {
        //navigator['app'].exitApp();
      }
    });
  }


  redirecHome() {
    this.router.navigate(['/home']);
  };

  //sql light
  sqlset() {
    console.log('[啟動頁] 建置sqllight 資料表');
    return new Promise((resolve, reject) => {
      const success = (_res) => {
        console.log('[啟動頁] 建置sqllight 資料表 成功', _res);
        this.doNext().then(resolve, reject);
      };
      const error = (_err) => {
        console.log('[啟動頁] 建置sqllight 資料表失敗：', _err);
        this.StartError = true;
        console.log('[啟動頁 StartError]', this.StartError);
        this.showMsgAndExit("STARTAPP.ERROR_OTHER");
      };
      this.sql.createTable().then(success, error);
    })
  }

}


