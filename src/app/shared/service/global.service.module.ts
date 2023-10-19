/**
 * 全域共用Service
 */
import { NgModule } from '@angular/core';

//---global---//
import { Base64Service } from './global/base64.service';
import { DateTimeService } from './global/daettime.service';
import { GetSessionKeyService } from './global/getSessionKey.service';
import { GetWayUrlService } from './global/getwayUrl.service';
import { LayoutService } from './global/layout.service';
import { LocalStorageService } from './global/localStorage.service';
import { SecurytyService } from './global/security.service';
import { PopupService } from './global/popup.service';
import { HexadecimalService } from './global/hexadecimal.service';
import { TimerService } from './global/timer.service';
import { SortByService } from './global/sortby.service';
import { CheckService } from './global/check.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    Base64Service,
    DateTimeService,
    GetSessionKeyService,
    GetWayUrlService,
    LayoutService,
    LocalStorageService,
    SecurytyService,
    PopupService,
    HexadecimalService,
    SortByService,
    CheckService
  ],
  exports: [],
})
export class GlobalServiceModule {
  constructor(
  ) {
    console.log('GlobalServiceModule Start >>');
  }
}
