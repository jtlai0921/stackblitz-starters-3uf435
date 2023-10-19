
import { Component,NgZone } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
import { AgreementAddService } from '../../service/customize/agreementAdd.service';
declare var PatternLock;
@Component({
  selector: 'app-pop-quickLoginTerms',
  templateUrl: './pop-quickLoginTerms.component.html'
  
})
export class PopQuickLoginTermsComponent {
  private _subscribe;
  public Isopen = false;
  private type = '';
  private event: any;
  private cancel: any;
  private Content:any;
  private patternLock = null;;
  private isAgreementChecked = false;
  constructor(
    private _langTransService: LangTransService,
    private popup: PopupService,
    private zone : NgZone,
    private agreement: AgreementAddService
  ) {
    console.log('PopPatterLockComponent constructor');
    this._subscribe = this.popup.quickLoginTermsSetting.subscribe(
      (setting: object) => {
       
        if(setting.hasOwnProperty('Isopen')){
          this.Isopen =  setting['Isopen'];
        }else{
          this.Isopen = true;
        }
        if(!this.Isopen){
          return;
        }
        this.event = setting['event'];
        this.cancel = setting['cancel'];
        this.isAgreementChecked =false;
        this.type = setting['type'] || '';
        if(this.type == "P" || ""){
          this.Content = this._langTransService.instant("QUICKLOGIN.PATTERN_TERMS");
        }else{
          this.Content = this._langTransService.instant("QUICKLOGIN.QUICK_TERMS");
        }
        
        
      }
    );

  }
  ngOnInit() {
    
  }

 
  Comfirm(){
    if (!this.isAgreementChecked) {
      this.popup.setConfirm({
        content: 'QUICKLOGIN.READ_AND_AGREE_TERMS'
      });
      return;
    }

    // 發送同意紀錄至中台
    let agreementType = (this.type == "P" || "") ? 1 : 2;
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(this.Content));
    let content = div.innerHTML;
    this.agreement.agreemnetAdd(agreementType, content);

    if(this.event!=undefined){
      this.event();
    }
    this.Isopen = false;
  }
  Cancel() {
    if(this.cancel!=undefined){
      this.cancel();
    }
    this.Isopen = false;
  }

  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }

}




