import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
declare var Swiper: any; 
@Component({
  selector: 'app-excess_amount_notice',
  templateUrl: './excess_amount_notice.component.html',
  styleUrls: ['./excess_amount_notice.component.css']
})
export class ExcessAmountNoticeComponent implements OnInit {
  public HotProblem =
  [
    {issuer:"TWD-232894543敦南分行",description:"轉出超過5,000,000或轉入超過10,000,000"},
    {issuer:"TWD-232894543敦南分行",description:"轉出超過5,000,000"},
    {issuer:"TWD-232894543敦南分行",description:"轉入超過10,000,000"}
  ];



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
