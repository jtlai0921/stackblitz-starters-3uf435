import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AREA } from '../../../assets/configuration/area';
import { GetAnnouncementService } from '../../shared/service/customize/getAnnouncement.service';
import { PopupService } from '../../shared/service/global/popup.service';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html'
  // ,styleUrls: ['./select-location.component.css']
})
export class SelectLocationComponent implements OnInit {

  public defaultLang;
  public data = AREA;
  public className = '';
  constructor(
    private router: Router,
    private popup: PopupService,
    private layout: LayoutService,
    private storage: LocalStorageService,
    private announcementService: GetAnnouncementService
  ) {
    this.layout.setHeaderStatus({ status: false })
  }

  ngOnInit() {
    if(this.data.length > 3){
      this.className = 'col-xs-6 country-area-card-25';
    }
    if(this.data.length == 3){
      this.className = 'col-xs-12 country-area-card-30';
    }
    if(this.data.length == 2){
      this.className = 'col-xs-12 country-area-card-50';
    }
    if(this.data.length == 1){
      this.setLang(this.data[0]);
    }
  }


  setLang(item) {
    // Define area code
    const langCode = item.lang;
    const area = JSON.stringify(langCode).substr(3, 2);

    // Storage area code
    console.log('[選擇預設區域] 選擇預設區域: ', area);
    this.storage.set('Area', area);

    // Get announcement
    console.log('[選擇預設區域] 查詢最新公告...');
    this.popup.setLoading(true);
    this.announcementService.getAllAnnouncement(this.storage.get('Area'), this.storage.get('Commonlang')).then(
      (announcement_res) => {
        console.log('[選擇預設區域] 成功查詢最新公告: ', announcement_res);
        this.onGetAnnouncementCompleted();
      },
      (announcement_err) => {
        console.log('[選擇預設區域] 查詢最新公告失敗: ', announcement_err);
        this.onGetAnnouncementCompleted();
      }
    );
  }

  onGetAnnouncementCompleted() {
    this.popup.setLoading(false);
    if (this.storage.get('tour')) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/tour']);
    }
  }
}



