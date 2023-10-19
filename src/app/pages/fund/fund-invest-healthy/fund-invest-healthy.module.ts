/**
 * 投資組合分析Module
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';

// ---------------- Module Start ---------------- //
import { FundInvestHealthyRoutingModule } from './fund-invest-healthy-routing.module';
import { SharedModule } from '@systems/shared.module';
import { FundOverviewServiceModule } from '../shared/fund-overview-service.module';
import { ChartDoughnutComponentModule } from '@template/chart/chart-doughnut/chart-doughnut.component.module';
// ---------------- Pages Start ---------------- //
import { FundInvestHealthyMainComponent } from './fund-invest-healthy-main/fund-invest-healthy-main.component';
import { FundInvestHealthyTotalComponent } from './fund-invest-healthy-total/fund-invest-healthy-total.component';
import { FundInvestHealthyAnalysisComponent } from './fund-invest-healthy-analysis/fund-invest-healthy-analysis.component';
import { ExpandListModule } from '@template/expand/expand-list.module';

// ---------------- API Start ---------------- //

// ---------------- Service Start ---------------- //

@NgModule({
    imports: [
        SharedModule,
        FundInvestHealthyRoutingModule,
        FundOverviewServiceModule,
        ExpandListModule,
        ChartDoughnutComponentModule
    ],
    providers: [
        // ---------------- Service Start ---------------- //
    ],
    declarations: [
        // ---------------- Pages Start ---------------- //
        FundInvestHealthyMainComponent,
        FundInvestHealthyTotalComponent, // 投資合計
        FundInvestHealthyAnalysisComponent // 組合分析
    ]
})
export class FundInvestHealthyModule { }
