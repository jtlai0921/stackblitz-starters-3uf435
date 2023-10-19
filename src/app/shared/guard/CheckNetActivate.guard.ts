import { Injectable }    from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable }    from 'rxjs';
import { networkStateService } from '../service/cordova/networkState.service';
import { PopupService } from '../service/global/popup.service';
 
@Injectable()
export class CheckNetActivateGuard implements CanActivate {
  constructor(
    private network: networkStateService,
    private popup:PopupService
  ){
    
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|boolean {
    return this.IsConnect();
  }
  IsConnect(){
    if(!this.network.IsConnect()){
      this.popup.setConfirm({
        content:"STARTAPP.ERROR_NET"
      })
      this.popup.setLoading(false);
      return false;
    }
    return true;
  }

}