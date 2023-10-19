/**
 * 模擬api
 */
let data = {
    "apiId": "SPEC07010101",
    "token": {
        "requestId": "",
        "responseTime": "",
        "lang": "TW"
    },
    "resFlag": "0",
    "resMessage": {
        "errorCode": "",
        "errorMsg": ""
    },
    'resContent': {
        'intrat': '0.87000',
        'startDate': '109-01-01',
        'endDate': '109-02-06',
        'rateType': '機動',
        'tranAcct': '23-2-03-00-1214091',
        'newConAcct': '無',
        'newAutoTrn': '本金,轉期最終到期日:109-02-01',
        'newPeriod': '到期取息',
        'newBlamt': '500000',
        'newAplAmt': '500000',
        'newCurAmt': '40000',
        "currencyCode": "USD"
    }
};

let df_response = {
    "apiId": "SPEC07010101",
    "token": {
        "requestId": "",
        "responseTime": "",
        "lang": "TW"
    },
    "resFlag": "0",
    "resMessage": {
        "errorCode": "",
        "errorMsg": ""
    },
    'resContent': {
    }
};

export const api_response = { ...df_response, ...data };
export const api_response_empty = { ...df_response, ...df_response };
export const api_error = {
    'apiId': 'SPEC07010101',
    'token': {
        'requestId': '',
        'responseTime': '2020-06-20 18:18:31',
        'lang': 'zh_TW'
    },
    'resFlag': '1',
    'resMsg': {
        'errorCode': 'ERRAAAAAAA',
        'errorMsg': 'Test Error'
    }
};
export const api_exception = {
    'errorCode': 'ERRAAAAAAA',
    'errorMsg': 'Test Error'
};
