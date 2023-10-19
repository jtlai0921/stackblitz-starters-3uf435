/**
 * 放款明細頁
 */
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LoanAcctDetailsInqService } from '../../../shared/service/customize/loanAcctDetailsInq.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.css']
})
export class LoanDetailComponent implements OnInit, AfterViewInit {

  @Output()
  backToLoanSum: EventEmitter<any> = new EventEmitter();

  /** 放款明細查詢參數*/
  @Input() loanSummary: any;
  /** 放款明細資料*/ 
  loanDetail = {};
  /** 幣別*/
  currency: string;
  /** 帳戶國別*/
  country: string;
  /** 帳戶統編*/
  customerId: string;
  /***/
  customerName: string;
  /** D:DBO ; O:OBU */
  obuDbu: string;
  /**帳號*/
  acctNo: string;
  /**資料來源*/
  hostType: string;
  /**幣別*/
  public AcctCur = '';
  /**帳號*/
  public AcctNo = '';
  /**帳號分行*/
  public AcctBranchName = '';
  /**帳號狀態*/
  public AcctStatus = '';
  /**產品名稱*/
  public ProdName =  '';
  /**利率*/
  public ActlIntRate = '';
  /**利率別*/
  public IntType = '';
  /**動撥日*/
  public DisburseDt ='';
  /**到期日*/
  public MtrtyDt = '';
  /**授扣還款帳號*/
  public CreditStlAcctNum = '' ;
  /**授扣還款帳號幣別*/
  public CreditStlAcctNumCur = '';
  /**動撥金額*/
  public Amt_1 =0;
  /**授信額度*/
  public Amt_2 =0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layout: LayoutService,
    private loanAcctDetails: LoanAcctDetailsInqService,
    private popup: PopupService,
    private langTrans: LangTransService
  ) {
    this.layout.setHeaderStatus({
      // 放款明細
      title: "LOANDETAIL.TITLE",
      status: true,
      rightIcon: ' ',
      backEvent: () => {
        // 設置標題 帳戶查詢
        this.layout.setHeaderStatus({
        title: "MENU.ACT_QUERY"
        })
        this.backToLoanSum.emit('list');
        
      }
    });
    this.layout.checkFooterUpdate(this.router.url.substr(0,this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    /**註冊手勢事件 下滑Reload*/
    this.popup.setGestures({
      /**註冊Reload事件*/
      'reload': () => {
        /**兩秒後釋放掉Reload*/
        setTimeout(() => {
          this.ngOnInit();

          /**關閉Reload Method*/
          this.popup.setGestures({
            'reload_close': true
          });
        }, 2000);
      }
    });
  }

  /**
   * 目的：初始化Component或Directive 
   * 
   * 時機：在首次ngOnChanges完成之後觸發，只會發生一次
   */
  ngOnInit() {
    this.popup.setLoading(true);
    this.currency = this.loanSummary["Currency"];
    this.country = this.loanSummary["Country"];
    this.customerId = this.loanSummary["CustomerId"];
    this.customerName = this.loanSummary["CustomerName"];
    /** TODO: 待調整*/
    this.obuDbu = "O";
    this.acctNo = this.loanSummary["AcctNo"];
    this.hostType = this.loanSummary['HostType']
    this.getLoanDetail();
  }


  // 去空白
  trimempty(str) {
    str = str.replace(/(\r|\n|\r\n|(^\s*)|(\s*$)|\t|[　])/g, '');
    return str;
  }

  getLoanDetail() {
    this.loanAcctDetails.LoanAcctDetailsInq(this.currency, this.country, this.customerId, this.obuDbu, this.acctNo, this.hostType).then(
      (res) => {
        console.log('loanAcctDetailsInq success', res);
        this.loanDetail = res;
        /** 待缺欄位*/
        this.loanDetail['Amt_1'] = ""; //leo
        this.loanDetail['Amt_2'] = "";

      //幣別
      this.AcctCur = this.loanDetail['AcctCur'] ? this.loanDetail['AcctCur'] : this.AcctCur;
      /**帳號*/
      this.AcctNo = this.loanDetail['AcctNo'] ? this.trimempty(this.loanDetail['AcctNo']) : this.AcctNo;
      /**帳號分行*/
      this.AcctBranchName = this.loanDetail['AcctBranchName'] ? this.trimempty(this.loanDetail['AcctBranchName']) : this.AcctBranchName;
      /**帳號狀態*/
      this.AcctStatus = this.loanDetail['AcctStatus'] ? this.loanDetail['AcctStatus'] : this.AcctStatus;
      /**產品名稱*/
      this.ProdName = this.loanDetail['ProdName'] ? this.loanDetail['ProdName'] : this.ProdName;
      /**利率*/
      this.ActlIntRate = this.loanDetail['ActlIntRate'] ? this.loanDetail['ActlIntRate'] : this.ActlIntRate;
      /**利率別*/
      this.IntType = this.loanDetail['IntType'] ? this.loanDetail['IntType'] : this.IntType;
      /**動撥日*/
      this.DisburseDt = this.loanDetail['DisburseDt'] ? this.loanDetail['DisburseDt'] : this.DisburseDt;
      /**到期日*/
      this.MtrtyDt = this.loanDetail['MtrtyDt'] ? this.loanDetail['MtrtyDt'] : this.MtrtyDt;
      /**授扣還款帳號*/
      this.CreditStlAcctNum = this.loanDetail['CreditStlAcctNum'] ? this.loanDetail['CreditStlAcctNum'] : this.CreditStlAcctNum;
      /**授扣還款帳號幣別*/
      this.CreditStlAcctNumCur = this.loanDetail['CreditStlAcctNumCur'] ? this.loanDetail['CreditStlAcctNumCur'] : this.CreditStlAcctNumCur;
      /**動撥金額*/
      this.Amt_1 =  this.loanDetail['OutstandingPrincipalBalance'] ? this.loanDetail['OutstandingPrincipalBalance'] : this.Amt_1;
      /**授信額度  先放=>已用融資額度(核准額度)*/
      this.Amt_2 = this.loanDetail['AmtFincg'] ? this.loanDetail['AmtFincg'] : this.Amt_2;

        // 關閉Loading畫面
        this.popup.setLoading(false);
      },
      (err) => {
        // 關閉Loading畫面
        this.popup.setLoading(false);
      }
    );
  }
}
