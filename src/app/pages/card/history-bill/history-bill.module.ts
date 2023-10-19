/**
 * 各期帳單及未出帳查詢Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { ExpandListModule } from '@template/expand/expand-list.module';
// ---------------- Module Start ---------------- //
import { HistoryBillRoutingModule } from './history-bill-routing.module';
import { SharedModule } from '@systems/shared.module';
import { CardSelectMonthModule } from '../card-select-month/card-select-month.module';
import { CardMonthPopupModule } from '@template/list/card-month-popup/card-month-popup.module';
import { PaymentStatusModule } from '../payment-status/payment-status.module';
import { CardsAmountComponentModule } from '@template/deposit/cards-amount/cards-amount-component.module'; // 金額處理
// ---------------- Pages Start ---------------- //
import { HistoryBillMainComponent } from './history-bill-main/history-bill-main.component';
import { HistoryBillDetailComponent } from './history-bill-detail/history-bill-detail.component';
import { HistoryBillInfoComponent } from './history-bill-info/history-bill-info.component';
import { HistoryBillUnpaidComponent } from './history-bill-unpaid/history-bill-unpaid.component';
// import { CardSwiperDirective } from '@pages/card/shared/card-swiper.directive';
// ---------------- API Start ---------------- //
// import { SPEC12010301ApiService } from '@api/spec12/spec12010301/spec12010301-api.service';
// import { SPEC12010302ApiService } from '@api/spec12/spec12010302/spec12010302-api.service';
// import { SPEC12010401ApiService } from '@api/spec12/spec12010401/spec12010401-api.service';
// ---------------- Service Start ---------------- //
import { HistoryBillService } from '@pages/card/shared/history-bill-main.service';
import { HistoryBillServiceModule } from '@pages/card/shared/history-bill-service.module';
import { CardSwiperModule } from '@template/card-swiper/card-swiper.module';
import { CardDetailShowYearModule } from '@template/card-detail-show-year/card-detail-show-year.module';

@NgModule({
    imports: [
        SharedModule,
        HistoryBillRoutingModule,
        ExpandListModule,
        CardSelectMonthModule,
        CardMonthPopupModule,
        PaymentStatusModule,
        HistoryBillServiceModule,
        CardSwiperModule,
        CardDetailShowYearModule,
        CardsAmountComponentModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        HistoryBillService,
        // SPEC12010301ApiService,
        // SPEC12010302ApiService,
        // SPEC12010401ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        HistoryBillMainComponent,
        HistoryBillDetailComponent,
        HistoryBillInfoComponent,
        HistoryBillUnpaidComponent,
        // CardSwiperDirective
    ]
})
export class HistoryBillModule { }
