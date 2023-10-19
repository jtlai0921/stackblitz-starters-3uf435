import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
// import { ShareModule } from '../app/shared/share.module'; // 全域使用的library
import { LangTransModule } from './shared/pipe/langTransPipe/lang-trans.module';
import { StartComponent } from './component/app_start/start.component';

import { AnnouncementComponent } from './component/annou/announcement.component';
import { LanguageComponent } from './component/language/language.component';
import { PasswordChangeComponent } from './component/password_change/password_change.component';


import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { CommonProblemComponent } from './component/menu_common_problem/common_problem.component';
import { SelectLocationComponent } from './component/select-location/select-location.component';
import { DefaultCurrencyComponent } from './component/default-currency/default-currency.component';
import { QuickLoginComponent } from './component/quick-login/quick-login.component';
import { DeviceManageComponent } from './component/device-manage/device-manage.component';
import { UserSettingComponent } from './component/user-setting/user-setting.component';
import { UserSettingChangeComponent } from './component/user_setting_change/user_setting_change.component';
import { LogoutComponent } from './component/logout/logout.component';
import { UserCodeChangeComponent } from './component/user_code_change/user_code_change.component';
import { OtpComponent } from './component/menu01_otp/otp.component';
import { PersonalSettingComponent } from './component/personal_setting/personal_setting.component';
import { CheckNetActivateGuard } from './shared/guard/CheckNetActivate.guard';


import {
  HeaderComponent,
  FooterComponent,
  MenuComponent,
  HomeComponent,
  TourSwiperComponent
} from './component/layout';
import { AppModule } from './app.module';
import { DefaultLoginPageComponent } from './component/defaultLoginPage/defaultLoginPage.component';


export const ROUTE: Routes = [
  {
    path: '',
    redirectTo: '/start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    component: StartComponent,
    data: {}
  },
  {
    path: 'login',
    loadChildren: './component/menu00_login/login.modules#LoginModule'
  },
  {
    path: 'do_register_device',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/menu00_login/do-register-device/do-register-device.modules#DoRegisterDeviceModule'
  },
  {
    path: 'do_activite',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/menu00_login/do-activite/do-activite.modules#DoActiviteModule'
  },
  {
    path: 'do_change_password',
    canActivate:[CheckNetActivateGuard],
    component: PasswordChangeComponent,
    data: {}
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate:[CheckNetActivateGuard],
    data: {}
  },
  //Lazy Load Example
  {
    path: 'example',
    loadChildren: './component/example/example.modules#ExampleModule'
  },
  {
    path: 'tour',
    component: TourSwiperComponent,
    data: {}
  },
  {
    path: 'annou',
    component: AnnouncementComponent,
    data: {}
  },
  {
    path: 'lang',
    component: LanguageComponent,
    data: {}
  },
  {
    path: 'otp',
    component: OtpComponent,
    data: {}
  },
  {
    path: 'contact',
    component: ContactUsComponent,
    data: {}
  },
  {
    path: 'qa',
    loadChildren: './component/menu_common_problem/common_problem.modules#CommonProblemModule'
  },
  {
    path: 'location',
    component: SelectLocationComponent,
    data: {}
  },
  {
    path: 'default_currency',
    canActivate:[CheckNetActivateGuard],
    component: DefaultCurrencyComponent,
    data: {}
  },
  {
    path: 'quick_login',
    component: QuickLoginComponent,
    data: {}
  },
  {
    path: 'device-manage',
    canActivate:[CheckNetActivateGuard],
    component: DeviceManageComponent,
    data: {}
  },
  {
    path: 'user-setting',
    canActivate:[CheckNetActivateGuard],
    component: UserSettingComponent,
    data: {}
  },
  {
    path: 'user-setting-change',
    canActivate:[CheckNetActivateGuard],
    component: UserSettingChangeComponent,
    data: {}
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {}
  },
  {
    path: 'agreed_account',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/agreed_account/agreed_account.modules#AgreedAccountModule'
  },
  {
    path: 'user_code_change',
    canActivate:[CheckNetActivateGuard],
    component: UserCodeChangeComponent,
    data: {}
  },
  {
    path: 'personal_setting',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/personal_setting/personal_setting.modules#PersonalSettingModule'
  },
  {
    path: 'account_enquiry',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/account-enquiry/account-enquiry.modules#AccountModule'
  },
  {
    path: 'authorization',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/auth/auth.modules#AuthModule'
  },
  {
    path: 'defaultLoginPage',
    canActivate:[CheckNetActivateGuard],
    component: DefaultLoginPageComponent,
    data: {}
  },
  {
    path: 'finance',
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/finance/finance.module#FinanceModule'
  },
  {
    path: 'notification', 
    canActivate:[CheckNetActivateGuard],
    loadChildren: './component/notification/notification.modules#NotificationModule'
  },
  {
    path: 'update', 
    loadChildren: './component/appUpdate/appUpdate.modules#AppUpdateModule'
  }
];
//OtpComponent ContactUsComponent CommonProblemComponent SelectLocationComponent

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTE),
    LangTransModule
    //, ShareModule
    // ==Pie== //

    // ==Directive== //

    // ==Component== //

  ],
  exports: [
    RouterModule
  ],
  providers: [

  ],
  declarations: [
    // OtpComponent,
    // ContactUsComponent,
    // SelectLocationComponent
  ]
})
export class AppRoutingModule { }