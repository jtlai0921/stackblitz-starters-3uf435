export class HeaderOptions {
    style: string;  // 背景樣式 normal(預設)/login/user_home normal:一般頁面 user_home:登入後顯示帳戶資訊
    showMainInfo: boolean; // 是否顯示帳戶資訊(only for user-home)
    leftBtnIcon: string; // 'back'為上一頁圖示、'cancel'為取消文字、''空值為不顯示
    backPath: string; // 返回路徑預設為前頁
    title: string; // 'header_logo'時顯示"上海銀行"圖片，其他則為i18n KeyName
    rightBtnIcon: string; // 'qrcode'為qrcode圖示、'edit'為編輯文字、'finish'為完成文字、'customer_service'為客服圖示、''空值為不顯示
    header: string; // 'header_logo'為圖示、'header_logo_dark'為圖示、''空值為title標題
    headerClass: string;

    constructor() {
        this.style = 'normal';
        this.showMainInfo = false;
        this.leftBtnIcon = '';
        this.title = '';
        this.backPath = '';
        this.rightBtnIcon = '';
        this.header = 'header_logo';
        this.headerClass = 'header_group flex_row_cb';
    }
}
