import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { ExchangeRateModel } from '../exchangeRateModel';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { UserParaInqService } from '../../../shared/service/customize/userParaInq.service';
import { ForExRateDetailsInqService } from '../../../shared/service/customize/forExRateDetailsInq.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * 匯率查詢頁
 */
@Component({
  selector: 'app-exchangeRateQuery',
  templateUrl: './exchangeRateQuery.component.html',
  styleUrls: ['./exchangeRateQuery.component.css']
})
export class ExchangeRateQueryComponent implements OnInit {

  @Output("updateTabBarVisiable")
  public updateTabBarVisiable = new EventEmitter<boolean>();

  public pageType = "QUERY";      // Page type
  public exchangeRateModel;       // Exchange rate model
  public isCustomCurrencyShown;   // Is shown custom currency page or not
  public itemList;                // Exchange rate detail list
  public selectedRateType;        // Selected rate type

  public selCountryCurName;       // 下拉選單值 


  constructor(
    private zone: NgZone,
    private popup: PopupService,
    private layout: LayoutService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private userParaInqService: UserParaInqService,
    private forExRateDetailsInqService: ForExRateDetailsInqService,
    private langTrans: LangTransService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngOnInit() {
    // Init rate type
    this.selectedRateType = "S";

    // Init exchange rate model
    this.exchangeRateModel = new ExchangeRateModel(
      this.popup, this.dateTime, this.storage, this.userParaInqService, this.forExRateDetailsInqService,
      true, this.onDataUpdated, this.onAutocompleteUpdated, this.onAutocompleteItemClick
      , this.pageType, this.langTrans);

    this.exchangeRateModel.initSelectedCountry();
    this.exchangeRateModel.initSelectedCashCurrencyList();
    this.selCountryCurName = "countryCode." + this.exchangeRateModel.selectedCountry;


    this.route.queryParams.subscribe(params => {
      if (params.to == "goCustomCur") {
        this.onCustomCurrencyClick();
      }
    });

    if (!this.storage.get("isLogin")) {
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    } else {
      this.layout.setHeaderStatus({
        rightIcon: false
      })
    }
  }

  ngAfterViewInit() {
    // Init gestures
    this.popup.setGestures({
      'reload': () => {
        this.exchangeRateModel.onCountrySelected(this.exchangeRateModel.selectedCountry);
      }
    });
  }

  /**
   * On data updated
   */
  private onDataUpdated = () => {
    // Clear item list
    this.itemList = [];

    // Rate type "C" is only for taiwan country
    if (this.exchangeRateModel.selectedCountry != 'TW') {
      this.selectedRateType = "S";
    }

    // Add match items
    if (this.exchangeRateModel.exRateDetailList != null) {
      for (const detail of this.exchangeRateModel.exRateDetailList) {
        // Verify rate type
        var isRateTypeMatch = detail.RateType == this.selectedRateType;

        // Verify search currency
        var isKeywordMatch = false;
        if (this.exchangeRateModel.inputKeyword == null || this.exchangeRateModel.inputKeyword.trim().length == 0) {
          isKeywordMatch = true;
        } else if (detail.CurCodeFrom == null || detail.CurCodeFrom.trim().length == 0) {
          isKeywordMatch = true;
        } else {
          isKeywordMatch = detail.CurCodeFrom.trim().toUpperCase().indexOf(this.exchangeRateModel.inputKeyword.trim().toUpperCase()) >= 0;
        }

        // Verify selected currency list
        var isMatchSelectedCurrency = false;
        if (this.exchangeRateModel.inputKeyword != null && this.exchangeRateModel.inputKeyword.trim().length > 0) {
          isMatchSelectedCurrency = true;
        } else {
          for (const currency of this.exchangeRateModel.selectedCurrencyList) {
            if (detail.CurCodeFrom.trim().toUpperCase() == currency.trim().toUpperCase()) {
              isMatchSelectedCurrency = true;
              break;
            }
          }
        }

        // Verify currency exists
        var isCurrencyExists = false;
        for (const item of this.itemList) {
          if (item.CurCodeFrom.trim().toUpperCase() == detail.CurCodeFrom.trim().toUpperCase()) {
            isCurrencyExists = true;
          }
        }

        // Add item if match
        if (isRateTypeMatch && isKeywordMatch && isMatchSelectedCurrency && !isCurrencyExists) {
          this.itemList[this.itemList.length] = detail;
        }
        //列表內部顯示當前選擇國家之幣別
        this.itemList = this.itemList.filter(word => word.CurCodeFrom != this.exchangeRateModel.selectedCurrency)
      }
    }

    // Sort item list by selected currencies
    const weight = (currency: string): number => {
      const index = this.selectedRateType == "S" ?
        this.exchangeRateModel.selectedCurrencyList.indexOf(currency) :
        this.exchangeRateModel.selectedCashCurrencyList.indexOf(currency);
      return index >= 0 ? index : this.exchangeRateModel.selectedCurrencyList.length;
    }
    this.itemList.sort((a, b) => {
      return weight(a.CurCodeFrom) - weight(b.CurCodeFrom);
    });
  }

  /**
   * On auto complete keyword updated
   */
  private onAutocompleteUpdated = () => {
    this.onDataUpdated();
  }

  /**
   * On auto complete item clicked
   * @param currency Currency code
   */
  private onAutocompleteItemClick = (currency) => {
    // Update search keyword
    this.exchangeRateModel.inputKeyword = currency;

    // Dismiss auto complete popup
    this.exchangeRateModel.isAutocompletedShown = false;
  }

  /**
   * On custom currency clicked
   */
  public onCustomCurrencyClick() {
    let isLogin = this.storage.get("isLogin")
    if (!isLogin) { //未登入跳pop並跳回登入頁
      this.popup.setConfirm({         //欲前往此登入頁需先登入
        content: this.langTrans.instant("NOTIFICATION.NEED_LOGIN"),
        event: () => {
          this.storage.set("goCustomCur", true);

          const url = this.router.url;

          let redirectParameter;
          redirectParameter = url.substr(url.indexOf('=') + 1, url.length - 1);
          this.router.navigate(['/login'], { queryParams: { 'type': 'financePage;' + redirectParameter } });
        }
      })
    } else {
      this.storage.set("goCustomCur", false);
      // Hide L2 tab bar 
      this.updateTabBarVisiable.emit(false);

      // Display custom currency page
      this.isCustomCurrencyShown = true;
    }
  }

  /**
   * On custom currency back event
   * @param newProperty New properties
   */
  public onCustomCurrencyBackEvent(newProperties) {
    // Display L2 tab bar 
    this.updateTabBarVisiable.emit(true);

    // Back to exchanged rate query page
    this.isCustomCurrencyShown = false;

    // Update header
    this.layout.setHeaderStatus({
      status: true,
      title: "EXCHANGE_RATE.TITLE",
      backEvent: null
    });
   
    // Update data if settings modified
    if (newProperties.isCurrenciesModifid) {
      // Update selected country
      this.exchangeRateModel.selectedCountry = newProperties.selectedCountry;

      // Update selected currency list
      this.exchangeRateModel.onCountrySelected(this.exchangeRateModel.selectedCountry);
    }

    this.selCountryCurName = "countryCode." + this.exchangeRateModel.selectedCountry
    setTimeout(()=>{
      this.ngAfterViewInit();
    },200)
  }

  /**
   * On rate type button clicked
   */
  public onRateTypeClick(type) {
    // Update rate type
    this.selectedRateType = type;

    // Update item list
    this.onDataUpdated();
  }


  onCountryClick() {
    //若當前選擇現金匯率則無法選取下拉
    if(this.selectedRateType == "C"){
      return;
    }
    let newArr = [];
    this.exchangeRateModel.countryList.forEach((item, i) => {
      if (this.exchangeRateModel.selectedCountry == item.country)
        newArr.push({
          desc: this.langTrans.instant("countryCode." + item.country),
          value: item.country,
          checked: true
        });
      else
        newArr.push({
          desc: this.langTrans.instant("countryCode." + item.country),
          value: item.country,
          checked: false
        });
    });
    this.popup.setCheckList({
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.selCountryCurName = result['desc'];
        this.exchangeRateModel.onCountrySelected(result.value);
      }
    })
  }
}
