import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PersonalInfo } from './personal-info';
import { HeaderOptions } from './header-options';
import { LocalStorageService } from '@lib/storage/local-storage.service';
// import { MENU_SETTING } from '@conf/menu/main-menu';
import { ObjectUtil } from '@util/formate/modify/object-util';

@Injectable({
    providedIn: 'root'
})
export class HeaderCtrlService {

    // -- data -- //
    disableReturnCount: number;
    disableNativeReturnSubject: Subject<boolean> = new Subject<boolean>();
    changeLeftBtnClick: Subject<any> = new Subject<any>();
    changeRightBtnClick: Subject<any> = new Subject<any>();
    changeOption: Subject<any> = new Subject<any>();
    updateOptionSubject: Subject<any> = new Subject<any>();
    // -- event -- //
    onLeftEventClickSubject: Subject<any> = new Subject<any>(); // 左側事件點擊控制

    // changePersonalInfo: Subject<any> = new Subject<any>();
    // closeMenuSubject: Subject<any> = new Subject<any>();
    // displayNavSliderFrameSubject: Subject<any> = new Subject<any>();
    // changeSliderSubject: Subject<any> = new Subject<any>();
    // checkFinishSubject: Subject<any> = new Subject<any>();
    closePopupSubject: Subject<any> = new Subject<any>();
    constructor(
        private localStorage: LocalStorageService,
    ) {
        this.disableReturnCount = 0;
        // this.initSliderMenu();
    }

    // initSliderMenu() {
    //   // 取localstorage 若取不到用預設選單
    //   const sliderSetting = this.localStorage.getObj(this.sliderMenuKey);

    //   /*  chengWei 20-04-10 目前短解 ，待選單改為ID清單對應優化後可刪除
    //       針對線上取號以設定選單的人更新localStorage URL
    //       Strat
    //   */
    //   const changeSliderSetting = this.localStorage.getObj('converSliderUrlFlag');
    //   if (sliderSetting && !changeSliderSetting) {
    //     let converSliderMenu = [];
    //     sliderSetting.forEach((item) => {
    //       if (item['name'] == 'FUNC_SUB.OTHER.OTN'  || item['name'] == 'MAIN_MENU.TICKET') {
    //         item['url'] = 'take-number';
    //       }
    //       converSliderMenu.push(item);
    //     });
    //     this.localStorage.setObj(this.sliderMenuKey, converSliderMenu);
    //     this.localStorage.setObj('converSliderUrlFlag', true);
    //   }
    //    /*  END chengWei 20-04-10 目前短解 */
    //   // this.sliderMenu = sliderSetting || MENU_SETTING.SLIDER;
    // }

    /**
     * 更新選單
     * @param newSliderMenu 新排序選單
     */
    // updateSliderMenu(newSliderMenu) {
    //   this.sliderMenu = newSliderMenu;
    //   this.localStorage.setObj(this.sliderMenuKey, this.sliderMenu);
    //   this.changeSliderSubject.next(this.sliderMenu);
    // }

    // getSliderMenu(): any[] {
    //   return ObjectUtil.clone(this.sliderMenu);
    // }

    /**
     * 設定個人資訊(存款餘額/信用卡消費)
     * @param info 個人資訊
     */
    // setPersonalInfo(info: PersonalInfo) {
    //   this.changePersonalInfo.next(info);
    // }

    /**
     * 清除Body的class屬性
     */
    // resetBodyClass() {
    //   const classList = [];
    //   const frameZones = Array.from(document.body.classList);
    //   frameZones.forEach((item) => classList.push(item));
    //   // document.body.classList.forEach((item) => classList.push(item));
    //   classList.forEach((item) => document.body.classList.remove(item));
    // }

    /**
     * 設定Body的class 屬性
     * @param classList class清單
     */
    // setBodyClass(classList: string[]) {
    //   this.resetBodyClass();
    //   classList.forEach((item) => document.body.classList.add(item));
    // }

    /**
     * 設定Header樣式
     * @param style 樣式名稱 normal/login
     */
    setHeaderStyle(style: string) {
        const option = new HeaderOptions();
        option.style = style;
        this.setOption(option);
    }

    /**
     * 設定Header選項
     * @param option Header設定
     * @param isCreate false:使用當前頁面header樣式更新/true:使用預設header樣式更新
     */
    setOption(option, isCreate?: boolean) {
        if (isCreate) {
            this.changeOption.next(option);
        } else {
            this.updateOptionSubject.next(option);
        }
    }

    /**
     * 更新Header選項
     * @param option Header設定
     */
    // updateOption(option) {
    //   this.updateOptionSubject.next(option);
    // }

    closePopup() {
        this.closePopupSubject.next();
    }

    /**
     * 設定左邊按鈕
     * @param clickLeft 對應Function
     */
    setLeftBtnClick(clickLeft: any) {
        this.changeLeftBtnClick.next(clickLeft);
    }

    /**
     * 設定右邊按鈕
     * @param clickRight 對應Function
     */
    setRightBtnClick(clickRight: any) {
        this.changeRightBtnClick.next(clickRight);
    }

    /**
     * 點選左側選單
     */
    onLeftClickEvent(e: any) {
        this.onLeftEventClickSubject.next(e);
    }

    /**
     * 關閉選單
     */
    // closeMenu() {
    //   this.closeMenuSubject.next();
    // }

    /**
     * 設定是否顯示NavSliderFrame
     * @param display 顯示狀態
     */
    // displayNavSliderFrame(display: boolean) {
    //   this.displayNavSliderFrameSubject.next(display);
    // }

    disableNativeReturn(disable: boolean) {
        if (disable) {
            this.disableReturnCount += 1;
            this.disableNativeReturnSubject.next(true);
        } else {
            this.disableReturnCount -= 1;
            if (this.disableReturnCount <= 0) {
                this.disableReturnCount = 0;
                this.disableNativeReturnSubject.next(false);
            }
        }

    }

    /**
     *
     */
    // setCheckFinishStatus(checkFinish: boolean) {
    //   this.checkFinishSubject.next(checkFinish);
    // }

}
