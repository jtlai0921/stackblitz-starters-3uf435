/**
 * 首頁相關連結設定
 */

// == (未登入前首頁)啟動首頁快捷選單 == //
export const START_HOME_BTN = {
    // 左按鈕: 我要開戶
    'left': {
        id: 'start.messageCenter',
        name: 'FUNC.START_HOME.LEFT',
        url: 'acocountonline',
        icon_class: ''
    },
    // 右按鈕: 登入
    'right': {
        id: 'start.messageCenter',
        name: 'FUNC.START_HOME.RIGHT',
        url: 'login',
        icon_class: ''
    }
};
export const START_HOME_MENU = [
    // 帳戶總覽
    {
        id: 'start.accountOverview',
        name: 'FUNC.START_HOME.BTN1',
        url: '',
        icon_class: 'shortcut_i_account'
    },
    // 台幣轉帳
    {
        id: 'start.twdTransfer',
        name: 'FUNC.START_HOME.BTN2',
        url: '',
        icon_class: 'shortcut_i_transfer'
    },
    // 外幣匯率
    {
        id: 'start.exchangeRate',
        name: 'FUNC.START_HOME.BTN3',
        url: 'exchangeRate',
        icon_class: 'shortcut_i_foreignRate'
    },
    // 線上客服
    {
        id: 'start.onlineService',
        name: 'FUNC.START_HOME.BTN4',
        url: 'online-service',
        icon_class: 'shortcut_i_customer'
    }
];