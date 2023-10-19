/**
 * 裝置資料
 */
import { Injectable,NgZone} from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';
import { PopupService } from '../global/popup.service';
import { Config } from '../../../../assets/configuration/config';
/**
 * [API] 國內託收票據查詢
 */
@Injectable()
export class DoDomColInqService {

    constructor(
        private zone: NgZone,
        public telegram: TelegramService,
        public router: Router,
        public routeAct: ActivatedRoute,
        public storage: LocalStorageService,
        public popup: PopupService,
    ) { }

  
    public getReqObjectSample(){
        return {"Country": "","CustomerId": "","AcctNo": "","AcctCur": "" ,"Branch": "","Status": "","DateType": "","DateFrom": "","DateTo": ""}
    }
    public doDomColInq(reqObject) {
        return new Promise((resolve, reject) => {
            
            const requset =  this.telegram.GetRequstParam('CCMPTX000190Rq');
            requset["Country"] = reqObject["Country"]
            requset["CustomerId"] = reqObject["CustomerId"]
            requset["AcctNo"] = reqObject["AcctNo"]
            requset["AcctCur"] = "TWD"
            requset["Branch"] = reqObject["Branch"]
            requset["Status"] = reqObject["Status"]
            requset["DateType"] = reqObject["DateType"]
            requset["DateFrom"] = reqObject["DateFrom"]
            requset["DateTo"] = reqObject["DateTo"]
            this.telegram.GetRespone(requset).then(resolve,reject);
            //resolve(this.res);
        });
    }

}
