/**
 * 模擬api
 */

let dataToday = {
    'resContent': {
        'rowData': [
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '20000', 'balAmt': '21111', 'remark': '011-02121000555571轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '10000', 'balAmt': '31111', 'remark': '011-02121000559556轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '20000', 'balAmt': '51111', 'remark': '011-02121000566953轉入' },
            { 'txDate': '2019-11-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '3000', 'drAmt': '0', 'balAmt': '48111', 'remark': '011-021210007755685轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '3000', 'drAmt': '0', 'balAmt': '45111', 'remark': '011-02121000456695轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '5000', 'drAmt': '0', 'balAmt': '42111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '6000', 'drAmt': '0', 'balAmt': '41111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '3000', 'balAmt': '45111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '1000', 'drAmt': '0', 'balAmt': '46111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '10000', 'drAmt': '0', 'balAmt': '47111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '2000', 'balAmt': '38111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '2000', 'balAmt': '36111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '1000', 'drAmt': '0', 'balAmt': '40111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '500', 'drAmt': '0', 'balAmt': '42111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '300', 'drAmt': '0', 'balAmt': '38111', 'remark': '011-02121000798556轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '1000', 'drAmt': '0', 'balAmt': '41111', 'remark': '011-02121000798556轉入' },
        ],
        'totalData': {
            'totalDramt': '110000',
            'totalCramt': '360000',
            'totalDramtCount': '9',
            'totalCramtCount': '6'
        },
        'account': {
            'accountId': '05108000019026',
            'accountNickName': '0510nickName_Jerry',
            'currencyCode': 'USD',
            'currencyName': '美金'
        },
        'warningMsg': '請注意：目前顯示之餘額/資料尚不包含前一營業日批次待入扣帳之餘額/資料!!',
        'paginator': {
            'totalCount': '30',
            'pageSize': '15',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};
let data7D = {
    'resContent': {
        'rowData': [
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '30000', 'balAmt': '31111', 'remark': '011-02121000766585轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '30000', 'balAmt': '41111', 'remark': '011-02121000445652轉入' },
            { 'txDate': '2019-10-08', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '50000', 'balAmt': '61111', 'remark': '011-02121000765223轉入' },
            { 'txDate': '2019-10-09', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '4000', 'drAmt': '0', 'balAmt': '78111', 'remark': '011-021210004446594轉入' },
            { 'txDate': '2019-10-09', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '6000', 'drAmt': '0', 'balAmt': '85111', 'remark': '011-021210007998565轉入' },
            { 'txDate': '2019-10-09', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7000', 'drAmt': '0', 'balAmt': '90111', 'remark': '011-021210007985567轉入' },
            { 'txDate': '2019-10-10', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '30000', 'balAmt': '31111', 'remark': '011-02121000766585轉入' },
            { 'txDate': '2019-10-10', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '1000', 'balAmt': '41111', 'remark': '011-02121000445652轉入' },
            { 'txDate': '2019-10-11', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '10000', 'balAmt': '61111', 'remark': '011-02121000765223轉入' },
            { 'txDate': '2019-10-12', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '5000', 'drAmt': '0', 'balAmt': '78111', 'remark': '011-021210004446594轉入' },
            { 'txDate': '2019-10-12', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '500', 'drAmt': '0', 'balAmt': '85111', 'remark': '011-021210007998565轉入' },
            { 'txDate': '2019-10-12', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '1000', 'drAmt': '0', 'balAmt': '90111', 'remark': '011-021210007985567轉入' },
            { 'txDate': '2019-10-13', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '30000', 'balAmt': '31111', 'remark': '011-02121000766585轉入' },
            { 'txDate': '2019-10-13', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '12000', 'balAmt': '41111', 'remark': '011-02121000445652轉入' },
            { 'txDate': '2019-10-13', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '3000', 'balAmt': '61111', 'remark': '011-02121000765223轉入' },
            { 'txDate': '2019-10-13', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '3000', 'drAmt': '0', 'balAmt': '85111', 'remark': '011-021210007998565轉入' },
            { 'txDate': '2019-10-13', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '5000', 'drAmt': '0', 'balAmt': '90111', 'remark': '011-021210007985567轉入' },
            { 'txDate': '2019-10-14', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '2000', 'balAmt': '31111', 'remark': '011-02121000766585轉入' },
            { 'txDate': '2019-10-14', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '30000', 'balAmt': '41111', 'remark': '011-02121000445652轉入' },
            { 'txDate': '2019-10-14', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '50000', 'balAmt': '61111', 'remark': '011-02121000765223轉入' },
            { 'txDate': '2019-10-15', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '4000', 'drAmt': '0', 'balAmt': '78111', 'remark': '011-021210004446594轉入' },
            { 'txDate': '2019-10-15', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '10000', 'drAmt': '0', 'balAmt': '85111', 'remark': '011-021210007998565轉入' },
            { 'txDate': '2019-10-15', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7000', 'drAmt': '0', 'balAmt': '90111', 'remark': '011-021210007985567轉入' }
        ],
        'totalData': {
            'totalDramt': '11000',
            'totalCramt': '50000',
            'totalDramtCount': '11',
            'totalCramtCount': '12'
        },
        'account': {
            'accountId': '05108000019026',
            'accountNickName': '0510nickName_Jerry',
            'currencyCode': 'USD',
            'currencyName': '美金'
        },
        'warningMsg': '請注意：目前顯示之餘額/資料尚不包含前一營業日批次待入扣帳之餘額/資料!!',
        'paginator': {
            'totalCount': '30',
            'pageSize': '10',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};
let data1M = {
    'resContent': {
        'rowData': [
            { 'txDate': '2019-10-09', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '18000', 'balAmt': '41111', 'remark': '011-02121000756685轉入' },
            { 'txDate': '2019-10-10', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '9000', 'balAmt': '51111', 'remark': '011-02121000665958轉入' },
            { 'txDate': '2019-10-11', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '15000', 'balAmt': '61111', 'remark': '011-021210004456526轉入' },
            { 'txDate': '2019-10-11', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '14500', 'drAmt': '0', 'balAmt': '88111', 'remark': '011-021210007779853轉入' },
            { 'txDate': '2019-10-12', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '16500', 'drAmt': '0', 'balAmt': '95111', 'remark': '011-021210007779985轉入' },
            { 'txDate': '2019-10-13', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '5500', 'drAmt': '0', 'balAmt': '100111', 'remark': '011-02121000555696轉入' },
            { 'txDate': '2019-10-13', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '12000', 'balAmt': '41111', 'remark': '011-02121000756685轉入' },
            { 'txDate': '2019-10-14', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '9000', 'balAmt': '51111', 'remark': '011-02121000665958轉入' },
            { 'txDate': '2019-10-14', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '19000', 'balAmt': '61111', 'remark': '011-021210004456526轉入' },
            { 'txDate': '2019-10-14', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '4600', 'drAmt': '0', 'balAmt': '88111', 'remark': '011-021210007779853轉入' },
            { 'txDate': '2019-10-15', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7500', 'drAmt': '0', 'balAmt': '95111', 'remark': '011-021210007779985轉入' },
            { 'txDate': '2019-10-16', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '10000', 'drAmt': '0', 'balAmt': '100111', 'remark': '011-02121000555696轉入' },
            { 'txDate': '2019-10-17', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '3000', 'balAmt': '41111', 'remark': '011-02121000756685轉入' },
            { 'txDate': '2019-10-17', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '30000', 'balAmt': '51111', 'remark': '011-02121000665958轉入' },
            { 'txDate': '2019-10-17', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '150000', 'balAmt': '61111', 'remark': '011-021210004456526轉入' },
            { 'txDate': '2019-10-18', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '3000', 'drAmt': '0', 'balAmt': '88111', 'remark': '011-021210007779853轉入' },
            { 'txDate': '2019-10-18', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7000', 'drAmt': '0', 'balAmt': '95111', 'remark': '011-021210007779985轉入' },
            { 'txDate': '2019-10-20', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '5500', 'drAmt': '0', 'balAmt': '100111', 'remark': '011-02121000555696轉入' },
            { 'txDate': '2019-10-20', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '1000', 'balAmt': '41111', 'remark': '011-02121000756685轉入' },
            { 'txDate': '2019-10-20', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '2000', 'balAmt': '51111', 'remark': '011-02121000665958轉入' },
            { 'txDate': '2019-10-21', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '500', 'balAmt': '61111', 'remark': '011-021210004456526轉入' },
            { 'txDate': '2019-10-22', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '4200', 'drAmt': '0', 'balAmt': '88111', 'remark': '011-021210007779853轉入' },
            { 'txDate': '2019-10-23', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7000', 'drAmt': '0', 'balAmt': '95111', 'remark': '011-021210007779985轉入' },
            { 'txDate': '2019-10-24', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '8000', 'drAmt': '0', 'balAmt': '100111', 'remark': '011-02121000555696轉入' },
            { 'txDate': '2019-10-24', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '20000', 'balAmt': '41111', 'remark': '011-02121000756685轉入' },
            { 'txDate': '2019-10-24', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '10000', 'balAmt': '51111', 'remark': '011-02121000665958轉入' },
            { 'txDate': '2019-10-25', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '9600', 'balAmt': '61111', 'remark': '011-021210004456526轉入' },
            { 'txDate': '2019-10-25', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '5500', 'drAmt': '0', 'balAmt': '88111', 'remark': '011-021210007779853轉入' },
            { 'txDate': '2019-10-25', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '10000', 'drAmt': '0', 'balAmt': '95111', 'remark': '011-021210007779985轉入' },
            { 'txDate': '2019-10-26', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '20000', 'drAmt': '0', 'balAmt': '100111', 'remark': '011-02121000555696轉入' },
            { 'txDate': '2019-10-24', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '20000', 'balAmt': '41111', 'remark': '011-02121000756685轉入' },
            { 'txDate': '2019-10-24', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '10000', 'balAmt': '51111', 'remark': '011-02121000665958轉入' }
        ],
        'totalData': {
            'totalDramt': '200000',
            'totalCramt': '500000',
            'totalDramtCount': '15',
            'totalCramtCount': '17'
        },
        'account': {
            'accountId': '05108000019026',
            'accountNickName': '0510nickName_Jerry',
            'currencyCode': 'USD',
            'currencyName': '美金'
        },
        'warningMsg': '請注意：目前顯示之餘額/資料尚不包含前一營業日批次待入扣帳之餘額/資料!!',
        'paginator': {
            'totalCount': '30',
            'pageSize': '10',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};
let dataCustom = {
    'resContent': {
        'rowData': [
            { 'txDate': '2019-10-06', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '150000', 'balAmt': '51111', 'remark': '011-02121000665985轉入' },
            { 'txDate': '2019-10-06', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '200000', 'balAmt': '61111', 'remark': '011-02121000778569轉入' },
            { 'txDate': '2019-10-08', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '100000', 'balAmt': '71111', 'remark': '011-021210009985687轉入' },
            { 'txDate': '2019-10-15', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '17500', 'drAmt': '0', 'balAmt': '98111', 'remark': '011-021210007569955轉入' },
            { 'txDate': '2019-10-16', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '14500', 'drAmt': '0', 'balAmt': '105111', 'remark': '011-02121000623325轉入' },
            { 'txDate': '2019-10-17', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '6000', 'drAmt': '0', 'balAmt': '110111', 'remark': '011-02121000111256轉入' },
            { 'txDate': '2019-10-18', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '15000', 'balAmt': '51111', 'remark': '011-02121000665985轉入' },
            { 'txDate': '2019-10-18', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '20000', 'balAmt': '61111', 'remark': '011-02121000778569轉入' },
            { 'txDate': '2019-10-19', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '9500', 'balAmt': '71111', 'remark': '011-021210009985687轉入' },
            { 'txDate': '2019-10-20', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '10500', 'drAmt': '0', 'balAmt': '98111', 'remark': '011-021210007569955轉入' },
            { 'txDate': '2019-10-21', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '4500', 'drAmt': '0', 'balAmt': '105111', 'remark': '011-02121000623325轉入' },
            { 'txDate': '2019-10-21', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '2000', 'drAmt': '0', 'balAmt': '110111', 'remark': '011-02121000111256轉入' },
            { 'txDate': '2019-10-22', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '15000', 'balAmt': '51111', 'remark': '011-02121000665985轉入' },
            { 'txDate': '2019-10-23', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '20000', 'balAmt': '61111', 'remark': '011-02121000778569轉入' },
            { 'txDate': '2019-10-24', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '9500', 'balAmt': '71111', 'remark': '011-021210009985687轉入' },
            { 'txDate': '2019-10-24', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7500', 'drAmt': '0', 'balAmt': '98111', 'remark': '011-021210007569955轉入' },
            { 'txDate': '2019-10-24', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '4500', 'balAmt': '105111', 'remark': '011-02121000623325轉入' },
            { 'txDate': '2019-10-25', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '8600', 'drAmt': '0', 'balAmt': '110111', 'remark': '011-02121000111256轉入' },
            { 'txDate': '2019-10-25', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '100000', 'balAmt': '51111', 'remark': '011-02121000665985轉入' },
            { 'txDate': '2019-10-26', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '26000', 'balAmt': '61111', 'remark': '011-02121000778569轉入' },
            { 'txDate': '2019-10-26', 'memo': '網路轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '36000', 'balAmt': '71111', 'remark': '011-021210009985687轉入' },
            { 'txDate': '2019-10-27', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '7500', 'drAmt': '0', 'balAmt': '98111', 'remark': '011-021210007569955轉入' },
            { 'txDate': '2019-10-28', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '0', 'drAmt': '4500', 'balAmt': '105111', 'remark': '011-02121000623325轉入' },
            { 'txDate': '2019-10-29', 'memo': '批次轉帳', 'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!', 'crAmt': '75000', 'drAmt': '0', 'balAmt': '110111', 'remark': '011-02121000111256轉入' }
        ],
        'totalData': {
            'totalDramt': '70000',
            'totalCramt': '150000',
            'totalDramtCount': '10',
            'totalCramtCount': '14'
        },
        'account': {
            'accountId': '05108000019026',
            'accountNickName': '0510nickName_Jerry',
            'currencyCode': 'USD',
            'currencyName': '美金'
        },
        'warningMsg': '請注意：目前顯示之餘額/資料尚不包含前一營業日批次待入扣帳之餘額/資料!!',
        'paginator': {
            'totalCount': '30',
            'pageSize': '10',
            'pageNumber': '5',
            'sortColName': '',
            'sortDirection': 'DESC'
        }
    }
};

let df_response = {
    "apiId": "SPEC10020001",
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
    "resContent": {
        "rowData": [{
            "txDate": "2019-10-08",
            "memo": "網路轉帳",
            'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!',
            "crAmt": "0",
            "drAmt": "20000",
            "balAmt": "21111"
            , "remark": "NT02204000007528"
        }, {
            "txDate": "2019-10-09",
            "memo": "批次轉帳",
            'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!',
            "crAmt": "0",
            "drAmt": "10000",
            "balAmt": "31111"
            , "remark": "NT02204000007528"
        }, {
            "txDate": "2019-10-10",
            "memo": "網路轉帳",
            'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!',
            "crAmt": "0",
            "drAmt": "20000",
            "balAmt": "51111"
            , "remark": "NT02204000007528"
        }, {
            "txDate": "2019-11-14",
            "memo": "網路轉帳",
            'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!',
            "crAmt": "3000",
            "drAmt": "0",
            "balAmt": "48111"
            , "remark": "NT02204000007528"
        }, {
            "txDate": "2019-10-18",
            "memo": "批次轉帳",
            'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!',
            "crAmt": "3000",
            "drAmt": "0",
            "balAmt": "45111"
            , "remark": "NT02204000007528"
        }, {
            "txDate": "2019-12-26",
            "memo": "網路轉帳",
            'warningMsg': '請注意：目前顯示之餘額/資料尚不包含今日批次待入扣帳之餘額/資料!!',
            "crAmt": "5000",
            "drAmt": "0",
            "balAmt": "40111"
            , "remark": "NT02204000007528"
        }],
        "totalData": {
            "totalDrawal": "11000",
            "totalDeposit": "50000",
            "totalDrawalCount": "3",
            "totalDepositCount": "3"
        },
        "account": {
            " accountId ": "05108000019026",
            "accountNickName": "0510nickName_Jerry",
            "currencyCode": "USD",
            'currencyName': '美金'
        },
        "warningMsg": "請注意：目前顯示之餘額/資料尚不包含前一營業日批次待入扣帳之餘額/資料!!",
        "paginator": {
            "totalCount": "20",
            "pageSize": "10",
            "pageNumber": "5",
            "sortColName": "",
            "sortDirection": "DESC",
        }
    }
};

export const api_response = {...df_response, ...dataToday};
export const api_response7D = {...df_response, ...data7D};
export const api_response1M = {...df_response, ...data1M};
export const api_responseCustom = {...df_response, ...dataCustom};
export const api_error = {
    'apiId': 'SPEC06010102',
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
