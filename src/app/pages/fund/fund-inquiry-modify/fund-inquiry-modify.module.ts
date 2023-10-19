/**
 * 定期(不)定額查詢修改Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { FundInquiryModifyRoutingModule } from './fund-inquiry-modify-routing.module';
import { SharedModule } from '@systems/shared.module';
import { ExpandListModule } from '@template/expand/expand-list.module';
import { NoteModule } from '@template/note/note.module';
import { PaginatorCtrlModule } from '@template/paginator/paginator-ctrl.module';
import { ErrorBoxModule } from '@template/msg/error-box/error-box.module';
// ---------------- Pages Start ---------------- //
import { FundInquiryModifyMainComponent } from './fund-inquiry-modify-main/fund-inquiry-modify-main.component';
import { FundInquiryModifyDetailComponent } from './fund-inquiry-modify-detail/fund-inquiry-modify-detail.component';
import { FundInquiryModifyContentComponent } from './fund-inquiry-modify-content/fund-inquiry-modify-content.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //
import { SPEC11050101ApiService } from '@api/spec11/spec11050101/spec11050101-api.service';
import { FundInquiryModifyService } from '../shared/fund-inquiry-modify.service';

@NgModule({
    imports: [
        SharedModule,
        FundInquiryModifyRoutingModule,
        ExpandListModule,
        NoteModule,
        PaginatorCtrlModule, // 分頁機制
        ErrorBoxModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
        FundInquiryModifyService,
        // api
        SPEC11050101ApiService
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        FundInquiryModifyMainComponent,
        FundInquiryModifyDetailComponent,
        FundInquiryModifyContentComponent
    ]
})
export class FundInquiryModifyModule { }
