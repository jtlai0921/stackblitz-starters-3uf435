/**
 * API 發送選項設定
 * @param header 自定Header
 * @param background 背景執行
 * @param simOpt 模擬選項
 */
import { API_TOKEN_REQUEST } from './api-formate';
import { ObjectUtil } from '@util/formate/modify/object-util';
import { CacheData } from '@systems/system/cache/cache-data';



export class TelegramOption {
    header?: object;
    background?: boolean; // true:背景發送, false:啟動loading
    simOpt?: string;
    useCache?: boolean;
    cacheOpton?: CacheData;

    constructor() {
        this.header = ObjectUtil.clone(API_TOKEN_REQUEST);
        this.background = false;
    }
}
