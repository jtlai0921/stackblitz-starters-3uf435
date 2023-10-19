import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules';
import { PublicShareComponentModule } from '../../shared/component/public/public-share.modules';

import { FinanceRoutingModule } from './finance-routing.module';
import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { ForExRateDetailsInqService } from '../../shared/service/customize/forExRateDetailsInq.service';
import { IntRateDetailsInqService } from '../../shared/service/customize/doIntRateDetailsInq.service';
import { CurrencyService } from '../../shared/service/customize/Currency.service';
import { DateTimeService } from '../../shared/service/global/daettime.service';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';

import { FinanceRootComponent } from './financeRoot/financeRoot.component';
import { ExchangeRateQueryComponent } from './exchangeRateQuery/exchangeRateQuery.component';
import { InterestRateQueryComponent } from './interestRateQuery/interestRateQuery.component';
import { ExchangeRateConverterComponent } from './exchangeRateConverter/exchangeRateConverter.component';
import { ExchangeRateCustomCurrencyComponent } from './exchangeRateCustomCurrency/exchangeRateCustomCurrency.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LangTransModule,
    DirectiveShareModule,
    FinanceRoutingModule,
    PipeShareModule,
    PublicShareComponentModule
  ],
  declarations: [
    FinanceRootComponent,
    ExchangeRateQueryComponent,
    ExchangeRateConverterComponent,
    InterestRateQueryComponent,
    ExchangeRateCustomCurrencyComponent
  ],
  providers: [
    ForExRateDetailsInqService,
    IntRateDetailsInqService,
    CurrencyService,
    DateTimeService
  ]
})
export class FinanceModule { }
