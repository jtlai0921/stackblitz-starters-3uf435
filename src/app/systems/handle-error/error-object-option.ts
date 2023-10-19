import { ERROR_CODE_LIST } from '@conf/error/error_code';
import { ObjectCheckUtil } from '@util/check/object-check-util';
import { ObjectUtil } from '@util/formate/modify/object-util';
import { HandleErrorOptions } from './handlerror-options';

export class ErrorObjectOption {
    private errorCodeList: object;

    /**
     * 回傳錯誤事件
     * @param set_data 
     */
    returnError(set_data: object, errorCode?: string): HandleErrorOptions {
        let output = new HandleErrorOptions();
        if (typeof errorCode != 'undefined') {
            const tmp_obj = this.getErrorObj(errorCode);
            output = { ...output, ...tmp_obj };
        }
        output = { ...output, ...set_data };

        return output;
    }


    /**
     * 取得error code物件
     * @param error_code 對應ERROR_CODE_LIST的key
     */
    private getErrorObj(error_code: string): object {
        let output = ObjectCheckUtil.checkObjectList(ERROR_CODE_LIST, error_code);
        if (typeof output != 'object') {
            output = {};
        }
        return ObjectUtil.clone(output);
    }
}
