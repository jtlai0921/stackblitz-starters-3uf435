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
export class DoChkIssueInqService {

    constructor(
        private zone: NgZone,
        public telegram: TelegramService,
        public router: Router,
        public routeAct: ActivatedRoute,
        public storage: LocalStorageService,
        public popup: PopupService,
    ) { }

    AcctNo;
    AcctCur;
    public getReqObjectSample(){
        return {"AcctNo": "","AcctCur": "" ,"Date": ""}
    }
    public doChkIssue(reqObject) {
        return new Promise((resolve, reject) => {
            
            const requset =  this.telegram.GetRequstParam('CCMPTX000191Rq');
            this.AcctNo = reqObject["AcctNo"];
            this.AcctCur = reqObject["AcctCur"];
            requset["AcctNo"] = reqObject["AcctNo"]
            requset["AcctCur"] = reqObject["AcctCur"]
            requset["Date"] = reqObject["Date"]
            this.telegram.GetRespone(requset).then(resolve,reject);
            //resolve(this.getRes());
        });
    }        


}
