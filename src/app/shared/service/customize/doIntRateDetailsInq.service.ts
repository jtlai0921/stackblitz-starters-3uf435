import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';

/**
 * [API] 利率查詢
 */
@Injectable()
export class IntRateDetailsInqService {
  
    constructor(
        public telegram : TelegramService,
        public router :Router,
        public routeAct :ActivatedRoute,
        public storage : LocalStorageService
    ) {}
                
   
    
    /**
     * 利率查詢 CCMPTX000203Rq
     */
    public IntRateDetailsInq(Country) {
        return new Promise((resolve, reject) => {
            const requset =  this.telegram.GetRequstParam('CCMPTX000203Rq');
            requset['Country'] = Country;
            this.telegram.GetRespone(requset).then(resolve,reject);
        });
    }
}
