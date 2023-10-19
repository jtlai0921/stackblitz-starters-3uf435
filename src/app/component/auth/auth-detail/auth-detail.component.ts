import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { PopupService } from '../../../shared/service/global/popup.service';

@Component({
  selector: 'app-auth-detail',
  templateUrl: './auth-detail.component.html',
  styleUrls: ['./auth-detail.component.css']
})
export class AuthDetailComponent implements OnInit {

  @Input() isAuth: any; // reqData
  @Input() showOperationBtn: any; // reqData
  @Input() detailData: any; // reqData

  @Output() callbackData: EventEmitter<any> = new EventEmitter();

  trnTypeChannel;

  constructor(
    public popup: PopupService,
    private layout: LayoutService
  ) {
  }

  ngOnInit() {
    this.layout.setHeaderStatus({
      status: true,
      initbackStack: false,
      rightIcon: ' ', //隱藏右上角icon
      title: (!this.isAuth ? 'AUTH.PENDING_AUTH_DETAIL' : 'AUTH.HAVE_AUTH_DETAIL') // 待授權明細/已授權明細
    });
    console.log('[授權明細頁][req] isAuth', this.isAuth);
    console.log('[授權明細頁][req] showOperationBtn', this.showOperationBtn);
    console.log('[授權明細頁][req] detailData', this.detailData);

    // 判斷通路類別決定交易類型轉換
    this.trnTypeChannel = this.detailData.nTxnChannel == "CSFAX" ? "AUTH_TRNTYPE_CSFAX" : "AUTH_TRNTYPE";

    if (this.detailData.hasOwnProperty('AuthRecList')) {
      this.detailData.AuthRecList.forEach(item => {
        if (item.hasOwnProperty('Action')) {
          if (item.Action == 'A') {
            item.ActionMark = "AUTH.HAVED_AUTH";
          } else {
            item.ActionMark = "AUTH.REJECTED";
          }
        }
      });
    }
  }

  /**
   * [前端事件綁定][母頁回調觸發] 點擊授權按鈕
   */
  onAuthClick() {
    console.log('[授權明細頁] onAuthClick');
    let callbackData = { "Action": "auth" };
    console.log('[授權明細頁][callback] callbackData', callbackData);
    this.callbackData.emit(callbackData);
  }

  /**
   * [前端事件綁定][母頁回調觸發] 點取消權按鈕
   */
  onCancelClick() {
    console.log('[授權明細頁] onCancelClick');
    let callbackData = { "Action": "cancel" };
    console.log('[授權明細頁][callback] callbackData', callbackData);
    this.callbackData.emit(callbackData);
  }

  /**
   * [前端事件綁定][母頁回調觸發] 點擊退回按鈕
   */
  onRefundClick() {
    console.log('[授權明細頁] onRefundClick');
    let callbackData = { "Action": "refund" };
    console.log('[授權明細頁][callback] callbackData', callbackData);
    this.callbackData.emit(callbackData);
  }

}
