import { Pipe, PipeTransform } from '@angular/core';
import { Setting } from './setting';
@Pipe({
  name: '_custom'
})
export class CustomPipe implements PipeTransform {

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
