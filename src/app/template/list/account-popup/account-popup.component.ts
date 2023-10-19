/**
 * 帳號選單service
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-account-popup',
    templateUrl: './account-popup.component.html',
    styleUrls: [],
    providers: []
})

export class AccountPopupComponent implements OnInit {
    /**
     * 參數處理
     */
    title: string; // popup標題
    data?: Array<any> = [];
    promise: Promise<any>;
    select: string;
    type: string;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.chooseOver = (item) => {
                let output = {
                    account: item.accountId,
                    nickName: item.nickName,
                    currencyCode: item.currencyCode
                };
                resolve(output);
            };

            this.cancleClick = () => {
                reject();
            };

        });
    }

    ngOnInit() {
    }

    chooseOver(item) {
    }

    cancleClick() {
    }

}
