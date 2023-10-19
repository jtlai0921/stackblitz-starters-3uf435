import { Component, OnInit } from '@angular/core';
import { UpdateMobileSessionService } from './shared/service/customize/updateMobileSession.service';
import { LocalStorageService } from './shared/service/global/localStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private updateMobileSession: UpdateMobileSessionService,
    private storage: LocalStorageService,
  ) {
    // APP程式一啟動，註銷掉isLogin紀錄用以消除前次APP使用未執行登出的情況
    this.storage.set('isLogin', false);
  }

  ngOnInit() {
    document.addEventListener("resume", this.updateSession, false);
  }
  updateSession = () => {
    let isLogin = this.storage.get("isLogin");
    if (isLogin) {
      this.updateMobileSession.updateMobileSession();
    }
  }
}
