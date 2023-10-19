/**
 * 幣別處理
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '../../telegram/telegram.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { KEY_CURRENCY_PARA, KEY_USER_PARA } from '../../../../assets/configuration/userParaKey';


@Injectable({
    providedIn: 'root'
  })
export class CurrencyService {

    constructor(
        private telegram: TelegramService,
        private storage: LocalStorageService
    ) { }

    getDefaultCurrency(){
       var result =  this.storage.get(KEY_CURRENCY_PARA.CURRENCIES);
       if(result == undefined || result ==""){
        result = this.getLocalCurrency();
       }
       if(result == undefined || result ==""){
        result = "TWD"
       }
       return result;
    }

    getLocalCurrency(){
        var Country = this.storage.get("UserCountry")
        return this.CurrencyTable[Country]
    }

    CurCode = "";
    SortCurrency(list,code){
        this.CurCode = code;
        list.sort((a, b) => { return this.CurrencySort(a, b) })
    }

    CurrencySort(a, b) {
        var DefaultCurrency = this.getDefaultCurrency();
        var LoaclCurrency = this.getLocalCurrency();
        var CurrencyA = a[this.CurCode]
        var CurrencyB = b[this.CurCode]
        if (CurrencyA == DefaultCurrency) {
          return -1;
        }
        if (CurrencyB == DefaultCurrency) {
          return 1;
        }
        if (CurrencyA == LoaclCurrency) {
            return -1;
          }
          if (CurrencyB == LoaclCurrency) {
            return 1;
          }
        if (CurrencyA < CurrencyB) {
          return -1;
        }
        if (CurrencyA > CurrencyB) {
          return 1;
        }
        return 0
      }


    private CurrencyTable = {"TW":"","US":"","HK":"","AU":"AUD"}
}