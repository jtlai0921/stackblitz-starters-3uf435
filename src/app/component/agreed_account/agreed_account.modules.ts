
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Route Module
import { AgreedAccountRoutingModule } from './agreed_account-routing.module';
import { AgreedAccountComponent } from './agreed_account.component';
import { AgreedAccountComfirmComponent } from './agreed_account_comfirm/agreed_account_comfirm.component';
import { AgreedAccountFinishComponent } from './agreed_account_finish/agreed_account_finish.component';

import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module'
import { FundXferAddService } from '../../shared/service/customize/fundXferAdd.service';
import { PatternLockService } from '../../shared/service/global/patternLock.service';

import { PayeeAcctInqService } from '../../shared/service/customize/payeeAcctInq.service';
import { GetRelAcctInqService } from '../../shared/service/customize/getRelAcctInq.service';
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { SocialShareService } from '../../shared/service/cordova/socialShare.service';
import { Base64Service } from '../../shared/service/global/base64.service';
import { DateTimeService } from '../../shared/service/global/daettime.service';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    AgreedAccountRoutingModule,
    FormsModule,
    LangTransModule,
    PipeShareModule
  ],
  declarations: [
    AgreedAccountComponent,
    AgreedAccountComfirmComponent,
    AgreedAccountFinishComponent
  ],
  providers: [
    FundXferAddService,
    PayeeAcctInqService,
    GetRelAcctInqService,
    IDGateService,
    Base64Service,
    DateTimeService,
    SocialShareService,
    PatternLockService
  ]
})
export class AgreedAccountModule { }
