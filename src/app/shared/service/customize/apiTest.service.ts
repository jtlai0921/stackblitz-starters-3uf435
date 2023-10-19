import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';

/**
 * [API] 裝置之所有綁定使用者查詢服務類別
 */
@Injectable()
export class ApiTestService {
  
    constructor(
        public telegram : TelegramService,
        public router :Router,
        public routeAct :ActivatedRoute,
        public storage : LocalStorageService
    ) {}
                
   
    
    /**
     * 查詢與設備綁定的使用者清單 CCMPTX000185Rq
     */
    public AcctSummInq() {
        return new Promise((resolve, reject) => {
            const requset =  this.telegram.GetRequstParam('CCMPTX000182Rq');
            requset['Currency'] = "TWD";
            this.telegram.GetRespone(requset).then(resolve,reject);
        });
    }

    public RelCustInq() {
        return new Promise((resolve, reject) => {
            const requset =  this.telegram.GetRequstParam('CCMPTX000192Rq');
            this.telegram.GetRespone(requset).then(resolve,reject);
        });
    }
    public test() {
        return new Promise((resolve, reject) => {
            const requset =  this.telegram.GetRequstParam('CCMPTX000190Rq');
            requset["Country"] = "TW"
            requset["CustomerId"] = "16085840"
            requset["AcctNo"] = "901540269303"
            requset["AcctCur"] = "TWD"
            requset["Branch"] = "0901"
            requset["Status"] = "1"
            requset["DateType"] = "3"
            requset["DateFrom"] = "20180701"
            requset["DateTo"] = "20180807"
            this.telegram.GetRespone(requset).then(resolve,reject);
        });
    }
}
