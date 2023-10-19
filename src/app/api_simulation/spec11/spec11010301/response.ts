/**
 * 模擬api
 */
let data = {
    'apiId': 'SPEC11010301',
    'token': {
        'requestId': '',
        'responseTime': '',
        'lang': ''
    },
    'resFlag': '0',
    'resMessage': {
        'errorCode': '',
        'errorMsg': ''
    },
    "resContent": {
        "outputData": {
            "strTotalNoproc": "-888,115",
            "riskData": [
                {
                    "engName": "conservative",
                    "chiName": "保守型比例",
                    "value": "27.63"
                },
                {
                    "engName": "aggressive",
                    "chiName": "積極型比例",
                    "value": "18.31"
                },
                {
                    "engName": "moderate",
                    "chiName": "穩健型比例",
                    "value": "54.06"
                }
            ],
            "currencyData": [
                {
                    "engName": "TWD",
                    "chiName": "台幣比例",
                    "value": "57.83"
                },
                {
                    "engName": "JPY",
                    "chiName": "日圓比例",
                    "value": "1.00"
                },
                {
                    "engName": "EUR",
                    "chiName": "歐元比例",
                    "value": "2.68"
                },
                {
                    "engName": "AUD",
                    "chiName": "澳幣比例",
                    "value": "0.51"
                },
                {
                    "engName": "USD",
                    "chiName": "美金比例",
                    "value": "30.54"
                }
            ],
            "regionData": [
                {
                    "engName": "others",
                    "chiName": "其他比例",
                    "value": "4.32"
                },
                {
                    "engName": "fixedIncomeFund",
                    "chiName": "固定收益型比例",
                    "value": "50.12"
                },
                {
                    "engName": "balancedFund",
                    "chiName": "平衡型比例",
                    "value": "2.89"
                },
                {
                    "engName": "equityFund",
                    "chiName": "股票型比例",
                    "value": "18.09"
                },
                {
                    "engName": "currencyFund",
                    "chiName": "貨幣型比例",
                    "value": "24.58"
                }
            ],
            "strTotalTotosamt": "13,426,562",
            "showCcyList": true,
            "strTotalTotprice": "12,538,447",
            "sumupInfo": [
                {
                    "noProc": "-888,115.00",
                    "totsAmt": "13,358,600.00",
                    "totChiCcy": "台幣",
                    "totPrice": "12,470,485.00",
                    "apdint": "0.00",
                    "intAmt": "-888,115.00",
                    "rate": "1.0000",
                    "intretn": "-6.65",
                    "baoChou": "-6.65",
                    "totEngCcy": "TWD"
                },
                {
                    "noProc": "-13,411.00",
                    "totsAmt": "1,235,419.00",
                    "totChiCcy": "美金",
                    "totPrice": "1,222,008.00",
                    "apdint": "0.00",
                    "intAmt": "-13,411.00",
                    "rate": "29.9900",
                    "intretn": "-1.09",
                    "baoChou": "-1.09",
                    "totEngCcy": "USD"
                },
                {
                    "noProc": "0.00",
                    "totsAmt": "1,100,150,000.00",
                    "totChiCcy": "日圓",
                    "totPrice": "1,100,150,000.00",
                    "apdint": "0.00",
                    "intAmt": "0.00",
                    "rate": ".2888",
                    "intretn": "0.00",
                    "baoChou": "0.00",
                    "totEngCcy": "JPY"
                },
                {
                    "noProc": "0.00",
                    "totsAmt": "30,000,000.00",
                    "totChiCcy": "歐元",
                    "totPrice": "30,000,000.00",
                    "apdint": "0.00",
                    "intAmt": "0.00",
                    "rate": "34.0800",
                    "intretn": "0.00",
                    "baoChou": "0.00",
                    "totEngCcy": "EUR"
                },
                {
                    "noProc": "0.00",
                    "totsAmt": "3,244.00",
                    "totChiCcy": "澳幣",
                    "totPrice": "3,244.00",
                    "apdint": "0.00",
                    "intAmt": "0.00",
                    "rate": "19.6300",
                    "intretn": "0.00",
                    "baoChou": "0.00",
                    "totEngCcy": "AUD"
                },
                {
                    "noProc": "-1,290,311.00",
                    "totsAmt": "1,390,595,816.00",
                    "totChiCcy": "折台",
                    "totPrice": "1,389,305,505.00",
                    "apdint": "0.00",
                    "intAmt": "-1,290,311.00",
                    "rate": "",
                    "intretn": "-0.09",
                    "baoChou": "-0.09",
                    "totEngCcy": "折台"
                }
            ],
            "strTotalNtMoney": "13,426,561.8",
            "alShow": [
                {
                    "fundChiCcy": "台幣",
                    "p3": "3.0499%",
                    "p1": "-1.5017%",
                    "fundTpeCh": "全球高收益債券",
                    "region": "固定收益型",
                    "fundName": "復華高益策略組合基金",
                    "fundCode": "7320",
                    "weight": "17.88",
                    "poi": "-0.50%",
                    "priceDate": "108/05/17",
                    "fundEngCcy": "TWD",
                    "poi_image": "DOWN",
                    "viewCurrency": "台幣",
                    "ntMoney": "2,400,000.00",
                    "fundMoney": "2,400,000.00",
                    "nowPrice": "2,387,908.00",
                    "rankName": "穩健型",
                    "acctPrice": "13.3400",
                    "p6": "7.4181%"
                },
                {
                    "fundChiCcy": "台幣",
                    "p3": ".1083%",
                    "p1": ".0397%",
                    "fundTpeCh": "貨幣市場 - 新台幣",
                    "region": "貨幣型",
                    "fundName": "復華貨幣市場基金",
                    "fundCode": "7317",
                    "weight": "14.90",
                    "poi": "1.11%",
                    "priceDate": "108/05/17",
                    "fundEngCcy": "TWD",
                    "poi_image": "UP",
                    "viewCurrency": "台幣",
                    "ntMoney": "2,000,000.00",
                    "fundMoney": "2,000,000.00",
                    "nowPrice": "2,022,273.00",
                    "rankName": "保守型",
                    "acctPrice": "14.4459",
                    "p6": ".1973%"
                }
            ],
            "ccyList": {
                "rate": "0.0",
                "engCcy": "折台",
                "chiCcy": "折台"
            },
            "totalNtMoney": 1.34265618E7,
            "infoDateStr": "2020/07/07  08：09：19  PM",
            "strTotalBaochou": "-6.61",
            "isNetTans": "true"
        }
    }
};

let df_response = {
    'apiId': 'SPEC11010301',
    'token': {
        'requestId': '',
        'responseTime': '',
        'lang': ''
    },
    'resFlag': '0',
    'resMessage': {
        'errorCode': '',
        'errorMsg': ''
    },
    'resContent': {

    }
};

export const api_response = { ...df_response, ...data };
export const api_response_empty = { ...df_response, ...df_response };
export const api_error = {
    'apiId': 'SPEC11010301',
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
