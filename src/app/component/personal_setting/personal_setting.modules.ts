
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Route
import { PersonalSettingRoutingModule } from './personal_setting-routing.module'
//Share Module
import { LangTransModule} from '../../shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules'
//Component
import { PersonalSettingComponent } from './personal_setting.component';
import {ExcessAmountComponent} from './excess_amount/excess_amount.component';
import {ExcessAmountNoticeComponent} from './excess_amount_notice/excess_amount_notice.component';
import {BalanceNoticeComponent} from './balance_notice/balance_notice.component';
import {BalanceNoticeEditComponent} from './balance_notice_edit/balance_notice_edit.component';
import {ExchangeRatePriceComponent} from './exchange_rate_price/exchange_rate_price.component';
import {ExchangeRatePriceEditComponent} from './exchange_rate_price_edit/exchange_rate_price_edit.component';
import {AmountNoticeComponent} from './amount_notice/amount_notice.component';
import {AmountNoticeEditComponent} from './amount_notice_edit/amount_notice_edit.component';

//Service
import { ForExRateDetailsInqService } from '../../shared/service/customize/forExRateDetailsInq.service';
import { NotifyListInqService } from '../../shared/service/customize/notifyListInq.service';
import { NotifyListModService } from '../../shared/service/customize/notifyListMod.service';

@NgModule({
  imports: [
    CommonModule,
    PersonalSettingRoutingModule,
    FormsModule,
    LangTransModule,
    PipeShareModule,
    DirectiveShareModule
  ],
  declarations: [
    PersonalSettingComponent,
    ExcessAmountComponent,
    ExcessAmountNoticeComponent,
    BalanceNoticeComponent,
    BalanceNoticeEditComponent,
    ExchangeRatePriceComponent,
    ExchangeRatePriceEditComponent,
    AmountNoticeComponent,
    AmountNoticeEditComponent
  ],
  providers:[
    ForExRateDetailsInqService,
    NotifyListInqService,
    NotifyListModService
  ]
})
export class PersonalSettingModule { }
