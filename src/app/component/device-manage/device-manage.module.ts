/**
 * APP Module 載入
 */
// ==angular== //
import { NgModule } from '@angular/core';

import { OtpDeviceComponent } from './otp-device/otp-device.component';
import { RegisteredDeviceComponent } from './registered-device/registered-device.component';
import { CommonModule } from "@angular/common";
import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    LangTransModule,
    PipeShareModule
  ],
  declarations: [
    OtpDeviceComponent,
    RegisteredDeviceComponent
  ],
  providers: [
  ],
  entryComponents: [
    OtpDeviceComponent,
    RegisteredDeviceComponent
  ]
})
export class DeviceManageModule {
  constructor(
    // private _logger: Logger
  ) {
    // this._logger.error('AppModule Class Start >>');
  }
}
