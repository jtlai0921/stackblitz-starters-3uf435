/**
 * 投資總覽Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { SharedModule } from '@systems/shared.module';
import { ExpandListModule } from '@template/expand/expand-list.module';
import { NoteModule } from '@template/note/note.module';
import { PaginatorCtrlModule } from '@template/paginator/paginator-ctrl.module';
import { FundOverviewRoutingModule } from './fund-overview-routing.module';

// ---------------- Pages Start ---------------- //
import { FundOverviewComponent } from './fund-overview-main/fund-overview.component';
import { FundOverviewService } from '../shared/fund-overview.service';
import { SPEC11010301ApiService } from '@api/spec11/spec11010301/spec11010301-api.service';
// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //


@NgModule({
    imports: [
        SharedModule,
        FundOverviewRoutingModule,
        ExpandListModule,
        NoteModule,
        PaginatorCtrlModule // 分頁機制
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FundOverviewService,
        // api
        SPEC11010301ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        FundOverviewComponent
    ]
})
export class FundOverviewModule { }
