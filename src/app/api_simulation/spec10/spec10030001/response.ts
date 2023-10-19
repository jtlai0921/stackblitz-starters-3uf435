/**
 * 模擬api
 */
let resData1 = {
    'apiId': 'SPEC10030001',
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
        dataTime: "2020-06-20",
        rowData: [
            {
                currencyCode: "USD",
                currencyName: "美金",
                rate: "5.50"
            },
            {
                currencyCode: "JPY",
                currencyName: "日圓",
                rate: "7.50"
            },
            {
                currencyCode: "EUR",
                currencyName: "歐元",
                rate: "8.05"
            },
            {
                currencyCode: "CNY",
                currencyName: "人民幣",
                rate: "3.20"
            }
        ]
    }
};

let resData2 = {
    'apiId': 'SPEC10030001',
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
    'apiId': 'SPEC10030001',
    'token': {
        'requestId': '',
        'responseTime': '2020-06-20 18:28:31',
        'lang': 'zh_TW'
    },
    'resFlag': '1',
    'resMsg': {
        'errorCode': 'ERR10030001',
        'errorMsg': 'Test Error'
    }
};
export const api_exception = {
    'errorCode': 'ERRAAAAAAA',
    'errorMsg': 'Test Error'
};
