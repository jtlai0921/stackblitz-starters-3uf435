import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppUpdateComponent } from './appUpdate.component';

const routes: Routes = [
  { path: '', component : AppUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppUpdateRoutingModule {}
