/**
 * 定義錯誤訊息物件
 */
import { ERROR_UC02 } from './error_uc02'; // 一般登入
import { ERROR_UC06 } from './error_uc06'; // 國外匯入匯款
import { ERROR_UC10 } from './error_uc10'; // 金融資訊

// -------------------- [系統共用 0000 ] -------------------- //
const ERROR_UC0000 = {
    // 預設錯誤
    'DEFAULT': {
        app_error_code: '000001',
        app_error_code_hide: false,
        help: '預設錯誤',
        title: 'ERROR.TITLE',
        // 發生未預期的錯誤，若有帳務交易，請確認本筆交易是否成功（查詢轉出帳號餘額或交易明細），造成不便，敬請見諒。若有其他問題，請聯繫本行客服中心。
        content: 'ERROR.DEFAULT'
    }
    // 參數格式錯誤
    , 'DATA_FORMAT_ERROR': {
        app_error_code: '000002',
        app_error_code_hide: false,
        help: '設定參數格式錯誤',
        title: 'ERROR.TITLE',
        // 資料格式錯誤
        content: 'ERROR.DATA_FORMAT_ERROR'
    }
    // 無資料
    , 'RSP_FORMATE_ERROR': {
        app_error_code: '000003',
        app_error_code_hide: false,
        help: '回傳資料格式錯誤',
        title: 'ERROR.TITLE',
        // 回傳資料格式錯誤，請聯絡客服人員。
        content: 'ERROR.RSP_FORMATE_ERROR'
    }
    // 無資料
    , 'EMPTY': {
        app_error_code: '0000004',
        app_error_code_hide: false,
        help: '查無資料',
        title: 'ERROR.TITLE',
        // 查無資料
        content: 'ERROR.EMPTY'
    }
    // 無資料
    , 'EMPTY_SEARCH': {
        app_error_code: '0000004',
        app_error_code_hide: false,
        help: '查詢期間無交易資料',
        title: 'ERROR.TITLE',
        // 查詢期間無交易資料
        content: 'ERROR.EMPTY_SEARCH'
    }
    // 路徑不存在
    , 'EMPTY_PATH': {
        app_error_code: '0000005',
        app_error_code_hide: false,
        help: '指定功能路徑不存在',
        title: 'ERROR.TITLE',
        // content: 'ERROR.PATH_NOT_EXIST'
        content: '目前此功能尚未提供喔!!!!!'
    }
    // 路徑不存在: 連結設定(中台設定資料)
    , 'EMPTY_LINK': {
        app_error_code: '0000006',
        app_error_code_hide: false,
        help: '指定功能路徑不存在(對外連線)',
        title: 'ERROR.TITLE',
        content: 'ERROR.PATH_NOT_EXIST'
    }

};
// -------------------- [通訊API相關 0001 ] -------------------- //
const ERROR_UC0001 = {
    // 參數格式錯誤
    'REQ_ERROR': {
        app_error_code: '0001001',
        app_error_code_hide: false,
        help: 'api request設定參數格式錯誤',
        title: 'ERROR.TITLE',
        // 資料格式錯誤
        content: 'ERROR.DATA_FORMAT_ERROR'
    }
    // 無資料
    , 'REP_ERROR': {
        app_error_code: '0001002',
        app_error_code_hide: false,
        help: 'api response回傳資料格式錯誤',
        title: 'ERROR.TITLE',
        // 回傳資料格式錯誤，請聯絡客服人員。
        content: 'ERROR.RSP_FORMATE_ERROR'
    }
    // 無資料
    , 'EMPTY_API': {
        app_error_code: '0001003',
        app_error_code_hide: false,
        help: '查無資料',
        title: 'ERROR.TITLE',
        // 查無資料
        content: 'ERROR.EMPTY'
    }
    // 無資料
    , 'EMPTY_RANGE_API': {
        app_error_code: '0001004',
        app_error_code_hide: false,
        help: '查詢期間無交易資料',
        title: 'ERROR.TITLE',
        // 查詢期間無交易資料
        content: 'ERROR.EMPTY_SEARCH'
    }
};
// -------------------- [通訊相關 0002 ] -------------------- //
const ERROR_UC0002 = {
    'SERVER_MAINTAIN': {
        app_error_code: '0002001',
        app_error_code_hide: true, // 停機公告已設定內容為準
        help: '停機公告機制',
        title: 'ERROR.INFO_TITLE',
        // 親愛的客戶您好，目前系統維護中，請稍後再試。造成您的不便，敬請見諒。
        content: 'ERROR.NO_SERVICE'
    }
    , 'NETWORK_CLIENT': {
        app_error_code: '0002002',
        app_error_code_hide: false,
        help: 'client network error',
        title: 'ERROR.TITLE',
        // 網路連線失敗，請您確認網路連線後再試。
        content: 'ERROR.NO_NETWORK'
    }
    , 'NETWORK_SERVER': {
        app_error_code: '0002003',
        app_error_code_hide: false,
        help: 'server network error',
        title: 'ERROR.TITLE',
        // 系統維護中，請稍後再試!若有其他問題，請聯絡客服人員。
        content: 'ERROR.CONNECTION'
    }
    , 'SERVER_TIMEOUT': {
        app_error_code: '0002004',
        app_error_code_hide: false,
        help: 'server connect timeout',
        title: 'ERROR.TITLE',
        // 連線逾時，請稍後再試，若有帳務交易發生逾時情況，煩請先暫停交易並洽客服人員查明結果。
        content: 'ERROR.CONNECTION_TIMEOUT'
    }
    , 'SERVER_TIMEOUT_CLIENT': {
        app_error_code: '0002005',
        app_error_code_hide: false,
        help: 'client wait server connect timeout(APP 等候超過時間)',
        title: 'ERROR.TITLE',
        // 連線逾時，請稍後再試，若有帳務交易發生逾時情況，煩請先暫停交易並洽客服人員查明結果。
        content: 'ERROR.CONNECTION_TIMEOUT'
    }
    , 'CHALLENGE_RESPONSE_ERROR': {
        app_error_code: '0002006',
        app_error_code_hide: false,
        help: 'do challenge response error',
        title: 'ERROR.TITLE',
        // 系統維護中，請稍後再試!若有其他問題，請聯絡客服人員。
        content: 'ERROR.CONNECTION'
    }
    , 'CHALLENGE_RESPONSE_CHANGE_ERROR': {
        app_error_code: '0002007',
        app_error_code_hide: false,
        help: 'send challenge response error',
        title: 'ERROR.TITLE',
        // 系統維護中，請稍後再試!若有其他問題，請聯絡客服人員。
        content: 'ERROR.CONNECTION'
    }
    , 'REQUEST_TOKEN_SET_ERROR': {
        app_error_code: '0002008',
        app_error_code_hide: false,
        // modify request obj token object is error
        help: 'modify request token data error',
        title: 'ERROR.TITLE',
        // 資料格式錯誤
        content: 'ERROR.DATA_FORMAT_ERROR'
    }
    , 'API_SEND_ERROR': {
        app_error_code: '0002009',
        app_error_code_hide: false,
        // send api error
        help: 'send api error',
        title: 'ERROR.TITLE',
        // 系統維護中，請稍後再試!若有其他問題，請聯絡客服人員。
        content: 'ERROR.CONNECTION'
    }
    , 'CHALLENGE_RESPONSE_REQ_ENCODE_ERROR': {
        app_error_code: '0002010',
        app_error_code_hide: false,
        // do challenge response request encode error
        help: 'do challenge response request encode error',
        title: 'ERROR.TITLE',
        // 資料格式錯誤
        content: 'ERROR.DATA_FORMAT_ERROR'
    }
    , 'CHALLENGE_RESPONSE_RES_DECODE_ERROR': {
        app_error_code: '0002011',
        app_error_code_hide: false,
        // do challenge response request encode error
        help: 'do challenge response response decode error',
        title: 'ERROR.TITLE',
        // 回傳資料格式錯誤，請聯絡客服人員。
        content: 'ERROR.RSP_FORMATE_ERROR'
    }
    , 'API_POST_ERROR': {
        app_error_code: '0002012',
        app_error_code_hide: false,
        // do api post error
        help: 'do api post error',
        title: 'ERROR.TITLE',
        // 系統維護中，請稍後再試!若有其他問題，請聯絡客服人員。
        content: 'ERROR.CONNECTION'
    }

};
// -------------------- [載入相關 0003 ] -------------------- //
const ERROR_UC0003 = {
    'PATH_NOT_EXIST': {
        app_error_code: '0003001',
        app_error_code_hide: false,
        help: '載入位置不存在',
        title: 'ERROR.TITLE',
        // 路徑不存在
        content: 'ERROR.PATH_NOT_EXIST'
    }
    , 'PLUGIN_ERROR': {
        app_error_code: '0003002',
        app_error_code_hide: false,
        help: 'plugin不存在',
        title: 'ERROR.TITLE',
        // 很抱歉，必要元件無法執行或異常！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。
        content: 'ERROR.PLUGIN_ERROR'
    }
    , 'SQLITE_DB_ERROR': {
        app_error_code: '0003003',
        app_error_code_hide: false,
        help: 'sqllit error',
        title: 'ERROR.TITLE',
        // 很抱歉，資料連線異常！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。
        content: 'ERROR.SQLITE_DB_ERROR'
    }
};


export const ERROR_CODE_LIST = {
    // -------------------- [一般登入 02] -------------------- //
    ...ERROR_UC02
    // -------------------- [國外匯入匯款 06] -------------------- //
    , ...ERROR_UC06
    // -------------------- [金融資訊 0010 ] -------------------- //
    , ...ERROR_UC10


    // 以下固定放這些，功能請往上放
    // -------------------- [系統共用 0000 ] -------------------- //
    , ...ERROR_UC0000
    // -------------------- [通訊API相關 0001 ] -------------------- //
    , ...ERROR_UC0001
    // -------------------- [通訊相關 0002 ] -------------------- //
    , ...ERROR_UC0002
    // -------------------- [載入相關 0003 ] -------------------- //
    , ...ERROR_UC0003
};