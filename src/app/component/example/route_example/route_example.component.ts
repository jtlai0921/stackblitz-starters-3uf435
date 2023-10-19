
import { Component, OnInit } from '@angular/core';
import {LayoutService} from '../../../shared/service/global/layout.service';
@Component({
  selector: 'app-example-route',
  templateUrl: './route_example.component.html'

})
export class RouteExampleComponent implements OnInit {
  constructor(
    public layout : LayoutService
  ){
    console.log('RouteExampleComponent constructor');
    this.layout.setHeaderStatus(true);
  }
  ngOnInit() {
  
  }
}




