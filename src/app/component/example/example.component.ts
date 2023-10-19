
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import {LocalStorageService} from '../../shared/service/global/localStorage.service';
import {PopupService} from '../../shared/service/global/popup.service';
import { SortByService } from '../../shared/service/global/sortby.service';
import { SearchFilterService } from '../../shared/component/public/search-filter.service';
import { SQLlightService} from '../../shared/service/cordova/sqllight/sqllight.service'
declare var widow:any;
@Component({
  //selector: 'app-header',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']

})
export class ExampleComponent implements OnInit {

  private _reloadEvent = () => { console.log('Reload Function!');}
  public SwiperStatus = '';
  constructor(
    public layout : LayoutService,
    public pop : PopupService,
    public sort :　SortByService,
    public search : SearchFilterService,
    public sql : SQLlightService
  ){

    //pop 元件範例
    this.pop.setPatternLock({
      title : '彈窗密碼',
      event : (res) => {

        console.log('res',res);
        if(res.length < 5){
          this.pop.setPatternLock({error:true});
        }else{

          this.pop.setPatternLock({msg:'兩次密碼不一至'});

          setTimeout(()=>{
            this.pop.setPatternLock({msg:'彈窗密碼',reset:true,Isopen:false});
          },1200)
        }

      }
    });
    // //app暫停 背景執行
    // document.addEventListener('pause', () => {
    //   console.log('[STEP] APP on pause');
    // });
    // //app從背景執行回復
    // document.addEventListener('resume', () => {
    //   console.log('[STEP] APP on resume');
    // });

    console.log('ExampleComponent constructor');
    this.sql.createTable().then((res)=>{
      console.log('sql.createTable res',res);
    },(err)=>{
      console.log('sql.createTable err',err);
    });

   
    //註冊手勢事件 上下左右事件
    // this.pop.setGestures({
    //   //註冊手勢 上滑
    //   'up': () => {console.log('example swiper UP');this.SwiperStatus = 'UP'},
    //   //註冊手勢 下滑
    //   'down': () => {console.log('example swiper DOWN');this.SwiperStatus = 'DOWN'},
    //   //註冊手勢 左滑
    //   'left': () => {console.log('example swiper LEFT');this.SwiperStatus = 'LEFT'},
    //   //註冊手勢 右滑
    //   'right': () => {console.log('example swiper RIGHT');this.SwiperStatus = 'RIGHT'},
    //   //註冊Reload事件
    // });
    //註冊下滑Reload 事件
    this.pop.setGestures({
      'reload': () => { 
        
        setTimeout(()=>{
          //兩秒後關閉Reload Method
          this.pop.setGestures({
            'reload_close':true
          });
        },2000);

       }
    });
  }
  public filterArray = ['id','name'];
  public data = [
    { id:3,name:'A',text:'A_testB',country:"Taiwan",ahead:'h'},
    { id:1,name:'B',text:'A_testC',country:"Japan",ahead:'g'},
    { id:1,name:'B',text:'B_testD',country:"Hongkong",ahead:'ha'},
    { id:1,name:'Z',text:'A_testE',country:"USA",ahead:'a'},
    { id:6,name:'K',text:'A_testF',country:"China",ahead:'f'},
    { id:2,name:'D',text:'A_testG',country:"India",ahead:'g'}
  ];
  public IsShow = true;
  public Selected;

  public source = [
    { id:3,name:'A',text:'A_testB',country:"Taiwan",ahead:'h'},
    { id:1,name:'B',text:'A_testC',country:"Japan",ahead:'g'},
    { id:1,name:'B',text:'B_testD',country:"Hongkong",ahead:'ha'},
    { id:1,name:'Z',text:'A_testE',country:"USA",ahead:'a'},
    { id:6,name:'K',text:'A_testF',country:"China",ahead:'f'},
    { id:2,name:'D',text:'A_testG',country:"India",ahead:'g'}
  ]
  public viewData = {
    title: '國別',
    default_value: 'Taiwan',
    option: [
      'Taiwan',
      'Japan',
      'Hongkong',
      'USA',
      'China',
      'India'
    ] 
  }
  public filterKey = 'country';
  public testData = [
    {
      "Country": "TW",
      "CustomerId": "84429175",
      "CustomerName": "AA股份有限公司",
      "Status": "ACTIVE",
      "ProductName": "中企長放",
      "ProductCode": "0034",
      "ProductType": "N",
      "MaturityDt": "2015-08-20",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "1",
      "DisburseDt": "2014-08-21",
      "AmountFinanced": "2000000",
      "Currency": "TWD",
      "AcctNo": "141540176418",
      "ActualInterestRate": "0",
      "BranchName": "營業部",
      "BranchCode": "0901"
    },
    {
      "Country": "TW",
      "CustomerId": "33485736",
      "CustomerName": "BB股份有限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2013-02-07",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "4.089",
      "DisburseDt": "2017-10-18",
      "AmountFinanced": "786.2",
      "Currency": "HKD",
      "AcctNo": "AHAH3IP10005",
      "ActualInterestRate": "1.2",
      "BranchName": "法作",
      "BranchCode": "0233"
    },
    {
      "Country": "TW",
      "CustomerId": "33485736",
      "CustomerName": "BB股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2013-01-14",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "4.089",
      "DisburseDt": "2013-01-02",
      "AmountFinanced": "1000",
      "Currency": "HKD",
      "AcctNo": "AHAH3IR10263",
      "ActualInterestRate": "2",
      "BranchName": "法作",
      "BranchCode": "0233"
    },
    {
      "Country": "TW",
      "CustomerId": "33485736",
      "CustomerName": "BB股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2013-02-07",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "4.089",
      "DisburseDt": "2013-02-06",
      "AmountFinanced": "10251.9",
      "Currency": "HKD",
      "AcctNo": "AHAH3IR10268",
      "ActualInterestRate": "2",
      "BranchName": "法作",
      "BranchCode": "0233"
    },
    {
      "Country": "HK",
      "CustomerId": "89384758",
      "CustomerName": "CC股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2013-02-07",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2013-02-06",
      "AmountFinanced": "50",
      "Currency": "USD",
      "AcctNo": "AHAH3IR10269",
      "ActualInterestRate": "2",
      "BranchName": "法作",
      "BranchCode": "0233"
    },
    {
      "Country": "HK",
      "CustomerId": "89384758",
      "CustomerName": "CC股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2014-05-16",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2013-12-17",
      "AmountFinanced": "1000",
      "Currency": "USD",
      "AcctNo": "AHBM3IO00016",
      "ActualInterestRate": "2.167019",
      "BranchName": "營業部",
      "BranchCode": "0901"
    },
    {
      "Country": "TW",
      "CustomerId": "48747485",
      "CustomerName": "DD股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2014-08-14",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2014-08-14",
      "AmountFinanced": "100",
      "Currency": "USD",
      "AcctNo": "AHBM3IR00374",
      "ActualInterestRate": "6.3",
      "BranchName": "營業部",
      "BranchCode": "0901"
    },
    {
      "Country": "TW",
      "CustomerId": "48747485",
      "CustomerName": "DD股份有限公司",
      "Status": "ACTIVE",
      "ProductName": "固定短擔",
      "ProductCode": "0001",
      "ProductType": "",
      "MaturityDt": "2009-09-24",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "1",
      "DisburseDt": "2008-09-24",
      "AmountFinanced": "20000",
      "Currency": "TWD",
      "AcctNo": "0000002026427746",
      "ActualInterestRate": "0",
      "BranchName": "中山 分",
      "BranchCode": "0141"
    },
    {
      "Country": "TW",
      "CustomerId": "48747485",
      "CustomerName": "DD股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2010-12-22",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2010-06-25",
      "AmountFinanced": "10000",
      "Currency": "USD",
      "AcctNo": "AHAE0IR01539",
      "ActualInterestRate": "2.811839",
      "BranchName": "敦北",
      "BranchCode": "0015"
    },
    {
      "Country": "TW",
      "CustomerId": "48747485",
      "CustomerName": "DD股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2010-09-23",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2010-06-25",
      "AmountFinanced": "50000",
      "Currency": "USD",
      "AcctNo": "AHAE0IR01540",
      "ActualInterestRate": "3.837209",
      "BranchName": "敦北",
      "BranchCode": "0015"
    },
    {
      "Country": "TW",
      "CustomerId": "48747485",
      "CustomerName": "DD股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2011-01-05",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2010-07-09",
      "AmountFinanced": "6600",
      "Currency": "USD",
      "AcctNo": "AHAE0IR01550",
      "ActualInterestRate": "2.283298",
      "BranchName": "敦北",
      "BranchCode": "0015"
    },
    {
      "Country": "TW",
      "CustomerId": "48747485",
      "CustomerName": "DD股份有限公司",
      "Status": "Active",
      "ProductName": "SHORT TERM LOAN",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2011-01-08",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2010-07-12",
      "AmountFinanced": "1000",
      "Currency": "USD",
      "AcctNo": "AHAE0IR01553",
      "ActualInterestRate": "2.283298",
      "BranchName": "敦北",
      "BranchCode": "0015"
    },
    {
      "Country": "US",
      "CustomerId": "77675857",
      "CustomerName": "US股份有限公司",
      "Status": "Active",
      "ProductName": "MIDDLE TERM SECURED",
      "ProductCode": "",
      "ProductType": "",
      "MaturityDt": "2011-03-31",
      "AdvVal": "",
      "LoanBal": "",
      "ExRate": "31.352",
      "DisburseDt": "2009-03-31",
      "AmountFinanced": "2000",
      "Currency": "TWD",
      "AcctNo": "AHAE9SL00005",
      "ActualInterestRate": "4.499999",
      "BranchName": "敦北",
      "BranchCode": "0015"
    }
  ];
  ngOnInit() {

     //sqlLight Test
     console.log('sqlLight Test >>>>>');
     this.sql.insert('test','TestValue').then((res)=>{
       console.log('sql.insert res',res);
     },(err)=>{
       console.log('sql.insert err',err);
     });
 
     this.sql.insert('test2',{ key:'test',value:'Test Obj' }).then((res)=>{
       console.log('sql.insert res',res);
     },(err)=>{
       console.log('sql.insert err',err);
     });
 
     this.sql.select('test').then((res)=>{
       console.log('sql.select res',res);
     },(err)=>{
       console.log('sql.select err',err);
     });
 
     this.sql.select('test2').then((res)=>{
       console.log('sql.select res',res);
     },(err)=>{
       console.log('sql.select err',err);
     });
 
     this.sql.select('test3').then((res)=>{
       console.log('sql.select res',res);
     },(err)=>{
       console.log('sql.select err',err);
     });
 
     this.layout.setHeaderStatus({
       status:true,
       title:'EXAMPLE'
     });

    // 資料篩選範例
    console.log('testData',this.testData);
    var filterData_OR = this.search.FilterData(this.testData, { Country:'US',Currency : 'TWD,HKD'} );
    console.log('filterData_OR',filterData_OR);
    var filterData_AND = this.search.FilterData(this.testData, { Country:'US',Currency : 'TWD,HKD'},true);
    console.log('filterData_AND',filterData_AND);

    var newData =  this.sort.SortBy(this.data,'id,name,text');
    console.log('newData',newData);
    //Loading Open
    this.pop.setLoading(true);
    //Loading Close
    setTimeout(() => {
      this.pop.setLoading(false);
    }, 300);
  }

  showDetail(item){
    console.log(item);
    this.Selected = item;
    this.IsShow = false;
    //打開細節頁 選單換成上一頁事件註冊
    this.layout.setHeaderStatus({
      title:'EXAMPLE DETAIL',
      backEvent:()=>{
        this.IsShow = true;
        this.layout.setHeaderStatus({title:'EXAMPLE'})
      }
    })
    //註冊左滑back事件
    // this.pop.setGestures({
    //   'left': () => {
    //     this.IsShow = true;
    //     this.layout.setHeaderStatus({title:'EXAMPLE'});
    //   }
    // });
  }

  Callback(event){
   console.log('Callback',event);
   this.IsShow = true;
   //打開細節頁 選單換成上一頁事件註冊
  }

  //Pop Example
  PurePop(){
    this.pop.setTransQuery({
      defaulr: '2018-08-27',
      event : (date) => {
        console.log(date);
      }
    });
  }
  TitlePop(){
    this.pop.setConfirm({
      title:'Message Title',
      content:'Somthing Content For Message!',
      event:(e)=>{
        console.log('TitlePop Click',e);
      }
    });
  }
  HtmlPop(){
    this.pop.setConfirm({
      title:'Html Title',
      content:'Somthing Content With Html!<br/><strong>IMPORTANT</strong><br/><strong>IMPORTANT2</strong>',
      event:(e)=>{
        console.log('TitlePop Click',e);
      }
    });
  }
  PopTwoBtn(){
    this.pop.setConfirm({
      content:'You Can Set "checkTxt" and "cancelTxt" FOR Button Display',
      checkTxt:'確認文字設定',
      cancelTxt:'取消文字設定',
      event:(e)=>{
        console.log('TitlePop Click',e);
      }
    });
  }
  PopInput(){
    this.pop.setInput({
      title:'密碼框',
      placeholder:'請輸入密碼',
      default:'', //預設值
      checkTxt:'確定',
      cancelTxt:'取消',
      event:(value)=>{
        console.log('input value',value);
      }
    });
  }
  PopCheck(){
    var demoData = [
      {'value':'1','desc':'指紋/臉部辨識'},
      {'value':'2','desc':'圖形驗證碼'},
      {'value':'3','desc':'TEST3'},
      {'value':'4','desc':'TEST4'},
    ];
    this.pop.setCheckList({
      title:'快速登入設定',
      content:'請選擇預設快速登入:',
      type:'checkbox',
      data: demoData,
      checkTxt:'確認',
      cancelTxt:'取消',
      event:(e)=>{
        console.log('Check Items',e);
      }
    });
  }
  PopRadio(){
    var demoData = [
      {'value':'1','desc':'指紋/臉部辨識'},
      {'value':'2','desc':'圖形驗證碼'},
      {'value':'3','desc':'TEST3'},
      {'value':'4','desc':'TEST4'},
    ];
    this.pop.setCheckList({
      title:'快速登入設定',
      content:'請選擇預設快速登入:',
      data: demoData,
      type:'radio',
      event:(e)=>{
        console.log('Radio Item',e);
      }
    });
  }
  PopSelect(){
    var demoData = [
      {'value':'1','name':'TWD-183984756 敦南分行','local':'台灣','no':'9281719','company':'星巴克股份有限公司'},
      {'value':'2','name':'TWD-183984756 敦東分行','local':'台灣','no':'1223456','company':'雲巴克股份有限公司'},
      {'value':'3','name':'TWD-183984756 敦西分行','local':'台灣','no':'2222222','company':'日巴克股份有限公司'},
      {'value':'4','name':'TWD-183984756 敦北分行','local':'台灣','no':'3333333','company':'天巴克股份有限公司'}
    ];
    this.pop.setSelect({
      title:'請選擇約定帳號',
      data: demoData,
      event:(e)=>{
        console.log('S Item',e);
      }
    });
  }

  public percentNum = 0;
  public loadMsg = 'Loading Init';
  PopPerCent(){
    this.percentNum += 1;
    this.loadMsg = (this.percentNum > 50) ? 'Loading B' : 'Loading A';
    setTimeout(()=>{
      this.pop.setPercentage({
        status:true,
        content: this.loadMsg,
        percent : this.percentNum
      });
      if(this.percentNum < 100){
        this.PopPerCent();
      }else{
        this.pop.setPercentage({
          status:true,
          content: this.loadMsg,
          percent : this.percentNum,
          checkTxt :'已完成',
          event:()=>{
            this.pop.setPercentage({status:false});
          }
        });
      }
    },50);
  }

  PopDatePicker(){
    this.pop.setDatePicker({
      status:true,
      datepicDefalult:'2018/08/10', //預設值
      event:(seleted)=>{
        console.log('Selected Date',seleted);
      }
    });
  }

  ngOnDestroy(){
    console.log('Example ngOnDestroy');
  }

  RestartApp(){
    navigator['app'].exitApp();
  }

  public r1;
  public r2;
  public r3;
  public r4;
  // public viewData;
  result1(filter){
    console.log('r1',filter);
   this.r1 = (filter) ? filter.length : 0;
  }
  result2(filter){
    console.log('r2',filter);
    this.r2 = (filter) ? filter.length : 0;
  }
  result3(filter){
    console.log('r3',filter);
    this.r3 = (filter) ? filter.length : 0;
  }
  result4(filter){
    console.log('r4',filter);
    this.r4 = (filter) ? filter.length : 0;
  }
}




