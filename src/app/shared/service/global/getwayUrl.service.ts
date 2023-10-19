/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { DeviceService } from '../cordova/device.service';
import { Config } from '../../../../assets/configuration/config';
import { SecurytyService } from './security.service';
import { DateTimeService } from './daettime.service';
import { Http, Response } from '@angular/http';
@Injectable()
export class GetWayUrlService {
    public offline = Config.OFFLINE;
    constructor(
        public security: SecurytyService,
        public dateformat: DateTimeService,
        public device: DeviceService,
        private http: Http
    ) {
    }
    public GetWayUrl = '';
    /**
     * 首次取得GetWayUrl
     */
    public FirstGetUrl() {
        return new Promise((resolve, reject) => {
            this.GetWayUrl = ''
            this.initEvent().then((res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            });
        });
    }
    /**
     * 取得GetWayUrl
     * @param key 查詢條件
     */
    public getUrl() {
        console.log('[GetWayUrlService] getUrl', this.GetWayUrl);
        return new Promise((resolve, reject) => {
            if (this.GetWayUrl != '') {
                console.log('[GetWayUrlService] getUrl is Exist', this.GetWayUrl);
                resolve(this.GetWayUrl);
            } else {
                this.initEvent().then((res) => {
                    resolve(res);
                }, (error) => {
                    reject(error);
                });
            }
        });
    }
    /**
     * 初始事件
     */
    private initEvent() {
        return new Promise((resolve, reject) => {
            if (!this.offline) {
                const apiReq = this.getRequest();
                this.http.post(Config.URL, apiReq).toPromise().then(
                    (res: Response) => {
                        try {
                            var resObj = res.json();
                            console.log('[GetWayUrlService] GetWaUrl Responese Success', resObj);
                            if (resObj['HeaderRs']['Result'] === 4001) {
                                let resStr = resObj['BodyRs']['Data'];
                                let UrlObj = JSON.parse(this.security.Base64Decode(resStr));
                                this.GetWayUrl = UrlObj['GatewayUrl'];
                                resolve(this.GetWayUrl);
                            } else {
                                //Error Handle
                                console.log('[GetWayUrlService] GetWaUrl Responese Error', resObj);
                                reject(res);
                            }
                        } catch (catchError) {
                            console.error("[GetWayUrlService] catchError", catchError)
                            reject({ "HeaderRs": { "Result": "reject" } })
                        }
                    }, (er) => {
                         try {
                            console.log('[GetWayUrlService] GetWaUrl Responese Fail', er.json());
                            reject(er.json())
                        } catch (catchError) {
                            reject({ "HeaderRs": { "Result": "reject" } })
                        }
                    }
                );
            } else {
                resolve(Config.URL);
            }
        });
    }

    private getRequest() {

        let BodyRq = JSON.stringify({"TxnId":"CCMPTX000060Rq","AppVersion": this.device.getDeviceInfo('appinfo')['version']});
        BodyRq = this.security.Base64Encode(BodyRq);
        let timeFormat = this.dateformat.datetimeFormat(Date.now(), 'yyyyMMddhhmmss')
        //console.log('device',this.device.getDeviceInfo());
        let apiRequest = {
            "HeaderRq": {
                "Type": 0,
                "AppId": "MPASS",
                "Manufacturer": this.device.getDeviceInfo('manufacturer'),
                "Model": this.device.getDeviceInfo('model'),
                "DeviceId": this.device.getDeviceInfo('uuid'),
                "TxnId": "CCMPTX000060Rq",
                "Language": 0,
                "Timestamp": timeFormat,
                "RqUID": timeFormat,
                "Version": "2"
            },
            "BodyRq": {
                "DataType": 0,
                "Data": BodyRq
            }
        };
        return apiRequest;
    }
}
