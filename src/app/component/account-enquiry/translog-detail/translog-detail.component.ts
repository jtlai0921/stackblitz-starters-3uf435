import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { PopupService } from '../../../shared/service/global/popup.service';

@Component({
  selector: 'app-translog-detail',
  templateUrl: './translog-detail.component.html',
  styleUrls: ['./translog-detail.component.css']
})
export class TranslogDetailComponent implements OnInit {

  @Input() txnRec: any;

  public _txnRec;
  public UserName;
  public TxnDate;
  public Country;
  public CustomerId;
  public CustomerName;
  public PayerAcct;

  //交易序號
  public TxnNo;


  public TxnStatus;
  public TxnCode;

  public DebitCur;
  public DebitAmt;

  public PayeeAcct;
  public PayeeName;

  public CreditBankId;
  public CreditBranchCode;

  public Last = "";
  public First = "";

  public DateFrom;
  public DateFromText;
  public DateTo;
  public DateToText;

  public Memo;

  public Counter = 0;

  constructor(
    private popup: PopupService,
    private dateTime: DateTimeService,
    private langTransService: LangTransService,
  ) {
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
  }

  ngOnInit() {
    this.initTxnDetail();
  }

  private initTxnDetail() {
    // Check txn record
    if (this.txnRec == null) {
      return;
    }

    // Check first txn detail
    if (this.txnRec.TxnDetList == null || this.txnRec.TxnDetList.length == 0) {
      return;
    }

    const txnDet = this.txnRec.TxnDetList[0];
    if (txnDet == null) {
      return;
    }

    // User name
    this.UserName = "(" + this.txnRec.Country + ")" + this.txnRec.CustomerId + this.txnRec.CustomerName;

    //Txn Status
    this.TxnStatus = txnDet.TxnStatus;

    // Txn date
    var txnDateString = txnDet.TxnDate;

    var txnDateValue = new Date(txnDateString);

    if (this.txnRec.TxnCode == "PDT") {
      var PeriodInfo = txnDet.PeriodInfo;
      var from = PeriodInfo.DateFrom.substring(0, 4) + "/" + PeriodInfo.DateFrom.substring(4, 6) + "/" + PeriodInfo.DateFrom.substring(6, 8)
      var to = PeriodInfo.DateTo.substring(0, 4) + "/" + PeriodInfo.DateTo.substring(4, 6) + "/" + PeriodInfo.DateTo.substring(6, 8)
      this.DateFrom = new Date(from);
      this.DateTo = new Date(to);

      this.TxnDate = this.TxnDateCounter();
      this.DateFromText = this.dateTime.datetimeFormat(this.DateFrom.getTime(), "yyyy/MM/dd");
      this.DateToText = this.dateTime.datetimeFormat(this.DateTo.getTime(), "yyyy/MM/dd");
      if(this.Counter == 0){
        this.Last = txnDet.PeriodStatus[txnDet.PeriodStatus.length -1].TxnDate;
        this.First = txnDet.PeriodStatus[0].TxnDate;
      }else{
        this.Last = this.lastDate();
        this.Last = this.Last ? this.Last : ""
        this.First = this.firstDate();
        this.First = this.First ? this.First : ""
      }
      
    } else {
      this.TxnDate = this.dateTime.datetimeFormat(txnDateValue.getTime(), "yyyy/MM/dd");
    }
    // Other

    this.TxnNo = this.txnRec.TxnNo;

    this.TxnCode = this.txnRec.TxnCode;
    this.Country = this.txnRec.Country;
    this.CustomerId = this.txnRec.CustomerId;
    this.CustomerName = this.txnRec.CustomerName;

    this.PayerAcct = txnDet.PayerAcct;
    this.DebitCur = txnDet.DebitCur;
    this.DebitAmt = txnDet.DebitAmt;

    this.PayeeAcct = txnDet.PayeeAcct;
    this.PayeeName = txnDet.PayeeName;

    this.CreditBankId = txnDet.CreditBankId;
    this.CreditBranchCode = txnDet.CreditBranchCode;

    this.Memo = txnDet.Memo ? txnDet.Memo.trim() :"";
    // 關閉Loading畫面
    this.popup.setLoading(false);
  }


  TxnDateCounter() {
    const txnDet = this.txnRec.TxnDetList[0];
    var TransDate = "";
    var PeriodInfo = txnDet.PeriodInfo;
    if (PeriodInfo.PeriodType == 'M') {
      // Monthly
      var counter = 0;
      var isChecked = false;
      var dateCounter = new Date(this.DateFrom.getFullYear(), this.DateFrom.getMonth(), 1);
      while (dateCounter <= this.DateTo) {
        if (dateCounter.getFullYear() == this.DateFrom.getFullYear() &&
          dateCounter.getMonth() == this.DateFrom.getMonth() &&
          this.DateFrom.getDate() > parseInt(PeriodInfo.PeriodValue)) {
          dateCounter = new Date(dateCounter.setMonth(dateCounter.getMonth() + 1));
          continue;
        }
        else if (dateCounter.getFullYear() == this.DateTo.getFullYear() &&
          dateCounter.getMonth() == this.DateTo.getMonth() &&
          this.DateTo.getDate() < parseInt(PeriodInfo.PeriodValue)) {
          dateCounter = new Date(dateCounter.setMonth(dateCounter.getMonth() + 1));
          continue;
        }
        else {
          counter = counter + 1;
        }
        dateCounter = new Date(dateCounter.setMonth(dateCounter.getMonth() + 1));
      }
      this.Counter = counter;
      if(counter == 0){
        counter = txnDet.PeriodStatus.length;
      }
      TransDate = this.langTransService
        .instant("AGREEDACCOUNT.MONTHLY_AMOUNT")
        .replace("[#DATE]", PeriodInfo.PeriodValue)
        .replace("[#COUNT]", counter.toString());
    }
    else if (PeriodInfo.PeriodType == 'W') {
      // Weekly
      var counter = 0;
      var isChecked = false;
      var dateCounter = new Date(this.DateFrom.getFullYear(), this.DateFrom.getMonth(), this.DateFrom.getDate());
      const suffixDate = parseInt(PeriodInfo.PeriodValue) < dateCounter.getDay() ? 7 + parseInt(PeriodInfo.PeriodValue) - dateCounter.getDay() : parseInt(PeriodInfo.PeriodValue) - dateCounter.getDay();
      dateCounter = new Date(dateCounter.setDate(dateCounter.getDate() + suffixDate));
      while (dateCounter <= this.DateTo) {
        if (dateCounter.getFullYear() == this.DateTo.getFullYear() &&
          dateCounter.getMonth() == this.DateTo.getMonth() &&
          dateCounter.getDate() > this.DateTo.getDate()) {
          continue;
        } else {
          counter = counter + 1;
        }
        dateCounter = new Date(dateCounter.setDate(dateCounter.getDate() + 7));
      }

      // Get week string
      var week;
      switch (parseInt(PeriodInfo.PeriodValue)) {
        case 0:
          week = this.langTransService.instant("AGREEDACCOUNT.SUNDAY");
          break;
        case 1:
          week = this.langTransService.instant("AGREEDACCOUNT.MONDAY");
          break;
        case 2:
          week = this.langTransService.instant("AGREEDACCOUNT.TUESDAY");
          break;
        case 3:
          week = this.langTransService.instant("AGREEDACCOUNT.WEDNESDAY");
          break;
        case 4:
          week = this.langTransService.instant("AGREEDACCOUNT.THURSDAY");
          break;
        case 5:
          week = this.langTransService.instant("AGREEDACCOUNT.FRIDAY");
          break;
        case 6:
          week = this.langTransService.instant("AGREEDACCOUNT.SATURDAY");
          break;
      }
      this.Counter = counter;
      if(counter == 0){
        counter = txnDet.PeriodStatus.length;
      }
      TransDate = this.langTransService
        .instant("AGREEDACCOUNT.WEEKLY_AMOUNT")
        .replace("[#WEEK]", week)
        .replace("[#COUNT]", counter.toString());
    }
    return TransDate;
  }

  firstDate() {
    const txnDet = this.txnRec.TxnDetList[0];
    var PeriodInfo = txnDet.PeriodInfo;
    var periodValue = +PeriodInfo.PeriodValue;
    var day = new Date(this.DateFromText);
    if (PeriodInfo.PeriodType == "M") {
      if (this.DateFrom.getDate() > periodValue) {
        day.setDate(1);
        day.setMonth(day.getMonth() + 1);
        var maxDay = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
        if (maxDay < periodValue) {
          day.setMonth(day.getMonth() + 1);
        } else {
          day.setDate(periodValue);
        }
      } else if (this.DateFrom.getDate() < periodValue) {
        var maxDay = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
        if (maxDay < periodValue) {
          day.setDate(1);
          day.setMonth(day.getMonth() + 1);
        } else {
          day.setDate(periodValue);
        }
      }
    } else {
      if (this.DateFrom.getDay() > periodValue) {
        day.setDate(day.getDate() + 7 - this.DateFrom.getDay() + periodValue);
      } else if (this.DateFrom.getDay() < periodValue) {
        day.setDate(day.getDate() - this.DateFrom.getDay() + periodValue);
      }
    }
    return this.dateTime.datetimeFormat(day.getTime(), 'yyyy/MM/dd')
  }
  lastDate() {
    const txnDet = this.txnRec.TxnDetList[0];
    var PeriodInfo = txnDet.PeriodInfo;
    var periodValue = +PeriodInfo.PeriodValue;
    var lastDay = new Date(this.DateToText);
    if (PeriodInfo.PeriodType == "M") {
      if (this.DateTo.getDate() > periodValue) {
        lastDay.setDate(periodValue);
      } else if (this.DateTo.getDate() < periodValue) {
        lastDay.setDate(1);
        lastDay.setMonth(lastDay.getMonth() - 1);
        var maxDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 0).getDate();
        if (maxDay < periodValue) {
          lastDay.setMonth(lastDay.getMonth() + 1);
        } else {
          lastDay.setDate(periodValue);
        }
      }

    } else {
      if (this.DateTo.getDay() > periodValue) {
        lastDay.setDate(lastDay.getDate() - this.DateTo.getDay() + periodValue);
      } else if (this.DateTo.getDay() < periodValue) {
        lastDay.setDate(lastDay.getDate() - 7 - this.DateTo.getDay() + periodValue);
      }
    }
    return this.dateTime.datetimeFormat(lastDay.getTime(), 'yyyy/MM/dd')
  }

  toDate(date) {
    return date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8);
  }

}
