/**
 * Route定義
 * 設定
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //
import { SettingComponent } from './setting.component';

const routes: Routes = [
  { path: 'menu', component: SettingComponent },
  // == 語言 == //
  {
    path: 'language', loadChildren: './language/language.module#LanguageModule'
    , data: {
      preload: false
    }
  },
  // == 系統資訊 == //
  {
    path: 'systeminfo', loadChildren: './systemInfo/systemInfo.module#SystemInfoModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
