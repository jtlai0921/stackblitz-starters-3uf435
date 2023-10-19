/**
 * 台幣轉帳Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { TwdTransferRoutingModule } from './twd-transfer-routing.module';
import { SharedModule } from '@systems/shared.module';
// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        TwdTransferRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
    ]
})
export class TwdTransferModule { }
