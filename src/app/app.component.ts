import { Component, OnInit } from '@angular/core';
import { Logger } from '@systems/system/logger/logger.service';
import { LanguageChangeService } from '@systems/system/language/language-change.service';
import { LayoutCtrlService } from '@systems/route/layout/layout-ctrl.service';
import { InitService } from '@systems/system/init/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LanguageChangeService]
})
export class AppComponent implements OnInit {
  title = 'scsb';

  constructor(
    private languageService: LanguageChangeService,
    private layoutCtrlService: LayoutCtrlService,
    private initService: InitService
  ) {
    this.languageService.setDefaultLanguage(); // 改語系
    this.layoutCtrlService.init(); // 畫面控制
  }

  ngOnInit() {
    this.initService.init();
  }

}
