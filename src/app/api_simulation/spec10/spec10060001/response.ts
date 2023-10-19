/**
 * 模擬api
 */
let resData1 = {
    'apiId': 'SPEC10060001',
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
        dataTime: "2020-06-20 17:48:30",
        rowData: [
            {
                currencyCode: "USD",
                currencyName: "美金",
                category: "0",
                buyRate: "29.55",
                sellRate: "29.65"
            },
            {
                currencyCode: "JPY",
                currencyName: "日圓",
                category: "0",
                buyRate: "0.2749",
                sellRate: "0.2789"
            },
            {
                currencyCode: "EUR",
                currencyName: "歐元",
                category: "0",
                buyRate: "40.50",
                sellRate: "40.80"
            },
            {
                currencyCode: "USD CASH",
                currencyName: "美金現金",
                category: "1",
                buyRate: "28.50",
                sellRate: "28.80"
            },
            {
                currencyCode: "JPY CASH",
                currencyName: "日圓現金",
                category: "1",
                buyRate: "9.50",
                sellRate: "9.80"
            },
            {
                currencyCode: "EUR CASH",
                currencyName: "歐元現金",
                category: "1",
                buyRate: "39.50",
                sellRate: "39.80"
            },
            {
                currencyCode: "CNY CASH",
                currencyName: "人民幣現金",
                category: "1",
                buyRate: "4.50",
                sellRate: "4.80"
            }
        ]
    }
};

let resData2 = {
    'apiId': 'SPEC10060001',
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
    'apiId': 'SPEC10060001',
    'token': {
        'requestId': '',
        'responseTime': '2020-06-20 18:28:31',
        'lang': 'zh_TW'
    },
    'resFlag': '1',
    'resMsg': {
        'errorCode': 'ERR10060001',
        'errorMsg': 'Test Error'
    }
};
export const api_exception = {
    'errorCode': 'ERRAAAAAAA',
    'errorMsg': 'Test Error'
};
