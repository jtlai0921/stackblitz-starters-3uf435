/**
 * [樣版] 啟動首頁廣告
 */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
// --- library --- //
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { FormateService } from '@template/formate/formate.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';

@Component({
    selector: 'app-start-home-ad',
    templateUrl: './start-home-ad.component.html',
    styleUrls: [],
    providers: []
})
export class StartHomeAdComponent implements OnInit {
    /**
     * 參數處理
     */
    // @Input() setData: Array<object>; 
    // @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    adData: Array<any>;
    openFlag = false;

    constructor(
        private _logger: Logger,
        private errorHandler: HandleErrorService,
        private _formateService: FormateService,
        private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.getData();
    }

    /**
     * 廣告列表顯示/隱藏事件
     * 動畫效果在css內: .beforeLogin_event_container的transition
     */
    onClick() {
        if (!this.openFlag) {
            // 關->開
            this.openFlag = true;
        } else {
            // 開->關
            this.openFlag = false;
        }
    }

    /**
     * 選單事件(主頁籤)
     * @param menu 選單
     */
    onGoEvent(menu) {
        let go_path = this._formateService.checkField(menu, 'url');
        if (!go_path) {
            // this.errorHandler.handleError({}, 'EMPTY_LINK');
            // 不顯示錯誤，即無反應
            return false;
        }
        this.navgator.push(go_path);
    }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 取廣告
     */
    private getData(): Promise<any> {
        let output = [
            {
                title: '精選組合投資首選',
                content: '洞燭市場先機！依不同族群，由專家團隊打造的精選投資組合！',
                img: 'assets/images/login_event_3.png',
                url: 'acocountonline',
                url_title: '看更多'
            }
            , {
                title: '線上開戶e指通',
                content: '存款利率最高1.2％<br> 悠遊卡自動加值最高2%<br> 自動化通路免手續費最高15次',
                img: 'assets/images/login_event_1.png',
                url: 'acocountonline',
                url_title: '看更多'
            }
            // 無連結不提供按鈕
            , {
                title: '精選組合投資首選',
                content: '洞燭市場先機！依不同族群，由專家團隊打造的精選投資組合！',
                img: 'assets/images/login_event_2.png',
                url: '',
                url_title: ''
            }
        ];

        this.adData = output;
        return Promise.resolve(output);
    }


}
