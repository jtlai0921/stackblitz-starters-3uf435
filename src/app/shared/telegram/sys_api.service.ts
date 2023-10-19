import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { timeout } from 'rxjs/operators';
import { Config } from '../../../assets/configuration/config';
@Injectable()
export class SystemApiService {
  
    constructor(
      private http: Http
    ) { }
    /**
     * api get
     * @param url 網址
     * @param param 參數
     */
    public Get(url: string,param:object) {
        return this.http.get(url,param).toPromise().then(
            (res : Response) => {
              return res.json();
            },
            (error: Response) => {
              return error.json();
            }
          );
    }

    /**
     * api post
     * @param url 網址
     * @param param 參數
     */
    public Post(url: string,param:object) {
      // 取得電文對應之timeout設定值 
      // 30 secs
      let timeoutValue:number = Config.timeout1;
      // 60 secs
      if (Config.timeout2List.includes(param['HeaderRq']['TxnId']))
        timeoutValue = Config.timeout2;
      // 120 secs
      else if (Config.timeout3List.includes(param['HeaderRq']['TxnId'])) 
        timeoutValue = Config.timeout3;

      return new Promise((resolve, reject) => {
        this.http.post(url,param).pipe(
          timeout(timeoutValue)
        ).toPromise().then(
          (res : Response) => {
            console.log("[http POST][original sucess]", res);
            try {
              resolve(res.json())
            } catch (catchErr) {
              reject({"HeaderRs":{"Result":"reject"}})
            }
          },
          (error: Response) => {
            console.error("[http POST][original failed]", error);
            try {
              var errResult = error.json();
              if(!errResult.hasOwnProperty("HeaderRs")){
                errResult = {"HeaderRs":{"Result":"reject"}};
              }
              reject(errResult)
            } catch (catchErr) {
              // HTTP request timeout
              if (error.toString().includes("TimeoutError") || error.toString().includes("Timeout has occurred"))
                reject({"HeaderRs":{"Result":"TIMEOUT"}});
              // HTTP request rejected by server
              reject({"HeaderRs":{"Result":"reject"}});
            }
          }
        );
      });
    }

}
