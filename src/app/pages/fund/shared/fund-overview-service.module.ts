/**
 * 投資總覽 Service Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
// ---------------- Module Start ---------------- //
// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //
import { SPEC11010301ApiService } from '@api/spec11/spec11010301/spec11010301-api.service';
// ---------------- Service Start ---------------- //
import { FundOverviewService } from './fund-overview.service';

@NgModule({
    imports: [
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        SPEC11010301ApiService,
        FundOverviewService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
    ]
})
export class FundOverviewServiceModule { }