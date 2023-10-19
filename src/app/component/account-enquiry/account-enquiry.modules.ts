
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules';
import { PublicShareComponentModule } from '../../shared/component/public/public-share.modules';
//Route Module
import { AccountRoutingModule } from './account-enquiry-routing.module';
//Pipe
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module'

import { AccountEnquiryComponent } from './account-enquiry.component';
import { DepositSummaryComponent } from './deposit-summary/deposit-summary.component';
import { DepositDetialComponent } from './deposit-detial/deposit-detial.component';
import { LoanSummaryComponent } from './loan-summary/loan-summary.component';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';
import { BillCollectionComponent } from './billCollection/billCollection.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { TranslogComponent } from './translog/translog.component';
import { TranslogDetailComponent } from './translog-detail/translog-detail.component';
import { ReservationQueryComponent } from './reservationQuery/reservationQuery.component';
import { ReservationQuerySingleDetailsComponent } from './reservationQuerySingleDetails/reservationQuerySingleDetails.component';
import { ReservationQueryCycleDetailsComponent } from './reservationQueryCycleDetails/reservationQueryCycleDetails.component';
import { SortByService } from '../../shared/service/global/sortby.service';


@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    LangTransModule,
    DirectiveShareModule,
    PublicShareComponentModule,
    PipeShareModule
  ],
  declarations: [
    AccountEnquiryComponent,
    DepositSummaryComponent,
    DepositDetialComponent,
    LoanSummaryComponent,
    LoanDetailComponent,
    BillCollectionComponent,
    AccountMenuComponent,
    TranslogComponent,
    TranslogDetailComponent,
    ReservationQueryComponent,
    ReservationQuerySingleDetailsComponent,
    ReservationQueryCycleDetailsComponent
  ],
  providers: [
    SortByService
  ]
})
export class AccountModule { }
