import { Injectable } from '@angular/core';
import { Setting } from './setting';

@Injectable()
export class CustomCodeService {

  transform(value: any,keys:any): any {
    if(Setting.hasOwnProperty(keys)){
      var result = value;
      if(typeof Setting[keys][value] != 'undefined'){
        result = Setting[keys][value];
      }
    }
    return result;
  }
}
