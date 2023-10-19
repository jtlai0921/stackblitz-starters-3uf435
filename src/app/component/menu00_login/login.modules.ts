
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Route Module
import { LoginRoutingModule } from './login-routing.module';
import { LogInComponent } from './login.component';

import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module'
import { IDGateService } from '../../shared/service/cordova/IdGete.service';
import { Base64Service } from '../../shared/service/global/base64.service';
import { DateTimeService } from '../../shared/service/global/daettime.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { HiBiometricAuthService } from '../../shared/service/cordova/HiBiometricAuth.service';
import { QuickLoginService } from '../../shared/service/customize/quickLogin.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { PatternLockService } from '../../shared/service/global/patternLock.service';



@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    LangTransModule
  ],
  declarations: [
    LogInComponent
  ],
  providers: [
    IDGateService,
    Base64Service,
    DateTimeService,
    LocalStorageService,
    HiBiometricAuthService,
    QuickLoginService,
    LangTransService,
    PatternLockService
  ]
})
export class LoginModule { }
