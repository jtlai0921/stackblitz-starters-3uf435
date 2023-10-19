/**
 * 外幣兌換Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { ForeignTransferRoutingModule } from './foreign-transfer-routing.module';
import { SharedModule } from '@systems/shared.module';
import { MenuPopupModule } from '@template/list/menu-popup/menu-popup.module';
import { BookmarkModule } from '@template/bookmark/bookmark.module';
import { StepBarModule } from '@template/stepbar/step-bar.module';
import { FlagFormateModule } from '@template/formate/view/flag/flag-formate.module';
import { CurrencyFlagPopupModule } from '@template/list/currency-flag/currency-flag-popup.module';
import { ExchangeRateServiceModule } from '@pages/financial/shared/service/exchange-rate-service.module';

// ---------------- Pages Start ---------------- //
import { ForeignTransferMainComponent } from './main/foreign-transfer-main.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        ForeignTransferRoutingModule,
        MenuPopupModule,
        BookmarkModule,
        StepBarModule,
        FlagFormateModule,
        CurrencyFlagPopupModule,
        ExchangeRateServiceModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        ForeignTransferMainComponent
    ]
})
export class ForeignTransferModule { }
