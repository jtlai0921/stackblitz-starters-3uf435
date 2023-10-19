import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountEnquiryComponent } from './account-enquiry.component';
import { ReservationQueryComponent } from './reservationQuery/reservationQuery.component';
import { TranslogComponent } from './translog/translog.component';

const routes: Routes = [
  { path: '', component: AccountEnquiryComponent },
  { path: 'translog', component: TranslogComponent },
  { path: 'reservationQuery', component: ReservationQueryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
