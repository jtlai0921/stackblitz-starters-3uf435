/**
 * 立即轉定存Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { CompositToTimeRoutingModule } from './composit-to-time-routing.module';
import { SharedModule } from '@systems/shared.module';
// ---------------- Pages Start ---------------- //

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        CompositToTimeRoutingModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
    ]
})
export class CompositToTimeModule { }
