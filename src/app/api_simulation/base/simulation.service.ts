/**
 * 模擬程式控制
 */
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Logger } from '@systems/system/logger/logger.service';
// -- util -- //
import { SimulationApi } from './simulation-api';
import { CommonUtil } from '@util/common-util';
import { ApiRequestOption } from '@api/base/options/api-request-option';
// -- library -- //
import { FormateService } from '@template/formate/formate.service';

@Injectable({
    providedIn: 'root'
})
export class SimulationService {

    constructor(
        private _logger: Logger,
        private _formateService: FormateService
    ) { }

    /**
     * 執行模擬程式
     * @param serviceId 
     * @param reqData 
     */
    getResponse(serviceId: string, reqData: ApiRequestOption): Promise<any> {
        const simulationTime = environment.SIMULATION_TIME;
        return CommonUtil.wait(simulationTime)
            .then(() => {
                return this.getServiceClass(serviceId).then(
                    (simulation) => {
                        let output = simulation.getResponse(reqData);
                        return Promise.resolve(output);
                    },
                    (errorObj) => {
                        this._logger.error('include simulation error:', errorObj);
                        return Promise.reject(errorObj);
                    }
                );
            });
    }

    /**
     * 取得simulation 物件
     * @param serviceId 
     */
    private getServiceClass(serviceId: string): Promise<SimulationApi> {
        let file_name = serviceId.toLocaleLowerCase();
        let folder_name = file_name.substr(0, 6);

        const className = serviceId.toUpperCase() + 'SimulateService';
        const classPath = '' + folder_name + '/' + file_name + '/' + file_name + '-simulate.service';
        // const classPath = 'api_simulation/' + folder_name + '/' + file_name + '/' + file_name + '-simulate.service';
        // const classPath = 'api_simulation/spec06/spec06010101/spec06010101-simulate.service';
        // let className = 'SPEC06010101SimulateService';
        // return CommonUtil.importClass(classPath, className);
        return new Promise((resolve, reject) => {
            import('../' + classPath).then(
                (loadModule) => {
                    if (typeof loadModule[className] == 'function') {
                        let output = new loadModule[className]();
                        resolve(output);
                    } else {
                        reject('miss class name' + className);
                    }
                },
                (errorObj) => {
                    reject(errorObj);
                }
            ).catch((exceptionObj) => {
                reject(exceptionObj);
            });
        });
    }

}
