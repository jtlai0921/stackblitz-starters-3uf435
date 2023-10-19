
import { Component } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

@Component({
  selector: 'app-pop-confirm',
  templateUrl: './pop-confirm.component.html'
})
export class PopConfirmComponent {
  private _subscribe;
  public Isopen = false;
  private title = '';
  private content = '';
  private cancelTxt = '';
  private checkTxt = '';
  private event: any;
  private errEvent: any;
  private keepOpen = false;
  constructor(
    private _langTransService: LangTransService,
    private pop: PopupService
  ) {
    console.log('PopConfirmComponent constructor');
    this._subscribe = this.pop.confirnSetting.subscribe(
      (setting: object) => {
        // console.log('confirm setting',setting);
        this.Isopen = true;
        this.title = setting['title'] || '';
        this.content = this._langTransService.instant(setting['content'] || '');
        this.event = setting['event'];
        this.checkTxt = this._langTransService.instant(setting['checkTxt'] || '');
        this.cancelTxt = setting['cancelTxt'] || '';
        this.errEvent = setting['errEvent'];
        this.keepOpen = setting['keepOpen'] ? true : false;
      }
    );
  }

  Cancel() {
    if (typeof this.errEvent == 'function') {
      this.errEvent(false);
    }
    this.Isopen = false;
  }
  OKBTN(){
    return this._langTransService.instant('BTN.DETERMINE');
  }
  Submit() {
    if (typeof this.event == 'function') {
      this.event(true);
    }
    if (!this.keepOpen)
      this.Isopen = false;
  }


  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }
}




