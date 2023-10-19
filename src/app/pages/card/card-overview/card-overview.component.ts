/**
 * 信用卡總覽
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { BonusConvertHistoryService } from '../shared/bonus-convert-history.service';
import { HistoryBillService } from '../shared/history-bill-main.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { CardPersonalProfileService } from '../shared/card-personal-profile.service';
import { TelegramOption } from '@api/base/options/telegram-option';
declare var Swiper: any;

@Component({
    selector: 'app-card-overview',
    templateUrl: './card-overview.component.html',
    styleUrls: []
})

export class CardOverviewComponent implements OnInit {
    private swiper: any;
    selectMonth = ''; // EX: 2020-07-28
    unpaidData: any; // 未出帳消費資訊
    billData = {};  // 各期帳單查詢
    cardProfileData: any; // 信卡現況查詢
    monthStr = ''; //EX: 07月

    showData = {
        totalConsume: '', // 繳款金額小計
        nowRange: '', // 目前可用額度
        curBal: '', // 本期應繳總額
        minPay: '', // 本期最低應繳金額
        dueDate: '', // 本期繳款截止日
        bonusCount: '' // 信卡紅利點數
    };
    hasAllData = false;
    hasBillData = false; // 是否取得帳單資訊

    constructor(
        private historyBill: HistoryBillService, // 近期帳單,未出帳,各期帳單
        private cardbonus: BonusConvertHistoryService, // 紅利點數
        private cardProfile: CardPersonalProfileService, // 信卡現況查詢
        private _logger: Logger,
        private navgator: NavgatorService
    ) { }

    ngOnInit() {
        // this.doSwiper();
        let option = new TelegramOption();
        option.background = true;

        // 信用卡現況查詢
        this.cardProfile.getCardProfile({}, option).then(
            (result) => {
                this._logger.log("getCardProfile, result:", result);
                this.cardProfileData = result.infoData;
                this.showData.nowRange = this.cardProfileData.currentBalance;
                this.showData.bonusCount = this.cardProfileData.bonus;
                this._logger.log("showData.nowRange:", this.showData.nowRange);
            },
            (errorObj) => {
                this._logger.log("getCardProfile, errorObj:", errorObj);
            }
        );

        // 未出帳消費查詢
        this.historyBill.getUnpaidData({}, option).then(
            (result) => {
                this._logger.log("getUnpaidData, result:", result);
                this.unpaidData = result.infoData;
                this.showData.totalConsume = this.unpaidData.totalConsume;
            },
            (errorObj) => {
                this._logger.log("getUnpaidData, errorObj:", errorObj);
            }
        );

        // 近期帳單查詢
        this.historyBill.getNowBillData({}, option).then(
            (result) => {
                this._logger.log("getNowBillData, result:", result);
                this.selectMonth = result.selectedMonth;
                this.monthStr = result.monthStr;
                this.showData.curBal = result.curBal;
                this.showData.minPay = result.minPay;
                this.showData.dueDate = result.dueDate;
                this.billData = result.billData; // 計算繳費狀況顯示 使用
                // 若未取得帳單相關資訊, 就無法計算出 繳費狀況
                if (Object.keys(this.billData).length === 0) {
                    this._logger.log("billData, object empty");
                    this.hasBillData = false;
                } else {
                    this.hasBillData = true;
                }
                this.hasAllData = true; // 帳單相關資料最後回來,取完後開啟顯示畫面資訊
            },
            (errorObj) => {
                this._logger.log("getNowBillData, errorObj:", errorObj);
                this.hasBillData = false;
            }
        );

        // 信卡紅利點數查詢
        // this.cardbonus.getBonusCount({}, option).then(
        //     (result) => {
        //         this._logger.log("getBonusCount, result:", result);
        //         let info = result.infoData;
        //         this.showData.bonusCount = info.bonus;
        //         this._logger.log("bonusCount:", this.showData.bonusCount);
        //     },
        //     (errorObj) => {
        //         this._logger.log("getBonusCount, errorObj:", errorObj);
        //     }
        // );
    }

    // 點擊信用卡現況
    onCardProfile() {
        this._logger.log("into onCardProfile");
    }

    // 點擊繳卡費
    onCardPay() {
        this._logger.log("into onCardPay");
    }

    // 點擊申請信用卡
    onCardApply() {
        this._logger.log("into onCardApply");
    }

    // 點擊未出帳消費 明細按鈕
    onGoDetail() {
        this._logger.log("into onGoDetail");
        this.navgator.push('history-bill-main');
    }

    // 點擊各期帳單查詢
    onGoBillDetail() {
        this._logger.log("into onGoBillDetail");
        this.navgator.push('history-bill-main');
    }

    // 點擊紅利點數
    onGoBonusPoint() {
        this._logger.log("into onGoBonusPoint");
        let option = new TelegramOption();
        option.background = true;
    }
}