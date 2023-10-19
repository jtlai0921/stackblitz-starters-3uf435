import { Component, OnInit, Input } from '@angular/core';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { IDGateService } from '../../../shared/service/cordova/IdGete.service';
import { FundXferModService } from '../../../shared/service/customize/fundXferMod.service';
import { PatternLockService } from '../../../shared/service/global/patternLock.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { DoLoginService } from '../../../shared/service/customize/doLogin.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { HexadecimalService } from '../../../shared/service/global/hexadecimal.service';

@Component({
  selector: 'app-reservationQueryCycleDetails',
  templateUrl: './reservationQueryCycleDetails.component.html',
  styleUrls: ['./reservationQueryCycleDetails.component.css']
})

export class ReservationQueryCycleDetailsComponent implements OnInit {

  /**
   * 參數設定
   */
  @Input() listData: any; // Selected List Data from Parent
  summaryPage = false;
  singleDetailPage = false;
  cycleDetailPage = true;
  showData = [];
  isChange = false;
  constructor(
    private popup: PopupService,
    private layout: LayoutService,
    private idGate: IDGateService,
    private fundXferModService: FundXferModService,
    private langTransService: LangTransService,
    private patternLockService: PatternLockService,
    private storage: LocalStorageService,
    private doLoginService: DoLoginService,
    private hex: HexadecimalService
  ) {

    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.TRANSFER_DETAIL' // 預約轉帳明細
    });
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    let tempCObj = { 'type': 'done', 'data': [] };
    let tempWObj = { 'type': 'todo', 'data': [] };
    this.listData['PeriodStatus'].forEach(item => {
      switch (item['TxnStatus']) {
        case '0':
        case '1':
        case '2':
        case '3':
          tempWObj['data'].push(item);
          break;
          default:
          tempCObj['data'].push(item);
          break;
      }
    });
    this.showData.push(tempWObj);
    this.showData.push(tempCObj);
  }


  /**
   * [API] Cancel Wire Transfer Reservation 約定轉帳取消
   */
  onCancel(item, index) {
    this.popup.setConfirm({
      content: 'TRANSACTION.DO_CANCEL', // 您將取消此筆預約交易
      checkTxt: 'TRANSACTION.CANCEL_CONFIRM', // 確定取消
      cancelTxt: 'TRANSACTION.KEEP', // 暫時保留
      event: () => {
        this.doVerify(item, index);
      }
    });
  }

  doVerify(item, index) {
    this.patternLockService.checkQuickLogin((type) => {
      this.quickOrder(type, item, index);
    }, PatternLockService.order, () => {
      this.setInput(item, index);
    }).then((res) => {
      if (!res) {
        this.setInput(item, index);
      }
    });

  }
  setInput(item, index) {
    this.popup.setInput({
      title: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_TITLE"),
      placeholder: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_HINT"),
      default: "",
      checkTxt: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_CONFIRM"),
      cancelTxt: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_CANCEL"),
      inPassword: true,
      event: (value) => {
        this.doCancel(value, "0", item, index);
      }
    });
  }
  quickOrder(type, item, index) {
    this.popup.setInput({
      isOpen: false
    });
    this.idGate.generateSignatureOTP().then(
      (res) => {
        console.log("快登密碼", res);
        console.log("執行登入");
        this.doCancel(res, type, item, index);
      }
      , (err) => {
        this.popup.setConfirm({
          content: "BTN.ERROR", // 快登失敗
          event: () => { }
        });
      }
    )
  }
  doCancel(pin, type, item, index) {
    this.popup.setLoading(true);
    this.popup.setInput({
      isOpen: false
    });
    let req = {};
    let tempArray = [];
    tempArray.push(item['Seq']);
    let signatureStr = this.listData['TxnNo'].trim();
    tempArray.forEach(str => {
      signatureStr += '|' + str;
    });

    req['PeriodIdList'] = tempArray;
    req['BatchId'] = this.listData['TxnNo'];
    req['UserPIN'] = pin;
    req['AuthType'] = type;

    console.log("[Signature] original-string =", signatureStr);
    let hexStr = this.hex.utf8ToHex(signatureStr).toUpperCase();
    console.log("[Signature] hex-string =", hexStr);

    this.idGate.genSignatureOTP(hexStr).then((res) => {
      console.log("[Signature] SignatureOTP =", res);
      req['Signature'] = res.toString();
      this.fundXferModService.getFundXferMod(req).then(
        (fundXferMod_res) => {
          console.log('[Transfer Reservation cycleDetail] getFundXferMod success', fundXferMod_res);
          var resultList = fundXferMod_res['PeriodResultList'];
          var errResult = 0;
          if (resultList != undefined) {
            resultList.forEach(result => {
              if (result["Result"] != 4001) {
                errResult += 1
              }else{
                 // 快登錯誤次數歸0
                 this.storage.set("QuickLoginErrorKey",0)
              }
            });
          }
          if (errResult > 0) {
            this.popup.setConfirm({
              content: 'TRANSACTION.CANCEL_FAIL', // 取消失敗
              event: () => {
              }
            });
          } else {
            this.popup.setConfirm({
              content: 'TRANSACTION.CANCEL_SUCCESS', // 取消成功
              event: () => {
                var item = this.showData[0]['data'][index];
                this.showData[1]['data'].splice(this.showData[1]['data'].length, 0, item);
                this.showData[0]['data'].splice(index, 1);
              }
            });
          }
          this.popup.setLoading(false);
        },
        (fundXferMod_err) => {
          this.popup.setLoading(false);
        }
      );
    })
  }

}
