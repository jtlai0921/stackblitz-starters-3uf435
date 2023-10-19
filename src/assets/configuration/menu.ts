import { FunctionListService } from "../../app/shared/service/customize/functionList.service";
export const MENU_SETTING = {

};

export const BeforeLoginMenuList = [
  {
    "key": "LOGINOUT.GOTOHOME",
    "link": "/login",
    "iconClass": "nav-title-icon-logout"
  },
  {
    "key": "MENU.OTP_GENERATE",
    "link": "/otp",
    "iconClass": "nav-title-icon-otp"
  },
  {
    "key": "MENU.FINANCE",
    "link": "sub",
    "iconClass": "nav-title-icon-information"
  },
  {
    "key": "MENU.BULLENTIN",
    "link": "/annou",
    "iconClass": "nav-title-icon-announcement"
  },
  {
    "key": "MENU.POSITION",
    "link": "url:BankPosition",
    "iconClass": "nav-title-icon-location"
  },
  {
    "key": "MENU.FAQ",
    "link": "/qa",
    "iconClass": "nav-title-icon-qa"
  },
  {
    "key": "MENU.CONTACT_US",
    "link": "/contact",
    "iconClass": "nav-title-icon-contact"
  },
  {
    "key": "MENU.TRANSLATE",
    "link": "/lang",
    "iconClass": "nav-title-icon-global"
  },
]
export const BeforeLoginSubMenuList = [
  {
    "key": "SUB_MENU.EXCHANGE_RATE",
    "link": "/finance",
    "parameter": "exchangeRateQuery",
    "main": "MENU.FINANCE"
  },
  {
    "key": "SUB_MENU.EXCHANGE_CONVERTER",
    "link": "/finance",
    "parameter": "exchangeRateConverter",
    "main": "MENU.FINANCE"
  },
  {
    "key": "SUB_MENU.INTEREST_RATE",
    "link": "/finance",
    "parameter": "interestRateQuery",
    "main": "MENU.FINANCE"
  },
  {
    "key": "",
    "link": "",
    "main": ""
  }
]
export const AfterLoginMenuList = [
  {
    "key": "MENU.OTP_GENERATE",
    "link": "/otp",
    "iconClass": "nav-title-icon-otp"
  },
  {
    "key": "MENU.NOTICE",
    "link": "/notification",
    "iconClass": "nav-title-icon-notice",
    "permission": FunctionListService.ATM_TXN
  },
  {
    "key": "MENU.AUTH_RELEASE",
    "link": "sub",
    "iconClass": "nav-title-icon-authorization"
  },
  {
    "key": "MENU.ACT_QUERY",
    "link": "sub",
    "iconClass": "nav-title-icon-inquiry"
  },
  {
    "key": "SUB_MENU.AGREEACCOUNT",
    "permission": FunctionListService.ATM_TXN,
    "link": "/agreed_account",
    "iconClass": "nav-title-icon-transfer"
  },
  {
    "key": "MENU.SETTING",
    "link": "sub",
    "iconClass": "nav-title-icon-setting"
  },
  {
    "key": "MENU.FINANCE",
    "link": "sub",
    "iconClass": "nav-title-icon-information"
  },
  {
    "key": "MENU.BULLENTIN",
    "link": "/annou",
    "iconClass": "nav-title-icon-announcement"
  },
  {
    "key": "MENU.POSITION",
    "link": "url:BankPosition",
    "iconClass": "nav-title-icon-location"
  },
  {
    "key": "MENU.FAQ",
    "link": "/qa",
    "iconClass": "nav-title-icon-qa"
  },
  {
    "key": "MENU.CONTACT_US",
    "link": "/contact",
    "iconClass": "nav-title-icon-contact"
  },
  {
    "key": "MENU.OTHER_APP",
    "link": "sub",
    "iconClass": "nav-title-icon-ctbclink"
  }
]
export const AfterLoginSubMenuList = [
  {
    "key": "SUB_MENU.APP_SET",
    "link": "/user-setting",
    "main": "MENU.SETTING"
  },
  {
    "key": "SUB_MENU.NOTIFICATIONSETTING",
    "link": "/personal_setting",    
    "permission": FunctionListService.ATM_TXN,
    "main": "MENU.SETTING"
  },
  {
    "key": "SUB_MENU.INFO_CHANGE",
    "link": "/user-setting-change",
    "main": "MENU.SETTING"
  },
  {
    "key": "SUB_MENU.DEPOSITSUMMARY",
    "link": "/account_enquiry",
    "permission": FunctionListService.ACCT_SUMM,
    "parameter": "depositSumPage",
    "main": "MENU.ACT_QUERY"
  },
  {
    "key": "SUB_MENU.DEPOSITDETAIL",
    "link": "/account_enquiry",
    "permissionGroup": FunctionListService.DepositDetailGroupKey,
    "parameter": "depositDetailPage",
    "main": "MENU.ACT_QUERY"
  },
  {
    "key": "SUB_MENU.LOANSUMMARY",
    "link": "/account_enquiry",
    "parameter": "loanSumPage",
    "permission": FunctionListService.LOAN_DET_INQ,
    "main": "MENU.ACT_QUERY"
  },
  {
    "key": "SUB_MENU.BILLCOLLECTION",
    "link": "/account_enquiry",
    "parameter": "billColPage",
    "permissionGroup": FunctionListService.BillCollectionGroupKey,
    "main": "MENU.ACT_QUERY"
  },
  {
    "key": "SUB_MENU.TRANSACTION",
    "link": "/account_enquiry",
    "parameter": "transPage",
    "permission": FunctionListService.ATM_TXN,
    "main": "MENU.ACT_QUERY"
  },
  {
    "key": "SUB_MENU.NONAUTH",
    "link": "/authorization",
    "parameter": "nonAuth",
    "permission": FunctionListService.TXN_AUTH,
    "main": "MENU.AUTH_RELEASE"
  },
  {
    "key": "SUB_MENU.AUTH",
    "link": "/authorization",
    "parameter": "auth",
    "permission": FunctionListService.TXN_AUTH,
    "main": "MENU.AUTH_RELEASE"
  },
  {
    "key": "SUB_MENU.EXCHANGE_RATE",
    "link": "/finance",
    "parameter": "exchangeRateQuery",
    "main": "MENU.FINANCE"
  },
  {
    "key": "SUB_MENU.EXCHANGE_CONVERTER",
    "link": "/finance",
    "parameter": "exchangeRateConverter",
    "main": "MENU.FINANCE"
  },
  {
    "key": "SUB_MENU.INTEREST_RATE",
    "link": "/finance",
    "parameter": "interestRateQuery",
    "main": "MENU.FINANCE"
  }
]
