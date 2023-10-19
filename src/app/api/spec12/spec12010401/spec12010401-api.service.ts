/**
 * API:  SPEC12010302-信用卡帳單查詢
 */
import { Injectable } from '@angular/core';
import { ApiBaseService } from '@api/base/api-base.service';
// -- Options -- //
import { ApiResponseOption } from '@api/base/options/api-response-option';
import { ApiRequestOption } from '@api/base/options/api-request-option';
import { SPEC12010401Req } from './spec12010401-req';
// -- Other Library -- //

@Injectable()
export class SPEC12010401ApiService extends ApiBaseService {
    protected serviceId = 'SPEC12010401';

    /**
     * 取得列表資料
     * @param reqData 
     * @param option 
     */
    getData(reqData: object, option?: object): Promise<any> {
        let sendObj = new ApiRequestOption(SPEC12010401Req, {
            'reqData': reqData
        });
        // 欄位檢核
        // let set_month = this._formateService.checkField(reqData, 'selectedMonth');
        // if (!this._checkService.checkEmpty(set_month, true)) {
        //     return this.returnError({}, 'REQ_ERROR');
        // }

        return this.send(sendObj, option).then(
            (resObj: ApiResponseOption) => {
                let output: any = {
                    status: false,
                    msg: '',
                    error: {},
                    infoData: {},
                    data: [], // 本期繳款紀錄資料
                    consumeData: [], // 本期消費紀錄資料
                    cardData: [], // 信卡資料
                    cardSwiperData: [] // 滑動信卡切換資料用
                };
                output.status = resObj.getStatus();
                output.msg = resObj.getErrorMsg();
                output.infoData = resObj.getData();
                output.error = resObj.getResMsg();
                output.data = this._formateService.checkObjectList(output.infoData, 'payRow');
                output.consumeData = this._formateService.checkObjectList(output.infoData, 'consumeRow');
                output.cardData = this._formateService.checkObjectList(output.infoData, 'cardData');
                output.cardData.forEach(item => {
                    output.cardSwiperData[item.cardLst] = item['cardRow'];
                });

                if (!this._checkService.checkEmpty(output.data, true) ||
                    !this._checkService.checkEmpty(output.consumeData, true)) {
                    // 查詢期間無交易資料
                    return this.returnError({}, 'EMPTY_RANGE_API');
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
