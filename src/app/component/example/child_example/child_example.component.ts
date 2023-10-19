
import { Component, OnInit , Input , Output ,EventEmitter} from '@angular/core';
@Component({
  selector: 'app-example-child',
  templateUrl: './child_example.component.html'
})
export class ChildExampleComponent {
  
  @Input() DataItem:any;

  @Output()
  updateData: EventEmitter<any> = new EventEmitter();
 
  constructor(){
    console.log('ChildExampleComponent constructor');
  }

  Close() {
    this.updateData.emit(false);
  }

  Submit(){
    this.updateData.emit(this.DataItem);
  }

}




