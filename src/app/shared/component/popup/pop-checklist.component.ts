
import { Component} from '@angular/core';
import {PopupService} from '../../service/global/popup.service'
@Component({
  selector: 'app-pop-checklist',
  templateUrl: './pop-checklist.component.html'
})
export class PopCheckListComponent {
  private _subscribe;
  public Isopen = false;
  private title = '';
  private content = '';
  private cancelTxt = '';
  private checkTxt = '';
  private checkType = '';
  private data:any;
  private event:any;
  constructor(
    private pop : PopupService
  ){
    this._subscribe = this.pop.checkListSetting.subscribe(
      (setting:object) => {
         this.Isopen = setting.hasOwnProperty("status")? setting["status"] : true;
         this.title = setting['title'] || 'BTN.SELECT_PLEASE';
         this.content = setting['content'] || '';
         this.event = setting['event'];
         this.checkTxt = setting['checkTxt'] || '';
         this.cancelTxt = setting['cancelTxt'] || '';
         this.checkType = setting['type'] || 'checkbox';
      
         this.data = setting['data'] || [];
         
         //data
         this.data.forEach((item)=>{
          if(!item.hasOwnProperty('checked')){
            item['checked'] = false;
          }
         });
         //set Default
         var Checkindex = this.data.findIndex( _index => {
           return _index['checked'];
         });
         console.log('Checkindex',Checkindex);
         if(Checkindex == -1 && this.data.length > 0){
          this.data[0]['checked'] = true;
         }
         this.data = this.data;
      }
    );
  }

  Cancel() {
    this.Isopen = false;
  }
  CheckItem(item){
    if (item['disabled']) {
      return;
    }

    if(this.checkType == 'radio'){
      this.data.forEach((item)=>{
        item['checked'] = false;
       });
    }
    item.checked = !item.checked;

    this.Submit();
  }
  Submit(){
    if(typeof this.event == 'function'){
      if(this.checkType == 'checkbox'){
        var outData = this.data.filter((item)=>{
          return item['checked'];
        });
        this.event(outData);
      }else if(this.checkType == 'radio'){
        var index = this.data.findIndex((item)=>{
          return item['checked'];
        });
        if(index > -1){
          this.event( this.data[index]);
        }else{
          this.event(null);
        }
      }
    }
    this.Isopen = false;
  }
  ngOnDestroy(){
    this._subscribe.unsubscribe();
  }
}




