import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitService } from '@systems/system/init/init.service';
// import { TrustedDeviceService } from '@lib/plugins/trusted-device.service';
// import { CertService } from '@lib/plugins/tcbb/cert.service';
import { UrlSchemeHandlerService } from './url-scheme-handler.service';
import { CheckVersionService } from './check-version.service';
import { SPEC01030101ApiService } from '@api/spec01/spec01030101/spec01030101-api.service';



@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    InitService,
    UrlSchemeHandlerService,
    CheckVersionService,
    SPEC01030101ApiService
    // TrustedDeviceService,
    // CertService
  ],
  declarations: [  ]
})
export class InitModule {}
