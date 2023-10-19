
import { Component } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LangTransService } from '../../pipe/langTransPipe/lang-trans.service';

@Component({
  selector: 'app-pop-percent',
  templateUrl: './pop-percent.component.html'
})
export class PopPercentComponent {
  private _subscribe;
  public Isopen = false;
  private title = '';
  private content = '';
  private cancelTxt = '';
  private checkTxt = '';
  private percent = 0;
  private event;
  constructor(
    private _langTransService: LangTransService,
    private pop: PopupService
  ) {
    console.log('PopConfirmComponent constructor');
    this._subscribe = this.pop.percentSetting.subscribe(
      (setting: object) => {
        this.Isopen = (setting.hasOwnProperty('status')) ? setting['status'] : false;
        this.title = setting['title'] || '';
        this.content = this._langTransService.instant(setting['content'] || '');
        this.checkTxt = setting['checkTxt'] || '';
        this.cancelTxt = setting['cancelTxt'] || '';
        this.percent = setting['percent'] || '';
        this.event = setting['event'] || null;
      }
    );
  }
  Cancel() {
    this.Isopen = false;
  }
  Submit() {
    if (typeof this.event == 'function') {
      this.event(true);
    }
    this.Isopen = false;
  }
  ngOnDestroy() {
    this._subscribe.unsubscribe();
  }
}




