import { PopupService } from "../../shared/service/global/popup.service";
import { DateTimeService } from "../../shared/service/global/daettime.service";
import { LocalStorageService } from "../../shared/service/global/localStorage.service";
import { UserParaInqService } from "../../shared/service/customize/userParaInq.service";
import { ForExRateDetailsInqService } from "../../shared/service/customize/forExRateDetailsInq.service";
import { EX_RATE_AREA } from "../../../assets/configuration/exRateArea";
import { KEY_USER_PARA, KEY_EX_RATE_CURRENCIES_PARA } from "../../../assets/configuration/userParaKey";
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';

export class ExchangeRateModel {

    /** Key for query remote parameter  */
    public KEY_PARA_ID = KEY_USER_PARA.EX_RATE_CURRENCIES + this.storage.get('idUser');
    /** Key for selected currencies in local storage and remote parameter */
    public KEY_SELECTED_CURRENCIES;

    public isAutocompletedShown;        // Is shown auto complete or not
    public queryDate;                   // Query date
    public userPara;                    // Remote user parameter 
    public countryList;                 // Contry list
    public currencyList;                // Currency list
    public exRateDetailList;            // Query exchange rate detail result
    public autocompleteList;            // Auto complete currency list
    public selectedCountry;             // Selected country
    public selectedCurrency;            // Selected currency
    public selectedCurrencyList;        // Selected currency list
    public selectedCashCurrencyList;    // Selected currency list

    private _inputKeyword;          // Search keyword by user input

    constructor(
        private popup: PopupService,
        private dateTime: DateTimeService,
        private storage: LocalStorageService,
        private userParaInqService: UserParaInqService,
        private forExRateDetailsInqService: ForExRateDetailsInqService,
        private shouldQueryExchangedRate: boolean,
        private onDataUpdated: (() => void),
        private onAutocompleteUpdated: (() => void),
        private onAutocompleteItemClick: ((currency) => void),
        private pageType: string,
        private langTrans: LangTransService,

    ) {
        // Init country list
        this.countryList = EX_RATE_AREA;
    }

    /**
     * Init selected country
     */
    public initSelectedCountry() {
        // Init country
        this.selectedCountry = null;

        // 01. By default currency
        const defaultCurrency = this.storage.get("slectedCurrency");
        for (const item of this.countryList) {
            if (item.currency == defaultCurrency) {
                this.selectedCountry = item.country;
                break;
            }
        }

        // 02. By user country
        if (this.selectedCountry == null) {
            const loginUserCountry = this.storage.get("loginUserCountry");
            for (const item of this.countryList) {
                if (item.country == loginUserCountry) {
                    this.selectedCountry = item.country;
                    break;
                }
            }
        }

        // 03. By user country
        if (this.selectedCountry == null) {
            const userCountry = this.storage.get("UserCountry");
            for (const item of this.countryList) {
                if (item.country == userCountry) {
                    this.selectedCountry = item.country;
                    break;
                }
            }
        }

        // 04. By area
        if (this.selectedCountry == null) {
            const area = this.storage.get("Area");
            for (const item of this.countryList) {
                if (item.country == area) {
                    this.selectedCountry = item.country;
                    break;
                }
            }
        }

        // 05. By first item
        if (this.selectedCountry == null) {
            this.selectedCountry = this.countryList[0].country;
        }

        // Swap current country to first one
        for (let index = 0; index < this.countryList.length; index++) {
            if (this.countryList[index].country == this.selectedCountry) {
                const temp = this.countryList[index];
                this.countryList[index] = this.countryList[0];
                this.countryList[0] = temp;
                break;
            }
        }

        // On country selected event
        this.onCountrySelected(this.selectedCountry);
    }

    /**
     * On country option item selected
     * @param event Selected event
     */
    public onCountrySelected(event) {
        // Storage selected country
        this.selectedCountry = event;

        // Find country currency
        for (const item of this.countryList) {
            if (item.country == event) {
                this.selectedCurrency = item.currency;
                break;
            }
        }

        // Update storage key
        this.KEY_SELECTED_CURRENCIES = this.getStorageKey(this.selectedCountry);

        // Check user parameter exist or not
        if (this.userPara == null) {
            // Get remote parameter for selected currency list
            this.getRemoteSelectedCurrencyList();
        } else {
            // Update selected currency list
            this.updateSelectedCurrencyList();

            // Query exchange rate detail
            this.forExRateDetailsInq();
        }
    }

    /**
     * Get storage key with target country code
     * @param country Target country code
     */
    public getStorageKey(country): string {
        return KEY_EX_RATE_CURRENCIES_PARA.SELECTED_CURRENCIES + this.pageType + "_" + country;
    }

    /**
     * Get remote selected currency list 
     */
    private getRemoteSelectedCurrencyList() {
        if (this.storage.get("isLogin")) {
            // Display loading page
            this.popup.setLoading(true);
            // 如果登入才要取回個人設定 Get remote user parameter
            this.userParaInqService.userParaInq(this.KEY_PARA_ID)
                .then(this.onUserParaInqSuccess, this.onUserParaInqFailed);
        } else {
            this.userPara = {};
            // Init selected currency list
            this.updateSelectedCurrencyList();

            // Query exchange rate detail
            this.forExRateDetailsInq();
        }
    }

    /**
     * On get remote data success
     */
    private onUserParaInqSuccess = (res) => {
        // DEBUG
        console.log('[Get selected currencies success]', res);

        // Storage user parameter
        this.userPara = res;

        // Init selected currency list
        this.updateSelectedCurrencyList();

        // Query exchange rate detail
        this.forExRateDetailsInq();
    }

    /**
     * On get remote data failed
     */
    private onUserParaInqFailed = (err) => {
        // DEBUG
        console.log('[Get selected currencies failed]', err);

        // Init selected currency list
        this.updateSelectedCurrencyList();

        // Query exchange rate detail
        this.forExRateDetailsInq();
    }

    /**
     * Update selected currency list
     */
    private updateSelectedCurrencyList() {
        // Init selected currency list
        this.selectedCurrencyList = [];

        // 01. Get remote selected currencies
        if (this.userPara != null) {
            var remoteData = this.userPara[this.KEY_SELECTED_CURRENCIES];
            if (remoteData != null && remoteData.length >= 3) {
                var splitRemoteData = remoteData.split("|");
                for (const currency of splitRemoteData) {
                    if (currency.length == 3) {
                        this.selectedCurrencyList[this.selectedCurrencyList.length] = currency;
                    }
                }
            }
        }

        // 02. Get storage selected currencies
        if (this.selectedCurrencyList == null || this.selectedCurrencyList.length == 0) {
            this.selectedCurrencyList = this.storage.get(this.KEY_SELECTED_CURRENCIES);
        }

        // 03. Add default currencies if data not exist
        if (this.selectedCurrencyList == null) {
            // Construct currency list array
            this.selectedCurrencyList = ["TWD", "USD", "EUR", "GBP", "JPY", "HKD", "CNH", "CNY", "SGD", "VND", "INR", "PHP", "IDR", "THB", "CAD", "AUD", "ZAR"];

            // Remove current currency if page type equals CONVERTER
            if (this.pageType == "CONVERTER") {
                for (const area of EX_RATE_AREA) {
                    if (area.country == this.selectedCountry) {
                        var index = this.selectedCurrencyList.indexOf(area.currency);
                        if (index > -1) {
                            this.selectedCurrencyList.splice(index, 1);
                        }
                        break;
                    }
                }
            }

            // Sotrage defalut currency list
            this.storage.set(this.KEY_SELECTED_CURRENCIES, this.selectedCurrencyList);
        }
    }


    public initSelectedCashCurrencyList() {
        this.selectedCashCurrencyList = ["USD", "JPY", "CNY", "HKD", "EUR", "AUD"]
    }

    /**
     * Query exchange rate detail
     */
    private forExRateDetailsInq() {
        // Check should query exchange rate or not
        if (this.shouldQueryExchangedRate == null || this.shouldQueryExchangedRate == false) {
            if (this.onDataUpdated != null) {
                this.onDataUpdated();
            }
            return;
        }

        // Display loading page
        this.popup.setLoading(true);

        // Clear data feilds
        this.queryDate = "";
        this.currencyList = [];
        this.exRateDetailList = [];

        // Query exchnage rate detail
        this.forExRateDetailsInqService.forExRateDetailsInq(
            this.selectedCountry).then(this.forExRateDetailSuccess, this.forExRateDetailFailed);
    }

    /**
     * On query exchange rate detail success
     */
    private forExRateDetailSuccess = (res) => {
        // DEBUG
        console.log("[Get exchange rate detail success]", res);

        // Storage exchange rate detail
        this.exRateDetailList = res;

        // Limit number
        for (const detail of this.exRateDetailList) {
            detail.BuyRate = parseFloat(detail.BuyRate).toFixed(6);
            detail.SellRate = parseFloat(detail.SellRate).toFixed(6);
        }

        // Update currency list
        for (const detail of this.exRateDetailList) {
            if (this.currencyList.indexOf(detail.CurCodeFrom) < 0) {
                this.currencyList[this.currencyList.length] = detail.CurCodeFrom;
            }
        }

        // Update query date 
        this.queryDate = this.dateTime.datetimeFormat(new Date().getTime(), "yyyy/MM/dd hh:mm:ss");

        // Notify data updated
        if (this.onDataUpdated != null) {
            this.onDataUpdated();
        }

        this.popup.setGestures({
            'reload_close': true
          });
        // Dismiss loading page
        this.popup.setLoading(false);
    }

    /**
     * On query exchange rate detail failed
     */
    private forExRateDetailFailed = (err) => {
        // DEBUG
        console.log("[Get exchange rate detail failed]", err);

        this.popup.setGestures({
            'reload_close': true
          });
        // Dismiss loading page
        this.popup.setLoading(false);

        // // Display error message
        // this.popup.setConfirm({}
        //     content: this.langTrans.instant("ERROR.ERROR_" + err.HeaderRs.Result) + "(" + err.HeaderRs.Result + ")"
        // });
    }

    /**
     * Set input keyword
     */
    set inputKeyword(value: string) {
        // Update value
        this._inputKeyword = value;

        // Find selected country's currency
        var skipCurrency;
        for (const area of EX_RATE_AREA) {
            if (area.country == this.selectedCountry) {
                skipCurrency = area.currency;
                break;
            }
        }

        // Update autocomplete list
        this.autocompleteList = [];
        if (value != null && value.length > 0) {
            for (const currency of this.currencyList) {
                if (currency != skipCurrency) {
                    if (currency.toUpperCase().indexOf(value.toUpperCase()) >= 0) {
                        if (this.selectedCurrencyList.indexOf(currency) < 0) {
                            if (this.autocompleteList.indexOf(currency) < 0) {
                                this.autocompleteList[this.autocompleteList.length] = currency;
                            }
                        }
                    }
                }
            }
        }

        // Display auto complete
        this.isAutocompletedShown = this.autocompleteList.length > 0;

        // Notify data updated
        if (this.onAutocompleteUpdated != null) {
            this.onAutocompleteUpdated();
        }
    }

    /**
     * Get input keyord
     */
    get inputKeyword(): string {
        return this._inputKeyword;
    }

    /**
     * On auto complete outbounds clicked
     */
    public onAutocompleteOutboundsClick() {
        // Dismiss auto complete
        this.isAutocompletedShown = false;
    }

    /**
     * On auto complete item clicked
     * @param currency Currency code
     */
    public onAutocompleteClick(currency) {
        if (this.onAutocompleteItemClick != null) {
            this.onAutocompleteItemClick(currency);
        }
    }
}