/**
 * 取得系統語系
 */
import { Injectable } from '@angular/core';
import { CTBC_PlugIn } from './_interface';

@Injectable()
export class PreferredLanguageService {
    /**
     * 參數設定
     */
    constructor() { }

    public getPreferredLanguage() {
        return new Promise((resolve, reject) => {
            CTBC_PlugIn.getPreferredLanguage(
                (success) => {
                    let lang = this.convertLangCode(success.value);
                    resolve(lang);
                }, 
                (error) => {
                    reject('Error getting language');
                }
            );
        });
    }

    /**
     * 轉換語系代碼
     * @param original 原始裝置語系代碼
     */
    public convertLangCode(original:string) {
        console.log('[lang] device orginal language =', original);
        // default value
        let lang = "enUS";

        original = original.toUpperCase();
        // 中文語系特殊處理
        if (original.includes("ZH")) {
            if (original.includes("TW"))
                lang = "zhTW";  // 台灣繁體中文
            else
                lang = "zhCN";  // 其他地區預設簡體中文
        }
        // 越南文語系
        if (original.includes("VI"))
            lang = "viVN";
        // 日本文語系
        if (original.includes("JA"))
            lang = "jaJP";

        return lang;
    }

}
