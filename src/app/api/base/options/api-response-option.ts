/**
 * 定義APP使用的response物件
 * 將Server的API整理成APP使用的固定格式
 */
import { environment } from '@environments/environment';
import { logger } from '@util/log-util';
import { API_RESPONSE_FORMATE } from './api-formate';
// --- util --- //
import { ObjectUtil } from '@util/formate/modify/object-util';
import { ObjectCheckUtil } from '@util/check/object-check-util';
import { FieldUtil } from '@util/formate/modify/field-util';

export class ApiResponseOption {
    /**
     * API Response 伺服器規格
     */
    private resBody = ObjectUtil.clone(API_RESPONSE_FORMATE);
    /**
     * appId
     */
    private serviceId: string;
    /**
     * api response status
     */
    private resStatus: boolean;
    /**
     * API Res Token Info 固定內容
     */
    private infoData: object;
    /**
     * API Msg Data 資訊或錯誤內容
     */
    private resMsg: object;
    /**
     * API Main Data 主要內容
     */
    private resContent: object;
    /**
     * paginatorObj 分頁物件
     */
    private paginatorObj: object;

    constructor(
        protected apiResJsonObj: object
    ) {
        this.setResData(apiResJsonObj);
    }

    /**
     * 取得server儲存物件
     */
    public getAllData() {
        return ObjectUtil.clone(this.resBody);
    }

    /**
     * 取得 response api id
     */
    public getServiceId() {
        return this.serviceId;
    }

    /**
     * 取得結果訊息
     */
    public getResMsg() {
        return this.resMsg;
    }

    /**
     * 取得主要資訊
     */
    public getInfoData() {
        return this.infoData;
    }

    /**
     * 取得內容
     */
    public getData() {
        return this.resContent;
    }

    /**
     * 取得回應時間
     */
    public getResponseTime() {
        let output = FieldUtil.checkField(this.infoData, 'responseTime');
        return output;
    }

    /**
     * 取得request id
     */
    public getRequestId() {
        let output = FieldUtil.checkField(this.infoData, 'requestId');
        return output;
    }

    /**
     * 取得系統語系
     */
    public getLanguage() {
        let output = FieldUtil.checkField(this.infoData, 'lang');
        return output;
    }

    /**
     * 檢查api結果
     */
    public getStatus(): boolean {
        return (this.resStatus) ? true : false;
    }

    /**
     * 回傳server提供的錯誤訊息
     */
    public getErrorMsg(): string {
        let output = FieldUtil.checkField(this.resMsg, 'msg');
        return output;
    }


    /**
     *  分頁資料整理
     * @param set_data
     */
    public getPagecounter() {
        let totalPages;
        let output_data = {
            pageSize: 0,
            totalPages: 1
        };
        let set_data = this.paginatorObj;
        // logger.error('paginatorObj', this.paginatorObj);
        if (ObjectCheckUtil.checkObject(set_data)
            && ObjectCheckUtil.checkObject(set_data, 'totalCount')
            && ObjectCheckUtil.checkObject(set_data, 'pageSize')
        ) {

            totalPages = Math.ceil(set_data['totalCount'] / (set_data['pageSize']));
            // tslint:disable-next-line: radix
            output_data.pageSize = parseInt(set_data['pageSize']);
            output_data.totalPages = totalPages;
        }

        // logger.error('paginatorObj getPagecounter', output_data);
        return output_data;
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /**
     * 依照API回傳的內容整理資料
     */
    private setResData(resData: any): void {
        if (ObjectCheckUtil.checkObject(resData)) {
            // logger.step('Telegram', 'ResBase', 'setResData set', ObjectUtil.clone(resData));
            this.resBody = { ...this.resBody, ...resData };

            this.serviceId = ObjectCheckUtil.checkObjectList(this.resBody, 'apiId');
            this.infoData = ObjectCheckUtil.checkObjectList(this.resBody, 'token');
            this.resContent = ObjectCheckUtil.checkObjectList(this.resBody, 'resContent');
            this.paginatorObj = ObjectCheckUtil.checkObjectList(this.resBody, 'resContent.paginator');
            this.setResMsg();
            this.showResponseLog(); // 顯示設定資訊
            logger.step('TelegramBase', 'ApiResOption', 'setResData output', ObjectUtil.clone(this.resBody));
            // logger.log('Telegram', 'ResBase', 'setResData output', this.getServiceId());
        } else {
            logger.step('TelegramBase', 'ApiResOption', 'setResData error (not object)', typeof resData, resData);
        }
    }

    /**
     * 設定結果判斷物件
     */
    private setResMsg() {
        let output: any = {
            status: false,
            responseTime: '',
            title: '',
            msg: '',
            classType: 'warning', // success, error, warning
            errorCode: '',
            errorMsg: '',
            error_list: []
        };
        let errorObj = ObjectCheckUtil.checkObjectList(this.resBody, 'resMsg');
        output = { ...output, ...errorObj };
        output.responseTime = this.getResponseTime();
        output['resFlag'] = ObjectCheckUtil.checkObjectList(this.resBody, 'resFlag');
        if (output['resFlag'] == '0') {
            output.status = true;
            output.title = 'ERROR.API.SUCCESS';
            output.classType = 'success';
        } else if (output['resFlag'] == '1') {
            output.title = 'ERROR.API.ERROR';
            output.classType = 'error';
        } else {
            output.title = 'ERROR.API.WARNING';
            // output.title = 'ERROR.API.UNKNOWN';
            output.classType = 'warning';
        }

        if (output.errorCode != '') {
            output.error_list.push('(' + output.errorCode + ')');
        }
        if (output.errorCodeMsg != '') {
            output.error_list.push(output.errorCodeMsg);
        }
        if (output.error_list.length > 0) {
            output.msg = output.error_list.join('');
        } else {
            output.msg = output.title;
        }

        logger.step('TelegramBase', 'ApiRes setMsg', ObjectUtil.clone(output));
        this.resMsg = output;
        this.resStatus = output['status'];
    }

    /**
     * 顯示response資訊（ development 使用）
     */
    private showResponseLog() {
        if (environment.PRODUCTION) {
            return false;
        }
        logger.log('====API Response Object Start====');
        logger.log('API Object', 'serviceId:', this.getServiceId());
        logger.log('API Object', 'api request id:', this.getRequestId());
        logger.log('API Object', 'response time:', this.getResponseTime());
        logger.log('API Object', 'server language:', this.getLanguage());
        logger.log('API Object', 'server msg:', this.getResMsg());
        logger.log('API Object', 'info data:', this.getInfoData());
        logger.log('API Object', 'main data:', this.getData());
        logger.log('====API Response Object End====');
    }

}
