export class AlertOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱

    constructor() {
        this.title = 'ERROR.INFO_TITLE'; // 提醒您
        this.btnTitle = 'BTN.CHECK';
    }
}
