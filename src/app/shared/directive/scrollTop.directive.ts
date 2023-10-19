import { Directive, ElementRef , AfterViewChecked,Output ,NgZone ,EventEmitter} from '@angular/core';
import { LocalStorageService } from '../service/global/localStorage.service';
declare var $;
@Directive({
  selector: 'scrollTop,[scrollTop]'
})
export class SrollTopDirective {

   @Output() change = new EventEmitter();
    private ele:any;
    constructor(el: ElementRef,public ngZone : NgZone, private storage: LocalStorageService) {
      console.log('scrollTop Directive constructor');
       this.ele = el.nativeElement;

       let isLogin = this.storage.get("isLogin");

      //addTop      
       if(isLogin){  
        var btn = document.createElement("div");
        btn.className = "backTop fadeIn";
        btn.id = "backTop"
        this.ele.appendChild(btn);
       }else {
        var btn = document.createElement("div");
        btn.className = "backTopNotLogin fadeIn";
        this.ele.appendChild(btn);
       }
      



       btn.onclick = ()=>{
        this.TopscrollTo();
       };

      // console.log('this.ele.onscroll',this.ele.onscroll);
        ngZone.runOutsideAngular(() => {

          this.ele.onscroll  = () => {
            if(this.ele.scrollTop < 200){
            btn.style.display = 'none';
            this.change.emit(true);
            }else{
            btn.style.display = 'block';
            this.change.emit(false);
            }
          }

      });
    }

    TopscrollTo() {
      this.ngZone.runOutsideAngular(() => {
        $(this.ele).animate({scrollTop: 0}, 500);
      });
      // console.log('this.ele.scrollTop',this.ele.scrollTop,$('body').length);
      // $(this.ele).animate({scrollTop: 0}, 500);
    }
 
}