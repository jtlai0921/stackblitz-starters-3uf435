import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Component
import { PersonalSettingComponent } from './personal_setting.component';
import {ExcessAmountComponent} from './excess_amount/excess_amount.component';
import {ExcessAmountNoticeComponent} from './excess_amount_notice/excess_amount_notice.component';
import {BalanceNoticeComponent} from './balance_notice/balance_notice.component';
import {BalanceNoticeEditComponent} from './balance_notice_edit/balance_notice_edit.component';
import {AmountNoticeComponent} from './amount_notice/amount_notice.component';
import {AmountNoticeEditComponent} from './amount_notice_edit/amount_notice_edit.component';
import {ExchangeRatePriceComponent} from './exchange_rate_price/exchange_rate_price.component';
import {ExchangeRatePriceEditComponent} from './exchange_rate_price_edit/exchange_rate_price_edit.component';
const routes: Routes = [
  {  path: '',
     component : PersonalSettingComponent,
     data: {}
  },
  {
    path: 'excess_amount',
    component: ExcessAmountComponent,
    data: {}
  },
  {
    path: 'excess_amount_notice',
    component: ExcessAmountNoticeComponent,
    data: {}
  },
  {
    path: 'balance_notice',
    component: BalanceNoticeComponent,
    data: {}
  },
  {
    path: 'balance_notice_notice',
    component: BalanceNoticeEditComponent,
    data: {}
  },
  {
    path: 'exchange_rate_price',
    component: ExchangeRatePriceComponent,
    data: {}
  },
  {
    path: 'exchange_rate_price_edit',
    component: ExchangeRatePriceEditComponent,
    data: {}
  },{
    path: 'exchange_rate_price_edit',
    component: ExchangeRatePriceEditComponent,
    data: {}
  },{
    path: 'exchange_rate_price_edit',
    component: ExchangeRatePriceEditComponent,
    data: {}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule]
})
export class PersonalSettingRoutingModule {}
