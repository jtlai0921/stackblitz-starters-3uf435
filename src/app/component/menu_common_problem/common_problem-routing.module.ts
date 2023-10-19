import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CommonProblemComponent} from './common_problem.component';
const routes: Routes = [
  {  path: '', component : CommonProblemComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule]
})
export class CommonProblemRoutingModule {}
