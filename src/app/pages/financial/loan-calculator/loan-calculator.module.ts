/**
 * 貸款本息攤還試算Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { LoanCalculatorRoutingModule } from './loan-calculator-routing.module';
import { SharedModule } from '@systems/shared.module';
import { StepBarModule } from '@template/stepbar/step-bar.module';

// ---------------- Pages Start ---------------- //
import { LoanCalculatorMainComponent } from './main/loan-calculator-main.component';
import { LoanCalculatorResultComponent } from './loan-calculator-result/loan-calculator-result.component';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        LoanCalculatorRoutingModule,
        StepBarModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        LoanCalculatorMainComponent,
        LoanCalculatorResultComponent
    ]
})
export class LoanCalculatorModule { }
