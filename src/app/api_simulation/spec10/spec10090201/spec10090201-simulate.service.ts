/**
 * Api Simulation: SPEC10090201-匯率到價通知新增、修改、刪除
 */
import { ApiRequestOption } from '@api/base/options/api-request-option';
import { SimulationApi } from '@simulation/simulation-api';
import { ObjectUtil } from '@util/formate/modify/object-util';
import {
    api_responseCreate,
    api_responseUpdate,
    api_responseDelete,
    api_response2,
    api_error
} from './response';

export class SPEC10090201SimulateService implements SimulationApi {

    public getResponse(reqObj: ApiRequestOption) {
        let output: any = {};
        output = ObjectUtil.clone(api_responseCreate);
        return ObjectUtil.clone(output);
    }

}
