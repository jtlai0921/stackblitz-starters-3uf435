/**
 * 理財妙管家Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { AutoFundRedeemRoutingModule } from './auto-fund-redeem-routing.module';
import { SharedModule } from '@systems/shared.module';
import { ExpandListModule } from '@template/expand/expand-list.module';
import { NoteModule } from '@template/note/note.module';
import { PaginatorCtrlModule } from '@template/paginator/paginator-ctrl.module';
import { ErrorBoxModule } from '@template/msg/error-box/error-box.module';
// ---------------- Pages Start ---------------- //
import { FundRedeemMainComponent } from './auto-fund-redeem-main/auto-fund-redeem-main.component';
import { FundRedeemDetailComponent } from './auto-fund-redeem-detail/auto-fund-redeem-detail.component';
import { FundRedeemContentComponent } from './auto-fund-redeem-content/auto-fund-redeem-content.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { AutoFundRedeemService } from '../shared/auto-fund-redeem.service';
import { SPEC11060101ApiService } from '@api/spec11/spec11060101/spec11060101-api.service';
@NgModule({
    imports: [
        SharedModule,
        AutoFundRedeemRoutingModule,
        ExpandListModule,
        NoteModule,
        PaginatorCtrlModule, // 分頁機制
        ErrorBoxModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        AutoFundRedeemService,
        // api
        SPEC11060101ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        FundRedeemMainComponent,
        FundRedeemDetailComponent,
        FundRedeemContentComponent

    ]
})
export class AutoFundRedeemModule { }
