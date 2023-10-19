/**
 * 投資總覽
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FundOverviewService } from '@pages/fund/shared/fund-overview.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { CacheService } from '@systems/system/cache/cache.service';
import { FormateService } from '@template/formate/formate.service';

@Component({
  selector: 'app-fund-overview',
  templateUrl: './fund-overview.component.html',
  styleUrls: []
})

export class FundOverviewComponent implements OnInit {
  infoData: any; // 所有資訊
  sumupInfo: any; // 合計資料(寫入我的基金資訊)
  hasData = false; // 是否取得資料

  constructor(
    private _logger: Logger,
    private _mainService: FundOverviewService,
    private navgator: NavgatorService,
    private _cacheService: CacheService,
    private _formateService: FormateService
  ) { }

  ngOnInit() {
    this._logger.log("into FundOverviewComponent");
    this._mainService.removeAllCache(); // 一進入功能先清除cache
    this.sendInvestHealthy();
  }

  // 發送投資合計/組合分析API 取得我的基金資料
  sendInvestHealthy() {
    this._mainService.getInvestHealthy({}).then(
      (result) => {
        this._logger.log("getInvestHealthy, result:", result);
        this.infoData = result.infoData;
        this.sumupInfo = result.sumupInfo; // 合計資料
        this._logger.log("getInvestHealthy, sumupInfo:", this.sumupInfo);
        this.hasData = true;
      },
      (errorObj) => {
        this._logger.log("getInvestHealthy, errorObj:", errorObj);
      }
    );
  }

  //---------- Button相關 ---------
  // 基金申購
  onInvest() {
    this._logger.log("into onInvest");
  }

  // 理財妙管家
  onAutoRedeem() {
    this._logger.log("into onAutoRedeem");
    this.navgator.push('auto-fund-redeem-main');
  }

  // 我的投資合計
  onInvestHealthy() {
    this._logger.log("into onInvestHealthy");
    this.navgator.push('fund-invest-healthy');
  }

  // 投資現值查詢
  onFundAccountBalance() {
    this._logger.log("into onFundAccountBalance");
    this.navgator.push('fund-account-balance-main');
  }

  // 定期定額查詢
  onFundInquiryModify() {
    this._logger.log("into onFundInquiryModify");
    this.navgator.push('fund-inquiry-modify-main');
  }

  // 基金情報
  onInvestInformation() {
    this._logger.log("into onInvestInformation");
    this.navgator.push('FundRiskWarning');
  }

  // 線上客服
  onOnlineService() {
    this._logger.log("into onOnlineService");
  }

}
