import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';

/**
 * [API] FAQ 查詢
 */
@Injectable()
export class FAQInqService {
  
    constructor(
        public telegram : TelegramService,
        public router :Router,
        public routeAct :ActivatedRoute,
        public storage : LocalStorageService
    ) {}
                
   
    
    /**
     * FAQ查詢 CCMPTX000206Rq
     */
    public FAQInq() {
        return new Promise((resolve, reject) => {
            var locale =  this.storage.get('Commonlang')
            const requset =  this.telegram.GetRequstParam('CCMPTX000206Rq');
            requset['Locale'] = locale;
            requset['KeyWord'] = "";
            requset['CacheId'] = "";
            requset['FAQId'] = "";
            this.telegram.GetRespone(requset).then(resolve,reject);
        });
    }
}
