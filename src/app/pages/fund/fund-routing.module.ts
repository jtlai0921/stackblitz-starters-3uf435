/**
 * Route定義
 * 投資理財服務
 */
// == 基本設定 == //
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ---------------- Pages Start ---------------- //

const routes: Routes = [
  // == 投資理財總覽 == //
  {
    path: 'fund-overview', loadChildren: './fund-overview/fund-overview.module#FundOverviewModule'
    , data: {
      preload: false
    }
  }
  // == 投資現值查詢 == //
  , {
    path: 'fund-account-balance', loadChildren: './fund-account-balance/fund-account-balance.module#FundAccountBalanceModule'
    , data: {
      preload: false
    }
  }
  // == 投資組合分析 == //
  , {
    path: 'fund-invest-healthy', loadChildren: './fund-invest-healthy/fund-invest-healthy.module#FundInvestHealthyModule'
    , data: {
      preload: false
    }
  }
  // == 基金贖回 == //
  , {
    path: 'fund-redeem', loadChildren: './fund-redeem/fund-redeem.module#FundRedeemModule'
    , data: {
      preload: false
    }
  }
  // == 基金轉換 == //
  , {
    path: 'fund-convert', loadChildren: './fund-convert/fund-convert.module#FundConvertModule'
    , data: {
      preload: false
    }
  }
  // == 基金申購 == //
  , {
    path: 'fund-invest', loadChildren: './fund-invest/fund-invest.module#FundInvestModule'
    , data: {
      preload: false
    }
  }
  // == 定期(不)定額查詢修改 == //
  , {
    path: 'fund-inquiry-modify', loadChildren: './fund-inquiry-modify/fund-inquiry-modify.module#FundInquiryModifyModule'
    , data: {
      preload: false
    }
  }
  // == 已實現損益查詢 == //
  , {
    path: 'fund-profit-loss', loadChildren: './fund-profit-loss/fund-profit-loss.module#FundProfitLossModule'
    , data: {
      preload: false
    }
  },
  // == 投資交易明細查詢 == //
  {
    path: 'fund-history', loadChildren: './fund-history/fund-history.module#FundHistoryModule'
    , data: {
      preload: false
    }
  }
  // == 理財妙管家 == //
  , {
    path: 'auto-fund-redeem', loadChildren: './auto-fund-redeem/auto-fund-redeem.module#AutoFundRedeemModule'
    , data: {
      preload: false
    }
  }
  // == 投資資訊情報 == //
  , {
    path: 'invest-information', loadChildren: './invest-information/invest-information.module#InvestInformationModule'
    , data: {
      preload: false
    }
  }
  // == 基金風險警語 == //
  , {
    path: 'fund-risk-warning', loadChildren: './fund-risk-warning/fund-risk-warning.module#FundRiskWarningModule'
    , data: {
      preload: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundRoutingModule { }
