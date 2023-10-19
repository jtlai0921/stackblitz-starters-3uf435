import { Directive, ElementRef, OnDestroy, NgZone, Renderer2 } from '@angular/core';
import { PopupService } from '../service/global/popup.service';
declare var window;

@Directive({
  selector: 'dropReload,[dropReload]'
})
export class DropReloadDirective {

  private _event: any;
  private _subscribe: any;
  private ele: any;
  private reloadBtn: any;

  private scrollTopY;
  private isTouchRegistered;
  private startY = 0;
  private relaod_style_height = 0;
  private maxY = 0;
  private isBackCancel = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private pop: PopupService,
    public ngZone: NgZone
  ) {
    console.log('DropReloadDirective Directive constructor');
    this._subscribe = this.pop.gesturesSetting.subscribe(
      (setting) => {
        if (setting.hasOwnProperty('reload')) {
          this._event = setting['reload'];
        }
        if (setting.hasOwnProperty('reload_close')) {
          if (setting['reload_close']) {
            // 關閉Reload圖示
            this.close();
            // 註銷Reload機制觸控事件
            // this.removeTouches();
            // 註銷滑動事件
            // this.ele.removeEventListener('scroll', this.touchScroll);
          }
        }
      }
    );
    renderer.addClass(el.nativeElement, "ios-scroll");
    this.ele = el.nativeElement;
  }

  ngAfterContentInit() {
    // 初始化下拉Reload機制控制事件
    this.event_set();
  }

  event_set() {
    var btn = document.createElement("div");
    // 取得裝置平台資訊
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // ios平台下拉reload圖示增加浮動效果，生成覆蓋於慣性滑動buffer區塊之效果
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
      btn.className = "refresh-loading-box ios-reload";
    else 
      btn.className = "refresh-loading-box";
    this.reloadBtn = btn;
    this.ele.parentElement.insertBefore(btn, this.ele);
    let str =
      '<div class="bubblingG">' +
      '<span id="bubblingG_1"></span>' +
      '<span id="bubblingG_2"></span>' +
      '<span id="bubblingG_3"></span>' +
      '</div>';
    this.reloadBtn.innerHTML += str;
    this.scrollTopY = 0;
    this.isTouchRegistered = true;
    this.ngZone.runOutsideAngular(() => {
      // [scroll] 用於控制重置reload機制相關監聽事件
      this.ele.addEventListener('scroll', this.touchScroll, false);
      // [touchstart] 用於反應畫面生成後，立刻操作reload手勢
      this.ele.addEventListener('touchstart', this.TouchStart, false);
    });
  }


  touchScroll = () => {
    // 取得當前卷軸位置
    this.scrollTopY = this.ele.scrollTop;
    console.log("[DropReloadDirective] touchScroll", this.scrollTopY, ', isTouchRegistered', this.isTouchRegistered);
    
    if (this.scrollTopY <= 0 && !this.isTouchRegistered) {
      console.log("[DropReloadDirective] regist reload touch event");
      // 畫面置頂時，註冊reload觸發事件 [touchstart]
      this.ele.addEventListener('touchstart', this.TouchStart, false);
      this.isTouchRegistered = true;
    } 
  }


  TouchStart = (e) => {
    var touchobj = e.changedTouches[0];
    console.log("[DropReloadDirective] TouchStart y =", touchobj.clientY);
    // 取得觸控起始點Y軸位置
    this.startY = Number(touchobj.clientY);
    this.maxY = this.startY;
    this.isBackCancel = false;

    // 註冊監聽手勢滑動位置，控制reload圖示顯示 [touchmove]
    this.ele.addEventListener('touchmove', this.TouchMove, false);
    // 註冊監聽手勢滑動終點，判斷執行reload作業與否 [touchend]
    this.ele.addEventListener('touchend', this.TouchEnd, false);
  }


  TouchMove = (e) => {
    var touchobj = e.changedTouches[0];
    console.log("[DropReloadDirective] TouchMove y =", touchobj.clientY, ", maxY =", this.maxY);

    // 紀錄滑動過程中Y軸最大值
    this.maxY = Number(touchobj.clientY) > this.maxY ? Number(touchobj.clientY) : this.maxY;

    // 計算Y軸移動差值
    var dist_y = Number(touchobj.clientY) - this.startY;
    console.log("[DropReloadDirective] TouchMove dist_y =", dist_y);

    if (!this.isBackCancel && dist_y > 30) {
      // 下滑為正，控制顯示reload圖示
      if (this.relaod_style_height == 0) {
        this.relaod_style_height = 60;
        this.reloadBtn.style.cssText = 'height:' + this.relaod_style_height + 'px;';
      } 
      // 下拉回推，取消reload
      if (this.maxY > (Number(touchobj.clientY) + 15)) {
        this.isBackCancel = true;
        this.close();
      }
    } 
    else {
      // 上滑為負，關閉reload圖示
      this.close();
      // 非置頂觸發時註銷所有reload相關觸控監聽
      if (this.scrollTopY > 0)
        this.removeTouches();   
    }
  }


  TouchEnd = (e) => {
    console.log("[DropReloadDirective] TouchEnd y =", e.changedTouches[0].clientY, ", maxY =", this.maxY, ", scrollTopY =", this.scrollTopY);
    /*
     * 觸發reload Event須具備以下條件：
     * (1) Reload圖示已完整顯示
     * (2) Reload事件處理函式存在
     */
    if (this.relaod_style_height == 60) {
      this.close();
      if (typeof this._event == 'function') {
      console.log('[DropReloadDirective] start reload event');
        this.pop.setLoading(true);
        this.ngZone.run(() => {
          this._event();
        });
      }
    }
  }

  /**
   * 關閉下拉Reload圖示
   */
  close() {
    console.log('[DropReloadDirective] close');
    this.relaod_style_height = 0;
    this.reloadBtn.style.cssText = 'height:' + this.relaod_style_height + 'px';
  }

  /**
   * 移除所有觸控事件監聽
   */
  removeTouches() {
    console.log("[DropReloadDirective] removeTouches");
    // 註銷所有reload相關事件
    this.ele.removeEventListener('touchstart', this.TouchStart);
    this.ele.removeEventListener('touchmove', this.TouchMove);
    this.ele.removeEventListener('touchend', this.TouchEnd);
    this.isTouchRegistered = false;
  }

  ngOnDestroy() {
    console.log("[DropReloadDirective] ngOnDestroy");
    this._subscribe.unsubscribe();  
  }
}