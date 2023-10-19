/**
 * API: SPEC10060001-外幣匯率查詢
 */
import { Injectable } from '@angular/core';
import { ApiBaseService } from '@api/base/api-base.service';
// -- Options -- //
import { ApiResponseOption } from '@api/base/options/api-response-option';
import { ApiRequestOption } from '@api/base/options/api-request-option';
import { SPEC10060001Req } from './spec10060001-req';
// -- Other Library -- //

@Injectable()
export class SPEC10060001ApiService extends ApiBaseService {
    protected serviceId = 'SPEC10060001'; // API Name

    getData(reqData?: object, option?: object): Promise<any> {

        let sendObj = new ApiRequestOption(SPEC10060001Req, {
            'reqData': reqData
        });
        // 欄位檢核
        

        // 修改request
        // let update_req = {};
        // sendObj.modifyRequest(update_req);

        return this.send(sendObj, option).then(
            (resObj: ApiResponseOption) => {
                let output: any = {
                    status: false,
                    msg: '',
                    error: {},    
                    responseTime: '', // 查詢回應時間
                    dataTime: '', // 資料時間
                    data: [],
                    nonCashData: [],
                    cashData: [],
                    currencyData: [],
                    list: {}
                };
                output.status = resObj.getStatus();
                output.msg = resObj.getErrorMsg();
                output.error = resObj.getResMsg();
                output.responseTime = resObj.getResponseTime();
                let resData = resObj.getData();
                output.dataTime = this._formateService.checkField(resData, 'dataTime');
                let modify_data = this._formateService.checkObjectList(resData, 'rowData');
                if (modify_data) {
                    output.data = modify_data;
                    output.data.forEach(item => {
                        // 需要資料整理
                        let sub_list = {
                            currencyCode: this._formateService.checkField(item, 'currencyCode'),
                            currencyName: this._formateService.checkField(item, 'currencyName'),
                            category: this._formateService.checkObjectList(item, 'category'),
                            buyRate: this._formateService.checkObjectList(item, 'buyRate'),
                            sellRate: this._formateService.checkObjectList(item, 'sellRate')
                        };
                        if (sub_list.category == '0') {
                            output.nonCashData.push(sub_list);
                        } else if (sub_list.category == '1') {
                            output.cashData.push(sub_list);
                        }
                        output.list[sub_list.currencyCode] = sub_list;
                        output.currencyData.push(sub_list);
                    });
                }

                if (!output.status) {
                    // 伺服器回傳錯誤
                    return this.returnError({
                        content: output.msg
                    }, 'SPEC10060001_SERVER_REP');
                }

                if (!this._checkService.checkEmpty(output.data, true)) {
                    return this.returnError({
                        content: 'ERROR.EMPTY'
                    }, 'SPEC10060001_SERVER_REP');
                }

                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}
