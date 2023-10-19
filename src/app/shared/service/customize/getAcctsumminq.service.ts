/**
 * 帳戶概要
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { LocalStorageService } from '../global/localStorage.service';
import { LangTransService } from 'src/app/shared/pipe/langTransPipe/lang-trans.service';
/**
 * [API]
 */
@Injectable()
export class GetAcctSummInqService {

    constructor(
        private langTransService: LangTransService,
        public storage: LocalStorageService,
        public telegram: TelegramService
    ) { }

    /**
     * 取得帳戶概要 CCMPTX000182Rq
     */
    public getAcctSummInq() {
        //取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000182Rq');
        // requset['Currency'] = this.storage.get('loginUserCountry');
        //打api
        requset['Currency'] ="TWD";

        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(requset).then(
                (res) => {
                    let data = this.modify(res);
                    resolve(data);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    modify(data) {

        let depositData = {
            'list': [],
            'curOrder': {},
            'countryOrder': {}
        };
        let loanData = {
            'list': [],
            'curOrder': {},
            'countryOrder': {}
        };

        data['AcctSummList'].forEach(item => {
            switch (item.AcctType) {
                case 'S':
                    item['AcctTypeCH'] = '活存';
                    item['AcctTypeNum'] = '1';
                    depositData.list.push(item);
                    break;

                case 'C':
                    item['AcctTypeCH'] = '支存';
                    item['AcctTypeNum'] = '2';
                    depositData.list.push(item);
                    break;

                case 'T':
                    item['AcctTypeCH'] = '定存';
                    item['AcctTypeNum'] = '3';
                    depositData.list.push(item);
                    break;

                case 'SD':
                    item['AcctTypeCH'] = '結構型';
                    item['AcctTypeNum'] = '4';
                    depositData.list.push(item);
                    break;

                case 'SE':
                    item['AcctTypeCH'] = '活存備償';
                    item['AcctTypeNum'] = '5';
                    depositData.list.push(item);
                    break;

                case 'L':
                    item['AcctTypeCH'] = '授信帳戶';
                    loanData.list.push(item);
                    break;

                case 'O':
                    item['AcctTypeCH'] = '海外存款';
                    item['AcctTypeNum'] = '6';
                    depositData.list.push(item);
                    break;

                case 'OD':
                    item['AcctTypeCH'] = '支存透支';
                    item['AcctTypeNum'] = '7';
                    depositData.list.push(item);
                    break;

                default:
                    break;
            }
        });

        depositData['curOrder'] = this.sortByCur(depositData['list']);
        loanData['curOrder'] = this.sortByCur(loanData['list']);
        depositData['countryOrder'] = this.sortByCountry(depositData['list']);
        loanData['countryOrder'] = this.sortByCountry(loanData['list']);

        depositData['list'] = this.sortByModify(depositData['list'], depositData['countryOrder'], depositData['curOrder']);
        loanData['list'] = this.sortByModify(loanData['list'], loanData['countryOrder'], loanData['curOrder']);

        depositData = this.selectDataModify(depositData);
        loanData = this.selectDataModify(loanData);

        data['depositData'] = depositData;
        data['loanData'] = loanData;
        return data;
    }

    /**
     * 幣別排序Array
     * 排序為，該國網銀本幣排第一個，TWD第二，其餘依字母先後排序
     * @param sortCurData
     */
    sortByCur(sortCurData) {
        let currency = {};
        let curOrder = [];
        sortCurData.forEach(item => {
            if (currency[item.AcctCurrency] == undefined) {
                currency[item.AcctCurrency] = [item.AcctCurrency];
            }
        });
        curOrder = Object.keys(currency);
        curOrder = curOrder.sort(function (a, b) {
            return a > b ? 1 : -1;
        });

        let twIndex = curOrder.indexOf('TWD');
        curOrder.splice(twIndex, 1);
        curOrder.unshift('TWD');
        return curOrder;
    }

    /**
     * 幣別排序Array
     * 排序為，第一個為GL全球'、第二個是登入之網銀國別、第三個是台灣，其餘依照首位字母由A至Z排
     * @param sortCountryData
     */
    sortByCountry(sortCountryData) {
        let country = {};
        let countryOrder = [];
        sortCountryData.forEach(item => {
            if (country[item.Country] == undefined) {
                country[item.Country] = [item.Country];
            }
        });
        countryOrder = Object.keys(country);
        countryOrder = countryOrder.sort(function (a, b) {
            return a > b ? 1 : -1;
        });

        let twIndex = countryOrder.indexOf('TW');
        countryOrder.splice(twIndex, 1);
        countryOrder.unshift('TW');
        countryOrder.unshift('GL');
        return countryOrder;
    }

    /**
     * 資料排序 
     * ‘全站邏輯’：國別>統編+公司名稱>產品別>幣別
     * @param sortByData 
     * @param countryOrder 國別排序順序Object
     * @param curOrder 幣別排序順序Object
     */
    sortByModify(sortByData, countryOrder, curOrder) {

        let countrySort = {};
        let curSort = {};
        countryOrder.forEach((country, i) => {
            countrySort[country] = i + 1;
        });

        curOrder.forEach((cur, i) => {
            curSort[cur] = i + 1;
        });


        var countrySortKeys = Object.keys(countrySort);

        var finalData = sortByData.filter(item => {
            return (countrySortKeys.indexOf(item['Country']) > -1)
        });

        finalData.sort((a, b) => {

            if (a['Country'] != b['Country']) {
                return countrySort[a['Country']] - countrySort[b['Country']];
            } else if (a['CustomerId'] != b['CustomerId']) {
                return a.CustomerId > b.CustomerId ? 1 : -1;
            } else if (a['AcctType'] != b['AcctType']) {
                return a.AcctTypeNum > b.AcctTypeNum ? 1 : -1;
            } else {
                return curSort[a['AcctCurrency']] - curSort[b['AcctCurrency']];
            }
        });

        return finalData;
    }

    selectDataModify(selectData) {
        let country = {};
        let sortCountry_company = {};

        selectData['list'].forEach(item => {
            item.cName = item.CustomerId + '-' + 'UNKnown';
            item.acName = item.AcctCurrency + '-' + item.AcctNo + item.BranchName;
            if (country[item.Country] == undefined) {
                country[item.Country] = [{ cName: item.cName, acName: item.acName, CustomerId: item.CustomerId }];
            } else {
                country[item.Country].push({ cName: item.cName, acName: item.acName, CustomerId: item.CustomerId });
            }
        });


        selectData['country_company'] = country;
        selectData['country_company']['GL'] = JSON.parse(JSON.stringify(selectData['list']));

        let countryKeys = Object.keys(selectData['country_company']);
        countryKeys.forEach(key => {
            let result = {};
            let finalRel = [];
            for (let i = 0; i < country[key].length; i++) {
                result[country[key][i].CustomerId] = country[key][i];
            }

            let b = Object.keys(result);

            b.forEach(item => {
                finalRel.push(result[item]);
            });
            selectData['country_company'][key] = finalRel;
        });

        selectData['country'] = countryKeys;
        // selectData['country'].unshift('GL');
        selectData['country'].forEach(key => {
            selectData['country_company'][key].unshift({ cName: this.langTransService.instant('DEPOSITSUMMARY.ALL_COMPANY'), CustomerId: '0' }); // 所有公司
        });

        return selectData;
    }


}
