
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Route Module
import { AuthRoutingModule } from './auth-routing.module';
import { PublicShareComponentModule } from '../../shared/component/public/public-share.modules';

// Service Module
import { PendingAuthInqService } from '../../shared/service/customize/pendingAuthInq.service';
import { DoAuthorizeService } from '../../shared/service/customize/doAuthorize.service';
import { ForExRateDetailsInqService } from '../../shared/service/customize/forExRateDetailsInq.service';
import { PatternLockService } from '../../shared/service/global/patternLock.service';

// Component Module
import { AuthComponent } from './auth.component';
import { AuthDetailComponent } from './auth-detail/auth-detail.component';
import { AuthConfirmedComponent } from './auth-confirmed/auth-confirmed.component';
import { AuthResultComponent } from './auth-result/auth-result.component';
import { AuthCardComponent } from './auth-card/auth-card.component';

import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';
// import {SrollTopDirective} from '../../shared/directive/scrollTop.directive';
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules';
@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    LangTransModule,
    DirectiveShareModule,
    PipeShareModule,
    PublicShareComponentModule
  ],
  declarations: [
    AuthComponent,
    AuthDetailComponent,
    AuthConfirmedComponent,
    AuthResultComponent,
    AuthCardComponent
  ],
  providers: [
    PendingAuthInqService,
    DoAuthorizeService, 
    ForExRateDetailsInqService,
    PatternLockService
  ]
})
export class AuthModule { }
