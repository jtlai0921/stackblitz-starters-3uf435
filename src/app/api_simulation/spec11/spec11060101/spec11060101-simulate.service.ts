/**
 * Api Simulation: SPEC11060101-理財妙管家
 */
import { ApiRequestOption } from '@api/base/options/api-request-option';
import { SimulationApi } from '@simulation/simulation-api';
import { ObjectUtil } from '@util/formate/modify/object-util';
import { api_response } from './response';
// import { FieldUtil } from '@util/formate/modify/field-util';
import { PaginatorSimlationUtil } from '@simulation/util/paginator-simulation-util';
import { logger } from '@util/log-util';

export class SPEC11060101SimulateService implements SimulationApi {
    public getResponse(reqObj: ApiRequestOption) {
        let output = ObjectUtil.clone(api_response);
        // let searchType = FieldUtil.checkField(set_data, 'searchType');
        // let output: any = {};
        const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
        console.log('電文近來', ObjectUtil.clone(reqObj));

        let output_data = PaginatorSimlationUtil.getResponse(
            output,
            paginatedInfo,
            'resContent.outputData.roiDataList'
        );
        logger.error('simu:', output_data, output, paginatedInfo);
        return ObjectUtil.clone(output_data);
    }
}
