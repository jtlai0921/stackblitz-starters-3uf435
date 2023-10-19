import { InjectionToken } from '@angular/core'

// import translations
import { LANG_ENUS_NAME, LANG_ENUS_TRANS } from './lang/lang-en-US';
import { LANG_ZHTW_NAME, LANG_ZHTW_TRANS } from './lang/lang-zh-TW';
import { LANG_ZHCN_NAME, LANG_ZHCN_TRANS } from './lang/lang-zh-CN';
import { LANG_VIVN_NAME, LANG_VIVN_TRANS } from './lang/lang-vi-VN';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// all traslations
const dictionary = {};
dictionary[LANG_ENUS_NAME] = LANG_ENUS_TRANS;
dictionary[LANG_ZHTW_NAME] = LANG_ZHTW_TRANS;
dictionary[LANG_ZHCN_NAME] = LANG_ZHCN_TRANS;
dictionary[LANG_VIVN_NAME] = LANG_VIVN_TRANS;
// providers
export const TRANSLATION_PROVIDERS = [
  { provide: TRANSLATIONS, useValue: dictionary }
];
