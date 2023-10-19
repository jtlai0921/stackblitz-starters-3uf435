/**
 * 繳費狀況資訊(EX: 已繳)
 * 
 * 
 */
import { Injectable, Output } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { FormateService } from '@template/formate/formate.service';

@Injectable()

export class PaymentStatusService {

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
    ) {
    }

    /**
     * 處理狀態顯示文字
     */
    formateStatusShow(setData) {
        this._logger.log("into formateStatusShow");
        let output = {
            status: false,
            msg: '',
            data: setData,
            show: '' // A: 已繳, B: 溢繳, C: 繳部分, D: 未繳足, E: 逾期, F: 未繳
        };
        let today = new Date().toLocaleDateString();
        let todayMin = new Date(today).getTime();
        this._logger.log("into formateStatusShow, todayMin:", todayMin);
        this._logger.log("into formateStatusShow, setData.dueDate:", setData.dueDate);
        this._logger.log("into formateStatusShow, setData.prevPay:", setData.prevPay);
        this._logger.log("into formateStatusShow, setData.curBal:", setData.curBal);
        this._logger.log("into formateStatusShow, setData.minPay:", setData.minPay);
        // ----- 測完開啟 -----
        let dueDate = setData['dueDate']; // => setData['dueDate']
        let prevPay = parseInt(setData['prevPay']); // => setData['prevPay']
        let curBal = parseInt(setData['curBal']); // => setData['curBal']
        let minPay = parseInt(setData['minPay']); // => setData['minPay']
        let formateDate = '';
        let len = '';
        // let dateSame = false; // 判斷日期是否一樣, true同一天, 因為同一天用毫秒數判斷會有問題
        // 若傳入之日期有 '-'格式做formate, 2020-07-20 or 2020-0720
        if (dueDate.indexOf('-') > 0) {
            let temp = dueDate.split('-');
            // 2020-0720
            if (temp.length == 2) {
                len = temp[0] + temp[1];
                if (len.length < 8) {
                    output.status = false;
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    return output;
                }
                let month = temp[1].substring(0, 2);
                let date = temp[1].substring(2, 4);
                formateDate = temp[0] + '/' + month + '/' + date;
                // 2020-07-20
            } else if (temp.length == 3) {
                len = temp[0] + temp[1] + temp[2];
                if (len.length < 8) {
                    output.status = false;
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    return output;
                }
                formateDate = temp[0] + '/' + temp[1] + '/' + temp[2];
            }
        } else if (dueDate.indexOf('/') > 0) {
            formateDate = dueDate;
            let temp = dueDate.split('/');
            for (let i = 0; i < temp.length; i++) {
                len += temp[i];
            }
        } else {
            // 20200720 不是西元年格式
            if (dueDate.length != 8) {
                output.status = false;
                output.msg = 'ERROR.DATA_FORMAT_ERROR';
                return output;
            } else {
                let year = dueDate.substring(0, 4);
                let month = dueDate.substring(4, 6);
                let date = dueDate.substring(6, 8);
                len = dueDate;
                formateDate = year + '/' + month + '/' + date;
            }
        }
        // let date = len.substring(6, 8);
        // let toDate = today.getDate().toString();
        // // dateSame: 為了判斷同一日， 同一日用毫秒數判斷會錯，因此此變數為true也視為同一天
        // if (date == toDate) {
        //     this._logger.log("len date same");
        //     dateSame = true;
        // }
        let dueDateMin = (new Date(formateDate)).getTime();
        this._logger.log("dueDateMin:", dueDateMin);
        // ----- 測式 -----
        // 已繳
        if (prevPay == curBal) {
            this._logger.log("A");
            output.show = 'A';
            // 溢繳
        } else if (prevPay > curBal) {
            this._logger.log("B");
            output.show = 'B';
            // 繳部分
        } else if (curBal > prevPay && prevPay >= minPay) {
            this._logger.log("C");
            output.show = 'C';
            // 未繳足
        } else if (minPay > prevPay && setData['prevPay'] != '0' && setData['prevPay'] != ''
            && todayMin <= dueDateMin) {
            this._logger.log("D");
            output.show = 'D';
            // 逾期
        } else if (minPay > prevPay && todayMin > dueDateMin) {
            this._logger.log("E");
            output.show = 'E';
            // 未繳
        } else if ((setData['prevPay'] == '0' || setData['prevPay'] == '') &&
            todayMin <= dueDateMin) {
            this._logger.log("F");
            output.show = 'F';
        }
        output.status = true;
        output.msg = 'success';
        this._logger.log("output:", output);
        return output;
    }







    /**
     * 處理狀態顯示文字(測試用)
     */
    formateStatusShowTest(setData) {
        this._logger.log("into formateStatusShow");
        let output = {
            status: false,
            msg: '',
            data: setData,
            show: '' // A: 已繳, B: 溢繳, C: 繳部分, D: 未繳足, E: 逾期, F: 未繳
        };
        let today = new Date().toLocaleDateString();
        let todayMin = new Date(today).getTime();
        this._logger.log("into formateStatusShow, todayMin:", todayMin);
        this._logger.log("into formateStatusShow, setData.dueDate:", setData.dueDate);
        this._logger.log("into formateStatusShow, setData.prevPay:", setData.prevPay);
        this._logger.log("into formateStatusShow, setData.curBal:", setData.curBal);
        this._logger.log("into formateStatusShow, setData.minPay:", setData.minPay);
        // test START -------------
        let dueDate = '2020-07-28'; // => setData['dueDate']
        let prevPay = 17000; // => setData['prevPay']
        let curBal = 20000; // => setData['curBal']
        let minPay = 18000; // => setData['minPay']
        // test END -------------
        let formateDate = '';
        let len = '';
        // let dateSame = false; // 判斷日期是否一樣, true同一天, 因為同一天用毫秒數判斷會有問題
        // 若傳入之日期有 '-'格式做formate, 2020-07-20 or 2020-0720
        if (dueDate.indexOf('-') > 0) {
            let temp = dueDate.split('-');
            // 2020-0720
            if (temp.length == 2) {
                len = temp[0] + temp[1];
                if (len.length < 8) {
                    output.status = false;
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    return output;
                }
                let month = temp[1].substring(0, 2);
                let date = temp[1].substring(2, 4);
                formateDate = temp[0] + '/' + month + '/' + date;
                // 2020-07-20
            } else if (temp.length == 3) {
                len = temp[0] + temp[1] + temp[2];
                if (len.length < 8) {
                    output.status = false;
                    output.msg = 'ERROR.DATA_FORMAT_ERROR';
                    return output;
                }
                formateDate = temp[0] + '/' + temp[1] + '/' + temp[2];
            }
        } else if (dueDate.indexOf('/') > 0) {
            formateDate = dueDate;
            let temp = dueDate.split('/');
            for (let i = 0; i < temp.length; i++) {
                len += temp[i];
            }
        } else {
            // 20200720 不是西元年格式
            if (dueDate.length != 8) {
                output.status = false;
                output.msg = 'ERROR.DATA_FORMAT_ERROR';
                return output;
            } else {
                let year = dueDate.substring(0, 4);
                let month = dueDate.substring(4, 6);
                let date = dueDate.substring(6, 8);
                len = dueDate;
                formateDate = year + '/' + month + '/' + date;
            }
        }
        // dateSame: 為了判斷同一日， 同一日用毫秒數判斷會錯，因此此變數為true也視為同一天
        // if (len.substring(6, 8) == (today.getDate()).toString()) {
        //     dateSame = true;
        // }
        let dueDateMin = (new Date(formateDate)).getTime();
        this._logger.log("dueDateMin:", dueDateMin);
        // ----- 測式 -----
        // 已繳
        if (prevPay == curBal) {
            this._logger.log("A");
            output.show = 'A';
            // 溢繳
        } else if (prevPay > curBal) {
            this._logger.log("B");
            output.show = 'B';
            // 繳部分
        } else if (curBal > prevPay && prevPay >= minPay) {
            this._logger.log("C");
            output.show = 'C';
            // 未繳足
        } else if (minPay > prevPay && setData['prevPay'] != '0' && setData['prevPay'] != ''
            && (todayMin <= dueDateMin)) {
            this._logger.log("D");
            output.show = 'D';
            // 逾期
        } else if (minPay > prevPay && todayMin > dueDateMin) {
            this._logger.log("E");
            output.show = 'E';
            // 未繳
        } else if ((setData['prevPay'] == '0' || setData['prevPay'] == '') &&
            (todayMin <= dueDateMin)) {
            this._logger.log("F");
            output.show = 'F';
        }
        output.status = true;
        output.msg = 'success';
        this._logger.log("output:", output);
        return output;
    }
}
