import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { GetAnnouncementService } from '../../shared/service/customize/getAnnouncement.service';
import { PredefineTag } from '../../shared/service/global/predefineTag.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { networkStateService } from '../../shared/service/cordova/networkState.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'app-annou',
  templateUrl: './announcement.component.html'
})
export class AnnouncementComponent implements OnInit, AfterViewInit {

  public IsOpen = true; // 控制開啟公告列表頁
  public selected: any;
  public announcementsJson = [];
  public pager = 0;         //目前顯示筆數
  public pagerAdd = 20;     //每次增加筆數
  public pagerData = [];    //顯示資料筆數
  public showLoad = false;   //顯示下方載入更多
  public hasTop = false; // 控制顯示置頂公告區域
  public networkStatus = this.network.IsConnect(); // 網路連線狀態
  public loginStatus = this.storage.get('isLogin'); // 登入狀態

  constructor(
    public popup: PopupService,
    public layout: LayoutService,
    public storage: LocalStorageService,
    public announce: GetAnnouncementService,
    private network: networkStateService,
    private langTrans: LangTransService,
    private router: Router,
    private predefineTag: PredefineTag,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.BULLENTIN', // 最新公告
      rightIcon: false
    });
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
    if (!this.loginStatus) {
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }

    this.route.queryParams.subscribe(params => {
      // 從footerBar點擊icon回到當前功能頁面，關閉loading畫面
      this.IsOpen = true; 
      this.ngOnInit();
    });
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.getAnnouncement();
      }
    });
  }

  ngOnInit() {
    if (!this.networkStatus) {
      this.popup.setConfirm({
        content: 'BULLENTIN.CHECK_NETWORK', // 請確認網路連線以取得最新資訊！
        event: () => { }
      });
    }
    this.popup.setLoading(true);
    this.getAnnouncement();
  }

  /**
   * Query announcement API to get new data
   */
  getAnnouncement() {
    this.announce.getAllAnnouncement(this.storage.get('Area'), this.storage.get('Commonlang')).then(
      (res) => {
        console.log('[最新公告] 成功查詢最新公告: ', res);
        this.getStorageAnnouncement();
      },
      (error) => {
        console.log('[最新公告] 查詢最新公告失敗: ', error);
        this.getStorageAnnouncement();
      }
    );
  }

  /**
   * Get storaged announcement data
   */
  getStorageAnnouncement() {
    this.announce.getStorageAnnouncement(this.storage.get('Area'), this.storage.get('Commonlang')).then(
      (res) => {
        console.log('[最新公告] 取得資料庫系統公告成功: ', res);
        this.dataHandle(res);
        //關閉Reload Method
        this.popup.setGestures({
          'reload_close': true
        });
        this.popup.setLoading(false);
      },
      (error) => {
        console.log('[最新公告] 取得資料庫系統公告失敗: ', error);
        this.popup.setConfirm({ content: this.langTrans.instant('BULLENTIN.ERR_QUERY_FAILED') });
        //關閉Reload Method
        this.popup.setGestures({
          'reload_close': true
        });
        this.popup.setLoading(false);
      }
    );
  }

  /**
   * 公告資料處理
   * @param source 公告資料陣列 
   */
  dataHandle(source) {
    this.announcementsJson = [];

    let resultData = [];
    //如果有生效日期跟過期日，日期如果在生效期後過期日前才有效
    source.forEach(element => {
      
      if(element.EffectiveTime && element.ExpireTime){
        if(element.EffectiveTime !="" && element.ExpireTime != "" ){
          //EffectiveTime == 生效日，ExpireTim == 過期日
          //目前PostDate只給到8位ex:20180707，所以要做另外處理
          let EffectiveTime = element.EffectiveTime.substring(0,8);
          let ExpireTime = element.ExpireTime.substring(0,8);

          if(EffectiveTime<=element.PostDate && element.PostDate<=ExpireTime){
            resultData.push(element);
          }
        }
      }
    });

    source = resultData;



    //資料處理 加日期
    source.forEach(ele => {
      ele['date'] = '';
      var dateStr = ele['PostDate'] + '';
      if (dateStr.length == 8) {
        ele['date'] = dateStr.substring(4, 6) + '/' + dateStr.substring(6, 8);
        ele['fulldate'] = dateStr.substring(0, 4) + '/' + dateStr.substring(4, 6) + '/' + dateStr.substring(6, 8);
        if (ele['Content']) {
          var div = document.createElement('div');
          div.innerHTML = ele['Content'];
          ele['ListContent'] = div.innerText || div.textContent;

          var content = ele['Content'];
          ele['Content'] = this.predefineTag.PredefineTag(content);
          
          console.log(ele['Content'])

          
          ele['brief'] = (ele['Content'].length > 50) ? ele['Content'].substring(0, 50) + '...' : ele['Content'];
        }
      }
    });
    //排序
    source.sort((a, b) => {
      var diff = a['PostDate'] - b['PostDate'];
      return (diff == 0) ? 0 : (diff > 0) ? -1 : 1;
    });
  
    this.announcementsJson = source;
    this.LoadPage();
  }

  toggle() {
    this.IsOpen = !this.IsOpen;
    if (this.IsOpen) {
      this.selected = null;
    }
    setTimeout(() => {
      //註冊手勢事件 下滑Reload
      this.popup.setGestures({
        //註冊Reload事件
        'reload': () => {
          //初始化資料數據
          this.getAnnouncement();
        }
      });
    }, 500)  
  }

  onSelect(item) {
    console.log('Selected:', item);
    this.selected = item;
    this.IsOpen = !this.IsOpen;
    this.layout.setHeaderStatus({
      rightIcon: false,
      backEvent: () => {
        this.toggle();
      }
    });
    if (!this.loginStatus) {
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }
  }

  LoadPage() {
    if (this.announcementsJson.length > this.pager + this.pagerAdd) {
      this.pager += this.pagerAdd;
      this.pagerData = this.announcementsJson.slice(0, this.pager);
      this.showLoad = true;
    } else {
      this.pagerData = this.announcementsJson;
      this.showLoad = false;
    }
  }


  
}


