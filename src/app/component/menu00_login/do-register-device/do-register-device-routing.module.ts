import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoRegisterDeviceComponent } from './do-register-device.component';


const routes: Routes = [
  {  path: '', component : DoRegisterDeviceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoRegisterDeviceRoutingModule {}
