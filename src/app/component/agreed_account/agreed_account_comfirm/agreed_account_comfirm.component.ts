import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { Router } from '@angular/router';

declare var Swiper: any;

@Component({
  selector: 'app-agreed-account-comfirm',
  templateUrl: './agreed_account_comfirm.component.html',
  styleUrls: ['./agreed_account_comfirm.component.css']
})
export class AgreedAccountComfirmComponent implements OnInit {

  @Input() ViewObject: any;
  @Input() PayeeAcctSelected: any;
  @Input() RelAcctSelected: any;
  @Input() UserName: any;
  @Input() Fee: any;

  @Output()
  comfirm: EventEmitter<any> = new EventEmitter();

  constructor(
    private layout: LayoutService,
    private langTransService: LangTransService,
    private popup: PopupService,
    private router: Router,
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: 'AGREEDACCOUNT.TITLE'
    })
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngOnInit() {

  }

  onCancelClick() {
    this.comfirm.emit(0);
  }

  onComfirmClick() {
    this.comfirm.emit(2);
  }
}
