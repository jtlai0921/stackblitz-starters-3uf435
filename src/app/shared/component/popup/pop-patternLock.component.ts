
import { Component,NgZone } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';
declare var PatternLock;
@Component({
  selector: 'app-pop-patternlock',
  templateUrl: './pop-patternLock.component.html'
  
})
export class PopPatternLockComponent {
  private _subscribe;
  public Isopen = false;
  private title = '';
  private event: any;
  private cancel:any;
  private patternLock = null;;

  constructor(
    private _langTransService: LangTransService,
    private pop: PopupService,
    private zone : NgZone
  ) {
    console.log('PopPatterLockComponent constructor');
    this._subscribe = this.pop.patternLockSetting.subscribe(
      (setting: object) => {
        
        try {
          if(setting['reset']){
            if(this.patternLock != null){
              this.zone.runOutsideAngular(()=>{
                this.patternLock.reset();
              })
            }
          }
          if(setting['error']){
            if(this.patternLock != null){
              this.zone.runOutsideAngular(()=>{
                this.patternLock.error();
              })
            }
          }
          if(setting['msg']){
            if(this.patternLock != null){
              this.title = setting['msg'];
            }
          }
         
  
          if(setting.hasOwnProperty('Isopen')){
            this.Isopen =  setting['Isopen'];
          }else{
            this.Isopen = true;
          }
          
          if(setting['reset'] || setting['error'] || setting['msg'] || !this.Isopen){
            return;
          }
          
          this.title = setting['title'] || '';
          this.event = setting['event'];
          this.cancel = setting['cancel'];
          setTimeout(()=>{
            console.log('runOutsideAngular!PatternLock',document.getElementById('patternHolder'));
            this.zone.runOutsideAngular(()=>{
              this.patternLock = new PatternLock('#patternHolder', {
                onDraw: (pattern) => {
                   this.event(pattern);
                }
              });
            })
          },100);
        } catch (error) {
          console.log(error);
        }

      }
    );

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




