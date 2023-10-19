import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoActiviteComponent } from './do-activite.component';

const routes: Routes = [
  {  path: '', component : DoActiviteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoActiviteRoutingModule {}
