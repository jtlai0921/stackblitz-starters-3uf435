
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules';
//Route Module
import { CommonProblemRoutingModule } from './common_problem-routing.module';
import { CommonProblemComponent} from './common_problem.component';

import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module'
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { Base64Service } from '../../shared/service/global/base64.service';
import { DateTimeService } from '../../shared/service/global/daettime.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { HiBiometricAuthService } from '../../shared/service/cordova/HiBiometricAuth.service';
import { FAQInqService } from '../../shared/service/customize/FAQInqt.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';
import { PublicShareComponentModule } from '../../shared/component/public/public-share.modules';

@NgModule({
  imports: [
    CommonModule,
    CommonProblemRoutingModule,
    FormsModule,
    DirectiveShareModule,
    LangTransModule,
    PipeShareModule,
    PublicShareComponentModule
  ],
  declarations: [
    CommonProblemComponent,
  ],
  providers: [
    IDGateService,
    Base64Service,
    DateTimeService,
    LocalStorageService,
    HiBiometricAuthService,
    FAQInqService,
    LangTransService
  ]
})
export class CommonProblemModule { }
