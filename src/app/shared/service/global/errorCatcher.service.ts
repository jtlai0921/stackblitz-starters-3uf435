import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { PopupService } from "./popup.service";
import { LangTransService } from "../../pipe/langTransPipe/lang-trans.service";

@Injectable()
export class ErrorCatcherService implements ErrorHandler {

    public errMsg;

    constructor(
        private popup: PopupService,
        private langTran: LangTransService,
        private zone: NgZone
    ) {
        this.errMsg = this.langTran.instant("ERROR.ERROR_9998") + "(9998)";
    }

    handleError(error) {
        console.error('[ErrorCatcher] error', error);
        this.zone.run(() => {
            // 關閉loading效果畫面
            this.popup.setLoading(false);
            // 顯示錯誤訊息
            // this.popup.setConfirm({
            //     content: this.errMsg
            // });
        });
    }
}