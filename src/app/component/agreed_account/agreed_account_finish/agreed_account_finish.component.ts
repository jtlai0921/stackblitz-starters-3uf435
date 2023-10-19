import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { PopupService } from '../../../shared/service/global/popup.service';
import { SocialShareService } from '../../../shared/service/cordova/socialShare.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';

declare var Swiper: any;

@Component({
  selector: 'app-agreed-account-finish',
  templateUrl: './agreed_account_finish.component.html',
  styleUrls: ['./agreed_account_finish.component.css']
})
export class AgreedAccountFinishComponent implements OnInit {

  @Input() ViewObject: any;
  @Input() PayeeAcctSelected: any;
  @Input() RelAcctSelected: any;
  @Input() DataResult: any;
  @Input() UserName: any;
  @Input() Fee: any;
  @Input() BatchId:any;
  @Output()
  comfirm: EventEmitter<any> = new EventEmitter();

  IsSuccess;

  constructor(
    private router: Router,
    private popup: PopupService,
    private layout: LayoutService,
    private langTransService: LangTransService,
    private share: SocialShareService,
    private functionList: FunctionListService,
    private doLogin: DoLoginService
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: 'AGREEDACCOUNT.TRANS_RESULT'
    })
  }
  ngOnInit() {
    this.IsSuccess = this.DataResult["result"] == 0;
  }
  onGoHome() {
    var page = "";
    var parameter: any;
    var defaultLoginPage = this.doLogin.getDefaultLogin();
    let url = this.layout.getLogInRedirect();
    //驗證是否有預設router
    page = defaultLoginPage.router;
    if (url) {
      page = url
    }
    url = "";
    parameter = defaultLoginPage.parameter;
    // Navigate to next page
    if (parameter != undefined) {
      var queryParams_
      if (typeof parameter == 'string') {
        queryParams_ = { 'type': parameter }
      } else {
        queryParams_ = parameter
      }
      this.router.navigate([page], { queryParams: queryParams_ });
    } else {
      this.router.navigate([page]);
    }
  }
  onReTry() {
    this.comfirm.emit(0);
  }
  onNotifyClick() {
    let cur = this.ViewObject.DebitCur;
    let amt = this.ViewObject.Amount;
    let acct = this.RelAcctSelected.AcctNo.substr(-5, 5);

    let title = this.langTransService.instant('AGREEDACCOUNT.NOTIFY_TITLE');
    let message = this.langTransService.instant('AGREEDACCOUNT.NOTIFY_MSG')
      .replace("#CUR", cur)
      .replace("#AMT", amt)
      .replace("#ACCT", acct);
    this.share.shareMessage(message, title);
  }

  onAcctDetailClick() {
    var isActivity = this.functionList.checkHasFunctionGroup(FunctionListService.DepositDetailGroupKey);
    if (!isActivity) {
      this.popup.setConfirm({
        content: "MENU.NO_PERMISSION"
      })
      return;
    }

    //this.layout.setUrlParam(this.RelAcctSelected.AcctNo)
    this.router.navigate(["/account_enquiry"], { queryParams: { from: 'agree', type: "depositDetailPage", company: this.RelAcctSelected.CustomerId, acctNo: this.RelAcctSelected.AcctNo } });
  }
}
