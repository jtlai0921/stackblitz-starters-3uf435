import { Component, OnInit, NgZone } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { UserParaInqService } from '../../shared/service/customize/userParaInq.service';
import { UserParaModService } from '../../shared/service/customize/userParaMod.service';
import { NotifyListInqService } from '../../shared/service/customize/notifyListInq.service';
import { NotifyListModService } from '../../shared/service/customize/notifyListMod.service';

import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { KEY_USER_PARA } from '../../../assets/configuration/userParaKey';

@Component({
  selector: 'app-personal_setting',
  templateUrl: './personal_setting.component.html',
  styleUrls: ['./personal_setting.component.css']
})
export class PersonalSettingComponent implements OnInit {

  /**
   * 參數設定：0=關閉；1=開啟
   * [訊息通知代碼表]
   * MS01	存款餘額上下限通知  
      AcctNo：帳號
      AcctCur：帳號幣別
      MaxAmt：金額上限
      MinAmt：金額下限
   * MS02	扣帳交易即時通知
      AcctNo：帳號
      AcctCur：帳號幣別
      Amount：金額
   * MS03	入帳交易即時通知
      AcctNo：帳號
      AcctCur：帳號幣別
      Amount：金額
   * MS04	支存帳戶存款不足通知
      AcctNo：帳號
      AcctCur：帳號幣別
   * MS05	託收票退票通知
      AcctNo：帳號
      AcctCur：帳號幣別
   * CR01	匯入匯款通知
   * CR03	匯出匯款通知
   * OT01	交易結果通知
   * AP01	預約交易前一日通知
   * AP02	登入結果通知
   * AP03	帳密登入通知
   * AP04	憑證到期通知
   * AP05	APP更新通知
   * AP06	往來帳戶異常交易
   * AP07	大額交易通知
   * AP08	主管交易逾期授權/放行統計
   * AP09	異常登入通知
   * AP10	匯率通知與設定
   * AP11	安控通知
   * AP12	匯率到價通知
   * AP13	待授權通知
   * AP14	授權完成通知
   * AP15	預約到期前一日未完成授權通知
   * AP16	止付通知
   **/
  // 中台ValueObject
  //一階段僅使用  AP16 AP01 OT01
  notificationPara = {
    //存款餘額上下限通知
    "MS01": { value: '0', UDFList: [], key: "MS01" },//{ AcctNo: "", AcctCur: "", MaxAmt: "", MinAmt: "" }
    //扣帳交易即時通知
    "MS02": { value: '0', UDFList: [], key: "MS02" },//{ AcctNo: "", AcctCur: "", Amount: "" }
    //入帳交易即時通知
    "MS03": { value: '0', UDFList: [], key: "MS03" },//{ AcctNo: "", AcctCur: "", Amount: "" }
    //支存帳戶存款不足通知
    "MS04": { value: '0', UDFList: [], key: "MS04" },//{ AcctNo: "", AcctCur: "" }
    //託收票退票通知
    "MS05": { value: '0', UDFList: [], key: "MS05" },//{ AcctNo: "", AcctCur: "" }
    "CR01": { value: '0' },	//	匯入匯款通知
    "CR03": { value: '0' },	//匯出匯款通知
    "OT01": { value: '0' },	//	交易結果通知
    "AP01": { value: '0' },	//	預約交易前一日通知
    "AP02": { value: '0' },	//	登入結果通知
    "AP03": { value: '0' },	//	帳密登入通知
    "AP04": { value: '0' },	//	憑證到期通知
    "AP05": { value: '0' },	//	APP更新通知
    "AP06": { value: '0' },	//	往來帳戶異常交易
    "AP07": { value: '0' },	//	大額交易通知
    "AP08": { value: '0' },	//  主管交易逾期授權/放行統計
    "AP09": { value: '0' },	//  異常登入通知
    "AP10": { value: '0' },	//  匯率通知與設定
    "AP11": { value: '0' },	//  安控通知
    "AP12": { value: '0' },	//  匯率到價通知
    "AP13": { value: '0' },	//  待授權通知
    "AP14": { value: '0' },	//  授權完成通知
    "AP15": { value: '0' },	//  預約到期前一日未完成授權通知
    "AP16": { value: '0' },	//  止付通知
  }

  public pageType;
  public editedData;
  public editPara;
  public accountInfo;

  private title = "USERSETTING.TITLE";
  private idUser;

  constructor(
    private layout: LayoutService,
    private storage: LocalStorageService,
    private popup: PopupService,
    private langTrans: LangTransService,
    private notifyListInq: NotifyListInqService,
    private notifyListMod: NotifyListModService,
  ) {

    var isLogin = this.storage.get("isLogin");
    if (!isLogin) {
      //註冊登入後要返回的網址
      this.layout.RegistLoginRedirect();
      //返回登入頁
      this.layout.redirectLogin();
    } else {

      this.layout.setHeaderStatus({
        status: true,
        title: this.title
      });
    }
    this.layout.checkFooterUpdate("/user-setting");
  }

  ngAfterViewInit() {
    //this.pageType = "balanceLimitPage";
    //balanceLimitEditPage
  }

  ngOnInit() {
    // 取得使用者識別代碼
    this.idUser = this.storage.get("idUser");
    // 取得使用者通知設定
    this.getNotificationSetting();
  }

  /**
   * [API] 用戶參數查詢：取得中台使用者通知設定
   */
  getNotificationSetting() {
    this.popup.setLoading(true);
    // 使用模糊查詢一次性取回所有使用者通知設定
    this.notifyListInq.notifyListInq().then((res) => {
      console.log('[通知設定頁][API] userParaInq success', res);
      this.notificationPara["MS01"]["UDFList"] = [];
      this.notificationPara["MS02"]["UDFList"] = [];
      this.notificationPara["MS03"]["UDFList"] = [];
      this.notificationPara["MS04"]["UDFList"] = [];
      this.notificationPara["MS05"]["UDFList"] = [];
      this.analyzeNotificationSetting(res);
      this.popup.setLoading(false);
    }, (err) => {
      this.popup.setLoading(false);
    })
  }

  /**
   * 解析各通知項目設定值
   * @param settings 設定值陣列
   */
  analyzeNotificationSetting(settings) {
    settings.forEach(setting => {
      if (!this.notificationPara[setting.ProductId]) {
        return;
      }
      this.notificationPara[setting.ProductId]["value"] = setting.Status;
      if (setting.UDFList != undefined) {
        setting.UDFList.forEach(element => {
          element.Status = setting.Status;
        });
        this.notificationPara[setting.ProductId]["UDFList"] = setting.UDFList.concat(this.notificationPara[setting.ProductId]["UDFList"]);
      }
    });
    console.log('[通知設定頁] analyzeNotificationSetting notificationPara', this.notificationPara);
  }

  /**
   * [前端事件綁定] 點擊通知項目設定開啟/關閉
   * 2018/10/26 僅提供直接無子項目之通知設定使用
   * @param item 通知設定項目
   */
  onItemClick(item) {
    console.log('[通知設定頁] onItemClick item', item);
    this.popup.setLoading(true);
    this.notificationPara[item]['value'] = (this.notificationPara[item]['value'] == '0') ? "1" : "0";
    var productParaInfo = {
      ProductId: item,
      UDFList: [],
      Status: this.notificationPara[item]['value'],
      AppId: "CCMP",
    }
    const success = (res) => {
      console.log('[通知設定頁][API] updateUserPara success', res);
      var index = res["NotifyResultList"].findIndex(sub_item => { return sub_item.ProductId == item })
      if (index == -1 || res["NotifyResultList"][index].Result != 4001) {
        let errMsg = this.langTrans.instant('NOTIFICATIONSETTING.ERR_MODIFY_FAILED');
        this.notificationPara[item]['value'] = (this.notificationPara[item]['value'] == '0') ? "1" : "0";
        this.popup.setConfirm({ content: errMsg });
      }
      this.popup.setLoading(false);
    }
    const error = (err) => {
      console.log('[通知設定頁][API] updateUserPara error', err);
      // 設定值儲存失敗，設定狀態倒回
      this.notificationPara[item]['value'] = (this.notificationPara[item]['value'] == '0') ? "1" : "0";
      this.popup.setLoading(false);
    }
    this.notifyListMod.notifyModInq([productParaInfo]).then(success, error);
  }




  /**
   * [前端事件綁定] 點擊通知項目子選單已設定按鈕
   * @param item 通知設定項目
   */
  onSubSettingsClick(item) {
    console.log('[通知設定頁] onSubSettingsClick item', item);
    if(this.notificationPara[item]["UDFList"].length == 0){
      this.popup.setConfirm({content:"NOTIFICATIONSETTING.No_Account"})
      return;
    }
    switch (item) {
      case "MS01":
        this.pageType = "balanceLimitPage"
        this.editPara = this.notificationPara[item];
        this.editPara.key = item;
        this.backNoticeSettingsPage();
        break;
      case "MS02":
      case "MS03":
      case "MS04":
      case "MS05":
        this.pageType = "amountLimitPage"
        this.editPara = this.notificationPara[item];
        this.editPara.key = item;
        this.backNoticeSettingsPage();
        break;
    }
  }

  /**
   * 設定上一頁事件：回到通知設定頁
   */
  backNoticeSettingsPage() {
    this.layout.setHeaderStatus({
      backEvent: () => {
        this.pageType = 'list';
        this.layout.setHeaderStatus({ title: this.title });
        this.popup.setLoading(true);
        this.getNotificationSetting();
      }
    });
  }

  /**
   * [子頁回調事件] 子通知設定列表頁點擊新增/編輯按鈕：間接開啟對應編輯頁
   * @param event 事件參數
   */
  onEditClickCallBack(event) {
    console.log('[通知設定頁][callback] onEditClickCallBack', event);
    // 取得欲設定之通知類型
    let item = event['item'];
    console.log('[通知設定頁][callback] onEditClickCallBack item', item);
    // 取得既有之設定內容，新增時則無
    this.editedData = event['data'];
    this.accountInfo = this.notificationPara[item];
    if (item == "MS01") {
      this.pageType = "balanceLimitEditPage";
    } else {
      this.pageType = "amountLimitEditPage";
    }
  }
}
