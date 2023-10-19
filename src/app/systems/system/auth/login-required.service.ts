import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { AppCtrlService } from '../app-ctrl/app-ctrl.service';

@Injectable()
export class LoginRequired implements CanActivate {

  constructor(
    private authService: AuthService,
    private appCtrlService: AppCtrlService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.checkIsLoggedIn()) { return true; }

    // 儲存現在的 URL，這樣登入後可以直接回來這個頁面
    this.appCtrlService.redirectUrl = url;
    // this.localStorageService.set('redirectUrl', url);
    // 導回登入頁面
    this.router.navigate(['/login']);
    return false;
  }

}
