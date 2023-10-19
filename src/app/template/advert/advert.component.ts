/**
 * [樣版] 廣告輪播牆
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FormateService } from '@template/formate/formate.service';
import { AdvertService } from './advert.service';
declare var Swiper: any;

@Component({
    selector: 'app-advert',
    templateUrl: './advert.component.html',
    styleUrls: [],
    providers: []
})
export class AdvertComponent implements OnInit {
    /**
     * 參數處理
     */
    private swiper: any;
    advertData = [];

    constructor(
        private _logger: Logger,
        private handleError: HandleErrorService,
        private _formateService: FormateService,
        private _mainService: AdvertService
    ) { }

    ngOnInit() {
        this._logger.log("into AdvertComponent");
        // 先取得假資料,待開規格(不一定正確)
        this._mainService.getAdvertData().then(
            (result) => {
                this.advertData = result.data;
                this._logger.log("advertData:", this.advertData);
            },
            (errorObj) => {
                this.handleError.handleError(errorObj);
            }
        );
        // this.doSwiper();
    }

    /**
     * 接收card-swiper.directive.ts 返回
     * @param e 
     */
    onSwiperBackEvent(e) {
        this._logger.log("into onSwiperBackEvent AdvertComponent");
        this.doSwiper();
    }

    // swiper設定
    doSwiper() {
        this._logger.log("into doSwiper AdvertComponent");
        if (typeof Swiper != 'function') {
            this._logger.log("into swiper error");
            return false;
        }
        this._logger.log("into do swiper AdvertComponent");
        if (!(this.swiper instanceof Swiper)) {
            this._logger.log("Swiper doEvent new swiper");
            this.swiper = new Swiper('.swiper-container_ad', {
                slidesPerView: 'auto',  // 設置slider容器能同時顯示的slides數量
                centeredSlides: true,   // 設定為true時，活動塊會居中，而不是默認狀態下的居左
                spaceBetween: 20,       // 兩個區塊間距
                pagination: {
                    el: '.swiper-pagination_ad',
                    clickable: true,      // 設置為true時，點擊分頁的指示點會控制Swiper切換
                }
            });
        } else {
            this._logger.log("Swiper doEvent update");
            this.swiper.update(true);
            //   this.swiper.slideTo(0); // 若改變帳號切回顯示第一筆
        }
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}
