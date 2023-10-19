import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: '_currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: any,format:any): any {
    if(value){
      value =value.toString().replace(",","");
    }
    format = (Number(format) != NaN) ? Number(format) : -1;
    
    if(Number(value) != NaN)
    {
      var result = Number(value);
      var resultString;
      if(format > -1){
        resultString = result.toFixed(format)
      }else{
        resultString = result.toString();
      }

      var aIntNum = resultString.split('.');
      var iIntPart = aIntNum[0];
      var iFlootPart = aIntNum.length > 1 ? '.' + aIntNum[1] : '';
      var rgx = /(\d+)(\d{3})/; // 如果整数部分位数大于或等于5 
      if (iIntPart.length >= 4)
      { 
        // 根据正则要求，将整数部分用逗号每三位分隔 
        while (rgx.test(iIntPart)) {
          iIntPart = iIntPart.replace(rgx, '$1' + ',' + '$2');
        }
      }

      //如果是字串 NaN 代表轉不過，直接回空值，不要是NaN
      if(iIntPart == 'NaN')
      {
        return '';
      }
      
      return  iIntPart + iFlootPart;
    }
    

    return value;
  }
}
