/**
 * API: SPEC05030101-帳戶明細查詢
 */
import { Injectable } from '@angular/core';
import { ApiBaseService } from '@api/base/api-base.service';
// -- Options -- //
import { ApiResponseOption } from '@api/base/options/api-response-option';
import { ApiRequestOption } from '@api/base/options/api-request-option';
import { SPEC11010201Req } from './spec11010201-req';
// -- Other Library -- //

@Injectable()
export class SPEC11010201ApiService extends ApiBaseService {

    protected serviceId = 'SPEC11010201';


    /**
     * 取得列表資料
     * @param reqData 條件
     *      accountId 帳號
     *      currency 幣別
     *      startDate 起始日
     *      endDate 結束日
     * @param option 其他連線參數控制
     * @param paginator 分頁物件
     */
    getPageData(reqData: object, option?: object, paginator?: object): Promise<any> {
        console.log("getPageData, paginator:",paginator);
        console.log("電文近來一");
        let sendObj = new ApiRequestOption(SPEC11010201Req, {
            'reqData': reqData,
            'paginator': paginator,
        });
        console.log("電文近來二");
        console.log("sendObj:",sendObj);
        
        // sendObj.modifyRequest(update_req);

        return this.send(sendObj, option).then(
            (resObj: ApiResponseOption) => {
                let output: any = {
                    status: false,
                    msg: '',
                    error: {},
                    infoData: {},
                    data: [], // 資訊(detail)
                    page_info: {} // 分頁相關
                };
                console.log("SPEC11010201ApiService, resObj:",resObj);
                console.log("電文近來三");
                output.status = resObj.getStatus();
                output.msg = resObj.getErrorMsg();
                output.error = resObj.getResMsg();
                // 頁數整理
                output.page_info = resObj.getPagecounter();

                let jsonObj = resObj.getData();
                output.infoData = jsonObj;
                console.log("SPEC11010201ApiService getPageData, jsonObj:",jsonObj);
                console.log("電文近來四");
                // let jsonObj = {};
                // if(jsonObj.hasOwnProperty('outputData')) {
                //     jsonObj = jsonObj['outputData'];
                // }
                console.log("3434343434343434 jsonObj:",jsonObj);
                // //   現職查詢(detail)
                output.data = this._formateService.checkObjectList(jsonObj, 'roiData');
                // output.data = test.roiData;
                console.log("SPEC11010201ApiService, output:",output);
                console.log("output.data:",output.data);

                if (!this._checkService.checkEmpty(output.data, true)) {
                    console.log("11111111111111111111111111111111111111111111111");
                    console.log("電文近來五");
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
