/**
 * 權限列表
 */
import { Injectable } from '@angular/core';

@Injectable()
export class FunctionListService {

  public static ACCT_ACTIVITY = "ACCT_ACTIVITY";
  public static ACCT_OVERVIEW = "ACCT_OVERVIEW";
  public static ACCT_SUMM = "ACCT_SUMM";
  public static ATM_TXN = "ATM_TXN";
  public static INV_PRD_DET = "INV_PRD_DET";
  public static INV_PRD_SUMM = "INV_PRD_SUMM";
  public static LOAN_DET_INQ = "LOAN_DET_INQ";
  public static TD_ACCT_DET = "TD_ACCT_DET";
  public static TD_ACCT_SUMM = "TD_ACCT_SUMM";
  public static TXN_AUTH = "TXN_AUTH";
  public static INTERNAL_TXN = "INTERNAL_TXN";
  public static LCY_TXN = "LCY_TXN";
  public static FCY_TXN = "FCY_TXN";
  public static IR_INQ = "IR_INQ";
  public static OR_INQ = "OR_INQ";
  public static COL_INQ = "COL_INQ";
  public static CHK_INQ = "CHK_INQ";
  public static MST_FILE_INQ = "MST_FILE_INQ";
  public static ACCT_ACTIVITY_TD = "ACCT_ACTIVITY_TD";
  public static ACCT_ACTIVITY_ST = "ACCT_ACTIVITY_ST";

  //總覽頁 權限
  public static HomeGroupKey = "Home";
  //託收票據查詢頁 權限
  public static BillCollectionGroupKey = "BillCollection";
  //存款明細 權限
  public static DepositDetailGroupKey = "DepositDetail";
  
  constructor(

  ) { }
  functionListShow;
  functionListValue;
  setFunctionList(functionList){
    this.functionListValue = functionList;
    this.setFunctionListShow();
  }

  setFunctionListShow(){
    this.functionListShow = {
      ACCT_ACTIVITY: false,
      ACCT_OVERVIEW: false,
      ACCT_SUMM: false,
      ATM_TXN: false,
      INV_PRD_DET: false,
      INV_PRD_SUMM: false,
      LOAN_DET_INQ: false,
      TD_ACCT_DET: false,
      TD_ACCT_SUMM: false,
      TXN_AUTH: false,
      INTERNAL_TXN: false,
      LCY_TXN: false,
      FCY_TXN: false,
      MST_FILE_INQ : false,
      IR_INQ : false,
      OR_INQ : false,
      COL_INQ : false,
      CHK_INQ : false,
      ACCT_ACTIVITY_TD:false,
      ACCT_ACTIVITY_ST:false
    }
    this.functionListValue.forEach(element => {
      this.functionListShow[element['FunctionId']] = true;
    });
    
  }

  checkHasFunction(functionId){
    if(typeof this.functionListShow == 'undefined'){
      return false;
    }
    return this.functionListShow[functionId];
  }

  checkHasFunctionGroup(GroupKey) {
      if(typeof this.functionListShow == 'undefined'){
        return false;
      }
      switch(GroupKey){
        case FunctionListService.HomeGroupKey:
          //首頁 權限
          return this.checkHome();
        case FunctionListService.BillCollectionGroupKey:
          //託收票據查詢頁 權限
          return (this.functionListShow.COL_INQ || this.functionListShow.CHK_INQ);
        case FunctionListService.DepositDetailGroupKey:
          //存款明細權限
          return (this.functionListShow.ACCT_ACTIVITY_TD || this.functionListShow.ACCT_ACTIVITY_ST|| this.functionListShow.ACCT_ACTIVITY);
      }
      return false;
  }

  checkHome() {
    return (this.checkHasFunction(FunctionListService.ACCT_OVERVIEW)
      || this.checkHasFunction(FunctionListService.ACCT_SUMM)
      || (this.checkHasFunction(FunctionListService.ACCT_ACTIVITY)
        && this.checkHasFunction(FunctionListService.MST_FILE_INQ)))
  }


}
