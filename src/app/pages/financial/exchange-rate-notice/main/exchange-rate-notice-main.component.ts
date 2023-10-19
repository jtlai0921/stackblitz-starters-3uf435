/**
 * 匯率到價通知
 */
import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@systems/route/layout/header/header-ctrl.service';
import { Logger } from '@systems/system/logger/logger.service';
import { NavgatorService } from '@systems/route/navgator/navgator.service';
import { ExchangeRateNoticeService } from '@pages/financial/shared/service/exchange-rate-notice.service';
import { note_content } from '@pages/financial/shared/notePopup-content';
import { AuthService } from '@systems/system/auth/auth.service';

@Component({
  selector: 'app-exchange-rate-notice-main',
  templateUrl: './exchange-rate-notice-main.component.html',
  styleUrls: [],
  providers: [ExchangeRateNoticeService]
})

export class ExchangeRateNoticeMainComponent implements OnInit {

  haveData = true;
  notePopupOption = {}; // 注意事項設定
  isEditing = false; // 是否按下編輯按鈕
  email: string;
  noticeData = []; // 匯率到價通知data
  notYetData = []; // 尚未生效的到價通知
  workingData = []; // 通知中的到價通知
  expiredData = []; // 已到期的到價通知
  errorMsg = "";
  note_content = note_content;

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private _logger: Logger,
    private navgator: NavgatorService,
    private mainService: ExchangeRateNoticeService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.notePopupOption = {
      title: 'POPUP.NOTE.TITLE',
      content: this.note_content
    };

    this._headerCtrl.setRightBtnClick(() => {
      this.onRightBtnClick();
    });

    this.email = this.auth.getEmail();

    // 取得匯率到價通知data
    this.mainService.getData().then(
      (res) => {
        this.haveData = true;
        // this.email = res.email;
        this.noticeData = res.data;
        this.notYetData = res.notYetData;
        this.workingData = res.workingData;
        this.expiredData = res.expiredData;
      },
      (errObj) => {
        this.haveData = false;
        this.errorMsg = errObj.content;
        // Error
      }
    );

  }

  /**
   * Header右側按鈕點擊事件
   */
  onRightBtnClick(){
    if (this.isEditing) {
      this.isEditing = false;
      this._headerCtrl.setOption({rightBtnIcon: 'edit'}); // 變更Header右側按鈕樣式
    } else {
      this.isEditing = true;
      this._headerCtrl.setOption({rightBtnIcon: 'finish'}); // 變更Header右側按鈕樣式
    }
    
  }

  /**
   * [刪除]按鈕點擊事件
   */
  onDeleteBtnClick(item) {
    let params = {
      action: 'delete',
      item
    };
    if (!item.email || item.email == '') {
      item.email = this.email;
    }
    this.navgator.push('exchangeRateNoticeSetting', params);
  }

  /**
   * [修改]按鈕點擊事件
   */
  onModifyBtnClick(item) {
    let params = {
      action: 'update',
      item
    };
    if (!item.email || item.email == '') {
      item.email = this.email;
    }
    this.navgator.push('exchangeRateNoticeSetting', params);
  }

  /**
   * [設定e-mail]按鈕點擊事件
   */
  onEmailSettingBtnClick() {
    this._logger.error("setting e-mail~~~~~");
  }

  /**
   * [新增到價通知]按鈕點擊事件
   */
  onAddNewNoticeBtnClick() {
    let params = {
      action: 'create',
      item: {
        email: this.email
      }
    };
    this.navgator.push('exchangeRateNoticeSetting', params);
  }

}
