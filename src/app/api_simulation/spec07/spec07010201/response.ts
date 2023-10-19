/**
 * 模擬api
 */

let dataToYear = {
    "apiId": "SPEC07010201",
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
        'accountId': '08292000039952',
        'currencyCode': 'USD',
        'rowData': [
            { 'transDate': '109-09-04', 'endDate': '109-09-29', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '1100', 'tax': '11000', 'depositAmt': '26000', 'drawAmt': '20000' },
            { 'transDate': '109-09-26', 'endDate': '109-10-14', 'newTrans': '存入', 'memo': '新開戶', 'stampTax': '1000', 'tax': '10000', 'depositAmt': '31000', 'drawAmt': '11000' },
            { 'transDate': '109-09-11', 'endDate': '109-09-29', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '42000', 'drawAmt': '18000' },
            { 'transDate': '109-09-27', 'endDate': '109-10-13', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '10', 'tax': '1000', 'depositAmt': '35000', 'drawAmt': '19000' },
            { 'transDate': '109-10-06', 'endDate': '109-10-14', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '1500', 'tax': '7500', 'depositAmt': '39000', 'drawAmt': '15000' },
            { 'transDate': '109-11-02', 'endDate': '109-11-19', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '10500', 'tax': '18500', 'depositAmt': '27000', 'drawAmt': '14000' },
            { 'transDate': '109-11-29', 'endDate': '109-12-05', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '34000', 'drawAmt': '45000' },
            { 'transDate': '109-11-18', 'endDate': '109-12-01', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '40200', 'drawAmt': '11000' },
            { 'transDate': '109-12-26', 'endDate': '109-01-07', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '120', 'depositAmt': '39500', 'drawAmt': '17000' },
            { 'transDate': '109-12-06', 'endDate': '109-12-21', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '25', 'tax': '950', 'depositAmt': '37000', 'drawAmt': '15000' },
            { 'transDate': '109-12-14', 'endDate': '109-01-03', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '1800', 'tax': '5600', 'depositAmt': '40100', 'drawAmt': '18000' },
            { 'transDate': '109-01-05', 'endDate': '109-01-20', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '1500', 'tax': '8000', 'depositAmt': '700000', 'drawAmt': '24000' }
        ],
        'paginatedInfo': {
            'totalRowCount': '30',
            'pageSize': '15',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};
let data1Y = {
    "apiId": "SPEC07010201",
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
        'rowData': [
            { 'transDate': '109-09-26', 'endDate': '109-10-14', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '1000', 'tax': '10000', 'depositAmt': '31000', 'drawAmt': '11000' },
            { 'transDate': '109-09-04', 'endDate': '109-09-29', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '1100', 'tax': '11000', 'depositAmt': '26000', 'drawAmt': '20000' },
            { 'transDate': '109-09-27', 'endDate': '109-10-13', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '10', 'tax': '1000', 'depositAmt': '35000', 'drawAmt': '19000' },
            { 'transDate': '109-09-11', 'endDate': '109-09-29', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '42000', 'drawAmt': '18000' },
            { 'transDate': '109-10-06', 'endDate': '109-10-14', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '1500', 'tax': '7500', 'depositAmt': '39000', 'drawAmt': '15000' },
            { 'transDate': '109-10-26', 'endDate': '109-11-12', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '31000', 'drawAmt': '21000' },
            { 'transDate': '109-10-09', 'endDate': '109-10-25', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '0', 'tax': '0', 'depositAmt': '29000', 'drawAmt': '16000' },
            { 'transDate': '109-10-31', 'endDate': '109-11-16', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '100', 'depositAmt': '48000', 'drawAmt': '28000' },
            { 'transDate': '109-10-15', 'endDate': '109-10-29', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '100', 'tax': '10000', 'depositAmt': '56000', 'drawAmt': '19000' },
            { 'transDate': '109-11-01', 'endDate': '109-11-17', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '55000', 'drawAmt': '27000' },
            { 'transDate': '109-11-02', 'endDate': '109-11-19', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '10500', 'tax': '18500', 'depositAmt': '27000', 'drawAmt': '14000' },
            { 'transDate': '109-11-29', 'endDate': '109-12-05', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '34000', 'drawAmt': '45000' },
            { 'transDate': '109-11-18', 'endDate': '109-12-01', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '40200', 'drawAmt': '11000' },
            { 'transDate': '109-12-26', 'endDate': '109-01-07', 'newTrans': '存入', 'memo': '新開戶', 'stampTax': '0', 'tax': '120', 'depositAmt': '39500', 'drawAmt': '17000' },
            { 'transDate': '109-12-06', 'endDate': '109-12-21', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '25', 'tax': '950', 'depositAmt': '37000', 'drawAmt': '15000' },
            { 'transDate': '109-12-14', 'endDate': '109-01-03', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '1800', 'tax': '5600', 'depositAmt': '40100', 'drawAmt': '18000' },
            { 'transDate': '109-01-05', 'endDate': '109-01-20', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '1500', 'tax': '8000', 'depositAmt': '700000', 'drawAmt': '24000' }
        ],
        'paginatedInfo': {
            'totalRowCount': '30',
            'pageSize': '15',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};
let data2Y = {
    "apiId": "SPEC07010201",
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
        'rowData': [
            { 'transDate': '109-03-11', 'endDate': '109-03-27', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '1100', 'tax': '11000', 'depositAmt': '27000', 'drawAmt': '16000' },
            { 'transDate': '109-03-15', 'endDate': '109-04-09', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '1300', 'tax': '13000', 'depositAmt': '29000', 'drawAmt': '27000' },
            { 'transDate': '109-06-29', 'endDate': '109-07-11', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '100', 'tax': '1000', 'depositAmt': '11000', 'drawAmt': '7500' },
            { 'transDate': '109-03-21', 'endDate': '109-04-12', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '1500', 'drawAmt': '15600' },
            { 'transDate': '109-04-27', 'endDate': '109-05-17', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '1900', 'tax': '5600', 'depositAmt': '29500', 'drawAmt': '3000' },
            { 'transDate': '109-04-08', 'endDate': '109-04-29', 'newTrans': '存入', 'memo': '新開戶', 'stampTax': '0', 'tax': '0', 'depositAmt': '500', 'drawAmt': '1000' },
            { 'transDate': '109-04-19', 'endDate': '109-05-13', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '1000', 'tax': '3100', 'depositAmt': '1000', 'drawAmt': '5900' },
            { 'transDate': '109-08-25', 'endDate': '109-09-13', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '100', 'depositAmt': '1100', 'drawAmt': '31000' },
            { 'transDate': '109-05-14', 'endDate': '109-06-02', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '750', 'tax': '11500', 'depositAmt': '49000', 'drawAmt': '17500' },
            { 'transDate': '109-05-03', 'endDate': '109-05-21', 'newTrans': '存入', 'memo': '新開戶', 'stampTax': '0', 'tax': '0', 'depositAmt': '100', 'drawAmt': '21000' },
            { 'transDate': '109-05-24', 'endDate': '109-06-07', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '30', 'tax': '450', 'depositAmt': '7900', 'drawAmt': '17000' },
            { 'transDate': '109-06-01', 'endDate': '109-06-14', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '50', 'drawAmt': '6000' },
            { 'transDate': '109-06-13', 'endDate': '109-06-27', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '1000', 'drawAmt': '10800' },
            { 'transDate': '109-06-25', 'endDate': '109-07-12', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '120', 'depositAmt': '1500', 'drawAmt': '9200' },
            { 'transDate': '109-07-11', 'endDate': '109-07-25', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '25', 'tax': '750', 'depositAmt': '2100', 'drawAmt': '11500' },
            { 'transDate': '109-07-26', 'endDate': '109-08-16', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '500', 'tax': '6100', 'depositAmt': '11500', 'drawAmt': '17500' },
            { 'transDate': '109-08-09', 'endDate': '109-08-26', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '7500', 'tax': '25000', 'depositAmt': '70000', 'drawAmt': '9700' }
        ],
        'paginatedInfo': {
            'totalRowCount': '30',
            'pageSize': '15',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};
let dataCustom = {
    "apiId": "SPEC07010201",
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
        'rowData': [
            { 'transDate': '109-05-06', 'endDate': '109-05-19', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '4500', 'tax': '10500', 'depositAmt': '65000', 'drawAmt': '2000' },
            { 'transDate': '109-05-21', 'endDate': '109-06-10', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '1000', 'tax': '7000', 'depositAmt': '11000', 'drawAmt': '5000' },
            { 'transDate': '109-05-03', 'endDate': '109-05-19', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '700', 'tax': '2100', 'depositAmt': '18000', 'drawAmt': '1500' },
            { 'transDate': '109-05-17', 'endDate': '109-06-05', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '100', 'tax': '0', 'depositAmt': '2900', 'drawAmt': '11000' },
            { 'transDate': '109-08-21', 'endDate': '109-09-06', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '100', 'tax': '2600', 'depositAmt': '37500', 'drawAmt': '7500' },
            { 'transDate': '109-06-26', 'endDate': '109-07-13', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '850', 'drawAmt': '1100' },
            { 'transDate': '109-06-08', 'endDate': '109-06-27', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '2100', 'tax': '5100', 'depositAmt': '2100', 'drawAmt': '6700' },
            { 'transDate': '109-06-11', 'endDate': '109-06-29', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '75', 'tax': '500', 'depositAmt': '1400', 'drawAmt': '23000' },
            { 'transDate': '109-06-17', 'endDate': '109-07-05', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '900', 'tax': '8500', 'depositAmt': '61000', 'drawAmt': '19500' },
            { 'transDate': '109-07-04', 'endDate': '109-07-19', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '750', 'drawAmt': '31000' },
            { 'transDate': '109-07-12', 'endDate': '109-07-28', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '40', 'tax': '490', 'depositAmt': '5600', 'drawAmt': '19000' },
            { 'transDate': '109-07-31', 'endDate': '109-08-19', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '0', 'depositAmt': '750', 'drawAmt': '8000' },
            { 'transDate': '109-08-15', 'endDate': '109-09-07', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '1400', 'tax': '0', 'depositAmt': '8500', 'drawAmt': '11000' },
            { 'transDate': '109-08-19', 'endDate': '109-09-09', 'newTrans': '存入', 'memo': '轉期付息', 'stampTax': '0', 'tax': '100', 'depositAmt': '1300', 'drawAmt': '1500' },
            { 'transDate': '109-08-01', 'endDate': '109-08-12', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '260', 'depositAmt': '6700', 'drawAmt': '7800' },
            { 'transDate': '109-09-06', 'endDate': '109-09-28', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '500', 'tax': '4000', 'depositAmt': '9500', 'drawAmt': '5000' },
            { 'transDate': '109-09-21', 'endDate': '109-10-06', 'newTrans': '轉帳', 'memo': '轉期付息', 'stampTax': '0', 'tax': '200', 'depositAmt': '50000', 'drawAmt': '3200' },
            { 'transDate': '109-09-26', 'endDate': '109-10-11', 'newTrans': '轉帳', 'memo': '新開戶', 'stampTax': '7500', 'tax': '21000', 'depositAmt': '110000', 'drawAmt': '2500' },
            { 'transDate': '109-10-09', 'endDate': '109-10-24', 'newTrans': '存入', 'memo': '新開戶', 'stampTax': '1300', 'tax': '19000', 'depositAmt': '56000', 'drawAmt': '9000' }
        ],
        'paginatedInfo': {
            'totalRowCount': '30',
            'pageSize': '15',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};

let df_response = {
    "apiId": "SPEC07010201",
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
        'rowData': [
        ],
        'paginatedInfo': {
            'totalRowCount': '30',
            'pageSize': '15',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};

export const api_response = { ...df_response, ...dataToYear };
export const api_response1Y = { ...df_response, ...data1Y };
export const api_response2Y = { ...df_response, ...data2Y };
export const api_responseCustom = { ...df_response, ...dataCustom };
export const api_error = {
    'apiId': 'SPEC07010201',
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
