/**
 * 裝置資料
 */
import { Injectable,NgZone} from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../global/localStorage.service';
/**
 * [API] 系統公告服務類別
 */
@Injectable()
export class QuickLoginService {
    private quickLoginKey = "quickLoginConfiguration";
    constructor(
        private zone: NgZone,
        public telegram: TelegramService,
        public router: Router,
        public routeAct: ActivatedRoute,
        public storage: LocalStorageService
    ) { 
   
    }
   
    //setting
    getConfigurations(){
        var company  = this.storage.get("loginUserCompany");
        var account  = this.storage.get("loginUserAccount");
        var country  = this.storage.get("loginUserCountry");
        return  this.getUserConfigurations(company,account,country);
    }

    updateConfigurations(configuration){
        var company  = this.storage.get("loginUserCompany");
        var account  = this.storage.get("loginUserAccount");
        var country  = this.storage.get("loginUserCountry");
        this.updateUserConfigurations(company,account,country,configuration);
    }
    updateUserConfigurations(company,account,country,configuration){
        var key = country+"_"+company+"_"+account
        var allQuickConfiguration = this.getAllConfiguration();
        allQuickConfiguration[key] = configuration;
        this.storage.set(this.quickLoginKey,allQuickConfiguration);
    }
    setConfigurations(key: string, value: any){
        var company  = this.storage.get("loginUserCompany");
        var account  = this.storage.get("loginUserAccount");
        var country  = this.storage.get("loginUserCountry");
        var userKey = country+"_"+company+"_"+account

        var allQuickConfiguration = this.getAllConfiguration();
        allQuickConfiguration[userKey][key] = value;
        this.storage.set(this.quickLoginKey,allQuickConfiguration);
    }

    setConfigurationsByKey(key: string, value: any,company: string,account: string,country: string){
        var userKey = country+"_"+company+"_"+account
        var allQuickConfiguration = this.getAllConfiguration();
        allQuickConfiguration[userKey][key] = value;
        this.storage.set(this.quickLoginKey,allQuickConfiguration);
    }

    getAllConfiguration(){
        var allQuickConfiguration = this.storage.get(this.quickLoginKey);
        if(allQuickConfiguration ==null || allQuickConfiguration == undefined){
            return {};
        }
        return allQuickConfiguration;
    }

    setLoginUser(){
        var company  = this.storage.get("loginUserCompany");
        var account  = this.storage.get("loginUserAccount");
        var country  = this.storage.get("loginUserCountry");
        var value = {"company":company,"account":account,"country":country}
        var userKey = country+"_"+company+"_"+account
        var allQuickConfiguration = this.getAllConfiguration();
        var config = allQuickConfiguration[userKey]
        if(config ==null || config ==undefined){
            allQuickConfiguration[userKey] = {"info":value}
            this.storage.set(this.quickLoginKey,allQuickConfiguration);
        }
    }
    //setting end



    isOneUser(){
        var allQuickConfiguration = this.getAllConfiguration();
        let countryKeys = Object.keys(allQuickConfiguration);
        return countryKeys.length == 1;
    }

    getUserCount(){
        var allQuickConfiguration = this.getAllConfiguration();
        let countryKeys = Object.keys(allQuickConfiguration);
        return countryKeys.length;
    }

    checkAutoUser(company,account,country){
        var allQuickConfiguration = this.getAllConfiguration();
        var key = country+"_"+company+"_"+account
        var configuration = allQuickConfiguration[key];
        if (configuration == null || configuration==undefined) {
            return false;
        }
        return true;
    }
    getUserConfigurations(company,account,country){
        var key = country+"_"+company+"_"+account
        var allQuickConfiguration = this.getAllConfiguration();
        var configuration = allQuickConfiguration[key];
        if (configuration == null || configuration==undefined) {
          configuration = {};
          allQuickConfiguration[key] = configuration;
          this.storage.set(this.quickLoginKey,allQuickConfiguration);
        }
        return configuration;
    }

    checkVersion(configVersion,localVersion){
        var nowVersion = localVersion.split('\.');
        var current = configVersion.split('\.');
        if(nowVersion.length != current.length){
            return false;
        }
        for (var i = 0; i < current.length; i++) {
            if (nowVersion[i] < current[i]) {
                return false;
            }
        }
        return true;
    }
}
