import { Component, OnInit, Input } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { DEFAULT_CURRENCIES, SUPPORT_CURRENCIES } from '../../../assets/configuration/currency';
import { KEY_CURRENCY_PARA, KEY_USER_PARA } from '../../../assets/configuration/userParaKey';
import { UserParaInqService } from '../../shared/service/customize/userParaInq.service';
import { UserParaModService } from '../../shared/service/customize/userParaMod.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { Router } from '@angular/router';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { EX_RATE_AREA } from "../../../assets/configuration/exRateArea";

@Component({
  selector: 'app-default-currency',
  templateUrl: './default-currency.component.html',
  styleUrls: ['./default-currency.component.css']
})

export class DefaultCurrencyComponent implements OnInit {

  KEY_CURRENCIES = KEY_CURRENCY_PARA.CURRENCIES;
  KEY_SELECTED_CURRENCY = KEY_CURRENCY_PARA.SELECTED_CURRENCY;
  KEY_PARA_ID = KEY_USER_PARA.CURRENCY + this.storage.get('idUser');

  isCurrencyPopupShown = false;
  isContainsPopupCurrencies = false;
  currencies = [];
  popupCurrencies = [];
  popupFilterCurrencies = [];
  _searchInputValue = "";
  selectedPopupCurrency = "";
  idUser = this.storage.get('idUser');
  currencyPara = {};
  countryList = EX_RATE_AREA;

  constructor(
    private router: Router,
    public layout: LayoutService,
    public storage: LocalStorageService,
    private paraInq: UserParaInqService,
    private paraMod: UserParaModService,
    private popup: PopupService,
    private langTransService: LangTransService
  ) {
    // Init layout
    this.layout.setHeaderStatus({
      status: true,
      title: 'DEFAULTCURRENCY.TITLE' // 預設幣別
    });
    
  }

  ngOnInit() {
    this.popup.setLoading(true);
    // 取得遠端中台儲存之使用者幣別相關設定
    this.paraInq.userParaInq(this.KEY_PARA_ID).then(
      (res) => {
        console.log('[幣別設定頁][API] userParaInq success', res);
        // 解析設定項目值
        this.analyzeCurrencySetting(res);
        // 初始化設定
        this.handleCurrencyPara();
        // 關閉Loading畫面
        this.popup.setLoading(false);
      },
      (err) => {
        console.log('getCurrencySetting failed.', err);

        let ResultCode = err['HeaderRs']['Result'];
        
        //錯誤代碼為13(無符合條件的資料)另外處理，依序國家、地區去做篩選
        if(ResultCode == "13"){

          //取得使用者資料
          let defaultCurrency = this.storage.get("slectedCurrency");
          let loginUserCountry = this.storage.get("loginUserCountry");
          let userCountry = this.storage.get("UserCountry");
          let area = this.storage.get("Area");
          if (!defaultCurrency) {
            //如果有登入使用者國家，則依登入使用者國家設置預設幣別
            if(loginUserCountry){
              for (const item of this.countryList) {
                if (item.country == loginUserCountry) {
                    this.storage.set("slectedCurrency", item.currency);
                    break;
                }
              }
            //如果有使用者國家，則依使用者國家設置預設幣別
            }else if(!loginUserCountry && userCountry){
              for (const item of this.countryList) {
                if (item.country == userCountry) {
                  this.storage.set("slectedCurrency", item.currency);
                  break;
                }
              }
            //如前項條件都沒有，則依使用者地區做預設幣別
            }else if(!loginUserCountry && !userCountry && area){
              for (const item of this.countryList) {
                if (item.country == area) {
                  this.storage.set("slectedCurrency", item.currency);
                  break;
                }
              }
            }
          }
          // 初始化設定
          this.handleCurrencyPara();
          // 關閉Loading畫面
          this.popup.setLoading(false);
        }else{
          this.popup.setConfirm({ content: this.langTransService.instant("ERROR.ERROR_" + ResultCode) + " (" + ResultCode + ')' });
        }
 
        // 關閉Loading畫面
        this.popup.setLoading(false);
      }
    );
  }

  /**
   * 解析設定值
   * @param settings 設定值陣列
   */
  analyzeCurrencySetting(settings) {
    let settingValue = {};
    settings.forEach(setting => {
      if (setting['Id'] === this.KEY_PARA_ID) {
        settingValue = setting;
      }
    });
    this.storage.set(this.KEY_SELECTED_CURRENCY, settingValue['Value']);    
  }

  /**
   * 解析處理遠端回傳之幣別設定
   */
  private handleCurrencyPara() {
    // Init currencies 處理幣別選單選項
    var storageCurrencies = this.storage.get(this.KEY_CURRENCIES);
    storageCurrencies = storageCurrencies ? storageCurrencies[this.idUser] : null;
    // 本機裝置未存有該使用者之幣別選單紀錄，使用預設選單
    if (storageCurrencies == null || storageCurrencies.length == 0) {
      storageCurrencies = DEFAULT_CURRENCIES;
    }
    for (let index = 0; index < storageCurrencies.length; index++) {
      const element = storageCurrencies[index];
      //去掉空值
      if(element != ""){
        this.addCurrency(element);
      }
    }

    // Init selected currency 處理幣別選取值
    var selectedCurrency = this.storage.get(this.KEY_SELECTED_CURRENCY)
    // 中台未存有該使用者之幣別選取值，預設新台幣TWD
    if (selectedCurrency == null || selectedCurrency == '') {
      selectedCurrency = "TWD";
    }
    let isInCurrencies = false;
    for (let i = 0; i < this.currencies.length; i++) {
      // 檢查使用者選取幣別是否存在於目前選單選項內
      if (!isInCurrencies)
        isInCurrencies = this.currencies[i]["code"] == selectedCurrency;
      // 設定幣別選單項狀態
      this.currencies[i]["isChecked"] = this.currencies[i]["code"] == selectedCurrency;
    }
    // 使用者幣別不在目前選單中，自動新增選項
    if (!isInCurrencies) {
      this.addCurrency(selectedCurrency);
      this.currencies[this.currencies.length - 1]["isChecked"] = true;
    }
    // 將使用者選取之幣別值備存於本機端
    this.storage.set(this.KEY_SELECTED_CURRENCY, selectedCurrency);

    // Init popup currencies 處理幣別額外新增選單
    this.popupCurrencies = SUPPORT_CURRENCIES;
    this.updateSearchFilter();
    this.addAddButton();
    this.sortCurrency();
  }

  @Input()
  set searchInputValue(value: string) {
    this._searchInputValue = value;
    this.updateSearchFilter()
  }

  get searchInputValue(): string {
    return this._searchInputValue.toUpperCase();
  }

  /**
   * On currency item clicked
   * @param index Currency index
   */
  onCurrencyItemClick(index?) {
      if (index === undefined || this.currencies[index]["isAddButton"]) {
        // Add button
        // Unselect all popup items
        for (let i = 0; i < this.popupCurrencies.length; i++) {
          this.popupCurrencies[i]["isChecked"] = false
        }
  
        // Clear search filter
        this._searchInputValue = ""
        this.updateSearchFilter()
  
        // Display currency popup
        this.isCurrencyPopupShown = true
      } else {
        // Currency item
        var code = this.currencies[index]["code"];
        if (code != null && code.length > 0) {
          // this.currencyPara[this.KEY_SELECTED_CURRENCY] = code;
          this.currencyPara = code;
          // 儲存使用者幣別選取值至遠端中台
          this.popup.setLoading(true);
          this.paraMod.updateUserPara(this.KEY_PARA_ID, this.currencyPara).then(
            (userParaMod_res) => {
              console.log(userParaMod_res);
              this.popup.setLoading(false);
            },
            (userParaMod_err) => {
              console.log(userParaMod_err);
              this.popup.setLoading(false);
            }
          );
        }
        // 將使用者選取之幣別值備存於本機端
        this.storage.set(this.KEY_SELECTED_CURRENCY, code);
        // 重新設定選單項目狀態
        for (let i = 0; i < this.currencies.length; i++) {
          this.currencies[i]["isChecked"] = i == index;
        }
      }

    this.sortCurrency();
  }

  /**
   * On popup outbound clicked
   */
  onPopupOutboundClick() {
    this.isCurrencyPopupShown = false
  }

  /**
   * On popup cancel clicked
   */
  onPopupCancelClick() {
    this.isCurrencyPopupShown = false
  }

  /**
   * On popup confirm clicked
   */
  onPopupConfirmClick() {
    this.isCurrencyPopupShown = false;
    //如果都沒有選，就按確定
    if(this.selectedPopupCurrency == "")
    {
      //沒選按確定就當是按x不要動作。
      this.onPopupCancelClick();
      return;
    }
    this.addCurrency(this.selectedPopupCurrency);

    // Save currency codes
    var storageCurrencies = [];
    for (let i = 0; i < this.currencies.length; i++) {
      storageCurrencies[i] = this.currencies[i]["code"];
    }

    
    // 儲存使用者自訂幣別選單至本機裝置
    let currenciesArray = {};
    currenciesArray[this.idUser] = storageCurrencies;
    this.storage.set(this.KEY_CURRENCIES, currenciesArray);
  }

  /**
   * On popup currency item clicked
   * @param index Item index
   */
  onPoupCurrencyItemClick(index) {
    for (let i = 0; i < this.popupFilterCurrencies.length; i++) {
      this.popupFilterCurrencies[i]["isChecked"] = i == index
    }
    this.selectedPopupCurrency = this.popupFilterCurrencies[index]["code"]
  }

  /**
   * Update popup item by input value
   */
  updateSearchFilter() {
    var index = 0
    this.popupFilterCurrencies = []
    if (this.popupCurrencies != null) {
      for (let i = 0; i < this.popupCurrencies.length; i++) {
        let currencyItem = this.popupCurrencies[i]
        if (this._searchInputValue != null && this._searchInputValue.trim().length > 0) {
          if (currencyItem["code"].indexOf(this.searchInputValue) >= 0) {
            if (!this.isContainsCurrencyCode(currencyItem["code"])) {
              this.popupFilterCurrencies[index] = currencyItem
              index++
            }
          }
        } else {
          if (!this.isContainsCurrencyCode(currencyItem["code"])) {
            this.popupFilterCurrencies[index] = currencyItem
            index++
          }
        }
      }
    }
    this.isContainsPopupCurrencies = index > 0
  }

  isContainsCurrencyCode(code): boolean {
    for (let currency of this.currencies) {
      if (currency["code"] == code) {
        return true
      }
    }
    return false
  }

  /**
   * Add currency item
   * @param code Currency code
   */
  addCurrency(code) {
    // Add currency item
    var index = this.currencies.length
    if (index === 10) {
      this.currencies.splice(9,1,{ "code": code });
    } else {
      for (let i = 0; i < this.currencies.length; i++) {
        if (this.currencies[i]["code"] == code) {
          return
        }
        if (this.currencies[i]["isAddButton"]) {
          index = i
        }
      }
      this.currencies[index] = { "code": code }
      // Add add button
      this.addAddButton();
    }   
  }

  /**
   * Add an add button
   */
  addAddButton() {
    // Check if contains popup currencies or not
    if (!this.isContainsPopupCurrencies) {
      return;
    }

    // Check if contains button already or not
    var containsAddButton = false;
    if (this.currencies.length === 10) {
      containsAddButton = true;
    } else {
      for (let i = 0; i < this.currencies.length; i++) {
        if (this.currencies[i]["isAddButton"]) {
          containsAddButton = true;
        }
      }
    }
    
    // Add button
    if (!containsAddButton) {
      this.currencies[this.currencies.length] = { 
        "isAddButton": true ,
        "code": this.langTransService.instant('DEFAULTCURRENCY.CURRENCY_ADD')
      };
    }
  }

  /**
   * 幣別選單項目排序
   * 將選取項排至第一位
   * 將空選項排至最後
   */
  sortCurrency() {
    let firstItem;
    let firstindex;
    
    // 取得語系選取項目與次序編號
    for (let i = 0; i < this.currencies.length; i++) {
      if (this.currencies[i]["isChecked"] == true) {
        firstindex = i;
        firstItem = this.currencies[i];
      }
    }
    // 刪掉原始該選項
    this.currencies.splice(firstindex, 1);
    // 將該選項新增至首位
    this.currencies.splice(0, 0, firstItem);
  }

}
