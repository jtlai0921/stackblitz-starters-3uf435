import { Pipe, PipeTransform } from '@angular/core';
import { LangTransService } from './lang-trans.service'; // our translate service

@Pipe({
  name: 'translate',
  pure: false // impure pipe, update value when we change language
})

export class LangTransPipe implements PipeTransform {
  private is_trans = false;
  private ord_value = ''; // 避免重複執行
  private ord_data = ''; // 避免重複執行
  private ord_lan = '';

  constructor(
    private _translateService: LangTransService
  ) {
    this._initSet();
  }

  /**
   * i18n
   * 每個pipe都是獨立的class實體
   * 以下為避免重複執行_translateService.instant
   */
  transform(value: string, args: string | string[]): any {
    if (this._translateService.currentLang !== this.ord_lan) {
      this._initSet();
    }
    if (value === this.ord_value && this.is_trans) {
      return this.ord_data;
    }
    
    const data = this._translateService.instant(value, args);
    this.ord_data = data;
    this.ord_value = value;
    this.is_trans = true;
    return data;
  }

  private _initSet() {
    this.is_trans = false;
    this.ord_lan = this._translateService.currentLang;
    this._translateService.use(this._translateService.currentLang);
  }


}
