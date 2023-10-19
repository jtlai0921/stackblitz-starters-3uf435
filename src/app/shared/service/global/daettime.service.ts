/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';

@Injectable()
export class DateTimeService {
  
    constructor() {}

    /**
     * 取得日期format
     * @param date 日期
     * @param _format format 格式：EX:yyyy-MM-dd hh:mm:ss
     */
    public datetimeFormat(date:number,_format:string = '') {
        var format = (_format == '') ? 'yyyy-MM-dd hh:mm:ss' : _format;
        var t = new Date(date);
        var tf = function(i) {
            return (i < 10 ? '0' : '') + i
        };
        var sf = function(i) {
            return (i < 100 ? '0' : '') + (i < 10 ? '0' : '') + i
        };
        var time = format.replace(/yyyy|MM|dd|hh|mm|ss|SSS/g, function(str) {
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
            case 'SSS':
                return sf(t.getMilliseconds());
            }
        })
        return time;
    }
}

