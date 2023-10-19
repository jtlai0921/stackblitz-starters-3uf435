import { Directive, ElementRef, AfterViewChecked, Input, NgZone } from '@angular/core';
import { PopupService } from '../service/global/popup.service';
@Directive({
  selector: 'gestures,[gestures]'
})
export class GesturesDirective {

  private mainDom: any;
  private _subscribe;

  private reloadFunction: any;
  private swipe_Up: any = () => { console.log('swipe_Up'); };
  private swipe_Down: any = () => { console.log('swipe_Down'); };
  private swipe_Left: any = () => { console.log('swipe_Left'); };
  private swipe_Right: any = () => { console.log('swipe_Right'); };
  private timeOut_flag = false;
  private startx = 0;
  private starty = 0;
  private h_percent = 0;
  private w_percent = 0;

  constructor(
    private el: ElementRef,
    private pop: PopupService,
    public ngZone: NgZone
  ) {

    console.log('GesturesDirective constructor');
    //設定偵測
    this._subscribe = this.pop.gesturesSetting.subscribe(
      (setting: object) => {
        console.log('Regist Swiper Event', setting);
        //取消所有事件
        if (setting['dispose']) {
          this.reloadFunction = null;
          this.swipe_Up = null;
          this.swipe_Down = null;
          this.swipe_Right = null;
          this.swipe_Left = null;
        } else {
          this.swipe_Up = (setting.hasOwnProperty('up')) ? setting['up'] : this.swipe_Up;
          this.swipe_Down = (setting.hasOwnProperty('down')) ? setting['down'] : this.swipe_Down;
          this.swipe_Right = (setting.hasOwnProperty('right')) ? setting['right'] : this.swipe_Right;
          this.swipe_Left = (setting.hasOwnProperty('left')) ? setting['left'] : this.swipe_Left;
        }
      }
    );


    this.mainDom = el.nativeElement;
    this.swiper_Set();
  }

  swiper_Set() {
    // 手勢更新
    var creenHeight = screen.height;
    var creenWidth = screen.width;
    this.ngZone.runOutsideAngular(() => {
      this.mainDom.addEventListener('touchstart', this.TouchStart, false);
    });
  }

  TouchStart = (e) => {
    console.log('TouchStart');
    this.mainDom.addEventListener('touchmove', this.TouchMove, false);
    var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
    this.startx = Number(touchobj.clientX) // get x position of touch point relative to left edge of browser
    this.starty = Number(touchobj.clientY) // get x position of touch point relative to left edge of browser
    this.timeOut_flag = true;
    this.h_percent = 0;
    this.w_percent = 0;
    // setTimeout(() => {
    //   this.timeOut_flag = false;
    //   this.mainDom.removeEventListener('touchmove', this.TouchMove);
    // }, 100);
  }

  TouchMove = (e) => {
    console.log('TouchMove');
    var touchobj = e.changedTouches[0] // reference first touch point for this event
    var dist_x = Number(touchobj.clientX) - this.startx;
    var dist_y = Number(touchobj.clientY) - this.starty;

    // swipe_Right
    if (document.getElementById('homeBall') == this.mainDom) {
      if (dist_x > 0 && Math.abs(dist_x) > Math.abs(dist_y)) {
        (typeof this.swipe_Right == 'function') ? this.swipe_Right() : null;
        this.mainDom.removeEventListener('touchmove', this.TouchMove);
      }
    }

    // swipe_Left
    if (document.getElementById('homeBall') == this.mainDom) {
      if (dist_x < 0 && Math.abs(dist_x) > Math.abs(dist_y)) {
        (typeof this.swipe_Left == 'function') ? this.swipe_Left() : null;
        this.mainDom.removeEventListener('touchmove', this.TouchMove);
      }
    }

    // swipe_Up
    if (document.getElementById('homeSection') == this.mainDom) {
      if (dist_y < 0 && Math.abs(dist_y) > Math.abs(dist_x)) {
        (typeof this.swipe_Up == 'function') ? this.swipe_Up() : null;
      }
    }

    // swipe_Down
    if (document.getElementById('homeBall') == this.mainDom) {
      if (dist_y > 0 && Math.abs(dist_y) > Math.abs(dist_x)) {
        (typeof this.swipe_Down == 'function') ? this.swipe_Down() : null;
      }
    }
    
  }


  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }
}