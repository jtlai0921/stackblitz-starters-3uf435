import { Injectable,NgZone } from '@angular/core';
import { Router, ActivatedRoute , NavigationEnd } from '@angular/router';
import { TelegramService } from '../../telegram/telegram.service';
import { TimerService } from '../global/timer.service';
import { LocalStorageService } from '../global/localStorage.service';
import { GetSessionKeyService } from '../../../shared/service/global/getSessionKey.service'
import { LayoutService } from '../../../shared/service/global/layout.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { PopupService } from '../global/popup.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
@Injectable({
  providedIn: 'root'
})
export class DoLogoutService {

  public _suscribe;
  public _ErrorCodeUse;
  public _ErrorCodeUseNumber;
  constructor(
    public router: Router,
    public telegram: TelegramService,
    public storage : LocalStorageService,
    public session : GetSessionKeyService,
    public layout : LayoutService,
    public functionList : FunctionListService,
    public popup : PopupService,
    public ngzone : NgZone,
    public timer : TimerService,
    public langTransService : LangTransService
  ) {
    this._suscribe = this.timer.timeEnd.subscribe((()=>{
      if(this.storage.get("Timeout") == 138)
                    {
                      //要秀138的訊息(此帳號已被其他裝置登入)
                      this._ErrorCodeUse = "ERROR.ERROR_138";
                      this._ErrorCodeUseNumber = 138;
                    }else{
                      this._ErrorCodeUse = "ERROR.ERROR_42";
                      this._ErrorCodeUseNumber = 42;
                    }
           this.Action_Logout().then((res)=>{
                    
                    this.ngzone.run(()=>{
                      
                        this.popup.setConfirm({ 
                          content: this.langTransService.instant(this._ErrorCodeUse) + '(' + this._ErrorCodeUseNumber + ')', 
                          event: () => {
                            this.router.navigate(['/login'],{queryParams:{'type':'logout'}});
                            this.layout.setFooterStatus(false);
                          } 
                        });
                    });
                },(error)=>{
                    this.ngzone.run(()=>{
                        this.popup.setConfirm({ 
                          content: this.langTransService.instant(this._ErrorCodeUse),  
                          event: () => {
                            this.router.navigate(['/login'],{queryParams:{'type':'logout'}});
                            this.layout.setFooterStatus(false);
                          } 
                        });
                    });
               });
               this.storage.set("Timeout",'');
    }));
  }

  /**
   * 進行使用者登出上行電文
   */
  public doLogout() {
    // 取得並設定參數
    const requset = this.telegram.GetRequstParam('CCMPTX000044Rq');
    // Call API
    return this.telegram.GetRespone(requset);
  }
  public Action_Logout(){
    return new Promise((resolve,reject)=>{
      this.doLogout().then(
        (response) => {
          if (response == null) {
            this.session.RegetKey();
            this.logoutComplie();
            resolve(true);
          }
          if (response["Result"] != 4001) {
            this.session.RegetKey();
            this.logoutComplie();
            resolve(true);
          }
          this.session.setKeyIndex(response["KeyIndex"]);
          this.session.setKey(response["SessionKey"]);
          this.logoutComplie();
          resolve(true);
        }
        , (error) => {
          this.session.RegetKey();
          this.logoutComplie();
          resolve(true);
        })

      });
    
  }


  logoutComplie() {
    this.layout.setFooterStatus(false);
    this.storage.set("isLogin", false);
    this.storage.set("userName", "");
    this.storage.set("loginEntryOtp", "");
    this.storage.set("loginUserCompany", "");
    this.storage.set("loginUserAccount", "");
    this.storage.set("loginUserCountry","");
    this.storage.set("idUser", "");
    this.storage.set("functionList", "");
    this.storage.set("agreeUnfinishData","");
    this.storage.set("loginUserCustomerName", "");
    
    this.functionList.setFunctionList([]);
    try {
      this.popup.setDatePicker({status:false})
      this.popup.setCheckList({status:false})
      this.popup.setDepositDetial({status:false})
      this.popup.setInput({isOpen:false});
      this.popup.setKeyboard(false);
      this.popup.setPatternLock({Isopen:false});
      this.popup.setQuickLoginTerms({Isopen:false});
      this.popup.setTransQuery({status: false});
    } catch (error) {
      console.log(error)
    }
  }

}
