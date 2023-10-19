/**
 * 外聯網址設定
 * target設定說明
 *  _system: 另開OS預設劉覽器開啟鏈結
 *  _blank: 開啟內嵌網頁劉覽器開啟鏈結
 */
import { environment } from '@environments/environment';

let externalWebOption = {
    // 智能客服
    'robot': {
        url: 'https://smartrobot.scsb.com.tw/index.php?eservice=mainapp'
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.robot'
        }
    },
    // 線上申請信用卡
    'applycard': {
        url: 'https://apply.scsb.com.tw/card/credit_card/contact'
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.applycard'
        }
    },
    // 線上開立數位存款帳戶
    'acocountonline': {
        url: 'https://apply.scsb.com.tw/openaccount/client/',
        target: '_system'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.acocountonline'
        }
    },
    // 網路銀行
    'onlinebank': {
        url: 'https://ibank.scsb.com.tw/'
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.onlinebank'
        }
    },
    // 行銷活動登錄
    'marketingactivitylogin': {
        url: 'https://ibank.scsb.com.tw/PROMOTIONS/cardlogin/begin.do'
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.marketingactivitylogin'
        }
    },
    // 信用卡優惠
    'creditcardoffers': {
        url: 'https://www.scsbrewards.com.tw/'
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.creditcardoffers'
        }
    },
    // 基金情報
    'fundWeb': {
        url: 'https://fund.scsb.com.tw/ReportFile/MarketComment/MarketWeek.jsp'
        , target: '_system'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.fundWeb'
        }
    },
    // 基金資訊觀測站
    'fundclear': {
        url: 'http://www.fundclear.com.tw'
        , target: '_blank'
        , confirmOptions: {
            title: '基金資訊觀測站', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.fundclear'
        }
    },
    // 公開資訊觀測站
    'newmops': {
        url: 'http://newmops.tse.com.tw'
        , target: '_blank'
        , confirmOptions: {
            title: '公開資訊觀測站', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.newmops'
        }
    },
    // 線上申請貸款: 我要申請信貸
    'loan-apply': {
        url: 'https://apply.scsb.com.tw/loan/client/?promotionUnit=8900&promotionCode=91006&project='
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: 'POPUP.WEB_OPEN.loanapply'
        }
    },
    'demo': {
        url: 'http path'
        , target: '_blank'
    }
    , 'demo2': {
        url: 'http path'
        , target: '_blank'
        , confirmOptions: {
            title: '', // 空值 就用預設值取代
            context: '即將離開app前往google網頁'
        }
    }
};

/**
 * 測試外連網址
 */
if (!environment.PRODUCTION) {

}

export const Sites = externalWebOption;
