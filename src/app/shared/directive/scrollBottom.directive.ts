import { Directive, ElementRef , AfterViewChecked,Output ,NgZone ,EventEmitter} from '@angular/core';
import { LocalStorageService } from '../service/global/localStorage.service';

declare var $;

@Directive({
  selector: 'scrollBottom,[scrollBottom]'
})
export class SrollBottomDirective{

   @Output() change = new EventEmitter();
    private ele:any;
    constructor(el: ElementRef,public ngZone : NgZone, private storage: LocalStorageService) {
      console.log('scrollBottom Directive constructor');
       this.ele = el.nativeElement;


       let isLogin = this.storage.get("isLogin");

      //addTop      
       if(isLogin){  
        var btn = document.createElement("div");
        btn.className = "backBottom fadeIn";
        this.ele.appendChild(btn);
       }else {
        var btn = document.createElement("div");
        btn.className = "backBottomNotLogin fadeIn";
        this.ele.appendChild(btn);
       }

       btn.onclick = ()=>{
        this.BottomscrollTo();
       };

      // console.log('this.ele.onscroll',this.ele.onscroll);
        ngZone.runOutsideAngular(() => {

          this.ele.onscroll  = (value) => {
            //若已置底則不顯示BTN
            if(this.ele.scrollTop >= (value['target'].scrollHeight - value['target'].offsetHeight-200)){
            btn.style.display = 'none';
            this.change.emit(true);
            }else{
            btn.style.display = 'block';
            this.change.emit(false);
            }
          }

      });
    }

    BottomscrollTo() {
      this.ngZone.runOutsideAngular(() => {
        $(this.ele).animate({scrollTop: 9999999 }, 500);
      });
    }
 
}