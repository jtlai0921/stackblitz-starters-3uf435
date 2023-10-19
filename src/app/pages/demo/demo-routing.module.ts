import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoMenuComponent } from '@pages/demo/demo-menu/demo-menu.component';

// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'demo-menu', pathMatch: 'full' },
  // Demo選單
  { path: 'demo-menu', component: DemoMenuComponent
    , data: {}
  },
  // 最新消息
  { path: 'demo-popup', loadChildren: './demo-popup/demo-popup.module#DemoPopupModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
