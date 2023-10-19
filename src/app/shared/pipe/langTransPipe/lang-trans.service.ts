/**
 * 語系變換與i18n
 */
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Config } from '../../../../assets/configuration/config';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
// import translations
import { LANG_ENUS_NAME, LANG_ENUS_TRANS } from './lang/lang-en-US';
import { LANG_ZHTW_NAME, LANG_ZHTW_TRANS } from './lang/lang-zh-TW';
import { LANG_ZHCN_NAME, LANG_ZHCN_TRANS } from './lang/lang-zh-CN';
import { LANG_VIVN_NAME, LANG_VIVN_TRANS } from './lang/lang-vi-VN';

@Injectable()
export class LangTransService {
  private _currentLang: string;
  private PLACEHOLDER = '%';
  private _defaultLang: string;
  private _fallback: boolean;
  public onLangChanged: EventEmitter<string> = new EventEmitter<string>();
  private _translationList: any;
  private _translations = {};
  private cacheTrans = {}; // cache
  private is_trans = false;

  // inject our translations
  constructor(
    public storage: LocalStorageService
  ) {
    this.createDictionary();
    const lang = this.getBrowserLanguage();
    this.setDefaultLang(lang);
    this.use(this._defaultLang);
  }

  private _initSet() {
    this.is_trans = false;
  }

  private createDictionary() {
    this._translations[LANG_ENUS_NAME] = LANG_ENUS_TRANS;
    this._translations[LANG_ZHTW_NAME] = LANG_ZHTW_TRANS;
    this._translations[LANG_ZHCN_NAME] = LANG_ZHCN_TRANS;
    this._translations[LANG_VIVN_NAME] = LANG_VIVN_TRANS;
  }

  /**
   * 特數設定，非中文就顯示英文
   * @param lang
   */
  private langConfig(lang: string) {
    // const res = /^zh/;
    // if (res.test(lang)) {
    //   lang = 'zh-TW';
    // } else {
    //   lang = 'en-US';
    // }
    const res = /^zh/;
    if (/^enUS/.test(lang)) {
      lang = 'en-US';
    } else if (/^zhCN/.test(lang)) {
      lang = 'zh-CN';
    } else if (/^viVN/.test(lang)) {
      lang = 'vi-VN';
    }else{
      lang = 'zh-TW';
    }
    return lang;
  }

  /**
   * 取得當前語系
   */
  public get currentLang() {
    var _lang = this.storage.get('Commonlang');
    if(_lang){
      this._currentLang = this.langConfig(_lang);;
    }
    return this._currentLang || this._defaultLang;
  }

  /**
   * 變換語系
   * @param lang 語系
   */
  public use(lang: string): void {
    // == 特數設定，非中文就顯示英文 == //
    lang = this.langConfig(lang);
    this._currentLang = lang;
    this._modifyTransList();
    this.onLangChanged.emit(lang);
    this.cacheTrans = {};
  }

  // 取得裝置語系代碼
  public getBrowserLanguage() {
    let locale;
    // On mobile
    locale = navigator.userAgent.match(/[a-z]{2}-[a-z]{2}/); // because Android navigator.language always returns 'en'
    if (locale) {locale = locale[0]}
    locale = locale || navigator.language;
    return locale;
  }

  /**
   * 換語系
   * @param key 換的key
   * @param words
   */
  public instant(key: string, words?: string | string[]) {
    let data = key;

    const translation: string = this.translate(key);

    if (translation) {
      data = (words) ? this.replace(translation, words) : translation;
      // console.error('lan:', key, data);
    }
    return data;
  }

  public enableFallback(enable: boolean) {
    this._fallback = enable;
  }

  /**
   * 設定語系
   * @param lang 語系
   */
  private setDefaultLang(lang: string) {
    this._defaultLang = lang;
  }

  // For 迴圈迭代找出 translation 物件之相對層數、
  private translate(propString: string) {
    let data = propString;
    if (!propString) {
      return data;
    }
    propString = propString.toString();

    // == 判斷cache == //
    if (this.cacheTrans.hasOwnProperty(propString)) {
      // == has cache == //
      return this.cacheTrans[propString];
    }


    const transObj = this._translationList;
    if (transObj.hasOwnProperty('list') && transObj.list.hasOwnProperty(propString)) {
      data = transObj.list[propString];
    } else if (transObj.hasOwnProperty('obj')) {
      let obj = JSON.parse(JSON.stringify(transObj.obj));
      const props = propString.split('.');
      let prop, key;
      if (props.length > 1) {
        for (key in props) {
          if (!props.hasOwnProperty(key)) {
            continue;
          }
          prop = props[key];
          if (obj && obj.hasOwnProperty(prop)) {
            obj = obj[prop];
          } else {
            break;
          }
        }
      } else if (obj.hasOwnProperty(propString)) {
        obj = obj[propString];
      }

      if (obj && typeof obj !== 'object') {
        data = obj;
        this._translationList.list[propString] = obj;
      }
    }
    this.cacheTrans[propString] = data;
    // console.log('lan:', propString, this.currentLang, this.cacheTrans[propString]);
    return data;
  }

  /**
   * 置換
   * @param word
   * @param words
   */
  private replace(word: string = '', words: string | string[] = '') {
    let translation: string = word;

    const values: string[] = [].concat(words);
    values.forEach((e, i) => {
      translation = translation.replace(this.PLACEHOLDER.concat(<any>i), e);
    });

    return translation;
  }

  /**
   * 處理
   */
  private _modifyTransList() {
    const obj = this._translations[this.currentLang];
    this._translationList = {
      obj : obj,
      list : {}
    };
  }

  public ClearCache(){
    this.cacheTrans = {};
  }

}
