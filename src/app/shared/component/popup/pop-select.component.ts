
import { Component} from '@angular/core';
import {PopupService} from '../../service/global/popup.service'
@Component({
  selector: 'app-pop-select',
  templateUrl: './pop-select.component.html'
})
export class PopSelectComponent {
  private _subscribe;
  public Isopen = false;
  private title = '';
  private content = '';
  private cancelTxt = '';
  private checkTxt = '';
  private checkType = '';
  private data:any;
  private event:any;
  private Seleted:any;
  constructor(
    private pop : PopupService
  ){
    this._subscribe = this.pop.selectSetting.subscribe(
      (setting:object) => {
         this.Isopen = true;
         this.title = setting['title'] || '';
         this.content = setting['content'] || '';
         this.event = setting['event'];
         this.checkTxt = setting['checkTxt'] || '';
         this.cancelTxt = setting['cancelTxt'] || '';
         this.checkType = setting['type'] || 'checkbox';
         this.data = setting['data'] || [];
         //data
         this.data.forEach((item)=>{
          item['checked'] = false;
         });
         this.data = this.data;
         //set Defualt
         if(this.data.length > 0){
            this.Seleted = this.data[0];
         }
      }
    );
  }

  Cancel() {
    this.Isopen = false;
  }

  Submit(){
    if(typeof this.event == 'function'){
      this.event(this.Seleted);
    }
    this.Isopen = false;
  }
  SetItem(e){
   this.Seleted = this.data.find((item)=>{
     return item.value == e;
   });
  }
  ngOnDestroy(){
    this._subscribe.unsubscribe();
  }
}




