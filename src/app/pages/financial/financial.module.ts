/**
 * 金融資訊Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { SharedModule } from '@systems/shared.module';
import { FinancialRoutingModule } from './financial-routing.module';
import { MenuTempModule } from '@template/list/menu/menu-temp.module';


// ---------------- Pages Start ---------------- //
import { FinancialComponent } from './financial.component';

// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    FinancialRoutingModule,
    MenuTempModule
  ],
  providers: [
    // ---------------- Service Start ---------------- //

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    FinancialComponent
  ]
})
export class FinancialModule { }

