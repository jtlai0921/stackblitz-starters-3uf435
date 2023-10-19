/**
 * 定存基本資料查詢Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { TimeDepositAllAccountRoutingModule } from './time-deposit-all-account-routing.module';
import { SharedModule } from '@systems/shared.module';
// ---------------- Pages Start ---------------- //
import { MainComponent } from './main/main.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        TimeDepositAllAccountRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        MainComponent
    ]
})
export class TimeDepositAllAccountModule { }
