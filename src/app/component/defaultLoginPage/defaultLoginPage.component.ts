import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../shared/service/global/layout.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { UserParaInqService } from '../../shared/service/customize/userParaInq.service';
import { UserParaModService } from '../../shared/service/customize/userParaMod.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';;
import { DEFAULT_LOGIN_PAGE_CONFIGURATIONS, getDefaultLoginPage } from '../../../assets/configuration/defaultLoginPage';
import { KEY_USER_PARA, KEY_DEFAULT_LOGIN_PAGE_PARA } from '../../../assets/configuration/userParaKey';
import { FunctionListService } from '../../shared/service/customize/functionList.service';
import { DoLoginService } from 'src/app/shared/service/customize/doLogin.service';

/**
 * 預設登入頁
 */
@Component({
  selector: 'app-default-login-page',
  templateUrl: './defaultLoginPage.component.html',
  styleUrls: ['./defaultLoginPage.component.css']
})
export class DefaultLoginPageComponent implements OnInit {

  private KEY_PARA_ID = KEY_USER_PARA.DEFAULT_LOGIN_PAGE + this.storage.get('idUser');
  private KEY_SELECTED_PAGE = KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE;

  public selectedPage;
  public defaultLoginPagePara = {};
  public itemList = DEFAULT_LOGIN_PAGE_CONFIGURATIONS;

  constructor(
    private popup: PopupService,
    private layout: LayoutService,
    private storage: LocalStorageService,
    private paraInq: UserParaInqService,
    private paraMod: UserParaModService,
    private functionList:FunctionListService,
    private doLoginService: DoLoginService
  ) {
    // Init layout
    this.layout.setHeaderStatus({
      status: true,
      title: 'DEFALUT_LOGIN_PAGE.TITLE'
    });

  }

  ngOnInit() {
    // Display loading page
    this.popup.setLoading(true);

    
    //控制是否因為權限而隱藏，現在不管有沒有權限都顯示
    for (const item of this.itemList) {
      item.isOpen = false;
      item["isShow"] = true;
      if(item.child != undefined){

      //   var show = false;
      //   for (const child of item.child) {
      //     child["isShow"] = this.checkDefaultLoginPage(child);
      //     if(child["isShow"]){
      //       show = true;
      //     }
      //   }
      //   item["isShow"] = show;
      // }else{
      //   item["isShow"] = this.checkDefaultLoginPage(item);
      
        for (const child of item.child) {
          child["isShow"] = true;
        }
      }
    }

    // 預設L2全部展開
    for (const item of this.itemList) {
      console.log("item.child  " + item.child);
      if (item.child != null) {
        for (const child of item.child) {
          // if (child.key == this.selectedPage) {
            item.isOpen = true;
          // }
        }
      }
    }

    // Get remote user parameter
    this.paraInq.userParaInq(this.KEY_PARA_ID).then(
    this.onUserParaInqSuccess, this.onUserParaInqError);
  
      

  }
  private checkDefaultLoginPage(defaultLoginPage) {
    if (defaultLoginPage.permission != undefined) {
      if (!this.functionList.checkHasFunction(defaultLoginPage.permission)) {
        return false;
      }
    }
    if (defaultLoginPage.permissionGroup != undefined) {
      if (!this.functionList.checkHasFunctionGroup(defaultLoginPage.permissionGroup)) {
        return false;
      }
    }
    return true
  }
  /**
   * On get remote user parameter success
   */
  private onUserParaInqSuccess = (res) => {
    // DEBUG
    console.log('get default login page success.', res);

    if (res.length > 0) {
      // Storage parameter
      this.defaultLoginPagePara = res[0].Value;

      // Get remote selected page and find match item
      // var remoteSelectedPage = this.defaultLoginPagePara[this.KEY_SELECTED_PAGE];
      var remoteSelectedPage = this.defaultLoginPagePara;
      this.selectedPage = getDefaultLoginPage(remoteSelectedPage).key;

      //判斷電文預設登入頁是否有權限，沒有權限則預設登入頁則從localStorage取得
      let defaultLoginPage = getDefaultLoginPage(this.selectedPage);
     
      if(!this.doLoginService.checkDefaultLoginPage(defaultLoginPage)){
        this.selectedPage = this.storage.get(this.KEY_SELECTED_PAGE);
      }

      console.log(this.selectedPage);

    }
     else {
      let storageSelectedPage = this.storage.get(this.KEY_SELECTED_PAGE);
      if (!storageSelectedPage) {
        this.selectedPage = 'HOME';
      } else {
        this.selectedPage = storageSelectedPage;
      }
    }

    // Storage selected page
    this.storage.set(this.KEY_SELECTED_PAGE, this.selectedPage);




    // Dismiss loading page
    this.popup.setLoading(false);
  }

  /**
   * On get remote user parameter failed
   */
  private onUserParaInqError = (err) => {
    // DEBUG
    console.log('get default login page failed.', err);
    if (err.HeaderRs.Result == 13) {
      // 錯誤走預設登入頁會取前一次紀錄，如無紀錄預設為首頁
      this.selectedPage = this.storage.get(this.KEY_SELECTED_PAGE);
      if(!this.selectedPage){
        this.selectedPage = "HOME";
        this.storage.set(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE, "HOME");
      }      
    } else {

      this.selectedPage = this.storage.get(this.KEY_SELECTED_PAGE);
      if(!this.selectedPage){
        this.selectedPage = "HOME";
        this.storage.set(KEY_DEFAULT_LOGIN_PAGE_PARA.SELECTED_PAGE, "HOME");
      }    
      // Display error message popup
      this.popup.setConfirm({
        content: 'ERROR.ERROR_' + err.HeaderRs.Result,
        event: () => {

        }
      });

    }

    // Dismiss loading page
    this.popup.setLoading(false);
  }

  /**
   * On option item clicked
   * @param value Option value
   */
  public onOptionClick(value) {

    // Stroage selected value
    this.selectedPage = value;
    // Update user parameter
    this.updateUserParamer();
  }

  /**
   * On option radio button selected
   * @param event Selected event
   */
  public onOptionSelected(event) {
    // Update user parameter
    this.updateUserParamer();
  }

  /**
   * Update user parameter
   */
  private updateUserParamer() {
    // Display loading page 
    this.popup.setLoading(true);

    // Storage selected page
    this.storage.set(this.KEY_SELECTED_PAGE, this.selectedPage);

    // Update remote user parameter
    this.defaultLoginPagePara = this.selectedPage;
    this.paraMod.updateUserPara(this.KEY_PARA_ID, this.defaultLoginPagePara)
      .then(this.onUpdateUserParamerSuccess, this.onUpdateUserParamerFailed);
  }

  /**
   * On update remote user parameter success
   */
  private onUpdateUserParamerSuccess = (res) => {
    // DEBUG
    console.log('update user parameter success.', res);

    // Dismiss loading page
    this.popup.setLoading(false);
  }

  /**
   * On update remote user parameter failed
   */
  private onUpdateUserParamerFailed = (err) => {
    // DEBUG
    console.log('update user parameter failed.', err);

    // Dismiss loading page
    this.popup.setLoading(false);
  }
}
