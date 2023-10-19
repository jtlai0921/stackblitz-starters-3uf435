import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AgreedAccountComponent} from './agreed_account.component';

const routes: Routes = [
  {  path: '', component : AgreedAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule]
})
export class AgreedAccountRoutingModule {}
