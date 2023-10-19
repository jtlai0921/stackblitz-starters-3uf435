/**
 * 外幣匯率popup
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

// ---------------- Model Start ---------------- //
import { TranslateModule } from '@ngx-translate/core';
import { RateFormateModule } from '@template/formate/number/rate/rate-formate.module';
import { FlagFormateModule } from '@template/formate/view/flag/flag-formate.module';
// import { BookmarkModule } from '@shared/template/select/bookmark/bookmark.module'; // 頁籤
// ---------------- Pages Start ---------------- //
import { CurrencyFlagPopupComponent } from './currency-flag-popup.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { CurrencyFlagPopupService } from './currency-flag-popup.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        OverlayModule,
        TranslateModule,
        FlagFormateModule,
        RateFormateModule,
        // BookmarkModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        CurrencyFlagPopupService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        CurrencyFlagPopupComponent
    ],
    exports: [
        CurrencyFlagPopupComponent
    ],
    entryComponents: [
      CurrencyFlagPopupComponent
    ]
})
export class CurrencyFlagPopupModule { }
