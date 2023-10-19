import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { FAQInqService } from '../../shared/service/customize/FAQInqt.service';
import { CustomCodeService } from '../../shared/pipe/publicPipe/custom/custom.service';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';

@Component({
  selector: 'app-common_problem',
  templateUrl: './common_problem.component.html',
  styleUrls: ['./common_problem.component.css']
})
export class CommonProblemComponent implements OnInit, AfterViewInit {
  public IsOpen = false;
  public activeClass = '';
  public typeCode = '0';
  public KeyWord = ""
  public openIndex: number;
  public FAQList;
  public FAQRes;
  public QATypeSelected = "0";
  public QATypeTitle = "PROBLEM.TOP_QA"; // 熱門問答
  public QATypeList = [];
  public selQAName = 'PROBLEM.ALL';
  public loginStatus = this.storage.get("isLogin")

  constructor(
    public popup: PopupService,
    private layout: LayoutService,
    private faqService: FAQInqService,
    private codeTrans: CustomCodeService,
    private langTrans: LangTransService,
    private storage: LocalStorageService,
    private router: Router,
  ) {
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngAfterViewInit() {
    console.log('Regist DropReload!')
    //註冊手勢事件 下滑Reload
    this.popup.setGestures({
      //註冊Reload事件
      'reload': () => {
        this.getData();
      }
    });
  }


  ngOnInit() {
    this.layout.setHeaderStatus({
      status: true,
      title: 'PROBLEM.TITLE',
      rightIcon: false
    })
    if (!this.loginStatus) {
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }

    this.getData();
  }

  getData() {
    this.FAQList = [];
    const success = (res) => {
      console.log("[CommonProblemComponent] getData Success", res);
      this.FAQRes = res;
      this.groupType();
      this.initList();
      //關閉Reload Method
      this.popup.setGestures({
        'reload_close': true
      });
      // 關閉Loading畫面
      this.popup.setLoading(false);
    }
    const error = (err) => {
      console.log("[CommonProblemComponent] getData Error", err);
      //關閉Reload Method
      this.popup.setGestures({
        'reload_close': true
      });
      // 關閉Loading畫面
      this.popup.setLoading(false);
      this.popup.setConfirm({
        content: 'PROBLEM.INFO_GET_ERROR', // 資料取得失敗
        event: () => {
        }
      });
    }
    this.faqService.FAQInq().then(success, error);
  }

  groupType() {
    // 取得所有問答類型值，剔除重複值，依照自然排序
    this.QATypeList = this.FAQRes['FAQList']
      .map((item => item.QuestType))
      .filter((item, index, array) => {
        return (item && index === array.indexOf(item))
      }).sort();
    console.log('[常見問答頁] groupType QATypeList', this.QATypeList);
  }

  initList() {
    this.FAQList = [];
    // 關鍵字搜尋
    if (this.IsKeyWordSearch) {
      this.FAQRes["FAQList"].forEach(faq => {
        if (faq["Question"].includes(this.KeyWord)) {
          this.addItem(faq)
          return;
        }
        if (faq["Answer"].includes(this.KeyWord)) {
          this.addItem(faq)
          return;
        }
        let questTypeString = this.langTrans.instant(this.codeTrans.transform(faq["QuestType"], "FAQ_QUESTTYPE"));
        if (questTypeString.includes(this.KeyWord)) {
          this.addItem(faq)
          return;
        }
      })
      this.LoadPage();
      return;
    }

    if (this.QATypeSelected == "0") {
      this.FAQRes["FAQList"].forEach(faq => {
        if (faq["HotFAQ"] == "Y") {
          this.addItem(faq);
        }
      });
    } else {
      var questType = this.QATypeSelected;
      this.FAQRes["FAQList"].forEach(faq => {
        if (faq["QuestType"] == questType) {
          this.addItem(faq);
        }
      });
    }
    this.LoadPage();
  }

  addItem(faq) {
    faq["Class"] = "list-card-style-l2 card-ques-l2"
    faq["ToggleClass"] = "fa fa-plus"
    faq["IsExtend"] = false
    this.FAQList.push(faq)
  }

  onQAClick() {
    let newArr = [
      {
        desc: this.langTrans.instant('PROBLEM.ALL'),
        value: '0',
        checked: false
      }
    ];
    this.QATypeList.forEach((item, i) => {
      if (this.QATypeSelected == item)
        newArr.push({
          desc: this.langTrans.instant(this.codeTrans.transform(item, "FAQ_QUESTTYPE")),
          value: item,
          checked: true
        });
      else
        newArr.push({
          desc: this.langTrans.instant(this.codeTrans.transform(item, "FAQ_QUESTTYPE")),
          value: item,
          checked: false
        });
    });
    this.popup.setCheckList({
      // title: this.langTransService.instant(''), // 
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.selQAName = result['desc'];
        this.QATypeSelected = result['value'];
        this.QATypeSelectChange();

        //篩選完之後如果是選擇全部則標題(this.QATypeSelected == "0")顯示熱門回答，其餘顯示搜尋結果
        if(this.QATypeSelected == "0"){
          this.QATypeTitle = "PROBLEM.TOP_QA";
        }else{
          this.QATypeTitle = "PROBLEM.TOP_SEARCH";
        }
 
		//下拉選完重search bar
        this.KeyWord = "";
      }
    })
  }

  QATypeSelectChange() {
    console.log('[常見問答頁] QATypeSelectChange QATypeSelected =', this.QATypeSelected);
    this.IsKeyWordSearch = false;
    if (this.QATypeSelected != "0") {
      this.QATypeTitle = this.QATypeSelected;
    } else {
      this.QATypeTitle = "PROBLEM.TOP_QA"; // 熱門搜尋
    }
    this.initList()
  }

  IsKeyWordSearch = false;
  keyWordSearch() {
    if (this.KeyWord == undefined || this.KeyWord == "") {
      if (this.IsKeyWordSearch) {
        this.QATypeSelected = "0";
        this.QATypeSelectChange();
      }
      return;
    }
    this.QATypeSelected = "0";
    this.QATypeTitle = "PROBLEM.TOP_SEARCH";
    this.IsKeyWordSearch = true;
    this.initList()
  }


  ToggleClick(item) {
    item["IsExtend"] = !item["IsExtend"]
    item["Class"] = item["IsExtend"] ? "list-card-style-l2 card-ques-l2 active" : "list-card-style-l2 card-ques-l2"
    item["ToggleClass"] = item["IsExtend"] ? "fa fa-minus" : "fa fa-plus"
  }

  toggle(recordIndex) {
    console.log("[CommonProblemComponent] 第幾筆=" + recordIndex);
    this.openIndex = recordIndex;
    if (this.FAQList[recordIndex].openType) {
      this.FAQList[recordIndex].openType = false;
    } else {
      this.FAQList[recordIndex].openType = true;
    }
  }
  itemChange() {

  }

  public pager = 0;         //目前顯示筆數
  public pagerAdd = 20;     //每次增加筆數
  public pagerData = undefined;    //顯示資料筆數
  public showLoad = false;   //顯示下方載入更多
  LoadPage() {
    if (this.pagerData == undefined) {
      this.pagerData = [];
    }
    if (this.FAQList.length > this.pager + this.pagerAdd) {
      this.pager += this.pagerAdd;
      this.pagerData = this.FAQList.slice(0, this.pager);
      this.showLoad = true;
    } else {
      this.pagerData = this.FAQList;
      this.showLoad = false;
    }
  }
}
