/**
 * Footer
 */
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutService } from '../../../shared/service/global/layout.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';
import { FunctionListService } from '../../../shared/service/customize/functionList.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { FootList, Home } from '../../../../assets/configuration/foot';

declare var $;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  isOpen = false;
  isLogin = false;

  constructor(
    public router: Router,
    public _layout: LayoutService,
    public storage: LocalStorageService,
    public functionList: FunctionListService,
    public popup: PopupService,
    public ngZone: NgZone
  ) {
    this._layout.footerUpdated.subscribe(
      (status) => {
        this.ngZone.run(() => {
          this.isOpen = status;
        })
        this.boardFixed(); //修正尚未登入Footer造成的留白
      }
    );
    this._layout.footerSourceUpdate.subscribe(
      (value) => {
        this.ngZone.run(() => {
          this.initFoot()
        })
      })
	//附加footer active效果
    this._layout.footerCheckUpdate.subscribe(
      (value) =>{
        this.FootSource.forEach((item) =>{
          if(value == item['link']){
            item['iconClass'] += " active";
            item['pClass'] += " active";
          }else{
            item['iconClass'] = item['iconClass'].replace(/ active/g, '')
            item['pClass'] = item['pClass'].replace(/ active/g, '')
          }
        })
      }
    )
  }

  ngOnInit() {
  }
  FootSource = []
  initFoot() {
    this.FootSource = []
    FootList.forEach(element => {
      if (element["permission"] == undefined) {
        this.FootSource.push(element)
      } else {
        for (var elementSub of element["permission"]) {
          if (typeof elementSub == "string") {
            if (this.functionList.checkHasFunction(elementSub)) {
              this.FootSource.push(element)
              break;
            }
          }
        }
      }
    });
    if (this.checkHome()) {
      this.FootSource.splice(2, 0, Home);
    }

    if (this.FootSource.length > 5) {
      this.FootSource = this.FootSource.slice(0,5);
    }

  }

  checkHome() {
    return this.functionList.checkHasFunctionGroup(FunctionListService.HomeGroupKey);
  }

  linkTo(url) {
    this._layout.clearBackEvent();
    let time = Date.now();
    console.log(url);
    if(url !== this.router.url.substr(0,this.router.url.indexOf('?')) && url !== this.router.url)
    {
      this.popup.setLoading(true);
    }
    
    this.router.navigate([url], { queryParams: { 'time': time.toString() } });
  }

  boardFixed() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.isOpen) {
        $('#mainboad').addClass('UnLogin');
      } else {
        $('#mainboad').removeClass('UnLogin');
      }
    });
  }



  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }
  ngOnDestroy() {
    this._layout.footerUpdated.unsubscribe();
  }
}
