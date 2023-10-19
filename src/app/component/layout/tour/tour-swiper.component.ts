import { Component, OnInit, AfterViewInit, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../../../../assets/configuration/config';
import { TOUR_SETTING } from '../../../../assets/configuration/tour';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { PopupService } from '../../../shared/service/global/popup.service';
declare var Swiper: any; // 引用外部javascript

@Component({
  selector: 'app-tour-swiper',
  templateUrl: './tour-swiper.component.html'
})
export class TourSwiperComponent implements OnInit {

  public pageSwiper: any;
  public imgsSwiper = [];
  public tourData = [];
  public translateX;

  constructor(
    public layout: LayoutService,
    public storage : LocalStorageService,
    private router: Router,
    private popup: PopupService, 
    private zone: NgZone
  ) {
    this.layout.setHeaderStatus({ status: false });
  }

  ngOnInit(){
    console.log('[導覽頁] tour-swiper');
    this.getTourData();    
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.pageSwiper = new Swiper('#swiper1', {
        on: {
          touchStart: (event) => {
            if (this.pageSwiper.isEnd) {
              this.translateX = this.pageSwiper.translate;
            }
          },
          touchEnd: (event) => {
            if (this.pageSwiper.isEnd) {
              if (this.pageSwiper.translate < this.translateX - 100) {
                this.gotoLoginPage();
              }
            }
          }
        }
      });
  
      let imgSwiper;
      this.tourData.forEach((data, index) => {
        if (data.imgs.length > 1) {
          imgSwiper = new Swiper('#imgSwiper' + index, {
            allowTouchMove: false,
            effect: 'fade',
            speed: Config.imgSpeed,
            loop: true,
            resistanceRatio: 0,
            autoplay: {
              delay: Config.imgInterval,
              stopOnLastSlide: false,
            },
          });
        } else {
          imgSwiper = null;
        }
  
        this.imgsSwiper.push(imgSwiper);
      });
    });
  }

  /**
   * [前端事件綁定] 點擊分頁器項目，自動滑動至指定導覽頁
   * @param index 分頁序號
   */
  onPaginationClick(index) {
    this.zone.runOutsideAngular(() => {
      console.log('[導覽頁] onPaginationClick index =', index);
      this.pageSwiper.slideTo(index);
    });
  }

  /**
   * [前端事件綁定] 點擊立即啟用按鈕
   */
  onStartClick(){
    console.log('[導覽頁] onStartClick');
    this.gotoLoginPage();
  }

  /**
   * 根據使用者身分取得對應之導覽資料
   */
  getTourData() {
    this.tourData = TOUR_SETTING;
    console.log('[導覽頁] getTourData tourData length =', this.tourData.length);
  }

  /**
   * 轉頁至登入畫面
   */
  gotoLoginPage() {
    this.zone.run(() => {
      // 紀錄已閱讀完畢導覽資訊之標記
      this.storage.set('tour', true);
      this.popup.setLoading(true);
      this.router.navigate(['/login']);
    });
  }
}
