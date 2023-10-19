import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
declare var Swiper: any; 
@Component({
  selector: 'app-exchange_rate_price_edit',
  templateUrl: './exchange_rate_price_edit.component.html',
  styleUrls: ['./exchange_rate_price_edit.component.css']
})
export class ExchangeRatePriceEditComponent implements OnInit {
  public HotProblem =
  [
    {status:"通知中",issuer:"USD>TWD",description:"<28.7928或>29.9381"},
    {status:"通知中",issuer:"USD>TWD",description:"<28.7928"},
    {status:"已過期",issuer:"USD>TWD",description:">29.9381"}
  ];



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
