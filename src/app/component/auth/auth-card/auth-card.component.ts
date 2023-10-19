import { Component, OnInit, Input } from '@angular/core';
import { DateTimeService } from '../../../shared/service/global/daettime.service';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.css']
})
export class AuthCardComponent implements OnInit {

  /**
   * 已授權/待授權 標記
   */
  @Input() isAuth: any; // reqData
  /**
   * 已授權之我的授權/其他授權 標記
   * [我的授權]
   *  授權方式：(隱藏)
   *  狀態：藍字
   * [其他授權]
   *  授權方式：(顯示)
   *  狀態：黑字
   */
  @Input() isMyAuth: any; // reqData
  /**
   * 是否顯示開啟明細箭頭按鈕
   */
  @Input() showDetailBtn: any; // reqData
  /**
   * 是否使用授權結果模板
   */
  @Input() isAuthResult: any; // reqData
  /**
   * 授權操作類型
   */
  @Input() action: any;
  /**
  * 是否使用結果頁tag
  */
  @Input() isResultTag: any;
  /**
  * 授權資料
  */
  @Input() data: any; // reqData

  lastAuthRec;  // 最新一筆授權操作紀錄
  authResult;   // 授權結果：授權成功/授權失敗
  datetimeTag;  // 時間標籤：預約/當日/逾期
  templateCard; // 交易卡片模板類型

  constructor(
    private datetime: DateTimeService
  ) { }

  ngOnInit() {
    this.getBatchTxnTemplate();
    this.getDisplayData();
  }

  /**
   * 轉換畫面顯示資訊
   */
  getDisplayData() {
    // 取得最新一筆授權操作紀錄
    // TODO: 確認AuthRecList排序規則
    if (this.data['AuthRecList'] && (length = this.data['AuthRecList'].length) > 0)
      this.lastAuthRec = this.data['AuthRecList'][length - 1];
    else
      this.lastAuthRec = {};

    // 取得時間標籤
    let today = this.datetime.datetimeFormat(Date.now(), "yyyyMMdd");
    if(this.data['nTxnDate']){
      this.data['nTxnDate'].replace("-","");
    }
    if(today < this.data['nTxnDate']){
      // 預約
      this.datetimeTag = "AUTH.TAG_RESERVATION";
    }
    else if(today == this.data['nTxnDate']){
      // 當日
      this.datetimeTag = "AUTH.TAG_TODAY";
    }
    else if(today > this.data['nTxnDate']){
      // 逾期
      this.datetimeTag = "AUTH.TAG_OVERDUE";
    }

    // 取得授權結果訊息
    if (this.action == "auth")
      this.authResult = this.data.authResult ? 'AUTH.AUTH_SUCCESS' : 'AUTH.AUTH_ERROR';
    else if (this.action == "cancel")
      this.authResult = this.data.authResult ? 'AUTH.CANCEL_SUCCESS' : 'AUTH.CANCEL_ERROR';
    else
     this.authResult = "";
  }

  /**
   * 選定整批交易卡片模板類型
   */
  getBatchTxnTemplate() {
    /**
     * 整批交易
     *   扣多入多 Batch_ManyToMany
     *   扣多入一 Batch_ManyToOne
     *   扣一入多 Batch_OneToMany
     */
    if (this.data['nTxnType'] == "0") {
      let bulkfileType = this.data['BULKFILETYPE'];
      if (bulkfileType == "F09" || 
          bulkfileType == "F10"
      ) {
        // 扣多入多
        this.templateCard = "Batch_ManyToMany";
      } 
      else if (bulkfileType == "US1" || 
               bulkfileType == "US3" || 
               bulkfileType == "YA1" || 
               (bulkfileType == "YA2" && this.data['TRANSACTIONTYPE'] == "SD")
      ) {
        // 扣多入一
        this.templateCard = "Batch_ManyToOne";
      } 
      else {
        // 扣一入多
        this.templateCard = "Batch_OneToMany";
      }
    }
  }
}


