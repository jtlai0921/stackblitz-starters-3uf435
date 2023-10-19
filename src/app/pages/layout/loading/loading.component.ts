
/**
 * @description
 * @author Amit Mahida , Wei 20200820
 * @export
 */
import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '@pages/layout/loading/loading.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css', './loading.v2.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoadingComponent implements OnDestroy {
    loadingText = 'Loading';
    textZindex = 0;
    showSpinner = false; // 顯示

    private subscription: Subscription;
    private timeout = 0;
    private threshold = 500; // loading出現時間

    constructor(
        private _logger: Logger,
        private loadingService: LoadingService
    ) {
        this.createServiceSubscription();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    createServiceSubscription() {
        let thresholdTimer: any;
        let timeoutTimer: any;

        this.subscription = this.loadingService.loadingSubject.subscribe(show => {
            if (show) {
                // loading 顯示事件
                this.doLoadingShow(thresholdTimer, timeoutTimer);
            } else {
                // loading 隱藏事件
                this.doLoadingHide(thresholdTimer, timeoutTimer);
            }
        });
    }

    /**
     * loading 顯示事件
     */
    private doLoadingShow(thresholdTimer, timeoutTimer) {
        this._logger.step('Loading', 'show in component');
        if (thresholdTimer) {
            return;
        }
        thresholdTimer = setTimeout(() => {
            thresholdTimer = null;
            this.showSpinner = true;

            if (this.timeout !== 0) {
                timeoutTimer = setTimeout(() => {
                    timeoutTimer = null;
                    this.showSpinner = false;
                }, this.timeout);
            }
        }, this.threshold);

    }

    /**
     * loading 隱藏事件
     */
    private doLoadingHide(thresholdTimer, timeoutTimer) {
        this._logger.step('Loading', 'close in component');
        if (thresholdTimer) {
            clearTimeout(thresholdTimer);
            thresholdTimer = null;
        }
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
        }
        timeoutTimer = null;
        this.showSpinner = false;
    }

}