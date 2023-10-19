import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
import { AREA } from '../../../../assets/configuration/area';

/**
 * 業務邏輯排序服務
 */
@Injectable()
export class SortByService {
  
    constructor(
      public storage: LocalStorageService
    ) {}

    /**
     * 排序功能
     * @param date 原始資料
     * @param format format 格式：'id,name'
     */
    public SortBy(value,format) {
        var sortKeys =  (typeof format == 'undefined' || format == '') ? [] : format.split(',');
        value.sort(function (a, b) {
          for(var i = 0 ; i　< sortKeys.length ; i++){
            if(a[sortKeys[i]] != b[sortKeys[i]]){
              return a[sortKeys[i]] - b[sortKeys[i]];
            }
            if(i == sortKeys.length){
              return a[sortKeys[i]] - b[sortKeys[i]];
            }
          }
        });
        return value;
    }

  /**
   * [排序] 帳號選單資料初始化
   * @param dataArray 原始資料陣列
   * @param settings 排序相關設定
   */
  public sortAcctList(dataArray, settings) {
    /*
     * 排序相關設定項目
     * {
     *    [ 必填項目 ]
     *    keyCountry: "原資料之「國別」鍵值",
     *    keyCompanyId: "原資料之「公司統編」鍵值",
     *    keyCompanyName: "原資料之「公司名稱」鍵值",
     *    keyCurrency: "原資料之「帳戶幣別」鍵值",
     *    keyAccout: "原資料之「帳戶帳號」鍵值",
     *    [ 選填項目 ]
     *    showAll: "是否增加全部選項，預設值true",
     *    allDesc: "指定全部項顯示文案，給入完整i18n鍵值",
     *    default: "指定預設欲選取之項目，無時預設值為全部項(使用Item內的desc做判斷)",
     *    allowCountry: "可點選國別項目，預設為false",
     *    allowCompany: "可點選公司項目，預設為false",
     * }
     * 
     * 帳號選單說明
     * 直接用於pop-checklist的來源資料
     * [排序規則]
     *  國別 > 統編+公司名稱 > 幣別 > 帳號
     *  (1) 登入國別相關數據必排首位
     *  (2) TW相關數據必排登入國別次位
     *  (3) 統編、公司均採用自然排序
     *  (4) 幣別排序首位為登入國本幣，次位為TWD，其餘採自然排序
     *  (5) 帳號採用自然排序
     * [選單結構 List]
     *  L1: 全部 (V)
     *  L1: 國別地區 (視設定參數)
     *  L2: 統編 公司 (視設定參數)
     *  L3: 幣別-帳號 (V)
     * [選項結構 Item]
     * {
     *    [ popup用欄位 ]
     *    desc: "",
     *    checked: "",
     *    disabled: "",
     *    [ 數據處理欄位 ]
     *    type: "all / country / company / account",
     *    original: {} / {country:"國別代碼" / {country:"國別代碼", company:"公司統編"} / 原始資料內容，用於選取時提取相對應之資料,
     *    index: "該資料於選單陣列之序號，用於各功能頁面維持項目之選取狀態"
     *    (checked狀態可無須額外控制，pop選單目前checked修改於原陣列資料物件)
     * }
     */

    let country = settings.keyCountry;
    let companyId = settings.keyCompanyId;
    let companyName = settings.keyCompanyName;
    let currency = settings.keyCurrency;
    let account = settings.keyAccout;
    let loginCountry = this.storage.get("loginUserCountry");
    let loginCountryCurrency;
    AREA.forEach((area) => {
      if (area.country == loginCountry)
        loginCountryCurrency = area.currency;
    });

    // 數據排序 [b, a, ......]
    dataArray.sort((a, b) => {
      // 國別相同
      if (a[country] == b[country]) {
        // 統編相同
        if (a[companyId] == b[companyId]) {
          // 公司名稱相同
          if (a[companyName] == b[companyName]) {
            // 幣別相同
            if (a[currency] == b[currency]) {
              // 帳號自然排序
              return a[account] < b[account] ? -1 : 1;
            }
            // 幣別相異
            else {
              // a為登入國本幣，a往前
              if (a[currency] == loginCountryCurrency) 
                return -1;
              // b為登入國本幣，a往後
              else if (b[currency] == loginCountryCurrency) 
                return 1;
              // a為TWD(且b不為登入國本幣)，a往前
              else if (a[currency] == "TWD") 
                return -1;
              // b為TWD(且a不為登入國本幣)，a往前
              else if (b[currency] == "TWD") 
                return 1;
              // 剩餘情況採自然排序
              else 
                return a[currency] < b[currency] ? -1 : 1;
            }
          } 
          // 公司名稱相異，自然排序
          else 
            return a[companyName] < b[companyName] ? -1 : 1;
        }
        // 統編相異，自然排序
        else 
          return a[companyId] < b[companyId] ? -1 : 1;
      } 
      // 國別相異
      else {
        // a為登入國別，a往前
        if (a[country] == loginCountry) 
          return -1;
        // b為登入國別，a往後
        else if (b[country] == loginCountry) 
          return 1;
        // a為台灣(且b不為登入國別)，a往前
        else if (a[country] == "TW") 
          return -1;
        // b為台灣(且a不為登入國別)，a往後
        else if (b[country] == "TW") 
          return 1;
        // 剩餘情況採自然排序
        else 
          return a[country] < b[country] ? -1 : 1;
      }
    });

    // 組織選單資料陣列
    let listData = [];
    let defaultItem = settings['default'];

    // 全部選項
    if (settings['showAll'] == undefined || settings['showAll'] == null || settings['showAll']) {
      let allItem = {
        desc: settings['allDesc'] ? settings['allDesc'] : "BTN.ALL",
        checked: defaultItem ? false : true,
        type: "all",
        original: {},
        index: listData.length
      };
      listData.push(allItem);
    }
    
    let tempCountry;
    let tempCompanyId;
    let countryItem;
    let companyItem;
    let accountItem;
    dataArray.forEach(data => {
      if (tempCountry != data[country]) {
        tempCountry = data[country];
        // 地區選項
        countryItem = {};
        countryItem.desc = "countryCode." + data[country].toString().toUpperCase();
        countryItem.checked = defaultItem == countryItem.desc ? true : false;
        countryItem.disabled = settings['allowCountry'] ? false : true;
        countryItem.type = "country";
        countryItem.original = { country: data[country] };
        countryItem.index = listData.length;
        listData.push(countryItem);

        // 清空公司選項暫存紀錄
        tempCompanyId = undefined;
      }

      if (tempCompanyId != data[companyId]) {
        tempCompanyId = data[companyId];
        // 公司選項
        companyItem = {};
        companyItem.desc = data[companyId] + " " + data[companyName];
        companyItem.checked = defaultItem == companyItem.desc ? true : false;
        companyItem.disabled = settings['allowCompany'] ? false : true;
        companyItem.type = "company";
        companyItem.original = { country: data[country], company: data[companyId] };
        companyItem.index = listData.length;
        listData.push(companyItem);
      }

      // 帳號選項
      accountItem = {};
      accountItem.desc = data[currency] + "-" + data[account];
      accountItem.checked = defaultItem == accountItem.desc ? true : false;
      accountItem.type = "account";
      accountItem.original = data;
      accountItem.index = listData.length;
      listData.push(accountItem);
    });

    return listData;
  }


  /**
   * [排序] 帳號選單資料初始化
   * @param dataArray 原始資料陣列
   * @param settings 排序相關設定
   * 
   * 
   */
  public sortCompanyList(dataArray, settings) {
    /*
     * 排序相關設定項目
     * {
     *    [ 必填項目 ]
     *    keyCountry: "原資料之「國別」鍵值",
     *    keyCompanyId: "原資料之「公司統編」鍵值",
     *    keyCompanyName: "原資料之「公司名稱」鍵值",
     *    [ 選填項目 ]
     *    showAll: "是否增加全部選項，預設值true",
     *    allDesc: "指定全部項顯示文案，給入完整i18n鍵值",
     *    default: "指定預設欲選取之項目，無時預設值為全部項(使用Item內的desc做判斷)"
     * }
     * 
     * 帳號選單說明
     * 直接用於pop-checklist的來源資料
     * [排序規則]
     *  國別 > 統編+公司名稱
     *  (1) 登入國別相關數據必排首位
     *  (2) TW相關數據必排登入國別次位
     *  (3) 統編、公司均採用自然排序
     * [選單結構 List]
     *  L1: 全部 (V)
     *  L1: 國別地區 (V)
     *  L2: 統編 公司 (V)
     * [選項結構 Item]
     * {
     *    [ popup用欄位 ]
     *    desc: "",
     *    checked: "",
     *    disabled: "",
     *    [ 數據處理欄位 ]
     *    type: "all / country / company",
     *    original: {} / {country:"國別代碼" / {country:"國別代碼", company:"公司統編"},
     *    index: "該資料於選單陣列之序號，用於各功能頁面維持項目之選取狀態"
     *    (checked狀態可無須額外控制，pop選單目前checked修改於原陣列資料物件)
     * }
     */

    let country = settings.keyCountry;
    let companyId = settings.keyCompanyId;
    let companyName = settings.keyCompanyName;
    let loginCountry = this.storage.get("loginUserCountry");

    // 數據排序 [b, a, ......]
    dataArray.sort((a, b) => {
      // 國別相同
      if (a[country] == b[country]) {
        // 統編相同
        if (a[companyId] == b[companyId]) {
          // 公司名稱，自然排序
          return a[companyName] <= b[companyName] ? -1 : 1;
        }
        // 統編相異，自然排序
        else 
          return a[companyId] < b[companyId] ? -1 : 1;
      } 
      // 國別相異
      else {
        // a為登入國別，a往前
        if (a[country] == loginCountry) 
          return -1;
        // b為登入國別，a往後
        else if (b[country] == loginCountry) 
          return 1;
        // a為台灣(且b不為登入國別)，a往前
        else if (a[country] == "TW") 
          return -1;
        // b為台灣(且a不為登入國別)，a往後
        else if (b[country] == "TW") 
          return 1;
        // 剩餘情況採自然排序
        else 
          return a[country] < b[country] ? -1 : 1;
      }
    });

    // 組織選單資料陣列
    let listData = [];
    let defaultItem = settings['default'];

    // 全部選項
    if (settings['showAll'] == undefined || settings['showAll'] == null || settings['showAll']) {
      let allItem = {
        desc: settings['allDesc'] ? settings['allDesc'] : "BTN.ALL_COMPANY",
        checked: defaultItem ? false : true,
        type: "all",
        original: {},
        index: listData.length
      };
      listData.push(allItem);
    }
    
    let tempCountry;
    let tempCompanyId;
    let countryItem;
    let comanyItem;
    dataArray.forEach(data => {
      if (tempCountry != data[country]) {
        tempCountry = data[country];
        // 地區選項
        countryItem = {};
        countryItem.desc = "countryCode." + data[country].toString().toUpperCase();
        countryItem.checked = defaultItem == countryItem.desc ? true : false;
        countryItem.type = "country",
        countryItem.original = { country: data[country] };
        countryItem.index = listData.length;
        listData.push(countryItem);

        // 清空公司選項暫存紀錄
        tempCompanyId = undefined;
      }

      if (tempCompanyId != data[companyId]) {
        tempCompanyId = data[companyId];
        // 公司選項
        comanyItem = {};
        comanyItem.desc = data[companyId] + " " + data[companyName];
        comanyItem.checked = defaultItem == comanyItem.desc ? true : false;
        comanyItem.type = "company",
        comanyItem.original = { country: data[country], company: data[companyId] };
        comanyItem.index = listData.length;
        listData.push(comanyItem);
      }
    });

    return listData;
  }
}

