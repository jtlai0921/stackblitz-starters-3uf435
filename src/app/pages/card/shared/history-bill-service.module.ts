/**
 * 各期帳單及未出帳查詢 Service Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
// ---------------- Module Start ---------------- //
// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //
import { SPEC12010301ApiService } from '@api/spec12/spec12010301/spec12010301-api.service';
import { SPEC12010302ApiService } from '@api/spec12/spec12010302/spec12010302-api.service';
import { SPEC12010401ApiService } from '@api/spec12/spec12010401/spec12010401-api.service';
// ---------------- Service Start ---------------- //
import { HistoryBillService } from '@pages/card/shared/history-bill-main.service';

@NgModule({
    imports: [
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        SPEC12010301ApiService,
        SPEC12010302ApiService,
        SPEC12010401ApiService,
        HistoryBillService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
    ]
})
export class HistoryBillServiceModule { }
