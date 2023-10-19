/**
 * 關係戶
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
/**
 * [API]
 */
@Injectable()
export class GetRelCustInqService {

    constructor(
        public telegram: TelegramService
    ) { }

    /**
     * 取得關係戶 CCMPTX000192Rq
     */
    public getRelCustInq() {
        //取得並設定參數
        const requset = this.telegram.GetRequstParam('CCMPTX000192Rq');
        //打api
        return new Promise((resolve, reject) => {
            this.telegram.GetRespone(requset).then(
                (res) => {
                    let data = this.modify(res);
                    resolve(data);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    modify(data) {

        let country = {};

        data['CustomerList'].forEach(item => {
            item.cName = item.CustomerId + '-' + item.CustomerName;
            if (country[item.Country] == undefined) {
                country[item.Country] = [item];
            } else {
                country[item.Country].push(item);
            }

        });
        let countryKeys = Object.keys(country);
        data['country_company'] = country;
        data['country_company']['ALL'] = data['CustomerList'];
        data['country'] = countryKeys;
        data['country'].unshift('ALL');
        data['country'].forEach(key => {
            data['country_company'][key].unshift({ cName: '所有公司', CustomerId: '0' });
        });


        return data;
    }

}
