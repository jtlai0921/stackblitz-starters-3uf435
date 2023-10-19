/**
 * 貸款本息攤還試算
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';
import { LoanCalculatorService } from '@pages/financial/shared/service/loan-calculator.service';

@Component({
  selector: 'app-loan-calculator-main',
  templateUrl: './loan-calculator-main.component.html',
  styleUrls: []
})

export class LoanCalculatorMainComponent implements OnInit {
  nowStep = 'edit'; // 當前步驟
  // 步驟列data
  stepMenuData = [
    {
      id: 'edit',
      name: 'STEP_BAR.COMMON.EDIT' // 輸入資料頁
    },
    {
      id: 'result',
      name: 'STEP_BAR.COMMON.RESULT', // 結果頁
      // 執行此步驟時是否隱藏步驟列
      hidden: true
    }
  ];

  notePopupOption = {}; // 注意事項設定
  dataTime: any; // 資料時間
  selectMethod = '1'; // 當前還款方式 1:本息 2:本金
  selectDuration = '1'; // 當前段式 1:一段式 2:二段式 3:三段式
  loanAmount = ''; // 貸款金額
  rate1 = ''; // 第一段貸款利率
  rate2 = ''; // 第二段貸款利率
  rate3 = ''; // 第三段貸款利率
  month1 = 0; // 第一段月數
  month2 = 0; // 第二段月數
  month3 = 0; // 第三段月數
  totalMonth = 0; // 總月數
  years = 0;
  months = 0;
  showResultPage = false; // 顯示結果頁

  // 輸出資料
  outputData = {
    selectMethod: '',
    selectDuration: '',
    loanAmount: '',
    rate1: '',
    rate2: '',
    rate3: '',
    month1: 0,
    month2: 0,
    month3: 0,
    totalMonth: 0
  };

  constructor(
    private logger: Logger,
    private errorHandler: HandleErrorService
  ) { }

  ngOnInit() {
    this.notePopupOption = {
      title: 'POPUP.NOTE.TITLE',
      content: 'POPUP.NOTE.LOAN_CALCULATOR',
    };

  }

  /**
   * [選擇還款方式]按鈕點擊事件
   */
  onSelectMethodClick(type) {
    this.selectMethod = type;
  }

  /**
   * [選擇段式]按鈕點擊事件
   */
  onSelectDurationClick(duration) {
    this.selectDuration = duration;
    if (duration == '1') {
      this.rate2 = '';
      this.month2 = 0;
      this.rate3 = '';
      this.month3 = 0;
    } else if (duration == '2') {
      this.rate3 = '';
      this.month3 = 0;
    }
    // 計算總期數
    this.totalMonth = this.month1 + this.month2 + this.month3;
    this.years = Math.floor(this.totalMonth / 12);
    this.months = (this.totalMonth % 12);
  }

  /**
   * [減號]按鈕點擊事件
   */
  onMinusBtnClick(period) {
    if (period == '1' && this.month1 > 0) {
      this.month1--;
    } else if (period == '2' && this.month2 > 0) {
      this.month2--;
    } else if (period == '3' && this.month3 > 0) {
      this.month3--;
    }
    // 計算總期數
    this.totalMonth = this.month1 + this.month2 + this.month3;
    this.years = Math.floor(this.totalMonth / 12);
    this.months = (this.totalMonth % 12);
  }

  /**
   * [加號]按鈕點擊事件
   */
  onPlusBtnClick(period) {
    if (period == '1') {
      this.month1++;
    } else if (period == '2') {
      this.month2++;
    } else if (period == '3') {
      this.month3++;
    }
    // 計算總期數
    this.totalMonth = this.month1 + this.month2 + this.month3;
    this.years = Math.floor(this.totalMonth / 12);
    this.months = (this.totalMonth % 12);
  }

  /**
   * [送出]按鈕點擊事件
   */
  onSendBtnClick() {
    // 檢核欄位
    if (!this.checkData().status) {
      this.errorHandler.handleError({
        title: 'ERROR.TITLE',
        content: this.checkData().err_msg
      });
      return;
    }

    this.outputData.selectMethod = this.selectMethod;
    this.outputData.selectDuration = this.selectDuration;
    this.outputData.loanAmount = this.loanAmount;
    this.outputData.rate1 = this.rate1;
    this.outputData.rate2 = this.rate2;
    this.outputData.rate3 = this.rate3;
    this.outputData.month1 = this.month1;
    this.outputData.month2 = this.month2;
    this.outputData.month3 = this.month3;
    this.outputData.totalMonth = this.totalMonth;
    this.showResultPage = true;
  }

  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this.showResultPage = false;
    this.selectMethod = '1';
    this.selectDuration = '1';
    this.loanAmount = '';
    this.rate1 = '';
    this.rate2 = '';
    this.rate3 = '';
    this.month1 = 0;
    this.month2 = 0;
    this.month3 = 0;
    this.totalMonth = 0;
    // this._headerCtrl.setLeftBtnClick(() => {
    //   this.back();
    // });
  }

  // 檢核欄位
  checkData() {
    let checkObj = {
      status: true,
      err_msg: ''
    };

    // 檢核貸款金額
    if (!this.loanAmount) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_AMOUNT';
      return checkObj;
    } else {
      // 貸款金額格式(整數10位)
      let reg = /^[1-9]\d{0,9}$/;
      if (!reg.test(this.loanAmount) || parseInt(this.loanAmount) == 0) {
        checkObj.status = false;
        checkObj.err_msg = 'FINANCIAL.ERR.INVALID_LOAN_AMOUNT';
        return checkObj;
      }
    }

    // 貸款利率格式(整數2位、小數3位)
    let reg = /^[1-9]\d{0,1}(\.\d{1,3})?$|^0(\.\d{1,4})?$/;;

    // 檢核貸款利率及期數第一段
    if (!this.rate1) {
      checkObj.status = false;
      checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_RATE';
      return checkObj;
    } else {
      if (!reg.test(this.rate1) || parseFloat(this.rate1) == 0) {
        checkObj.status = false;
        checkObj.err_msg = 'FINANCIAL.ERR.INVALID_LOAN_RATE';
        return checkObj;
      }

      if (this.month1 == 0) {
        checkObj.status = false;
        checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_TERM';
        return checkObj;
      }
    }

    // 檢核貸款利率第二段
    if (this.selectDuration == '2' || this.selectDuration == '3') {
      if (!this.rate2) {
        checkObj.status = false;
        checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_RATE';
        return checkObj;
      } else {
        if (!reg.test(this.rate2) || parseFloat(this.rate2) == 0) {
          checkObj.status = false;
          checkObj.err_msg = 'FINANCIAL.ERR.INVALID_LOAN_RATE';
          return checkObj;
        }

        if (this.month2 == 0) {
          checkObj.status = false;
          checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_TERM';
          return checkObj;
        }
      }
    }

    // 檢核貸款利率第三段
    if (this.selectDuration == '3') {
      if (!this.rate3) {
        checkObj.status = false;
        checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_RATE';
        return checkObj;
      } else {
        if (!reg.test(this.rate3) || parseFloat(this.rate3) == 0) {
          checkObj.status = false;
          checkObj.err_msg = 'FINANCIAL.ERR.INVALID_LOAN_RATE';
          return checkObj;
        }

        if (this.month3 == 0) {
          checkObj.status = false;
          checkObj.err_msg = 'FINANCIAL.ERR.ENTER_LOAN_TERM';
          return checkObj;
        }
      }
    }

    return checkObj;
  }

}
