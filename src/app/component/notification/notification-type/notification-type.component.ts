import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { LangTransModule } from '../../../shared/pipe/langTransPipe/lang-trans.module';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { Router } from '@angular/router';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { DateTimePipe } from '../../../shared/pipe/publicPipe/datetime.pipe';
import { CurrencyPipe } from '../../../shared/pipe/publicPipe/currency.pipe';
import { DateTimeService } from '../../../shared/service/global/daettime.service';


@Component({
    selector: 'app-notification-type',
    templateUrl: './notification-type.component.html',
    styleUrls: ['./notification-type.component.css']
})
export class NotificationTypeComponent implements OnInit, AfterViewInit {

    @Input() type: any; // reqData
    @Input() typeData: any; // reqData

    @Output() addReaded: EventEmitter<any> = new EventEmitter();

    public unreadData; // 未讀通知訊息陣列
    public readedData; // 已讀通知訊息陣列
    // 搜尋BAR搜尋條件
    public filterArray = ["TxnDate","StopCur","StopTotalAmt","StopRecord","AcctNo","CustomerId","CustomerName","DebitCur","DebitTotalAmt","CreditCur","CreditTotalAmt","TxnNo","section","TxnRecord","Remarks"];

    constructor(
        private popup: PopupService,
        private lang: LangTransService,
        private layout: LayoutService,
        private router: Router,
        private storage: LocalStorageService,
        private functionList:FunctionListService,
        private dateformat: DateTimeService,
        private DateTimePipe : DateTimePipe,
        private CurrencyPipe : CurrencyPipe
    ) {
        this.layout.setHeaderStatus({
            status: true,
            title: 'MENU.NOTICE', // 通知訊息
            rightIcon: 'noticeSetting'
        });

    }

    ngOnInit() {
        console.log('[通知類別訊息頁][req] type', this.type);
        console.log('[通知類別訊息頁][req] typeData', this.typeData);

        // 解析通知訊息數據
        this.analyzeNotificationData();
        // Parse content
        this.parseContent();
        // 更新已讀戳記
        this.addReadedTag();
    }

    ngAfterViewInit() {
    	//畫面優先捲至未讀訊息
        this.scrollToUnread();
    }
    //formate日期
    transDate(date){
        return this.DateTimePipe.transform(date, 'yyyy/MM/dd')
    }
    //formate金額三位一逗號
    transCurrency(Amt){
        return this.CurrencyPipe.transform(Amt,-1)
    }

    search_result(value){
        // 搜尋結果解析通知訊息顯示畫面
        this.analyzeNotificationData(value);
    }

    /**
     * 解析通知訊息未讀/已讀
     */
    analyzeNotificationData(value?) {
        let temp = [];
        if(value){
            temp = value
        }else{
            temp = this.typeData
        }

        console.log('[通知類別訊息頁] analyzeNotificationData original length =', this.typeData.length);
        this.readedData = [];
        this.unreadData = [];
        temp.forEach((item) =>{
            if(item.readed == true){
                // 已讀通知訊息
                this.readedData.push(item);
            }else{
                // 未讀通知訊息
                this.unreadData.push(item);
            }
        })

        var isSetToday = false;
        
        for(var i = 0;i<this.readedData.length;i++){
            if(isSetToday){
                i = this.readedData.length
                break;
            }
            var data = this.readedData[i];
            var NotifyTime =  this.transDate(data.NotifyTime)
            var today = this.dateformat.datetimeFormat(new Date().getTime(), 'yyyy/MM/dd');
            if(NotifyTime == today){
                this.readedData.splice(i,0,{today:true});
                isSetToday = true;
            }
        }
        for(var i = 0;i<this.unreadData.length;i++){
            if(isSetToday){
                i = this.unreadData.length
                break;
            }
            var data = this.unreadData[i];
            var NotifyTime =  this.transDate(data.NotifyTime)
            var today = this.dateformat.datetimeFormat(new Date().getTime(), 'yyyy/MM/dd');
            if(NotifyTime == today){
                this.unreadData.splice(i,0,{today:true});
                isSetToday = true;
            }
        }
        

        console.log('[通知類別訊息頁] analyzeNotificationData readed length =', this.readedData.length);
        console.log('[通知類別訊息頁] analyzeNotificationData unread length =', this.unreadData.length);
    }

    /**
     * Parse notification content JSON
     */
    parseContent() {
        this.typeData.forEach(element => {
            // Init content data
            var content = JSON.parse(element.Content);
            var contentSet = [];
            var linkSet = [];
            var buttonSet = [];
            
            
            // Update content by type
            if (this.type == '1') {
                // 增加搜尋bar欲搜尋內容
                content.section = this.lang.instant("NOTIFICATION.ALREADY_STOP");
                element.Content = JSON.stringify(content);
                // 1: 止付通知
                var section1 = "";
                section1 += this.lang.instant("NOTIFICATION.ALREADY_STOP") +" "+ (content["TxnDate"] ? this.transDate(content["TxnDate"]) : "")+ "\n\n";
                section1 += this.lang.instant("NOTIFICATION.STOP_TOTAL_AMT") + (content["StopCur"] ? content["StopCur"] : "") +" "+ (content["StopTotalAmt"] ? this.transCurrency(content["StopTotalAmt"]) : "") + "\n";
                section1 += this.lang.instant("NOTIFICATION.STOP_RECORD") + (content["StopRecord"] ? content["StopRecord"] : "")+ "\n";
                contentSet.push({ content: section1 });

                var section2 = "";
                section2 += this.lang.instant("NOTIFICATION.TXN_DATE") + (content["TxnDate"] ? this.transDate(content["TxnDate"]) : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.ACCT_NO") + (content["AcctNo"] ? content["AcctNo"] : "") + "\n";
                if(content["CustomerId"] || content["CustomerName"]){
                    section2 += "(" + (content["CustomerId"] ? content["CustomerId"] : "")+ (content["CustomerName"] ? content["CustomerName"] : "") + ")" + "\n";
                }
                section2 += this.lang.instant("NOTIFICATION.DEBIT_TOTAL_AMT") +" "+ (content["DebitCur"] ? content["DebitCur"] : "") +" "+ (content["DebitTotalAmt"] ? this.transCurrency(content["DebitTotalAmt"]) : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.CREDIT_TOTAL_AMT") +" "+ (content["CreditCur"] ? content["CreditCur"] : "") +" "+ (content["CreditTotalAmt"] ? this.transCurrency(content["CreditTotalAmt"]) : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.TXN_RECORD") + (content["TxnRecord"] ? content["TxnRecord"] : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.TXN_NO") + (content["TxnNo"] ? content["TxnNo"] : "") + "\n";
                contentSet.push({ content: section2 });

                contentSet.push({
                    Title: ">> "+this.lang.instant("NOTIFICATION.DETAIL"),
                    OnClick: () => {
                        this.checkDetail();
                    }
                });
            }
            else if (this.type == '2') {
                // 增加搜尋bar欲搜尋內容
                content.section = this.lang.instant("NOTIFICATION.TOMORROW_EXECUTE") + this.lang.instant("NOTIFICATION.TXNTYPE_" + (content["TxnType"] ? content["TxnType"] : "")) + this.lang.instant("NOTIFICATION.TRANSACTION");
                element.Content = JSON.stringify(content);
                // 2: 預約前一日付款通知
                var section1 = "";
                section1 += this.lang.instant("NOTIFICATION.TOMORROW_EXECUTE") + this.lang.instant("NOTIFICATION.TXNTYPE_" + (content["TxnType"] ? content["TxnType"] : "")) + this.lang.instant("NOTIFICATION.TRANSACTION") + "\n\n";
                section1 += this.lang.instant("NOTIFICATION.DEBIT_TOTAL_AMT") + (content["DebitCur"] ? content["DebitCur"] : "") +" "+ (content["DebitTotalAmt"] ? this.transCurrency(content["DebitTotalAmt"]) : "") + "\n";
                section1 += this.lang.instant("NOTIFICATION.CREDIT_TOTAL_AMT") + (content["CreditCur"] ? content["CreditCur"] : "") +" "+ (content["CreditTotalAmt"] ? this.transCurrency(content["CreditTotalAmt"]) : "")+ "\n";
                contentSet.push({ content: section1 });

                var section2 = "";
                section2 += this.lang.instant("NOTIFICATION.TXN_DATE") + (content["TxnDate"] ? this.transDate(content["TxnDate"]) : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.ACCT_NO") + (content["AcctNo"] ? content["AcctNo"] : "") + "\n";
                if(content["CustomerId"] || content["CustomerName"]){
                    section2 += "(" + (content["CustomerId"] ? content["CustomerId"] : "") + (content["CustomerName"] ? content["CustomerName"] : "")+ ")" + "\n";
                }
                section2 += this.lang.instant("NOTIFICATION.TXN_RECORD") + (content["TxnRecord"] ? content["TxnRecord"] : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.TXN_NO") + (content["TxnNo"] ? content["TxnNo"] : "") + "\n";
                contentSet.push({ content: section2 });

                contentSet.push({
                    Title: ">> "+this.lang.instant("NOTIFICATION.DETAIL"),
                    OnClick: () => {
                        this.checkDetail();
                    }
                });

                buttonSet.push({
                    Title: this.lang.instant("NOTIFICATION.BTN_ACCTSUMMARY"),
                    OnClick: () => {
                        this.layout.setHeaderStatus({
                            backEventStack : []
                        })
                        this.popup.setLoading(true);
                        this.router.navigate(['account_enquiry'], { queryParams: { from: 'notification', type : "depositSumPage", company : content["AcctNo"], currency : content["DebitCur"]}});
                    }
                });
            }
            else if (this.type == '3') {
                // 增加搜尋bar欲搜尋內容
                content.section = this.lang.instant("NOTIFICATION.TXNTYPE_" + (content["TxnType"] ? content["TxnType"] : "")) + (content["Result"] == "0000" ? " " + this.lang.instant("NOTIFICATION.RESULT_SUCCESS") : " " + this.lang.instant("NOTIFICATION.RESULT_FAILED"));
                element.Content = JSON.stringify(content);
                // 3: 交易結果通知
                var section1 = "";
                section1 += this.lang.instant("NOTIFICATION.TXNTYPE_" + (content["TxnType"] ? content["TxnType"] : "")) + (content["Result"] == "0000" ? " " + this.lang.instant("NOTIFICATION.RESULT_SUCCESS") : " " + this.lang.instant("NOTIFICATION.RESULT_FAILED")) + "\n\n";
                section1 += this.lang.instant("NOTIFICATION.DEBIT_TOTAL_AMT") + (content["DebitCur"] ? content["DebitCur"] : "") +" "+ (content["DebitTotalAmt"] ? this.transCurrency(content["DebitTotalAmt"]) : "") + "\n";
                contentSet.push({ content: section1 });

                var section2 = "";
                section2 += this.lang.instant("NOTIFICATION.TXN_DATE") + (content["TxnDate"] ? this.transDate(content["TxnDate"]) : "") + "\n";
                section2 += this.lang.instant("NOTIFICATION.ACCT_NO") + (content["AcctNo"] ? content["AcctNo"] : "")+ "\n";
                if(content["CustomerId"] || content["CustomerName"]){
                    section2 += "(" + (content["CustomerId"] ? content["CustomerId"] : "") + (content["CustomerName"] ? content["CustomerName"] : "")+ ")" + "\n";
                }
                section2 += this.lang.instant("NOTIFICATION.TXN_NO") + (content["TxnNo"] ? content["TxnNo"] : "")+ "\n";
                section2 += this.lang.instant("NOTIFICATION.REMARKS") + (content["Remarks"] ? content["Remarks"] : "") + "\n";
                contentSet.push({ content: section2 });
                contentSet.push({
                    Title: ">> "+this.lang.instant("NOTIFICATION.DETAIL"),
                    OnClick: () => {
                        this.checkDetail();
                    }
                });

                buttonSet.push({
                    Title: this.lang.instant("NOTIFICATION.BTN_DEPOSITSUMMARY"),
                    OnClick: () => {
                        this.popup.setLoading(true);
                        this.layout.setHeaderStatus({
                            backEventStack : []
                        })
                        this.router.navigate(['account_enquiry'], { queryParams: { from: 'notification', type : "depositSumPage", company : content["AcctNo"], currency : content["DebitCur"]}});
                    }
                });
            }

            // Update content data
            element.ContentSet = contentSet;
            element.ButtonSet = buttonSet;
        });
    }

    /**
     * [母頁回調觸發] 確認開啟通知類別訊息頁，戳記未讀變更為已讀
     */
    addReadedTag() {
        console.log('[通知類別訊息頁] addReadedTag');
        this.addReaded.emit();
    }

    /**
     * 捲動畫面至未讀
     */
    scrollToUnread() {
        let unread = document.getElementById("unread")
        if(unread){
            unread["parentNode"]["scrollTop"] = unread.offsetTop - unread["parentNode"]["offsetTop"];
        }
    }
    /*
    看明細功能
    APP發起交易之交易通知，帶到”帳戶查詢/APP交易紀錄”未來有網銀等通路來的通知
    (非APP發起之交易)，帶到該交易帳戶的”帳戶查詢/帳戶明細”+ 日期
    */
    checkDetail() {
        this.typeData.forEach(element => {
            let content = JSON.parse(element.Content);
            let content2 = element.ChannelId;
            if (content2.toUpperCase() == "APP2.0") {
                this.router.navigate(['/account_enquiry'], { queryParams: { type: "transPage" } })
            } else {
                var isActivity = this.functionList.checkHasFunctionGroup(FunctionListService.DepositDetailGroupKey);
                if (!isActivity) {
                     this.popup.setConfirm({
                        content: "MENU.NO_PERMISSION"
                     })
                     return;
                 }
                this.layout.setHeaderStatus({
                    backEventStack : []
                })
                this.router.navigate(['/account_enquiry'], { queryParams: { from: 'notification', type: "depositDetailPage", company: content["CustomerId"], acctNo: content["AcctNo"] } })
            }
        })

    }
}
