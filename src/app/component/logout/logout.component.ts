import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { LayoutService } from '../../shared/service/global/layout.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    public router: Router,
    public storage: LocalStorageService,
    public layout: LayoutService,) { }

  ngOnInit() {
    this.layout.setHeaderStatus({
      status: true,
      title: " ",
      rightIcon: "announce"
    });
    this.storage.set("DemoLoginType", "0");

    /**
     * 避免在約定轉帳直接登出資料無法清空(logoutservice 在 ngDestroy之前)
     */
    this.storage.set("agreeUnfinishData","");


  }

  goHome(){
    this.router.navigate(["/login"],{queryParams:{'type':'logout'}});  
  }
}
