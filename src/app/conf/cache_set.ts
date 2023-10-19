/**
 * Cache 設定參數處理
 * groupList: 設定群組類別，可透過刪除群組刪除相關資料
 */
export const CACHE_SET = {
    // -------------------- [銀行代碼] -------------------- //
    'bank-code': {
        ttl: 60,
        keepAlive: 'always',
        groupList: ['bank-code', 'bank-code']
    }
    // -------------------- [存摺] -------------------- //
    // , 'user-home-deposit': {
    //     ttl: 10,
    //     keepAlive: 'login',
    //     groupList: ['deposit', 'user-home']
    // }
    // // 存款查詢 (首頁資產)
    // , 'deposit-assets': {
    //     ttl: 10,
    //     keepAlive: 'login',
    //     groupList: ['deposit', 'deposit-assets', 'user-home']
    // }
    // 存款查詢-活存明細
    , 'deposit-demand': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-demand']
    }
    // 存款查詢-定存明細
    , 'deposit-time': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'deposit-time']
    }
    // 國外匯入匯款
    , 'foreign-ir-deposit': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'foreign-ir-deposit']
    }
    // 國外匯入匯款明細
    , 'foreign-ir-deposit-detail': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['deposit', 'foreign-ir-deposit', 'foreign-ir-deposit-detail']
    }
    // -------------------- [金融資訊] -------------------- //
    // 外幣存款利率
    , 'foreign-currency-rate': {
        ttl: 20,
        updateTimeList: ['08:00', '16:00'],
        keepAlive: 'always',
        groupList: ['financial', 'foreign-currency-rate'],
        langChangeRemove: 'remove'
    }
    // 外幣放款利率
    , 'foreign-loan-currency-rate': {
        ttl: 20,
        updateTimeList: ['08:00', '16:00'],
        keepAlive: 'always',
        groupList: ['financial', 'foreign-loan-currency-rate'],
        langChangeRemove: 'remove'
    }
    // OBU存款利率
    , 'obu-currency-rate': {
        ttl: 20,
        updateTimeList: ['08:00', '16:00'],
        keepAlive: 'always',
        groupList: ['financial', 'obu-currency-rate'],
        langChangeRemove: 'remove'
    }
    // 外幣匯率
    , 'exchange-rate': {
        ttl: 20,
        updateTimeList: ['08:00', '16:00'],
        keepAlive: 'always',
        groupList: ['financial', 'exchange-rate'],
        langChangeRemove: 'remove'
    }
    // 貸款本金明細查詢
    , 'loan-detail-details': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['loan', 'loan-detail-details']
    }
    // 貸款利息明細查詢
    , 'loan-detail-interests': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['loan', 'loan-detail-interests']
    }
    // 貸款基本資料查詢
    , 'loan-main-basic': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['loan', 'loan-main-basic']
    }
    // 定期存款基本資料查詢
    , 'time-deposit-basic': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['time-deposit', 'time-deposit-basic']
    }
    // 定期存款本金利息明細查詢
    , 'time-deposit-interest': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['time-deposit', 'time-deposit-interest']
    }
    // 信用卡各期帳單查詢
    , 'history-bill': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['card', 'history-bill']
    }
    // 未出帳消費查詢
    , 'unpaid-bill': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['card', 'unpaid-bill']
    }
    // 信用卡繳款月份查詢
    , 'card-select-month': {
        ttl: 10,
        keepAlive: 'login',
        groupList: ['card', 'card-select-month']
    }
    // // 台幣存款利率
    // , 'twdSave': {
    //     ttl: 20,
    //     keepAlive: 'always',
    //     groupList: ['financial', 'twdSave']
    // }
    // // 台幣放款利率
    // , 'twdLoan': {
    //     ttl: 20,
    //     keepAlive: 'always',
    //     groupList: ['financial', 'twdLoan']
    // }
    // -------------------- [轉出轉入帳號] -------------------- //
    // 台幣活存約定轉出及轉入帳號查詢
    // , 'acct-deposit': {
    //     ttl: 0,
    //     keepAlive: 'login',
    //     groupList: ['account', 'acct-deposit']
    // }
    // , 'acct-forex': {
    //     ttl: 0,
    //     keepAlive: 'login',
    //     groupList: ['account', 'acct-forex']
    // }

};
