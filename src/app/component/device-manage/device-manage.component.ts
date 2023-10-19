import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { DeviceManageDynamicComponentService } from './device-manage-dynamic-component.service';
import { DeviceManageDynamicComponentDirective } from './device-manage-dynamic-component.directive';
import { GetDeviceListService } from '../../shared/service/customize/get-device-list.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { DeviceManageDeviceListComponent } from './device-mange-device-list';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { LayoutService } from '../../shared/service/global/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-manage',
  templateUrl: './device-manage.component.html',
  styleUrls: ['./device-manage.component.css']
})
export class DeviceManageComponent implements OnInit {

  public isAPIReqponse = false;
  public isViewInitialized = false;
  public selected = "";
  public registerActive = true;
  public otpActive = false;

  @ViewChild(DeviceManageDynamicComponentDirective) componentHost: DeviceManageDynamicComponentDirective;

  constructor(
    private dynamicComponentService: DeviceManageDynamicComponentService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private getDeviceListService: GetDeviceListService,
    private _langTransService: LangTransService,
    private layout: LayoutService,
    private router: Router,
    private popup: PopupService
  ) {

  }

  ngOnInit() {
    this.layout.setHeaderStatus({
      status : true,
      title: 'DEVICE_MANAGE.DEVICE_MANAGER' // 裝置管理員
    })
    this.popup.setLoading(true);
    this.getDeviceListService.getDeviceList().then(
      (response) => {
        if (response == null) {
          this.popup.setConfirm({ content: this._langTransService.instant('DEVICE_MANAGE.GET_USER_REGISTER_ERROR') }); // 取得使用者所有註冊的設備列表失敗
          return;
        }

        console.log("Response = " + JSON.stringify(response, undefined, 2));

        if (response["Result"] != 4001) {
          this.popup.setConfirm({ content: this._langTransService.instant('DEVICE_MANAGE.GET_USER_REGISTER_ERROR') }); // 取得使用者所有註冊的設備列表失敗
          return;
        }
        var deviceList = response["DeviceList"]
        if (deviceList == null || deviceList.length == 0) {
          this.popup.setConfirm({ content: this._langTransService.instant('DEVICE_MANAGE.GET_USER_REGISTER_ERROR') }); // 取得使用者所有註冊的設備列表失敗
          return;
        }

        this.isAPIReqponse = true;
        DeviceManageDeviceListComponent.deviceList = deviceList
        this.displayFirstComponent();
      },
      (error) => {
        this.popup.setConfirm({ content: this._langTransService.instant('DEVICE_MANAGE.GET_USER_REGISTER_ERROR') }); // 取得使用者所有註冊的設備列表失敗
        this.isAPIReqponse = true;
        this.displayFirstComponent();
      })
  }

  public static updateDeviceList(successCallback, errorCallback) {

  }

  checkButtonColor(name: String) {
    return this.selected === name;
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.displayFirstComponent();
  }

  displayFirstComponent() {
    if (!this.isViewInitialized) {
      return
    }
    if (!this.isAPIReqponse) {
      return
    }
    this.selected = "RegisteredDevice";
    this.displayComponent("RegisteredDevice");
    setTimeout(() => {
      this.popup.setLoading(false);
    }, 1000);
  }

  displayComponent(componentName: string) {
    this.registerActive = componentName === 'RegisteredDevice'? true : false;
    this.otpActive = componentName === 'OtpDevice'? true : false;
    this.selected = componentName;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.dynamicComponentService.getComponent(componentName));
    const viewContainerRef = this.componentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
