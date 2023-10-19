import { FunctionListService } from "../../app/shared/service/customize/functionList.service";
export const MENU_SETTING = {

};

export const FootList = [
  {
    //授權
    "key": "MENU.AUTH",
    "link": "/authorization",
    "pClass": "MENU.AUTH",
    "iconClass": "fa i-authorization",
    "permission": [FunctionListService.TXN_AUTH],
    "weight": "1"
  },
  {
     //查詢
     "key": "MENU.SEARCH",
     "link": "/account_enquiry",
     "pClass": "MENU.SEARCH",
     "iconClass": "fa i-account",
     "permission": [FunctionListService.ACCT_SUMM,
      FunctionListService.ACCT_ACTIVITY,FunctionListService.LOAN_DET_INQ,FunctionListService.IR_INQ
      ,FunctionListService.OR_INQ,FunctionListService.COL_INQ,FunctionListService.CHK_INQ],
     "weight": "2"
  },
  {
     //交易
     "key": "MENU.TRANSCATION",
     "link": "/agreed_account",
     "pClass": "MENU.TRANSCATION",
     "iconClass": "fa i-transaction",
     "permission": [FunctionListService.ATM_TXN],
     "weight": "3"
  },
  {
     //產生ＯＴＰ
     "key": "MENU.OTP_GENERATE_SHORT",
     "link": "/otp",
     "pClass": "MENU.OTP_GENERATE_SHORT",
     "iconClass": "fa i-otp",
     "permission": [FunctionListService.TXN_AUTH],
     "weight": "4"
  },
  {
     //金融資訊
     "key": "MENU.FINANCE",
     "link": "/finance",
     "pClass": "MENU.FINANCE",
     "iconClass": "fa i-financial",
     "weight": "5"
  },
  {
     //設定
     "key": "MENU.SETTING_SHORT",
     "link": "/user-setting",
     "pClass": "MENU.SETTING",
     "iconClass": "fa i-setting",
     "weight": "6"
  },
  {
     //公告
     "key": "MENU.BULLENTIN_SHORT",
     "link": "/annou",
     "pClass": "MENU.BULLENTIN",
     "iconClass": "fa i-announcement",
     "weight": "7"
  }
]

export const Home = 
{
  //首頁
  "key": "MENU.HOME",
  "link": "/home",
  "pClass": "MENU.HOME",
  "iconClass": "fa i-home",
  "permission": [FunctionListService.ACCT_OVERVIEW,FunctionListService.ACCT_SUMM]
}