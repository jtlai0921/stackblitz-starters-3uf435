import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
declare var Swiper: any; 
@Component({
  selector: 'app-exchange_rate_price',
  templateUrl: './exchange_rate_price.component.html',
  styleUrls: ['./exchange_rate_price.component.css']
})
export class ExchangeRatePriceComponent implements OnInit {

  constructor(
    private layout: LayoutService
  )  { 
    
    this.layout.setHeaderStatus({
      status:true,
      title:'EXCHAGERATEPRICE.TITLE'
    })
  }
  ngOnInit() {
  }
}
