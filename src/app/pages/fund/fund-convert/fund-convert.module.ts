/**
 * 基金轉換Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { FundConvertRoutingModule } from './fund-convert-routing.module';
import { SharedModule } from '@systems/shared.module';
// ---------------- Pages Start ---------------- //
import { MainComponent } from './main/main.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        FundConvertRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        MainComponent
    ]
})
export class FundConvertModule { }
