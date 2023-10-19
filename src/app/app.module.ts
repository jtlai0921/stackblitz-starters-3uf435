/**
 * APP Module 載入
 */
// == Angular == //
import { NgModule, ErrorHandler } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// == APP ==//
import { AppRoutingModule } from './app-routing.module'; // routing
import { AppComponent } from './app.component';

// == Component ==//
import { LayoutModule } from './component/layout/layout.modules';
import { DeviceManageModule } from './component/device-manage/device-manage.module';
import { StartComponent } from './component/app_start/start.component';
import { AnnouncementComponent } from './component/annou/announcement.component';
import { LanguageComponent } from './component/language/language.component'
import { DefaultCurrencyComponent } from './component/default-currency/default-currency.component';
import { QuickLoginComponent } from './component/quick-login/quick-login.component';
import { DeviceManageComponent } from './component/device-manage/device-manage.component';
import { UserSettingComponent } from './component/user-setting/user-setting.component';
import { UserSettingChangeComponent } from './component/user_setting_change/user_setting_change.component';
import { LogoutComponent } from './component/logout/logout.component';
import { UserCodeChangeComponent } from './component/user_code_change/user_code_change.component';
import { PasswordChangeComponent } from './component/password_change/password_change.component';
import { OtpComponent } from './component/menu01_otp/otp.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { SelectLocationComponent } from './component/select-location/select-location.component';
import { DefaultLoginPageComponent } from './component/defaultLoginPage/defaultLoginPage.component';

// == Custom Module == //
import { ShareModule } from './shared/share.module'; // 全域使用的library
import { LangTransModule } from './shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from './shared/pipe/publicPipe/pipe.module';
import { GlobalServiceModule } from './shared/service/global.service.module';
import { TelegramModule } from './shared/telegram/telegram.module';
import { PopupComponentModule } from './shared/component/popup/pop.modules';
import { PublicShareComponentModule } from './shared/component/public/public-share.modules';

// == Custom Service == //
import { ApiTestService } from './shared/service/customize/apiTest.service';
import { PredefineTag } from './shared/service/global/predefineTag.service';
import { StartService } from './shared/service/customize/start.service';
import { DeviceManageDynamicComponentService } from './component/device-manage/device-manage-dynamic-component.service';
import { DoLoginService } from './shared/service/customize/doLogin.service';
import { FunctionListService } from './shared/service/customize/functionList.service';
import { QuickLoginService } from './shared/service/customize/quickLogin.service';
import { PatternLockService } from './shared/service/global/patternLock.service';
import { ErrorCatcherService } from './shared/service/global/errorCatcher.service';

// == Cordova Plugin == //
import { CordovaServiceModule } from './shared/service/cordova.service.module';
import { PINBlockService } from './shared/service/cordova/pinBlock.service';
import { VerifyServer } from './shared/service/cordova/verifyServer.service';
import { HiBiometricAuthService } from './shared/service/cordova/HiBiometricAuth.service';
import { TrustedDeviceService } from './shared/service/cordova/trustedDevice.service';

// == Directive ==//
import { DirectiveShareModule } from './shared/directive/directive.share.modules';
import { DeviceManageDynamicComponentDirective } from './component/device-manage/device-manage-dynamic-component.directive';

// == Guard ==//
import { CanDeactivateGuard } from './shared/guard/CanDeactivate.guard';
import { CheckNetActivateGuard } from './shared/guard/CheckNetActivate.guard';

// == Api Service == //
import { GetAppVersionInfoService } from './shared/service/customize/getAppVersionInfo.service';
import { GetAnnouncementService } from './shared/service/customize/getAnnouncement.service';
import { UserParaInqService } from './shared/service/customize/userParaInq.service';
import { UserParaModService } from './shared/service/customize/userParaMod.service';
import { GetRelCustInqService } from './shared/service/customize/getRelCustInq.service';
import { GetRelAcctInqService } from './shared/service/customize/getRelAcctInq.service';
import { GetAcctSummInqService } from './shared/service/customize/getAcctsumminq.service'; 
import { GetAcctOverviewInqService } from './shared/service/customize/getAcctoverviewinq.service';
import { LoanAcctDetailsInqService } from './shared/service/customize/loanAcctDetailsInq.service';
import { UpdateMobileSessionService } from './shared/service/customize/updateMobileSession.service';
import { DeviceUserInqService } from './shared/service/customize/deviceUserInq.service';
import { CASAActivityInqService } from './shared/service/customize/CASAActivityInq.service';
import { TDDetailInqRqService } from './shared/service/customize/TDDetailInqRq.service';
import { TDSummInqRqService } from './shared/service/customize/TDSummInqRq.service';
import { STDetailInqRqService } from './shared/service/customize/stDetailInqRq.service';
import { FundXferInqService } from './shared/service/customize/fundXferInq.service';
import { FundXferModService } from './shared/service/customize/fundXferMod.service';
import { DoDomColInqService } from './shared/service/customize/doDomColInq.service';
import { DoChkIssueInqService } from './shared/service/customize/doChkIssue.service';
import { AgreementAddService } from './shared/service/customize/agreementAdd.service';
import { E2eeParaInqService } from './shared/service/customize/e2eeParaInq.service';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    // ===== i18n ====== //
    LangTransModule,
    // ===== Pipe ====== //
    PipeShareModule,
    // ==Global Module== //
    CordovaServiceModule,
    GlobalServiceModule,
    TelegramModule,
    LayoutModule,
    DirectiveShareModule,
    PopupComponentModule,
    PublicShareComponentModule,
    // ==Route Module== //
    AppRoutingModule,
    DeviceManageModule
  ],
  declarations: [
    AppComponent,
    StartComponent,
    AnnouncementComponent,
    LanguageComponent,
    DefaultCurrencyComponent,
    QuickLoginComponent,
    DeviceManageComponent,
    DeviceManageDynamicComponentDirective,
    UserSettingComponent,
    UserSettingChangeComponent,
    LogoutComponent,
    UserCodeChangeComponent,
    PasswordChangeComponent,
    OtpComponent,
    ContactUsComponent,
    SelectLocationComponent,
    DefaultLoginPageComponent,
  ],
  providers: [
    // ==For App Start== //
    { provide: ErrorHandler, useClass: ErrorCatcherService},
    PredefineTag,
    GetAppVersionInfoService,
    GetAnnouncementService,
    GetRelCustInqService,
    GetRelAcctInqService,
    GetAcctSummInqService,
    StartService,
    DoLoginService,
    HiBiometricAuthService,
    DeviceManageDynamicComponentService,
    PINBlockService,
    DeviceUserInqService,
    FunctionListService,
    CASAActivityInqService,
    TDDetailInqRqService,
    TDSummInqRqService,
    STDetailInqRqService,
    FundXferInqService,
    FundXferModService,
    TrustedDeviceService,
    ApiTestService,
    GetAcctOverviewInqService,
    UserParaInqService,
    UserParaModService,
    LoanAcctDetailsInqService,
    QuickLoginService,
    DoDomColInqService,
    DoChkIssueInqService,
    UpdateMobileSessionService,
    VerifyServer,
    CanDeactivateGuard,
    CheckNetActivateGuard,
    PatternLockService,
    AgreementAddService,
    E2eeParaInqService
],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
  ) {
    console.log('AppModule Class Start >>');
  }
}
