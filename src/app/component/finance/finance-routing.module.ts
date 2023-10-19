import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceRootComponent } from './financeRoot/financeRoot.component';
import { CanDeactivateGuard } from '../../shared/guard/CanDeactivate.guard';


const routes: Routes = [
  {
    path: '',
    component: FinanceRootComponent,
    canDeactivate:[CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
