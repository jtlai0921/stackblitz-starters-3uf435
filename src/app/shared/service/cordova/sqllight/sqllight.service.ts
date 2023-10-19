/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { TABLES } from './table';
import { Config } from '../../../../../assets/configuration/config';
declare var window: any;

@Injectable()
export class SQLlightService {

    private CBCT :any;
    constructor() {
        console.log('SQLlightService constructor');
    }
    private init(){
        return new Promise((resolve, reject) => {
            this.CBCT = window.sqlitePlugin.openDatabase(
                {name: 'ctbc.db', location: 'default'},
                 function(res){
                     console.log('ctbc.db create And Open Ready!',res);
                     resolve(true)},
                 function(er){console.log('ctbc.db err!',er);
                reject(er);}
                );
        });
    }
    // 建立所有預先建立資料表
    public createTable() {
        return new Promise((resolve, reject) => {
            if(!Config.NATIVE_OPEN){
                resolve(true);
            }else{
                var alltable = Object.keys(TABLES);
                this.init().then(
                    (res) => {
                        this.CBCT.transaction((tx) => {
                            //CMD SAMPLE ： tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
                            alltable.forEach((name)=>{
                                var column = Object.keys(TABLES[name]);
                                var cmdstr = 'CREATE TABLE IF NOT EXISTS ' + name +' (' + column.join(',') + ')';
                                tx.executeSql(cmdstr);
                            });
                            resolve(true);
                        }, function(error) {
                            console.log('Transaction ERROR: ' + error.message);
                            reject(error);
                        });
                    },(_error) => {
                        reject(_error);
                    }
                );
            }
        });
    }

    public insert(tableName,data) {
        return new Promise((resolve, reject) => {
            if(typeof data == 'undefined' || tableName == ''){
                reject('data Undefined');
            }

            //泛用儲存
            this.CBCT.transaction((tx) => {

                //有設定table 預設表
            if(TABLES.hasOwnProperty(tableName)){
                var default_data = TABLES[tableName];
                //如果資料是Array
                if(Array.isArray(data)){

                    data.forEach( item => {
                        item = Object.assign(default_data,item);
                        var typeArray = (Object.keys(item)).fill('?');
                        tx.executeSql('INSERT INTO ' + tableName + ' VALUES (' + typeArray.join(',') + ')', Object.values(item));
                    });

                }else{
                    //如果資料是Object
                    data = Object.assign(default_data,data);
                    var typeArray = (Object.keys(data)).fill('?');
                    tx.executeSql('INSERT INTO ' + tableName + ' VALUES (' + typeArray.join(',') + ')', Object.values(data));
                }

            }else{
                //若無設定table 預設表 則一律存在system 表內
                var type = typeof data;
                data = (type == 'object') ? JSON.stringify(data) : data;
                tx.executeSql('INSERT INTO system VALUES (?,?,?)', [tableName,type, data]);
            }
             resolve(true);
            // tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
            },function(err){
                reject(err);
            });
        });
       
        
    }

    //泛用取得
    public select(tableName,query = {}) {
        console.log('tableName:' + tableName);
        return new Promise((resolve, reject) => {

            this.CBCT.transaction((tx) => {
                //query 條件式 AND
                var queryCmd = ' WHERE 1 = 1';
                if(typeof query == 'object'){
                    (Object.keys(query)).forEach(k => {
                        queryCmd = queryCmd + " AND " + k + "='" + query[k] + "'";
                    });
                }
                console.log('[sqlite] query', queryCmd);

                //有設定table 預設表
                if(TABLES.hasOwnProperty(tableName)){
                  tx.executeSql('SELECT * FROM ' + tableName + queryCmd, [], (tx, rs) => {
                   var result = [];
                   var total = rs.rows.length;
                   for(var i =0;i<total;i++){
                       result.push(rs.rows.item(i));
                   }
                   resolve(result);
                   }, function(tx, error) {
                     reject(error);
                   });
   
               }else{

                   //從system 取資料
                   tx.executeSql('SELECT * FROM system where key =? ', [tableName], (tx, rs) => {
                       var totalLength = rs.rows.length;
                       if(totalLength == 0){
                        reject('Data Not Found!');
                       }
                       if(totalLength == 1){
                           var _result = rs.rows.item(0);
                           if(_result['type'] == 'object'){
                             resolve(JSON.parse(_result['value']));
                           }else{
                             resolve(_result['value']);
                           }
                       }else if(totalLength > 1){
                           var _array = [];
                           for(var i  = 0 ; i < totalLength;i++){
                               _array.push(rs.rows.item(i));
                           }
                           resolve(_array);
                       }
                       
                       }, function(tx, error) {
                         reject(error);
                       });
               }
   
               // tx.executeSql('SELECT * FROM DemoTable', [], function(tx, rs) {
               // console.log('Record count (expected to be 2): ',rs.rows.item(0));
               // }, function(tx, error) {
               // console.log('SELECT error: ' + error.message);
               // });
           });

        });
        
    }
}
