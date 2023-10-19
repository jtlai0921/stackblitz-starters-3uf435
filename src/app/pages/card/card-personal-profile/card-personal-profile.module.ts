/**
 * 信用卡現況查詢Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { CardPersonalProfileRoutingModule } from './card-personal-profile-routing.module';
import { SharedModule } from '@systems/shared.module';
import { CardPersonalProfileServiceModule } from '../shared/card-personal-profile-service.module';
// ---------------- Pages Start ---------------- //
import { CardPersonalProfileMainComponent } from './card-personal-profile-main/card-personal-profile-main.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        CardPersonalProfileRoutingModule,
        CardPersonalProfileServiceModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        CardPersonalProfileMainComponent
    ]
})
export class CardPersonalProfileModule { }
