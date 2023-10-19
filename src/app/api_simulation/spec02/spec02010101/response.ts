/**
 * 模擬api
 */
let resData1 = {
    'apiId': 'SPEC02010101',
    'token': {
        'requestId': '',
        'responseTime': '2020-07-16 18:28:31',
        'lang': 'zh_TW'
    },
    'resFlag': '0',
    'resMsg': {
        'errorCode': '',
        'errorMsg': ''
    },
    'resContent': {
        "userId": "C221374420", // 身分證
        "loginUID": "a123456", // 使用者代號
        "role": "INDIVIDUAL",
        "accessToken": "eyJraWQiOiJDa2ZXZlNockQzTnI2UlEycUNnWWJPNE91akhQTmlESldkY0VOYWRjV1lnSmJUU29uY0JCVjVTb2tCQXV0d2ZPIiwidHlwIjoiSldUIiwiYWxnIjoiSFM1MTIifQ",
        "refreshToken": "eyJraWQiOiJkQUdWS1FLTmZ5bVZUQmVuUGNJQTV2dHNWUXNwMnVyYW9UZmo2YmxZV21MZ3Jtb0lTdWNidWtTTkthSW9XS3RvIiwidHlwIjoiSldUIiwiYWxnIjoiSFM1MTIifQ",
        "isMobilebank": "Y",
        "isCardUser": "Y",
        "isLoginCheckStrReset": "Y",
        "security": {
            "id4Num": "Y", // 是否有身分證後四碼驗證
            // "otp": "Y", // 是否有OTP驗證
            "fastPay": "Y", // 是否有快速交易驗證
            "fastPayNon": "Y", // 是否有快速交易-非約定驗證
            "deviceBind": "Y" // 是否有綁定裝置
        },
        "idType": "TWNID", // 本國人: TWNID 外國人: FOREIGNID 居留證: RESIDENTID
        "nameFlag": "Y", // 同戶名註記  BS1174 <NAME_FLG>
        "nonFlag": "Y", // 非約定註記 BS1174 <NONFLG>
        "fundAllow": "Y", // 網銀可否買基金 BS1174 <FMNET>
        "transferAllow": "Y", // 轉帳權限 Y: 可轉出、可查詢轉出轉入 N: 不可轉出、可查詢轉入 D: 註銷 BS1174 <TRFLG>
        "userName": "凱爾文",
        "email": "41874@scsb.com.tw",
        "phone": "0911222333", // 一般手機號碼 BS1833 <SREF>
        "phoneOTP": "0955666777", // OTP手機號碼 BS1830 <CTELNO1>
        "timeOut": "1.5"
    }
};

let resData2 = {
    'apiId': 'SPEC02010101',
    'token': {
        'requestId': '',
        'responseTime': '2020-07-16 18:28:31',
        'lang': 'zh_TW'
    },
    'resFlag': '0',
    'resMsg': {
        'errorCode': '',
        'errorMsg': ''
    },
    'resContent': {

    }
};

export const api_response1 = resData1;
export const api_response2 = resData2;
export const api_error = {
    'apiId': 'SPEC02010101',
    'token': {
        'requestId': '',
        'responseTime': '2020-06-20 18:28:31',
        'lang': 'zh_TW'
    },
    'resFlag': '1',
    'resMsg': {
        'errorCode': 'ERR02010101',
        'errorMsg': 'Test Error'
    }
};
export const api_exception = {
    'errorCode': 'ERRAAAAAAA',
    'errorMsg': 'Test Error'
};
