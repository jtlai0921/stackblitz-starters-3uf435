/**
 * 所有功能 route設定
 * header.title 標題(請用i18n設定檔)
 * header.leftBtnIcon 返回事件
 * header.style header的css樣式
 * footer.displayFooter 是否顯示footer: 交易為false, 查詢為true
 */
export const ROUTING_DEFAULT_PATH = 'home'; // 預設功能
export const ROUTING_PATH = {
    'demo': {
        'url': '/demo',
        'header': {
            'title': 'Demo'  // 金融資訊
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'footer': {
            'displayFooter': true
        }
    },
    // -------------------- [系統] -------------------- //
    // --- 首頁 --- //
    '': {
        'url': 'home',
        'header': {
            'style': 'login',
            'leftBtnIcon': 'ignor',
            'header': 'header_logo',
            'headerClass': 'header_start_home'
        },
        'footer': {
            'displayFooter': false // 之後改false
        }
    },
    'home': {
        'url': 'home',
        'header': {
            'style': 'login',
            'leftBtnIcon': 'ignor',
            'header': 'header_logo',
            'headerClass': 'header_start_home'
        },
        'footer': {
            'displayFooter': false // 之後改false
        }
    },
    'user-home': {
        'url': '/home/user-home',
        // 'preInit': false, // 會出錯
        'header': {
            'style': 'user_home',
            'leftBtnIcon': 'ignor',
            // 'showMainInfo': true,
            // 'rightBtnIcon': 'nav_right_edit_button',
            'header': 'header_logo',
            'headerClass': ''
        },
        'footer': {
            'displayFooter': true
        }
        // , 'micro': 'default' // 是否顯示微交互
    },
    // -------------------- [系統 End] -------------------- //
    // -------------------- [登入] -------------------- //
    'login': {
        'url': '/login/1',
        'header': {
            'style': 'login',
            'leftBtnIcon': 'back',
            'header': 'header_logo_dark',
            'headerClass': ''
        }
        , 'footer': {
            'displayFooter': false
        }
    },
    // -------------------- [登入 End] -------------------- //

    // ======================================== 主要功能 ======================================== //
    // -------------------- [存款查詢] -------------------- //
    // <<<<<<<<< [國外匯入匯款查詢] >>>>>>>>> //
    'foreign-ir': {
        'url': '/deposit/foreign-ir/main',
        'header': {
            'title': 'FUNC.DEPOSIT.INWARD_REMITTANCE'  // 國外匯入匯款查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [帳戶明細查詢] >>>>>>>>> //
    'deposit-account-detail': {
        'url': '/deposit/deposit-account-detail/main',
        'header': {
            'title': 'FUNC.DEPOSIT.STATEMENT'  // 帳戶明細查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },

    // -------------------- [存款查詢 End] -------------------- //
    // -------------------- [定期存款] -------------------- //
    'time-deposit-main': {
        'url': '/time-deposit/time-deposit-main/main',
        'header': {
            'title': 'FUNC.TIME_DEPOSIT.TIME_DEPOSIT_MAIN'  // 定期存款(主控)
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'urlParams': {
            'type': 'basic'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'time-deposit-detail': {
        'url': '/time-deposit/time-deposit-main/main',
        'header': {
            'title': 'FUNC.COMPOSITE_ACCOUNT_SERVICES.PRINCIPAL_INTEREST_DETAILS'  // 本金利息明細
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'urlParams': {
            'type': 'interest'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // -------------------- [定期存款 End] -------------------- //
    // -------------------- [貸款服務] -------------------- //
    'loan-detail': {
        'url': '/loan/loan-detail/main',
        'header': {
            'title': 'FUNC.COMPOSITE_ACCOUNT_SERVICES.PRINCIPAL_INTEREST_DETAILS'  // 本金利息明細查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'urlParams': {
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'loan-main-basic': {
        'url': '/loan/loan-main/main',
        'header': {
            'title': 'FUNC.LOANS.BASIC_DETAILS_INQUIRY'  // 貸款基本資料查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'loan-apply': {
        'url': 'loan-apply',
        'header': {
            'title': "FUNC.LOANS.LOANS_APPLY"  // 線上申請貸款: 我要申請信貸
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // -------------------- [貸款服務 End] -------------------- //
    // -------------------- [轉帳交易] -------------------- //
    // <<<<<<<<< [外幣兌換] >>>>>>>>> //
    'foreignTransfer': {
        'url': '/transfer/foreign-transfer',
        'header': {
            'title': 'FUNC.TRANSFER.BUY_SELL_FOREIGN_CURRENCY'  // 外幣兌換
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': false
        }
    },
    // -------------------- [轉帳交易 End] -------------------- //


    // -------------------- [投資理財] -------------------- //
    // <<<<<<<<< [投資組合總覽] >>>>>>>>> //
    'fund-overview': {
        'url': '/fund/fund-overview/main',
        'header': {
            'title': 'FUNC.WEALTH_INVEST.OVERVIEW'  // 
            , 'leftBtnIcon': ''
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [投資現值查詢] >>>>>>>>> //
    'fund-account-balance-main': {
        'url': '/fund/fund-account-balance/main',
        'header': {
            'title': '現值查詢'  // 定期存款(主控)
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [投資交易明細查詢] >>>>>>>>> //
    'fund-history': {
        'url': '/fund/fund-history/main',
        'header': {
            'title': 'FUNC.WEALTH_INVEST.TRANSACTIONS'  // 投資交易明細查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [投資組合分析] >>>>>>>>> //
    'fund-invest-healthy': {
        'url': '/fund/fund-invest-healthy/main',
        'header': {
            'title': 'FUNC.WEALTH_INVEST.OVERVIEW'  // 
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [理財妙管家] >>>>>>>>> //
    'auto-fund-redeem-main': {
        'url': '/fund/auto-fund-redeem/main',
        'header': {
            'title': '理財妙管家'  // 定期存款(主控)
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [基金風險警語] >>>>>>>>> //
    'FundRiskWarning': {
        'url': '/fund/fund-risk-warning/main',
        'header': {
            'title': '投資風險警語'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [基金定期定額] >>>>>>>>> //
    'fund-inquiry-modify-main': {
        'url': '/fund/fund-inquiry-modify/main',
        'header': {
            'title': '定期定額查詢/修改'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // <<<<<<<<< [已實現損益] >>>>>>>>> //
    'fund-profit-loss-main': {
        'url': '/fund/fund-profit-loss/main',
        'header': {
            'title': '已實現損益查詢'
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // -------------------- [投資理財 End] -------------------- //
    // -------------------- [信用卡] -------------------- //
    'card-overview': {
        'url': '/card/card-overview/main',
        'header': {
            'title': 'FUNC.CREDIT_CARDS.OVERVIEW'  // 信用卡總覽
            , 'leftBtnIcon': ''
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'history-bill-main': {
        'url': '/card/history-bill/main',
        'header': {
            'title': 'FUNC.CREDIT_CARDS.BILLS_AND_TRANSACTIONS'  // 各期帳單查詢(主控)
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'urlParams': {
            'type': 'detail' // 判斷顯示各期帳單
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'history-bill-unPaid': {
        'url': '/card/history-bill/main',
        'header': {
            'title': 'FUNC.CREDIT_CARDS.TRANSACTIONS_NOT_YET_BILLED'  // 未出帳消費查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'urlParams': {
            'type': 'unPaid' // 判斷顯示未出帳消費
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'card-personal-profile': {
        'url': '/card/card-personal-profile/main',
        'header': {
            'title': 'FUNC.CREDIT_CARDS.ACCOUNT_OVERVIEW'  // 信用卡現況查詢
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'pay-credit-payable': {
        'url': '/card/pay-credit-payable/main',
        'header': {
            'title': 'FUNC.CREDIT_CARDS.PAY_BILL'  // 繳信用卡款
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': false
        }
    },
    // -------------------- [信用卡 End] -------------------- //

    // ======================================== 其他功能 ======================================== //
    // -------------------- [金融資訊] -------------------- //
    'financial': {
        'url': '/financial/menu',
        'header': {
            'title': 'FUNC.FINANCIAL.FINANCIAL'  // 金融資訊
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'currencyRate': {
        'url': '/financial/currency-rate',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.NTD_INTEREST_RATES'  // 台幣利率
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'foreignCurrencyRate': {
        'url': '/financial/foreign-currency-rate',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.FOREIGN_CURRENCY_INTEREST_RATES'  // 外幣利率
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'finish'
            // , 'backPath': ''
            , 'style': 'normal'
        },
        'openType': '' // 開啟類型 app/web
        , 'footer': {
            'displayFooter': true
        }
    },
    'foreignLoanCurrencyRate': {
        'url': '/financial/foreign-loan-currency-rate',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.FOREIGN_CURRENCY_LENDING_RATES'  // 外幣放款利率
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'obuCurrencyRate': {
        'url': '/financial/obu-currency-rate',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.OBU_DEPOSIT_INTEREST_RATES'  // OBU存款利率
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'loanCalculator': {
        'url': '/financial/loan-calculator',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.LOAN_CALCULATOR'  // 貸款本息攤還試算
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': false
        }
    },
    'exchangeRate': {
        'url': '/financial/exchange-rate',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.EXCHANGE_RATES'  // 外幣匯率
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': 'financial'
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'exchangeRateHistory': {
        'url': '/financial/exchange-rate/history',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.TREND_GRAPH'  // 外幣歷史匯率走勢圖
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'currencyConverter': {
        'url': '/financial/currency-converter',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.CURRENCY_CONVERTER'  // 幣別換算
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': 'financial'
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'exchangeRateNotice': {
        'url': '/financial/exchange-rate-notice',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.EXCHANGE_RATE_NOTICE'  // 匯率到價通知
            , 'leftBtnIcon': 'back'
            , 'rightBtnIcon': 'edit'
            // , 'backPath': 'financial'
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'exchangeRateNoticeSetting': {
        'url': '/financial/exchange-rate-notice/setting',
        'preInit': true,
        'header': {
            'title': 'FUNC.RATES.EXCHANGE_RATE_NOTICE_SETTING'  // 匯率到價通知設定
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'edit'
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': false
        }
    },
    // -------------------- [金融資訊 End] -------------------- //
    // -------------------- [設定] -------------------- //
    'setting': {
        'url': '/setting/menu',
        'header': {
            'title': 'FUNC.SETTING.SETTING'  // 設定
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'language': {
        'url': '/setting/language',
        'preInit': true,
        'header': {
            'title': 'FUNC.SETTING.LANGUAGE'  // 語言設定
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'edit'
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    'systeminfo': {
        'url': '/setting/systeminfo',
        'preInit': true,
        'header': {
            'title': 'FUNC.SETTING.ABOUT'  // 關於此系統
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': 'edit'
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // -------------------- [設定 End] -------------------- //
    // -------------------- [線上服務] -------------------- //
    'online-service': {
        'url': '/other/online-service/main',
        'header': {
            'title': 'FUNC.ONLINE_SERVICE.CUSTOMER_SERVICE'  // 線上客服
            , 'leftBtnIcon': 'back'
            // , 'rightBtnIcon': ''
            // , 'backPath': ''
            , 'style': 'normal'
        }
        , 'footer': {
            'displayFooter': true
        }
    },
    // -------------------- [線上服務 End] -------------------- //
    // -------------------- [外開連結設定] -------------------- //
    // 智能客服
    'robot': {
        'url': 'robot',
        'header': {
            'title': "智能客服"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 線上申請信用卡
    'applycard': {
        'url': 'applycard',
        'header': {
            'title': "線上申請信用卡"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 線上開立數位存款帳戶
    'acocountonline': {
        'url': 'acocountonline',
        'header': {
            'title': "線上開立數位存款帳戶"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 網路銀行
    'onlinebank': {
        'url': 'onlinebank',
        'header': {
            'title': "網路銀行"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 行銷活動登錄
    'marketingactivitylogin': {
        'url': 'marketingactivitylogin',
        'header': {
            'title': "行銷活動登錄"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 信用卡優惠
    'creditcardoffers': {
        'url': 'creditcardoffers',
        'header': {
            'title': "信用卡優惠"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 基金情報
    'fundWeb': {
        'url': 'fundWeb',
        'header': {
            'title': "基金情報"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 基金資訊觀測站
    'fundclear': {
        'url': 'fundclear',
        'header': {
            'title': "基金資訊觀測站"
        },
        'openType': 'web' // 開啟類型 app/web
    },
    // 公開資訊觀測站
    'newmops': {
        'url': 'newmops',
        'header': {
            'title': "公開資訊觀測站"
        },
        'openType': 'web' // 開啟類型 app/web
    }
    // -------------------- [外開連結設定 End] -------------------- //
};


