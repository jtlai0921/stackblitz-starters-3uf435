import { Injectable } from '@angular/core';

@Injectable()
export class SearchFilterService {
  
    constructor(
    ) { }
    /**
     * SearchBar 搜尋用service
     * 參數為：
     * source(原始資料) column(篩選欄位:字串或陣列) searchkey (搜尋關鍵字)
     */
    public Filter(source: any,column:any,searchkey = '',IsNotify = false) {
      console.log('source,searchkey',source,searchkey);
      var filter = [];
      if(searchkey != '' && source){
        var keys = [];
        if(typeof column == 'string'){
          keys.push(column);
        }
        else if(typeof column == 'object' && column.length > 0){
          keys = column;
        }
        else if(keys.length == 0){
          keys= Object.keys(source[0]);
        }
        // 若為通知訊息搜尋bar時執行
        if(IsNotify){
          filter = source.filter(item => {
            let content = JSON.parse(item.Content);
            var isExist = false;
            keys.forEach(k => {
              if(content.hasOwnProperty(k) && ((content[k].toString()).toLowerCase()).indexOf(searchkey.toLowerCase()) > -1 ){
                isExist = true;
              }
            })
            return isExist;
          });
        }else{
          filter = source.filter(item => {
            var isExist = false;
            keys.forEach(k => {
              if(item.hasOwnProperty(k) && ((item[k].toString()).toLowerCase()).indexOf(searchkey.toLowerCase()) > -1 ){
                isExist = true;
              }
            })
            return isExist;
          });
        }
        return filter;
      }else{
        return filter;
      }
    }

    /**
     * 篩選資料用
     * 參數為：
     * source(原始資料)
     * column(篩選欄位:查詢物件 ex:{ name : '1,2' ,  value : '2'  , Currency : { 'rangeDate' : '2018/07/21-2018/09/21' , 'rangeNum' : '0-100'}}) 
     * IsUnion ( 預設值為false(條件為OR), true為聯集 )
     * isPreciseSearch (預設false為模糊比對, true時為精確比對)
     */
    public FilterData(source: any,column:any,IsUnion = false, isPreciseSearch = false) {
      console.log('FilterData Start s');
      var filter = [];
      if(typeof column == 'object'){

        var keys= Object.keys(column);
        filter = source.filter(item => {
          if(IsUnion){
              //篩選條件為 AND
              var isExistArray = [];

              keys.forEach(k => {
                //篩選為字串
                if(typeof column[k] == 'string'){
                  var k_value = [];
                  k_value = column[k].split(',');
                  var invalid = false;

                  k_value.forEach( f => {
                    if (!isPreciseSearch) {
                      if(item.hasOwnProperty(k) &&((item[k].toString()).toLowerCase()).indexOf((f.toString()).toLowerCase()) > -1 ){
                        invalid = true;
                      }
                    }
                    else {
                      // 精確比對
                      if (f == "" || (item.hasOwnProperty(k) && (item[k].toString().toLowerCase() == f.toString().toLowerCase()))) {
                        // 篩選值為空值(即不篩選此項目)或篩選值與資料數據完全相等，則判斷此筆資料符合篩選條件
                        invalid = true;
                      }
                    }
                  });
                  isExistArray.push(invalid);

                }else if(typeof column[k] == 'object'){
                  //篩選為物件
                  var _range = JSON.parse(JSON.stringify(column[k]));
                  if(_range.hasOwnProperty('rangeDate')){
                    var _date = _range['rangeDate'].split('-');
                    var columnDate = item[k].toString();


                    // 處理特殊格式 20181017  轉成 2018/10/17
                    columnDate = (columnDate.length != 8) ? columnDate : (columnDate.slice(0,4) + '/' + columnDate.slice(4,6) + '/' + columnDate.slice(6,8));
                    _date[0] = (_date[0].length!=8) ? _date[0] : (_date[0].slice(0,4) + '/' + _date[0].slice(4,6) + '/' + _date[0].slice(6,8));
                    _date[1] = (_date[1].length!=8) ? _date[1] : (_date[1].slice(0,4) + '/' + _date[1].slice(4,6) + '/' + _date[1].slice(6,8));
                    
                    //設定時間篩選條件下限為當天00:00:00，上限為當天23:59:59
                    _date[0] += " 00:00:00";
                    _date[1] += " 23:59:59";
                    
                    var _thisDate = new Date(columnDate);
                    var isValidDate = (new Date(_date[0])) <= _thisDate && (new Date(_date[1])) >= _thisDate;
                    isExistArray.push(isValidDate);
                  }

                  if(_range.hasOwnProperty('rangeNum')){
                    var _no = _range['rangeNum'].split('-');
                    var _thisNo = Number(item[k].toString());
      
                    var isValidNo = Number(_no[0]) <= _thisNo && Number(_no[1]) > _thisNo;
                    isExistArray.push(isValidNo);
                  };

                  if (_range.hasOwnProperty("mutliRangeNum")) {
                    var value = Number(item[k].toString());
                    var numList = _range['mutliRangeNum'].split(",");
                    var nums;
                    var isValid = numList.some(numPair => {
                      nums = numPair.split('-');
                      return Number(nums[0]) <= value && Number(nums[1]) > value;
                    });
                    isExistArray.push(isValid);
                  }

                  // console.log('second search handle');
                  //第二層參數處
                  delete _range['rangeDate'];
                  delete _range['rangeNum'];
                  delete _range['mutliRangeNum'];
                  var secondFiletr = Object.keys(_range);
                  if(secondFiletr.length > 0){
                    var second = this.filterSecond(item[k],column[k]);
                    isExistArray.push(second);
                  }

                }else{
                  isExistArray.push(false);
                }
              });


              return (isExistArray.indexOf(false) == -1);
              
          }else{

            //篩選條件為 OR
            var isExist = false;
            keys.forEach(k => {
              var k_value = [];

              if(typeof column[k] == 'string'){
                k_value = column[k].split(',');
                k_value.forEach( f => {
                  if (!isPreciseSearch) {
                    if(item.hasOwnProperty(k) &&((item[k].toString()).toLowerCase()).indexOf((f.toString()).toLowerCase()) > -1 ){
                      isExist = true;
                    }
                  }
                  else {
                    // 精確比對
                    if (f != "" && (item.hasOwnProperty(k) && (item[k].toString().toLowerCase() == f.toString().toLowerCase()))) {
                      // 篩選值不為空值且篩選值與資料數據完全相等，則判斷此筆資料符合篩選條件
                      isExist = true;
                    }
                  }
                });
              }else if(typeof column[k] == 'object'){
                
                //篩選為物件
                var _range = column[k];
                if(_range.hasOwnProperty('rangeDate')){
                  var _date = _range['rangeDate'].split('-');
                  var columnDate = item[k].toString();
                  // 處理特殊格式 20181017  轉成 2018/10/17
                  columnDate = (columnDate.length != 8) ? columnDate : (columnDate.slice(0,4) + '/' + columnDate.slice(4,6) + '/' + columnDate.slice(6,8));
                  _date[0] = (_date[0].length!=8) ? _date[0] : (_date[0].slice(0,4) + '/' + _date[0].slice(4,6) + '/' + _date[0].slice(6,8));
                  _date[1] = (_date[1].length!=8) ? _date[1] : (_date[1].slice(0,4) + '/' + _date[1].slice(4,6) + '/' + _date[1].slice(6,8));

                  //設定時間篩選條件下限為當天00:00:00，上限為當天23:59:59
                  _date[0] += " 00:00:00";
                  _date[1] += " 23:59:59";

                  var _thisDate = new Date(columnDate);

                  var isValidDate = (new Date(_date[0])) <= _thisDate && (new Date(_date[1])) >= _thisDate;
                  if(isValidDate){
                    isExist = true;
                  }
                }


                if(_range.hasOwnProperty('rangeNum')){
                  var _no = _range['rangeNum'].split('-');
                  var _thisNo = Number(item[k].toString());
                  var isValidNo = Number(_no[0]) <= _thisNo && Number(_no[1]) > _thisNo;
                  if(isValidNo){
                    isExist = true;
                  }
                }

              }
            })
            return isExist;

          }
        });
        return filter;
      }else{
        return filter;
      }
    }
    //處理第二層資料用 條件 Ｕnion
    public filterSecond(source: any,column:any){
      var filter = [];
      if(typeof column == 'object'){
        var isExistArray = [];
        var keys= Object.keys(column);
        if(!Array.isArray(source)){
          return false;
        }
        filter = source.filter(item => {
          //篩選條件為 AND
          keys.forEach(k => {
            //篩選為字串
            if(typeof column[k] == 'string'){
              var k_value = [];
              k_value = column[k].split(',');
              var invalid = false;

              k_value.forEach( f => {
              if(((item[k].toString()).toLowerCase()).indexOf((f.toString()).toLowerCase()) > -1 ){
                  invalid = true;
                }
              });
              isExistArray.push(invalid);

            }else if(typeof column[k] == 'object'){
              
              //篩選為物件
              var _range = column[k];
              if(_range.hasOwnProperty('rangeDate')){
                var _date = _range['rangeDate'].split('-');
                var columnDate = item[k].toString();
                // 處理特殊格式 20181017  轉成 2018/10/17
                columnDate = (columnDate.length != 8) ? columnDate : (columnDate.slice(0,4) + '/' + columnDate.slice(4,6) + '/' + columnDate.slice(6,8));
                _date[0] = (_date[0].length!=8) ? _date[0] : (_date[0].slice(0,4) + '/' + _date[0].slice(4,6) + '/' + _date[0].slice(6,8));
                _date[1] = (_date[1].length!=8) ? _date[1] : (_date[1].slice(0,4) + '/' + _date[1].slice(4,6) + '/' + _date[1].slice(6,8));


                //設定時間篩選條件下限為當天00:00:00，上限為當天23:59:59
                _date[0] += " 00:00:00";
                _date[1] += " 23:59:59";

                var _thisDate = new Date(columnDate);
                var isValidDate = (new Date(_date[0])) <= _thisDate && (new Date(_date[1])) >= _thisDate;
                isExistArray.push(isValidDate);
              }

              if(_range.hasOwnProperty('rangeNum')){
                var _no = _range['rangeNum'].split('-');
                var _thisNo = Number(item[k].toString());
                var isValidNo = Number(_no[0]) <= _thisNo && Number(_no[1]) > _thisNo;
                isExistArray.push(isValidNo);
              }

            }else{
              isExistArray.push(false);
            }
          });
        });
        return (isExistArray.indexOf(false) == -1);
      }else{
        return false;
      }
    }

}
