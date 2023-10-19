/**
 * 請設定子選單
 */

export const SUB_MENU = {
    // -------------------- [金融資訊] -------------------- //
    'financial': {
        menuType: '1',
        data: [
            // 台幣利率
            {
                name: 'FUNC.RATES.NTD_INTEREST_RATES', url: 'currencyRate'
            }
            // 外幣利率
            , {
                name: 'FUNC.RATES.FOREIGN_CURRENCY_INTEREST_RATES', url: 'foreignCurrencyRate'
            }
            // 外幣放款利率
            , {
                name: 'FUNC.RATES.FOREIGN_CURRENCY_LENDING_RATES', url: 'foreignLoanCurrencyRate'
            }
            // OBU存款利率
            , {
                name: 'FUNC.RATES.OBU_DEPOSIT_INTEREST_RATES', url: 'obuCurrencyRate'
            }
            // 貸款本息攤還試算
            , {
                name: 'FUNC.RATES.LOAN_CALCULATOR', url: 'loanCalculator'
            }
            // 外幣匯率
            , {
                name: 'FUNC.RATES.EXCHANGE_RATES', url: 'exchangeRate'
            }
            // 幣別換算
            , {
                name: 'FUNC.RATES.CURRENCY_CONVERTER', url: 'currencyConverter'
            }
            // 匯率到價通知
            , {
                name: 'FUNC.RATES.EXCHANGE_RATE_NOTICE', url: 'exchangeRateNotice'
            }
        ]
    },
    // -------------------- [金融資訊 End] -------------------- //
    // -------------------- [設定] -------------------- //
    'setting': {
        menuType: '1',
        data: [
            // 語言設定
            {
                name: 'FUNC.SETTING.LANGUAGE', url: 'language'
            }
        ]
    }
    // -------------------- [個人設定 End] -------------------- //
};