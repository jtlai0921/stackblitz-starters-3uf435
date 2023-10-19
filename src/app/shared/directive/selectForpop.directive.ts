import { Directive, ElementRef , AfterViewChecked,Input,Output ,NgZone,HostListener ,EventEmitter} from '@angular/core';
import { PopupService } from '../service/global/popup.service';
declare var $;
@Directive({
  selector: 'selectForpop,[selectForpop]'
})
export class SelectForPopDirective {

  public dataArray = [];
  @Input() ngModel;
  @Input() disabled;
  @Output() ngModelChange = new EventEmitter();

  private ele:any;
  constructor(el: ElementRef,public pop : PopupService) {
    console.log('SelectForPopDirective Directive constructor');
    this.ele = el.nativeElement;
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('click', ['$event'])
  ontouchstart(event: Event) {
    console.log('SelectForPopDirective', event.type);
    if (this.disabled)
      return;
    
    console.log('SelectForPopDirective Directive touchstart');
    this.dataArray = [];
    var option;
    option = this.ele.options;
    for(var i = 0;i < option.length ; i++){
      this.dataArray.push({
        desc:option[i].text,
        value:option[i].value,
        checked:false,
        disabled:option[i].disabled
      });
    }
    
    if(this.ngModel != ''){
      this.setActive(this.ngModel);
    }

    this.pop.setCheckList({
      type:'radio',
      data: this.dataArray,
      event:(e)=>{
        this.ngModel = e.value;
        this.setActive(e.value);
        console.log('setCheckList ngModel',this.ngModel );
        console.log('setCheckList e',e.value);
        this.ngModelChange.emit(e.value);
      }
    });
    event.preventDefault();
  }

  @HostListener('mousedown', ['$event'])
  onmousedown(event: Event) {
    console.log('SelectForPopDirective', event.type);
    event.preventDefault();
  }

  ngOnChanges(){
    
  }

  setActive(value){
    var index = this.dataArray.findIndex((item)=>{
      return item.value == value;
    });
    this.dataArray.forEach(_item =>{_item.checked = false;});
    if(index > -1){
      this.dataArray[index].checked = true;
    }
  }

}