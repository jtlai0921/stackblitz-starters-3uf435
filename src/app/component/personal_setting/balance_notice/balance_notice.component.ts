import { Component, OnInit, Output,Input, EventEmitter } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { UserParaInqService } from '../../../shared/service/customize/userParaInq.service';
import { NotifyListInqService } from '../../../shared/service/customize/notifyListInq.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { KEY_USER_PARA } from '../../../../assets/configuration/userParaKey';

@Component({
  selector: 'app-balance-notice',
  templateUrl: './balance_notice.component.html',
  styleUrls: ['./balance_notice.component.css']
})
export class BalanceNoticeComponent implements OnInit {

  @Output() editedData: EventEmitter<any> = new EventEmitter();
  @Input() editPara:any; // reqData

  private idUser; // 使用者識別代碼
  public settings = []; // 餘額上下限通知設定
  public accounts; // 所有已設定之帳號陣列
  private otherAcctInfo; // 未設定帳號資料(編輯功能)
  private PRODUCT_ID = "MS01"; // 餘額上下限通知識別代碼

  constructor(
    private layout: LayoutService,
    private storage: LocalStorageService,
    private paraInq: UserParaInqService,
    private langTrans: LangTransService,
    private popup: PopupService,
    private notifyListInq: NotifyListInqService
  )  { 
    
    this.layout.setHeaderStatus({
      status:true,
      title:'BALANCE_LIMIT.TITLE'
    });
  }

  ngOnInit() {
    // 取得使用者識別代碼
    this.idUser = this.storage.get("idUser");
    // 取得使用者餘額上下限通知設定
    this.getBalanceLimitSetting();
  }

  /**
   * [API] 用戶參數查詢：取得中台使用者餘額上下限通知設定
   */
  getBalanceLimitSetting() {
    this.analyzeBalanceLimitSetting();
  }

  /**
   * 解析餘額上下限通知設定值
   * @param settings 設定值陣列
   */
  analyzeBalanceLimitSetting() {
    this.settings = [];
    console.log('[餘額上下限通知列表頁] analyzeBalanceLimitSetting', this.editPara);
    this.PRODUCT_ID = this.editPara.key;
    this.editPara.UDFList.forEach(udf=> {
        if(udf.Status == "1"){
          this.settings.push(udf)
        }
    });
    
    console.log('[餘額上下限通知列表頁] analyzeBalanceLimitSetting accounts', this.accounts);
  }




  /**
   * [前端事件綁定][母頁回調觸發] 點擊新增/編輯通知設定按鈕
   * @param account 設定之帳號
   */
  onEditClick(account) {
    console.log('[餘額上下限通知列表頁] onEditClick account =', account);
    let setting = account;
    let callbackData = {
      "item": this.PRODUCT_ID,
      "data": setting
    };
    this.editedData.emit(callbackData);
  }
}
