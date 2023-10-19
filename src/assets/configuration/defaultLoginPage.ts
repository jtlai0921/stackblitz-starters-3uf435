import { FunctionListService } from "../../app/shared/service/customize/functionList.service";

export const DEFAULT_LOGIN_PAGE_CONFIGURATIONS = [
    {
        /**首頁*/
        key: "HOME",
        title: "MENU.HOME",
        router: "/home",
        permissionGroup: FunctionListService.HomeGroupKey,
        parameter: ""
    },
    {
        /**產生OTP*/
        key: "OTP",
        title: "MENU.OTP_GENERATE",
        router: "/otp",
        parameter: "" 
    },
    {
        /**通知訊息頁*/
        key: "NOTICE",
        title: "MENU.NOTICE",
        router: "/notification",
        permission: FunctionListService.ATM_TXN,
        parameter: ""
    },
    {
        /**授權放行*/
        key: "AUTH_RELEASE",
        title: "MENU.AUTH_RELEASE",
        isOpen: false,
        child: [
            {
                /**授權放行-待授權*/
                key: "NONAUTH",
                title: "SUB_MENU.NONAUTH",
                router: "/authorization",
                permission: FunctionListService.TXN_AUTH,
                parameter: "nonAuth"
            },
            {
                /**授權放行-已授權*/
                key: "AUTH",
                title: "SUB_MENU.AUTH",
                router: "/authorization",
                permission: FunctionListService.TXN_AUTH,
                parameter: "auth"
            }
        ]
    },
    {
        /**帳戶查詢*/
        key: "ACT_QUERY",
        title: "MENU.ACT_QUERY",
        isOpen: false,
        child: [
            {
                /**帳戶查詢-存款概要*/
                key: "ACT_QUERY_DEPOSITSUMMARY",
                title: "SUB_MENU.DEPOSITSUMMARY",
                permission: FunctionListService.ACCT_SUMM,
                router: "/account_enquiry"
            },
            {
                /**帳戶查詢-存款明細*/
                key: "ACT_QUERY_DEPOSITDETAIL",
                title: "SUB_MENU.DEPOSITDETAIL",
                router: "/account_enquiry",
                permissionGroup: FunctionListService.DepositDetailGroupKey,
                parameter: "depositDetailPage"
            },
            {
                /**帳戶查詢-放款概要*/
                key: "ACT_QUERY_LOANSUMMARY",
                title: "SUB_MENU.LOANSUMMARY",
                router: "/account_enquiry",
                permission: FunctionListService.LOAN_DET_INQ,
                parameter: "loanSumPage"
            },
            // {
                // /**帳戶查詢-匯款查詢*/
                // key: "ACT_QUERY_INQUIRY",
                // title: "SUB_MENU.INQUIRY",
                // router: "/account_enquiry",
                // parameter: "inquiryPage"
            // },
            {
                /**帳戶查詢-票據查詢*/
                key: "ACT_QUERY_BILLCOLLECTION",
                title: "SUB_MENU.BILLCOLLECTION",
                router: "/account_enquiry",
                permissionGroup: FunctionListService.BillCollectionGroupKey,
                parameter: "billColPage"
            },
            {
                /**帳戶查詢-交易紀錄*/
                key: "ACT_QUERY_TRANSACTION",
                title: "SUB_MENU.TRANSACTION",
                router: "/account_enquiry",
                parameter: "billColPage",
                permission: FunctionListService.ATM_TXN,
            }
        ]
    },
    {
        // /**帳戶交易*/
        // key: "ACT_TRANS",
        // title: "MENU.ACT_TRANS",
        // isOpen: false,
        // child: [
        // {
        /**帳戶交易-約定轉帳*/
        key: "ACT_TRANS_AGREEACCOUNT",
        title: "SUB_MENU.AGREEACCOUNT",
        router: "/agreed_account",
        permission: FunctionListService.ATM_TXN,
        parameter: ""
        // },
        // ]
    },
    {
        /**個人設定*/
        key: "SETTING",
        title: "MENU.SETTING",
        isOpen: false,
        child: [
            {
                /**個人設定-APP使用設定*/
                key: "SETTING_APP_SET",
                title: "SUB_MENU.APP_SET",
                router: "/user-setting",
                parameter: ""
            },
            {
                /**個人設定-通知設定*/
                key: "SETTING_NOTIFICATIONSETTING",
                title: "SUB_MENU.NOTIFICATIONSETTING",
                router: "/personal_setting",
                permission: FunctionListService.ATM_TXN,
                parameter: ""
            },
            {
                /**個人設定-資料變更*/
                key: "SETTING_INFO_CHANGE",
                title: "SUB_MENU.INFO_CHANGE",
                router: "/user-setting-change",
                parameter: ""
            }
        ]
    },
    {
        /**金融資訊*/
        key: "FINANCE",
        title: "MENU.FINANCE",
        isOpen: false,
        child: [
            {
                /**金融資訊-匯率查詢*/
                key: "FINANCE_EXCHANGE_RATE",
                title: "SUB_MENU.EXCHANGE_RATE",
                router: "/finance",
                parameter: "exchangeRateQuery"
            },
            {
                /**金融資訊-匯率換算器*/
                key: "FINANCE_EXCHANGE_CONVERTER",
                title: "SUB_MENU.EXCHANGE_CONVERTER",
                router: "/finance",
                parameter: "exchangeRateConverter"
            },
            {
                /**金融資訊-匯率查詢*/
                key: "FINANCE_INTEREST_RATE",
                title: "SUB_MENU.INTEREST_RATE",
                router: "/finance",
                parameter: "interestRateQuery"
            }
        ]
    },
    {
        /**最新公告*/
        key: "BULLENTIN",
        title: "MENU.BULLENTIN",
        router: "/annou",
        parameter: ""
    },
    {
        /**常見問答*/
        key: "FAQ",
        title: "MENU.FAQ",
        router: "/qa",
        parameter: ""
    },
    {
        /**聯絡客服*/
        key: "CONTACT_US",
        title: "MENU.CONTACT_US",
        router: "/contact",
        parameter: ""
    }
];

export const getDefaultLoginPage = (key) => {
    for (const item of DEFAULT_LOGIN_PAGE_CONFIGURATIONS) {
        if (item.child != null && item.child.length > 0) {
            for (const child of item.child) {
                if (child.key == key) {
                    return child;
                }
            }
        } else if (item.key == key) {
            return item;
        }
    }
    return DEFAULT_LOGIN_PAGE_CONFIGURATIONS[0];
}