import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: '_datetime'
})
export class DateTimePipe implements PipeTransform {

  transform(value:any, format:any): any {

    format = (typeof format != 'undefined' && format != '') ? format : 'yyyy/MM/dd';
    if (typeof value == 'undefined') {
        return "";
    }
    // console.log("[DateTimePipe] original value =", value, ", format =", format);
    
    // MMdd --> MM/dd
    value = (value.toString().length == 4) ? (value.substring(0,2) + '/' + value.substring(2,4)) : value;
    // yyyyMMdd --> yyyy/MM/dd
    value = (value.toString().length == 8) ? (value.substring(0,4) + '/' + value.substring(4,6) + '/' +value.substring(6,8))  : value;
    // yyyyMMddhhmmss --> yyyy/MM/dd hh:mm:ss
    value = (value.toString().length == 14) ? (value.substring(0,4) + '/' + value.substring(4,6) + '/' +value.substring(6,8) + ' ' + value.substring(8,10) + ':' + value.substring(10,12) + ':' + value.substring(12,14))  : value;
    // console.log("[DateTimePipe] handled value =", value);

    if((!isNaN(new Date(value).getTime()))){
        var t = new Date(value);
        var tf = function(i) {
        return (i < 10 ? '0' : '') + i
        };
        var time = format.replace(/yyyy|MM|dd|hh|mm|ss/g, function(str) {
            switch (str) {
            case 'yyyy':
                return tf(t.getFullYear());
               // break;
            case 'MM':
                return tf(t.getMonth() + 1);
               // break;
            case 'dd':
                return tf(t.getDate());
               // break;
            case 'hh':
                return tf(t.getHours());
               // break;
            case 'mm':
                return tf(t.getMinutes());
               // break;
            case 'ss':
                return tf(t.getSeconds());
               // break;
            }
        })
        return time;
    }
    return value;
  }
}
