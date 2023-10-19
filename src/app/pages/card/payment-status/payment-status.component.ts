/**
 * 繳費狀況資訊(EX: 已繳)
 * 
 * 繳費狀況顯示公式
 * 1.已繳
   已繳總金額 == 本期應繳總額
   prevPay == curBal

   2.溢繳
   已繳總金額 > 本期應繳總額
   prevPay > curBal

   3.繳部分:
   本期應繳總額 > 已繳總金額 >= 最低應繳總額
   curBal > prevPay >= minPay

   4.未繳足: 
   最低應繳總額 > 已繳總金額，且 當日 <= 繳款截止日
   minPay > prevPay && today <= dueDate

   5.逾期
   最低應繳總額 > 已繳總金額，且 當日 > 繳款截止日
   minPay > prevPay && today > dueDate

   6.未繳
   已繳總金額=0，且 當日 <= 繳款截止日
   prevPay == 0 && today <= dueDate
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';
import { PaymentStatusService } from './payment-status.service';
import { HandleErrorService } from '@systems/handle-error/handle-error.service';

@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    styleUrls: [],

})
export class PaymentStatusComponent implements OnInit {
    @Input() infoData: any; // 繳費相關資訊
    @Input() selectedMonth: string; // 選擇之年月份
    paidStr = ''; // 畫面顯示繳費狀況中文字, EX: 已繳
    oldSelectMonth = '';

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _mainService: PaymentStatusService
        , private handleError: HandleErrorService
    ) {
    }


    ngOnInit() {
        this._logger.log('into PaymentStatusComponent, infoData:', this.infoData);
        let checkMonth = this.checkSameMonth();
        // 月份選擇與上次不同才做formate顯示
        if (!checkMonth) {
            this.doFormate();
        }
    }

    // 信卡月份有改變(selectedMonth)，就觸發ngOnChanges去重新formate顯示
    ngOnChanges() {
        let checkMonth = this.checkSameMonth();
        // 月份選擇與上次不同才做formate顯示
        if (!checkMonth) {
            this.doFormate();
        }
    }

    // 繳款狀態顯示計算
    doFormate() {
        let formateData = this._mainService.formateStatusShow(this.infoData);
        this._logger.log("formateData:", formateData);
        if (formateData.status == true) {
            switch (formateData.show) {
                // 已繳
                case 'A':
                    this.paidStr = 'HISTORY_BILL.STATUS.HAS_PAID';
                    break;
                // 溢繳
                case 'B':
                    this.paidStr = 'HISTORY_BILL.STATUS.OVER_PAID';
                    break;
                //  繳部分
                case 'C':
                    this.paidStr = 'HISTORY_BILL.STATUS.PART_PAID';
                    break;
                //  未繳足
                case 'D':
                    this.paidStr = 'HISTORY_BILL.STATUS.NOT_ENOUGH';
                    break;
                // 逾期
                case 'E':
                    this.paidStr = 'HISTORY_BILL.STATUS.LATE_PAID';
                    break;
                // 未繳
                case 'F':
                    this.paidStr = 'HISTORY_BILL.STATUS.NO_PAID';
                    break;
                default:
                    this.paidStr = '';
                    break;
            }
            this._logger.log("formateData.show:", formateData.show);
        } else {
            this.handleError.handleError({
                title: 'ERROR.TITLE',
                content: formateData.msg
            });
        }
    }

    // 檢查選擇月份是否與上次相同， 相同true, 不同false
    checkSameMonth() {
        let output = false;
        if (this.oldSelectMonth == this.selectedMonth) {
            output = true;
            return output;
        }
        this.oldSelectMonth = this.selectedMonth;
        return output;
    }
}

