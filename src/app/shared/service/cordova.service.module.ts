/**
 * Telegram模組
 */
import { NgModule } from '@angular/core';
//---cordova---//
import { CTBC_PlugIn } from './cordova/_interface';
import { CiperService } from './cordova/cipher.service';
import { DeviceService } from './cordova/device.service';
import { IDGateService } from './cordova/IdGete.service';
import { networkStateService } from './cordova/networkState.service';
import { PushService } from './cordova/push.service';
import { PreferredLanguageService } from'./cordova/globalization.servics';
import { WbcService } from './cordova/wbc.service';
import { FileService } from './cordova/file.service';
import { SocialShareService } from './cordova/socialShare.service';
import { UpdateSecurityProvider } from './cordova/updateSecurityProvider.service';
import { SQLlightService } from './cordova/sqllight/sqllight.service';
@NgModule({
  declarations: [],
  exports: [],
  imports: [],
  providers: [
    CiperService,
    DeviceService,
    IDGateService,
    networkStateService,
    PushService,
    PreferredLanguageService,
    WbcService,
    FileService,
    SocialShareService,
    UpdateSecurityProvider,
    SQLlightService
  ]
})
export class CordovaServiceModule {
  constructor(
  ) {
    console.log('CordovaServiceModule Start >>');
  }
}
