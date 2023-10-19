import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangTransModule} from '../../pipe/langTransPipe/lang-trans.module';
import {PopupService} from '../../service/global/popup.service';

import {PopLoadingComponent} from './pop-loading.component';
import {PopConfirmComponent} from './pop-confirm.component';
import { PopInputComponent } from './pop-input.component'
import { PopCheckListComponent } from './pop-checklist.component';
import {PopSelectComponent} from './pop-select.component';
//import {PopGesturesComponent} from './pop-gestures.component';
import {PopPercentComponent} from './pop-percent.component';
import {DatepickerPopComponent} from './datepicker-pop.component';
import { PopTransQueryComponent } from './pop-transquery.component';
import { PopDepositSummaryComponent } from './pop-depositSummary.component';
import { PopDepositDetialComponent } from './pop-depositDetial.component';
import { PopPatternLockComponent } from './pop-patternLock.component';
import { PopQuickLoginTermsComponent } from './pop-quickLoginTerms.component';
import { PopKeyboardComponent } from './pop-keyboard.component';
import { DirectiveShareModule } from '../../directive/directive.share.modules';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LangTransModule,
    DirectiveShareModule
  ],
  declarations: [ 
    PopLoadingComponent,
    PopConfirmComponent,
    PopInputComponent,
    PopCheckListComponent,
    PopSelectComponent,
    //PopGesturesComponent,
    PopPercentComponent,
    DatepickerPopComponent,
    PopTransQueryComponent,
    PopDepositSummaryComponent,
    PopDepositDetialComponent,
    PopPatternLockComponent,
    PopQuickLoginTermsComponent,
    PopKeyboardComponent
  ],
  providers: [
    PopupService
  ],
  exports: [
    PopLoadingComponent,
    PopConfirmComponent,
    PopInputComponent,
    PopCheckListComponent,
    PopSelectComponent,
    //PopGesturesComponent,
    PopPercentComponent,
    DatepickerPopComponent,
    PopTransQueryComponent,
    PopDepositSummaryComponent,
    PopDepositDetialComponent,
    PopPatternLockComponent,
    PopQuickLoginTermsComponent,
    PopKeyboardComponent
  ]
})

export class PopupComponentModule {
  constructor(){
    console.log('PopupComponentModule Start >>');
  }
 }
