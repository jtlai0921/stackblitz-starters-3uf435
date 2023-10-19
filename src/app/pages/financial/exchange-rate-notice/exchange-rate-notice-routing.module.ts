/**
 * Route定義
 * 匯率到價通知設定
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ---------------- Pages Start ---------------- //
import { ExchangeRateNoticeMainComponent } from './main/exchange-rate-notice-main.component';
import { ExchangeRateNoticeSettingComponent } from './notice-setting/exchange-rate-notice-setting.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  , {
    path: 'main', component: ExchangeRateNoticeMainComponent
  }
  , {
    path: 'setting', component: ExchangeRateNoticeSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateNoticeRoutingModule { }
