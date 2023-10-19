import { Component,NgZone, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-reservationQuerySingleDetails',
  templateUrl: './reservationQuerySingleDetails.component.html',
  styleUrls: ['./reservationQuerySingleDetails.component.css']
})

export class ReservationQuerySingleDetailsComponent implements OnInit {

  /**
   * 參數設定
   */
  @Input() listData: any; // Selected List Data from Parent
  @Output() onLeftClick: EventEmitter<any> = new EventEmitter<any>();
  summaryPage = false;
  singleDetailPage = true;
  cycleDetailPage = false;

  constructor(
    private popup: PopupService,
    private layout: LayoutService,
    private idGate: IDGateService,
    private fundXferModService: FundXferModService,
    private patternLockService:PatternLockService,
    private langTransService:LangTransService,
    private storage:LocalStorageService,
    private doLoginService:DoLoginService,
    private zone:NgZone,
    private hex: HexadecimalService
  ) {
    
    this.layout.setHeaderStatus({
      status: true,
      title: 'MENU.TRANSFER_DETAIL' // 預約轉帳明細
    });
  }

  ngOnInit() {
  }

  leftEvent() {
    this.cycleDetailPage = false;
    this.singleDetailPage = false;
    this.summaryPage = true;
    let outputObj = {
      'cycleDetailPage': this.cycleDetailPage,
      'singleDetailPage': this.singleDetailPage,
      'summaryPage': this.summaryPage,
      'reload':true
    };   
    this.onLeftClick.emit(outputObj);
    
  }
  checkPayeeIdName(listData){
    return listData.PayeeId != "" &&listData.PayeeId != undefined 
    && listData.PayeeName != "" && listData.PayeeName != undefined;
  }
  /**
   * [API] Cancel Wire Transfer Reservation 約定轉帳取消
   */
  onCancel() {
    this.popup.setConfirm({ 
      content: 'TRANSACTION.DO_CANCEL', // 您將取消此筆預約交易
      checkTxt: 'TRANSACTION.CANCEL_CONFIRM', // 確定取消
      cancelTxt: 'TRANSACTION.KEEP', // 暫時保留
      event: () => {
       this.doVerify();
      }
    }); 
  }

  doVerify() {
    this.patternLockService.checkQuickLogin((type) => {
      this.quickOrder(type);
    }, PatternLockService.order,()=>{
      this.setInput();
    }).then((res)=>{
      if(!res){
        this.setInput();
      }
    });
  }

  setInput(){
    this.popup.setInput({
      title: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_TITLE"),
      placeholder: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_HINT"),
      default: "",
      checkTxt: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_CONFIRM"),
      cancelTxt: this.langTransService.instant("AGREEDACCOUNT.INPUT_PASSWORD_CANCEL"),
      inPassword: true,
      event: (value) => {
        this.doCancel(value,"0");
      }
    });
  }

  quickOrder(type) {
    this.popup.setInput({
      isOpen: false
    });
    this.idGate.generateSignatureOTP().then(
      (res) => {
        console.log("快登密碼", res);
        console.log("執行登入");
        this.doCancel(res, type);
      }
      , (err) => {
        this.popup.setConfirm({
          content: "BTN.ERROR", // 快登失敗
          event: () => { }
        });
      }
    )
  }
  doCancel(pin, type){
    this.zone.run(()=>{
      this.popup.setLoading(true);
    })
    
    let req = {};
    let signatureStr = this.listData['TxnNo'].trim();
    console.log("[Signature] original-string =", signatureStr);
    let hexStr = this.hex.utf8ToHex(signatureStr).toUpperCase();
    console.log("[Signature] hex-string =", hexStr);
    req['BatchId'] = this.listData['TxnNo'];
    req['UserPIN'] = pin;
    req['AuthType'] = type;
    
    this.idGate.genSignatureOTP(hexStr).then(
      (res) => {
        console.log("[Signature] SignatureOTP =", res);
        req['Signature'] = res.toString();
      this.fundXferModService.getFundXferMod(req).then(
        (fundXferMod_res) => {
          console.log('[Transfer Reservation cycleDetail] getFundXferMod success', fundXferMod_res);
          this.zone.run(()=>{
            this.popup.setConfirm({
              content: 'TRANSACTION.CANCEL_SUCCESS', // 取消成功
              event: () => {
                this.leftEvent();
              }
            });
            // 快登錯誤次數歸0
            this.storage.set("QuickLoginErrorKey",0)
            this.popup.setLoading(false);
          })
          
        },
        (fundXferMod_err) => {
          this.zone.run(()=>{
            this.popup.setLoading(false);
          })
        }
      );
    },(err)=>{
      console.log("genSignatureOTP Error",err);
    })
  }
}
