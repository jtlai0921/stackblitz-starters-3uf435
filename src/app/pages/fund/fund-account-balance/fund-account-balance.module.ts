/**
 * 投資現值查詢Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { FundAccountBalanceRoutingModule } from './fund-account-balance-routing.module';
import { SharedModule } from '@systems/shared.module';
import { ExpandListModule } from '@template/expand/expand-list.module';
import { NoteModule } from '@template/note/note.module';
import { PaginatorCtrlModule } from '@template/paginator/paginator-ctrl.module';
import { ErrorBoxModule } from '@template/msg/error-box/error-box.module';
// ---------------- Pages Start ---------------- //
import { BalanceDetailComponent } from './fund-account-balance-detail/balance-detail.component';
import { BalanceMainComponent } from './fund-account-balance-main/balance-main.component';
import { BalanceContentComponent } from './fund-account-balance-content/balance-content.component';
// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { FundAccountBalanceService } from '../shared/fund-account-balance.service';
import { SPEC11010201ApiService } from '@api/spec11/spec11010201/spec11010201-api.service';


@NgModule({
    imports: [
        SharedModule,
        FundAccountBalanceRoutingModule,
        ExpandListModule,
        NoteModule,
        PaginatorCtrlModule, // 分頁機制
        ErrorBoxModule
        
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FundAccountBalanceService,
        // api
        SPEC11010201ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        BalanceDetailComponent,
        BalanceMainComponent,
        BalanceContentComponent

    ]
})
export class FundAccountBalanceModule { }
