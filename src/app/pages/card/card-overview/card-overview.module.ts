/**
 * 信用卡總覽Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
// ---------------- Module Start ---------------- //
import { CardOverviewRoutingModule } from './card-overview-routing.module';
import { HistoryBillServiceModule } from '../shared/history-bill-service.module';
import { BonusConvertHistoryServiceModule } from '../shared/bonus-convert-history-service.module';
import { SharedModule } from '@systems/shared.module';
import { PaymentStatusModule } from '../payment-status/payment-status.module';
import { CardPersonalProfileServiceModule } from '../shared/card-personal-profile-service.module';
// ---------------- Pages Start ---------------- //
import { CardOverviewComponent } from './card-overview.component';
// import { CardSwiperDirective } from '../shared/card-swiper.directive';
// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { CardOverviewService } from '../shared/card-overview.service';
import { AdvertModule } from '@template/advert/advert.module';
import { CardSwiperModule } from '@template/card-swiper/card-swiper.module';

@NgModule({
    imports: [
        SharedModule,
        CardOverviewRoutingModule,
        HistoryBillServiceModule, // 各期,未出帳查詢 API
        BonusConvertHistoryServiceModule, // 兌換紅利相關 API
        CardPersonalProfileServiceModule, // 信用卡現況查詢
        PaymentStatusModule,
        AdvertModule,
        CardSwiperModule
        // CardSelectMonthModule,
        // CardMonthPopupModule,
        // PaymentStatusModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        CardOverviewService,
        // SPEC12010301ApiService,
        // SPEC12010302ApiService,
        // SPEC12010401ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        CardOverviewComponent,
        // HistoryBillMainComponent,
        // HistoryBillDetailComponent,
        // HistoryBillInfoComponent,
        // HistoryBillUnpaidComponent,
        // CardSwiperDirective
    ]
})
export class CardOverviewModule { }
