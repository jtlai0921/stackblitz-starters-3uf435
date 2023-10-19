
import { Component,NgZone} from '@angular/core';
import {PopupService} from '../../service/global/popup.service';
@Component({
  selector: 'app-loading',
  templateUrl: './pop-loading.component.html'
})
export class PopLoadingComponent {
  public _subscribe;
  public IsOpen = false;
 
  constructor(
    private pop : PopupService,
    private zone:NgZone
  ){
    console.log('PopLoadingComponent constructor');
    this._subscribe = this.pop.loadingStatus.subscribe(
      (status) => {
        this.zone.run(()=>{
          this.IsOpen = status;
        })
      }
    );
  }

  ngOnDestroy(){
    console.warn('ngOnDestroy!! unsubscribe')
    this._subscribe.unsubscribe();
  }
}




