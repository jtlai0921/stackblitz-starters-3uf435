/**
 * 貸款本息攤還試算結果頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoanCalculatorService } from '@pages/financial/shared/service/loan-calculator.service';
import { Logger } from '@systems/system/logger/logger.service';

@Component({
  selector: 'app-loan-calculator-result',
  templateUrl: './loan-calculator-result.component.html',
  styleUrls: [],
  providers: [LoanCalculatorService]
})

export class LoanCalculatorResultComponent implements OnInit {

  @Input() inputData;

  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();

  haveData = true;
  dataTime: any; // 資料時間
  // selectMethod = '1'; // 當前還款方式 1:本息 2:本金
  // selectDuration = '1'; // 當前段式 1:一段式 2:二段式 3:三段式
  loanAmount = ''; // 貸款金額
  repaymentMethod = ''; // 還款方式
  totalPayment = ''; // 期間攤還本息
  totalInterestPayable = ''; // 期間應付利息
  loanData = []; // 貸款本息攤還試算data
  // firstDurationObj = {}; // 第一段data
  // secondDurationObj = {}; // 第二段data
  // thirdDurationObj = {}; // 第三段data

  // 第一段data
  firstDurationObj = {
    duration: '',
    month: '', // 月數
    rate: '', // 貸款利率
    principal: '', // 期初本金
    durationInterestPayable: '', // 期間應付利息
    durationPayment: '', // 期間攤還本息
    monthlyPayment: '' // 每期攤還本息
  };

  // 第二段data
  secondDurationObj = {
    duration: '',
    month: '', // 月數
    rate: '', // 貸款利率
    principal: '', // 期初本金
    durationInterestPayable: '', // 期間應付利息
    durationPayment: '', // 期間攤還本息
    monthlyPayment: '' // 每期攤還本息
  };

  // 第三段data
  thirdDurationObj = {
    duration: '',
    month: '', // 月數
    rate: '', // 貸款利率
    principal: '', // 期初本金
    durationInterestPayable: '', // 期間應付利息
    durationPayment: '', // 期間攤還本息
    monthlyPayment: '' // 每期攤還本息
  };

  constructor(
    private mainService: LoanCalculatorService,
    private _logger: Logger
  ) { }

  ngOnInit() {
    // 取得貸款本息攤還試算結果data
    this.mainService.getData().then(
      (res) => {
        this.haveData = true;
        this.loanAmount = res.loanAmount;
        this.repaymentMethod = res.repaymentMethod;
        this.totalPayment = res.totalPayment;
        this.totalInterestPayable = res.totalInterestPayable;
        this.loanData = res.data;
        this.firstDurationObj = res.list["first"];
        this.secondDurationObj = res.list["second"];
        this.thirdDurationObj = res.list["third"];
        this._logger.error("firstDurationObj", this.firstDurationObj);
        this._logger.error("secondDurationObj", this.secondDurationObj);
        this._logger.error("thirdDurationObj", this.thirdDurationObj);
      },
      (errObj) => {
        this.haveData = false;
        // Error
      }
    );
  }

  /**
   * [重新試算]按鈕點擊事件
   */
  onAgainBtnClick() {
    this.onBackPageEvent();
  }

  /**
   * 返回事件
   */
  onBackPageEvent() {
    this.backPageEmit.emit();
  }

}
