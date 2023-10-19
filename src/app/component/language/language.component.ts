/**
 * Footer
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { LANGUAGES } from '../../../assets/configuration/language';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { UserParaInqService } from '../../shared/service/customize/userParaInq.service';
import { UserParaModService } from '../../shared/service/customize/userParaMod.service';
import { KEY_USER_PARA, KEY_LANGUAGE_PARA } from '../../../assets/configuration/userParaKey';
import { PopupService } from '../../shared/service/global/popup.service';
@Component({
  templateUrl: './language.component.html'
})

export class LanguageComponent implements OnInit {

  selectedLang = this.storage.get(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE);
  languages = LANGUAGES;
  KEY_PARA_ID = KEY_USER_PARA.LANGUAGE + this.storage.get('idUser');

  constructor(
    public router: Router,
    public layout: LayoutService,
    public storage: LocalStorageService,
    public langtrans: LangTransService,
    private paraInq: UserParaInqService,
    private paraMod: UserParaModService,
    private popup : PopupService
  ) {

    if (this.storage.get('isLogin')) {
      this.layout.setHeaderStatus({
        status: true,
        title: "MENU.TRANSLATE",
        rightIcon: false
      })
    } else {
      this.layout.setHeaderStatus({
        status: true,
        title: "MENU.TRANSLATE",
        backEvent: false,
        rightIcon: "announce"
      })
    }
  }

  ngOnInit() {
    // Selected language
    var isLogin = this.storage.get('isLogin');
    if (isLogin) {
      // 取得遠端中台儲存之使用者語系設定
      this.paraInq.userParaInq(this.KEY_PARA_ID).then(
        (res) => {
          console.log('[變更語系頁][API] userParaInq success.', res);
          this.selectedLang = res["value"];
          this.handleLanguagePara();
        },
        (err) => {
          console.log('[變更語系頁][API] userParaInq failed.', err);
          this.handleLanguagePara();
        }
      );
    } else {
      this.handleLanguagePara();
    }
  }

  /**
   * 處理語系預設行為
   */
  private handleLanguagePara() {
    // 未登入時之訪客共用語系設定
    if (typeof this.selectedLang == 'undefined' || this.selectedLang == '') {
      this.selectedLang = this.storage.get(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE);
    }
    // 系統預設語系
    if (typeof this.selectedLang == 'undefined' || this.selectedLang == '') {
      this.selectedLang = 'zhTW';
      this.storage.set(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE, this.selectedLang);
    }

    // Update local name
    this.updateLocalName();

    console.log("[變更語系頁] handleLanguagePara selectedlang =" + this.selectedLang);
    console.log("[變更語系頁] handleLanguagePara commonlang =" + this.storage.get(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE));
    
    // 關閉Loading畫面
    this.popup.setLoading(false);
  }

  /**
   * On language item clicked
   * @param item Language item
   */
  onLanguageItemClick(item) {
    var isLogin = this.storage.get('isLogin');
    this.selectedLang = item['code'];
    console.log("[變更語系頁] onLanguageItemClick selectedLang =" + this.selectedLang);
    
    // 使用者已登入狀態，更新中台儲存參數設定
    if (isLogin) {
      this.paraMod.updateUserPara(this.KEY_PARA_ID, this.selectedLang).then(
        (res) => {
          console.log("[變更語系頁][API] userParaMod success", res);
        },
        (err) => {
          console.log("[變更語系頁][API] userParaMod failed", err);
        }
      );
    }
    // 更新手機端參數設定
    this.storage.set(KEY_LANGUAGE_PARA.SELECTED_LANGUAGE, this.selectedLang);
    
    this.updateLocalName();
    //update i18N Language
    if (this.selectedLang) {
      this.langtrans.use(this.selectedLang);
    }
  }

  /**
   * Update language items local name
   */
  updateLocalName() {
    var localLang = null;
    for (const language of this.languages) {
      if (language["code"] == this.selectedLang) {
        localLang = language;
        break;
      }
    }
    if (localLang != null) {
      for (const language of this.languages) {
        language["localName"] = localLang[language["code"]]
      }
    }
  }
}




