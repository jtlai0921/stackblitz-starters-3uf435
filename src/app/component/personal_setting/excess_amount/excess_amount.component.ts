import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
declare var Swiper: any; 
@Component({
  selector: 'app-excess_amount',
  templateUrl: './excess_amount.component.html',
  styleUrls: ['./excess_amount.component.css']
})
export class ExcessAmountComponent implements OnInit {

  constructor(
    private layout: LayoutService
  )  { 
    
    this.layout.setHeaderStatus({
      status:true,
      title:'EXCESSAMOUNT.TITLE'
    })
  }
  ngOnInit() {
  }
}
