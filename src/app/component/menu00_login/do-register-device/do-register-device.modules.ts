
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Route Module
import { DoRegisterDeviceComponent } from './do-register-device.component';
import { DoRegisterDeviceRoutingModule } from './do-register-device-routing.module';


import { LangTransModule } from '../../../shared/pipe/langTransPipe/lang-trans.module'
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LangTransModule,
    DoRegisterDeviceRoutingModule
  ],
  declarations: [
    DoRegisterDeviceComponent,
  ],
  providers: [
    LocalStorageService,
  ]
})
export class DoRegisterDeviceModule { }
