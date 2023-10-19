/**
 * 導覽頁
 */
import { NgModule } from '@angular/core';
import { GuideRoutingModule } from './guide-routing.module';
import { SharedModule } from '@systems/shared.module';
// ---------------- Model Start ---------------- //
// ---------------- Pages Start ---------------- //
import { GuidePageComponent } from './guide-page/guide-page.component';
// ---------------- API Start ---------------- //
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //

@NgModule({
  imports: [
    SharedModule,
    GuideRoutingModule
  ],
  exports: [
    GuidePageComponent
  ],
  declarations: [
    GuidePageComponent
  ]
})
export class GuideModule { }
