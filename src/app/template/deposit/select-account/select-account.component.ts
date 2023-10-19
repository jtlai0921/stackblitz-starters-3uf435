/**
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { SelectAccountService } from './select-account.service';
import { AccountPopupService } from '@template/list/account-popup/account-popup.service';

@Component({
    selector: 'app-select-account',
    templateUrl: './select-account.component.html',
    styleUrls: [],

})
export class SelectAccountComponent implements OnInit {
    @Input() defaultAcct: any; // 預設帶進來之帳號
    @Input() type: string; // 帳號類別， 1: 帳戶明細...等其他, 2:貸款服務 
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    popupOption = {
        data: [],
        select: '', // 選擇之帳號，帳號打勾使用
        type: ''
    };
    // 回傳至父層
    acctInfo = {
        account: '',
        currencyCode: ''
    };

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private mainService: SelectAccountService
        , private popupService: AccountPopupService
    ) {
    }


    ngOnInit() {
        this._logger.log("SelectAccountComponent, type:", this.type);
        this.popupOption.type = this.type;
        // getAcctData取得帳號 => type: 1: 帳戶明細...等其他, 2:貸款服務
        this.mainService.getAcctData({}, this.type).then(
            (result) => {
                // 貸款帳戶
                if (this.type == 'loan') {
                    this.popupOption.data = result.data;
                    this.doLoan(result); // 處理 貸款資料
                    // 回傳至父層
                    let loanInfo = {
                        account: ''
                    };
                    loanInfo.account = this.acctInfo.account;
                    this.onBackPageData(loanInfo);
                    // 帳戶明細...等
                } else if (this.type == 'current') {
                    this.popupOption.data = result.currentData;
                    this.doCurrentData(result); // 處理 帳戶明細資料
                    // 帳戶資料回傳(正常流程) 
                    this.onBackPageData(this.acctInfo);
                } else if (this.type == 'timeDeposit') {
                    this.popupOption.data = result.timeDeposit;
                    this.doTimeDeposit(result); // 處理 帳戶明細資料
                    // 帳戶資料回傳(正常流程) 
                    this.onBackPageData(this.acctInfo);
                }
                // this.popupOption.data = result.data;
                // // 回傳至父層
                // let acctInfo = {
                //     account: '',
                //     currencyCode: ''
                // };
                // 若沒預設帳號，將api回傳第一筆帳號帶入預設
                // if (this.defaultAcct == '' || typeof this.defaultAcct == 'undefined' || this.defaultAcct == null) {
                //     this._logger.log("has not defaultAcct");
                //     this.acctInfo.account = result.data[0]['accountId']; // 帶回父層，發send05030102 request
                //     this.acctInfo.currencyCode = result.data[0]['currencyCode'];
                //     this.defaultAcct = result.data[0]['accountId']; // 此頁顯示
                //     this.popupOption.select = result.data[0]['accountId']; // 紀錄選擇之帳號，popup打勾
                // } else {
                //     // 若有選定預設帳號，帶入popup預設帳號
                //     this._logger.log("has defaultAcct");
                //     let temp = this.mainService.setDefaultInfo(result.data, this.defaultAcct);
                //     this.acctInfo.account = temp.accountId;
                //     this.acctInfo.currencyCode = temp.currencyCode;
                //     this.popupOption.select = this.defaultAcct; // 紀錄選擇之帳號，popup打勾
                // }
                // 特規處理 貸款服務所有帳戶(無幣別欄位)
                // if (this.type == '2') {
                //     // 回傳至父層
                //     let loanInfo = {
                //         account: ''
                //     };
                //     loanInfo.account = this.acctInfo.account;
                //     this.onBackPageData(loanInfo);
                //     // 帳戶資料回傳(正常流程) 
                // } else {
                //     this.onBackPageData(this.acctInfo);
                // }
            },
            (errorObj) => {
                this._logger.log("getAcctData error, errorObj:", errorObj);
                this.onErrorPageData(errorObj);
                errorObj['type'] = 'message';
                // this._handleError.handleError(errorObj);
            }
        );
    }

    /**
     * 處理 帳戶明細資料
     * @param result 中台回傳結果
     */
    private doCurrentData(result) {
        // 若沒預設帳號，將api回傳第一筆帳號帶入預設
        if (this.defaultAcct == '' || typeof this.defaultAcct == 'undefined' || this.defaultAcct == null) {
            this._logger.log("has not defaultAcct");
            this.acctInfo.account = result.currentData[0]['accountId']; // 帶回父層，發send05030102 request
            this.acctInfo.currencyCode = result.currentData[0]['currencyCode'];
            this.defaultAcct = result.currentData[0]['accountId']; // 此頁顯示
            this.popupOption.select = result.currentData[0]['accountId']; // 紀錄選擇之帳號，popup打勾
        } else {
            // 若有選定預設帳號，帶入popup預設帳號
            this._logger.log("has defaultAcct");
            let temp = this.mainService.setDefaultInfo(result.currentData, this.defaultAcct);
            this.acctInfo.account = temp.accountId;
            this.acctInfo.currencyCode = temp.currencyCode;
            this.popupOption.select = this.defaultAcct; // 紀錄選擇之帳號，popup打勾
        }
    }

    /**
     * 處理 定存資料
     * @param result 中台回傳結果
     */
    private doTimeDeposit(result) {
        // 若沒預設帳號，將api回傳第一筆帳號帶入預設
        if (this.defaultAcct == '' || typeof this.defaultAcct == 'undefined' || this.defaultAcct == null) {
            this._logger.log("has not defaultAcct");
            this.acctInfo.account = result.timeDeposit[0]['accountId']; // 帶回父層，發send05030102 request
            this.acctInfo.currencyCode = result.timeDeposit[0]['currencyCode'];
            this.defaultAcct = result.timeDeposit[0]['accountId']; // 此頁顯示
            this.popupOption.select = result.timeDeposit[0]['accountId']; // 紀錄選擇之帳號，popup打勾
        } else {
            // 若有選定預設帳號，帶入popup預設帳號
            this._logger.log("has defaultAcct");
            let temp = this.mainService.setDefaultInfo(result.timeDeposit, this.defaultAcct);
            this.acctInfo.account = temp.accountId;
            this.acctInfo.currencyCode = temp.currencyCode;
            this.popupOption.select = this.defaultAcct; // 紀錄選擇之帳號，popup打勾
        }
    }

    /**
 * 處理 貸款資料
 * @param result 中台回傳結果
 */
    private doLoan(result) {
        // 若沒預設帳號，將api回傳第一筆帳號帶入預設
        if (this.defaultAcct == '' || typeof this.defaultAcct == 'undefined' || this.defaultAcct == null) {
            this._logger.log("has not defaultAcct");
            this.acctInfo.account = result.data[0]['accountId']; // 帶回父層，發send05030102 request
            this.acctInfo.currencyCode = result.data[0]['currencyCode'];
            this.defaultAcct = result.data[0]['accountId']; // 此頁顯示
            this.popupOption.select = result.data[0]['accountId']; // 紀錄選擇之帳號，popup打勾
        } else {
            // 若有選定預設帳號，帶入popup預設帳號
            this._logger.log("has defaultAcct");
            let temp = this.mainService.setDefaultInfo(result.data, this.defaultAcct);
            this.acctInfo.account = temp.accountId;
            this.acctInfo.currencyCode = temp.currencyCode;
            this.popupOption.select = this.defaultAcct; // 紀錄選擇之帳號，popup打勾
        }
    }


    // 點擊帳號
    onSelect() {
        this._logger.log("into onSelect");
        // 回傳使用者選擇之帳號
        this.popupService.show(this.popupOption).then(
            (result) => {
                this._logger.log("result:", result);
                this.defaultAcct = result['account'];
                // 回來將預設帳號帶入，顯示下次開啟視窗之選擇帳號
                this.popupOption.select = this.defaultAcct;
                this.onBackPageData(result);
            },
            (cancel) => {
                this._logger.log("into cancel");
            }
        );
    }

    /**
     * 重新設定page data 子層返回事件
     * @param setData
     */
    onBackPageData(setData) {
        let output = {
            'page': 'acct-page',
            'type': 'back',
            'data': setData
        };
        this._logger.step('onBackPageData, setData', setData);
        this._logger.log("into onBackPageData, output:", output);
        this.backPageEmit.emit(output);
    }


    onErrorPageData(errorObj?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'acct-page',
            'type': 'back',
            'data': errorObj
        };
        this.errorPageEmit.emit(output);
    }
}

