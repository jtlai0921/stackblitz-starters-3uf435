import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { ExchangeRateModel } from '../exchangeRateModel';
import { PopupService } from '../../../shared/service/global/popup.service';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { UserParaInqService } from '../../../shared/service/customize/userParaInq.service';
import { ForExRateDetailsInqService } from '../../../shared/service/customize/forExRateDetailsInq.service';
import { EX_RATE_AREA } from '../../../../assets/configuration/exRateArea';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * 匯率轉換器
 */
@Component({
  selector: 'app-exchangeRateConverter',
  templateUrl: './exchangeRateConverter.component.html',
  styleUrls: [
    '../exchangeRateQuery/exchangeRateQuery.component.css',
    './exchangeRateConverter.component.css',
  ]
})
export class ExchangeRateConverterComponent implements OnInit {

  @Output("updateTabBarVisiable")
  public updateTabBarVisiable = new EventEmitter<boolean>();

  public pageType = "CONVERTER";    // Page type
  public converterList;             // Converter list
  public exchangeRateModel;         // Exchange rate model
  public isCustomCurrencyShown;     // Is shown custom currency page or not
  public loginStatus = this.storage.get("isLogin") //登入狀態

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
    private route: ActivatedRoute
  ) {
    this.layout.checkFooterUpdate(this.router.url.substr(0, this.router.url.indexOf('?')) || this.router.url);
  }

  ngOnInit() {
    // Init exchange rate model
    this.exchangeRateModel = new ExchangeRateModel(
      this.popup, this.dateTime, this.storage, this.userParaInqService, this.forExRateDetailsInqService,
      true, this.onDataUpdated, null, null, this.pageType, this.langTrans);
    this.exchangeRateModel.initSelectedCountry();
    this.selCountryCurName = "countryCode." + this.exchangeRateModel.selectedCountry;


    this.route.queryParams.subscribe(params => {
      if (params.to == "goCustomCur") {
        this.onCustomCurrencyClick();
      }
    });
    if (!this.loginStatus) {
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
    // Clear converter list
    this.converterList = [];

    // Add current currency
    var currentCurrency;
    for (const area of EX_RATE_AREA) {
      if (area.country == this.exchangeRateModel.selectedCountry) {
        currentCurrency = area.currency;
        this.addCurrency(currentCurrency, currentCurrency, 1, 1);
        break;
      }
    }

    // Add match items
    if (this.exchangeRateModel.exRateDetailList != null) {
      for (const detail of this.exchangeRateModel.exRateDetailList) {
        // Verify rate type
        var isRateTypeMatch = detail.RateType == "S";

        // Verify selected currency list
        var isCurrencyMatch = false;
        for (const currency of this.exchangeRateModel.selectedCurrencyList) {
          if (detail.CurCodeFrom.trim().toUpperCase() == currency.trim().toUpperCase()) {
            isCurrencyMatch = true;
            break;
          }
        }

        // Verify currency exists
        var isCurrencyExists = false;
        for (const converter of this.converterList) {
          if (converter.CurCodeFrom.trim().toUpperCase() == detail.CurCodeFrom.trim().toUpperCase()) {
            isCurrencyExists = true;
          }
        }

        // Add item if match
        if (isRateTypeMatch && isCurrencyMatch && !isCurrencyExists) {
          this.addCurrency(detail.CurCodeFrom, detail.CurCodeTo, detail.BuyRate, detail.SellRate);
        }
      }
    }

    // Sort item list by selected currencies
    const weight = (currency: string): number => {
      if (currency == currentCurrency) {
        return -1;
      } else {
        const index = this.exchangeRateModel.selectedCurrencyList.indexOf(currency);
        return index >= 0 ? index : this.exchangeRateModel.selectedCurrencyList.length;
      }
    }
    this.converterList.sort((a, b) => {
      return weight(a.CurCodeFrom) - weight(b.CurCodeFrom);
    });
  }

  /**
   * Add new currency item 
   * @param CurCodeFrom Currency from
   * @param CurCodeTo Currency to
   * @param BuyRate Buy rate
   * @param SellRate Sell rate
   */
  private addCurrency(CurCodeFrom, CurCodeTo, BuyRate, SellRate) {
    var item = {
      CurCodeFrom: CurCodeFrom,
      CurCodeTo: CurCodeTo,
      BuyRate: BuyRate,
      SellRate: SellRate,
      onModify: false,
      _input: "",
    };
    Object.defineProperty(item, "input", {
      get: (): string => {
        return item._input;
      },
      set: (newString: string) => {
        // Limit new string
        const billion = Math.pow(10, 8);
        newString = newString == null ? "" : newString;
        newString = newString.replace(/\,/g, "");
        newString = newString.replace(/^(\d+) e(\d)/g, "$1$2 e");
        newString = newString.replace(/^(\d+)\.(\d+) e(\d)/g, "$1$3.$2 e");
        const isBillionSymbol = newString.match(/\d+\.{0,1}\d* e$/g);
        newString = newString.replace(/[^\d|\.]/g, "");
        newString = newString.replace(/^\.+$/g, "");

        // Limit new float value
        var newValue = parseFloat(newString);
        newValue = newValue >= 0 ? newValue : 0;
        newValue = isBillionSymbol ? newValue * billion : newValue;

        // Storage new value
        if (newValue == 0) {
          item._input = "";
        } else {
          var isBiliionValue = newValue >= billion;
          var convertValue = isBiliionValue ? newValue / billion : newValue;
          var convertString = Intl.NumberFormat("en-US", { maximumSignificantDigits: 12 }).format(convertValue);
          if (isBiliionValue) {
            item._input = convertString + " e";
          } else {
            item._input = convertString;
          }
        }

        // Check if on modify or not
        if (item.onModify) {
          return;
        }

        // Update all converter value
        for (const converter of this.converterList) {
          converter.onModify = true;
          if (converter == item) {
            converter.input = newValue.toString();
          } else {
            converter.input = (newValue * parseFloat(item.BuyRate) / parseFloat(converter.SellRate)).toString();
          }
          converter.onModify = false;
        }
      },
      enumerable: true,
      configurable: true
    });
    this.converterList[this.converterList.length] = item;
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
      title: "EXCHANGE_CONVERTER.TITLE",
      backEvent: null
    });

    // Update data if settings modified
    if (newProperties.isCurrenciesModifid) {
      // Update selected country
      this.exchangeRateModel.selectedCountry = newProperties.selectedCountry;

      // Update selected currency list
      this.exchangeRateModel.onCountrySelected(this.exchangeRateModel.selectedCountry);
    }

    this.selCountryCurName = "countryCode." + this.exchangeRateModel.selectedCountry;
    setTimeout(()=>{
      this.ngAfterViewInit();
    },200)
  }
  onlyNumber(value) {
    console.log("value = " + value.srcElement.value)
    if (value.srcElement.value.match(/[^0-9.,e ]/) && value.srcElement.value != "") {
      let title = this.langTrans.instant('EXCHANGE_RATE.ERROR_TITLE')  //輸入換算金額錯誤
      let errMsg = this.langTrans.instant('EXCHANGE_RATE.ERROR_MESSAGE') //換算金額只能為數字
      this.popup.setConfirm({
        content: errMsg
      });
    }
    //   // 上限值須大於下限值
    //   if (this.checkMax && this.checkMin && this.max <= this.min)
    //   errMsg += this.langTrans.instant("BALANCE_LIMIT.ERR_INPUT_MIN_LARGER_MAX");

    // // 顯示錯誤訊息
    // if (errMsg.length > 0) {
    //   result = false;
    //   this.popup.setConfirm({
    //     title: this.title,
    //     content: errMsg
    //   });
  }

  onCountryClick() {
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
      // title: this.langTransService.instant(''), // 
      data: newArr,
      type: 'radio',
      event: (result) => {
        this.selCountryCurName = result['desc'];
        this.exchangeRateModel.onCountrySelected(result.value);
      }
    })
  }
}
