import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginService } from './shared/login.service';
// import { FtLoginService } from './shared/ftlogin.service';
import { SharedModule } from '@systems/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BiometricService } from '@lib/plugins/biometric.service';
import { AlertModule } from '@template/msg/alert/alert.module';
import { ConfirmModule } from '@template/msg/confirm/confirm.module';
import { SPEC02010101ApiService } from '@api/spec02/spec02010101/spec02010101-api.service';
// import { CertService } from '@lib/plugins/tcbb/cert.service';
// import { CertificateService } from '@pages/security/shared/service/certificate.service';
// import { CheckSecurityModule } from '@shared/transaction-security/check-security/check-security.module';

// 電文
// import { PatternLockService } from '@shared/pattern-lock/pattern-lock.service';
// import { SecurityService } from '@pages/security/shared/service/security.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    AlertModule,
    ConfirmModule,
    // CheckSecurityModule
  ],
  providers: [
    LoginService,
    SPEC02010101ApiService
    // BiometricService,
    // FtLoginService,
    // CertService,
    // CertificateService,
    // PatternLockService,
    // SecurityService,
  ],
  declarations: [LoginPageComponent]
})
export class LoginModule { }
