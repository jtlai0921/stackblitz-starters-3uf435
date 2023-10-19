import { Component, OnInit, EventEmitter, Output, Input, NgZone } from '@angular/core';
import { ExchangeRateModel } from '../exchangeRateModel';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { UserParaModService } from '../../../shared/service/customize/userParaMod.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { UserParaInqService } from '../../../shared/service/customize/userParaInq.service';
import { ForExRateDetailsInqService } from '../../../shared/service/customize/forExRateDetailsInq.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { FinanceRootComponent } from '../financeRoot/financeRoot.component';

declare var $: any;

@Component({
  selector: 'app-exchangeRateCustomCurrency',
  templateUrl: './exchangeRateCustomCurrency.component.html',
  styleUrls: [
    '../exchangeRateQuery/exchangeRateQuery.component.css',
    './exchangeRateCustomCurrency.component.css'
  ]
})
export class ExchangeRateCustomCurrencyComponent implements OnInit {


  @Input("pageType")
  public pageType;

  @Input("exchangeRateModel")
  public exchangeRateModel;

  @Output("onBackEvnet")
  public onBackEvnet = new EventEmitter<any>();

  public modifiedExchangeRateModel;   // Modified exchange rate model
  public selectedCurrencyMap;         // Selected currency map
  private isExit = false;
  public selCountryCurName;       // 下拉選單值 
  public loginStatus = this.storage.get("isLogin") //登入狀態
  
  constructor(
    private popup: PopupService,
    private layout: LayoutService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private userParaInqService: UserParaInqService,
    private forExRateDetailsInqService: ForExRateDetailsInqService,
    private userParaModService: UserParaModService,
    private langTrans: LangTransService,
    private router: Router,
    private zone: NgZone
  ) {

  }

  ngOnInit() {
    FinanceRootComponent.canExit = false;
    FinanceRootComponent.exitEvent.subscribe(()=>{
      this.onBackEvent(true,false);
    });
    // Init header
    this.layout.setHeaderStatus({
      status: true,
      title: "CUSTOM_CURRENCY.TITLE",
      backEvent: this.onBackButtonClick,
      rightIcon: false
    });
    if(!this.loginStatus){
      this.layout.setHeaderStatus({
        rightIcon: "announce"
      })
    }

    // Init modified exchange rate model
    this.modifiedExchangeRateModel = new ExchangeRateModel(
      this.popup, this.dateTime, this.storage, this.userParaInqService, this.forExRateDetailsInqService,
      false, this.onDataUpdated, null, this.onAutocompleteItemClick, this.pageType, this.langTrans);

    // 01. User parameter
    this.modifiedExchangeRateModel.userPara = {};
    if (this.exchangeRateModel.userParaInput != null) {
      for (const key of Object.keys(this.exchangeRateModel.userParaInput)) {
        this.modifiedExchangeRateModel.userPara[key] = this.exchangeRateModel.userParaInput[key];
      }
    }

    // 02. Currency list
    this.modifiedExchangeRateModel.currencyList = [];
    if (this.exchangeRateModel.currencyList != null) {
      for (const currency of this.exchangeRateModel.currencyList) {
        this.modifiedExchangeRateModel.currencyList[this.modifiedExchangeRateModel.currencyList.length] = currency;
      }
    }
    
    // 03. Country and currency list
    this.modifiedExchangeRateModel.onCountrySelected(this.exchangeRateModel.selectedCountry);
    this.selCountryCurName = "countryCode."+this.exchangeRateModel.selectedCountry;
    //如果國別為台灣時，幣別無TWD
    if (this.storage.get("loginUserCountry") == "TW") {
      let index = this.modifiedExchangeRateModel.selectedCurrencyList.indexOf("TWD");
      if (index != -1)
        this.modifiedExchangeRateModel.selectedCurrencyList.splice(index, 1)
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(()=>{
      $("#sortable").sortable({
        handle: ".icon-drag",
        opacity: 0.6,
        update: (event, ui) => {
          var currencyList: [string] = this.modifiedExchangeRateModel.selectedCurrencyList;
          var currency = $(ui.item).text();
          var firstIndex = currencyList.indexOf(currency);
          var secondIndex = currencyList.indexOf($(ui.item.prev()).text());
          secondIndex = secondIndex < firstIndex ? secondIndex + 1 : secondIndex;
          if (firstIndex >= 0 && firstIndex != secondIndex) {
            currencyList.splice(firstIndex, 1);
            currencyList.splice(secondIndex, 0, currency);
            this.modifiedExchangeRateModel.selectedCurrencyList = currencyList;
            this.onDataUpdated();
          }
        }
      });
      $("#sortable").disableSelection();
    })
    
    setTimeout(() => {
      this.popup.setLoading(false);
     }, 1500);
  }

  

  /**
   * On data updated
   */
  private onDataUpdated = () => {
    // 01. Update currency map
    // Find current country data
    if (this.selectedCurrencyMap == null) {
      this.selectedCurrencyMap = [];
    }
    var currentCountryData = null;
    for (const countryData of this.selectedCurrencyMap) {
      if (countryData.country == this.modifiedExchangeRateModel.selectedCountry) {
        currentCountryData = countryData;
        break;
      }
    }

    // Check current country data
    if (currentCountryData == null) {
      // Construct new country data
      currentCountryData = {
        country: this.modifiedExchangeRateModel.selectedCountry,
        selectedCurrencies: this.modifiedExchangeRateModel.selectedCurrencyList
      }
      this.selectedCurrencyMap[this.selectedCurrencyMap.length] = currentCountryData;
    }
    else {
      // Update currency list
      currentCountryData.selectedCurrencies = this.modifiedExchangeRateModel.selectedCurrencyList;
    }

    // 02. Update user parameter
    for (const countryData of this.selectedCurrencyMap) {
      const key = this.modifiedExchangeRateModel.getStorageKey(countryData.country);
      var combineString = "";
      if (countryData.selectedCurrencies != null && countryData.selectedCurrencies.length > 0) {
        for (const currency of countryData.selectedCurrencies) {
          if (combineString.length > 0) {
            combineString = combineString + "|";
          }
          combineString = combineString + currency;
        }
      }
      this.modifiedExchangeRateModel.userPara[key] = combineString;
    }
  }

  private onAutocompleteItemClick = (currency) => {
    // Clear keyword
    this.modifiedExchangeRateModel.inputKeyword = "";

    // Add currency
    this.modifiedExchangeRateModel.selectedCurrencyList[this.modifiedExchangeRateModel.selectedCurrencyList.length] = currency;

    // Notify data updated
    this.onDataUpdated();
  }

  /**
   * On header back button clicked
   */
  private onBackButtonClick = () => {
    this.popup.setConfirm({
      content: "CUSTOM_CURRENCY.EXIT_CONTENT",
      checkTxt: "CUSTOM_CURRENCY.EXIT_CONFIRM",
      cancelTxt: "CUSTOM_CURRENCY.EXIT_CANCEL",
      event: (e) => {
        this.onBackEvent(true,true);
      },
      errEvent: (e) => {
        this.onBackEvent(false,true);
      }
    });
  }

  /**
   * On delete currency button clicked
   * @param currency Target currency
   */
  public onDeleteCurrencyClick(currency) {
    // Remove target currency
    for (let index = 0; index < this.modifiedExchangeRateModel.selectedCurrencyList.length; index++) {
      if (this.modifiedExchangeRateModel.selectedCurrencyList[index] == currency) {
        this.modifiedExchangeRateModel.selectedCurrencyList.splice(index, 1);
        this.onDeleteCurrencyClick(currency);
        return;
      }
    }

    // Update data
    this.onDataUpdated();
  }

  /**
   * On back evnet
   * @param isCurrenciesModify Is currency list modified
   */
  public onBackEvent(isCurrenciesModifid,isGoBack) {
    // Check is modified or not
    if (isCurrenciesModifid) {
      // Storage new properties
      for (const countryData of this.selectedCurrencyMap) {
        const key = this.modifiedExchangeRateModel.getStorageKey(countryData.country);
        this.storage.set(key, countryData.selectedCurrencies);
      }

      // Display loading page
      this.popup.setLoading(true);

      // Update remote user parameter
      this.userParaModService.updateUserPara(this.modifiedExchangeRateModel.KEY_PARA_ID, this.modifiedExchangeRateModel.userPara)
        .then(
          (res) => {
            // DEBUG
            console.log("Update user para success", res);

            // Dismiss loading page
            this.popup.setLoading(false);

            // Notify back event
            if(isGoBack){
              this.notifyBackEvent(isCurrenciesModifid);
            }else{
              FinanceRootComponent.canDeactivateValue.next(true)
            }
          },
          (err) => {
            // DEBUG
            console.log("Update user para failed", err);

            // Dismiss loading page
            this.popup.setLoading(false);

            // Notify back event
            if(isGoBack){
              this.notifyBackEvent(isCurrenciesModifid);
            }else{
              FinanceRootComponent.canDeactivateValue.next(true)
            }
          }
        );
    }
    else {
      // Notify back event
      if(isGoBack){
        this.notifyBackEvent(isCurrenciesModifid);
      };
    }
  }


  /**
   * Notify back event
   * @param isCurrenciesModify Is currency list modified
   */
  private notifyBackEvent(isCurrenciesModifid) {
    FinanceRootComponent.initExitEvent();
    if (!this.isExit) {
      // Notify back event
      this.onBackEvnet.emit({
        isCurrenciesModifid: isCurrenciesModifid,
        selectedCountry: this.modifiedExchangeRateModel.selectedCountry
      });
    }
  }

  onCountryClick() {
    let newArr = [];
    this.modifiedExchangeRateModel.countryList.forEach((item, i) => {
      if (this.modifiedExchangeRateModel.selectedCountry == item.country)
        newArr.push({
          desc: this.langTrans.instant("countryCode."+item.country),
          value: item.country,
          checked: true
        });
      else
        newArr.push({
          desc: this.langTrans.instant("countryCode."+item.country),
          value: item.country,
          checked: false
        });
    });
    this.popup.setCheckList({
      // title: this.langTransService.instant(''), // 
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.selCountryCurName = result['desc'];
        this.modifiedExchangeRateModel.onCountrySelected(result.value);
      }
    })
  }
}
