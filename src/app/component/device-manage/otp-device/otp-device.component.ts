import { Component, OnInit } from '@angular/core';
import { DoChangeOtpDeviceService } from '../../../shared/service/customize/do-change-otp-device.service';
import { PopupService } from '../../../shared/service/global/popup.service';
import { DeviceService } from '../../../shared/service/cordova/device.service';
import { DeviceManageDeviceListComponent } from '../device-mange-device-list';
import { DateTimeService } from '../../../shared/service/global/daettime.service';
import { LocalStorageService } from '../../../shared/service/global/localStorage.service';


/**
 * OTP裝置
 */
@Component({
  selector: 'app-otp-device',
  templateUrl: './otp-device.component.html',
  styleUrls: ['./otp-device.component.css']
})
export class OtpDeviceComponent implements OnInit {

  public isClicked = false;

  constructor(
    private popup: PopupService,
    private device: DeviceService,
    private dateTime: DateTimeService,
    private storage: LocalStorageService,
    private doChangeOtpDeviceService: DoChangeOtpDeviceService,
  ) {

  }

  ngOnInit() {
    this.updateOtpDevice();
  }

  /**
   * Update current device is OTP device or not
   */
  updateOtpDevice() {
    // Init OTP device status
    this.isClicked = false;

    // Update OTP device status
    if (DeviceManageDeviceListComponent.deviceList != null) {
      for (const device of DeviceManageDeviceListComponent.deviceList) {
        if (device["DeviceId"] == this.device.getDeviceInfo('uuid')) {
          if (device["OtpDevice"] != 0) {
            this.isClicked = true;
            break;
          }
        }
      }
    }
  }

  /**
   * On register OTP device button clicked
   */
  onRegisterClick() {
    this.doChangeOtpDeviceService.doChangeOtpDevice().then(
      (response) => {
        // Check response
        // Message: 設備註冊OTP失敗
        if (response == null) {
          this.popup.setConfirm({ content: 'DEVICE_MANAGE.REGISTERED_DEVICE_ERROR' }); 
          return;
        }

        // Check result
        // Message: 設備註冊OTP失敗
        if (response["Result"] != 4001) {
          this.popup.setConfirm({ content: 'DEVICE_MANAGE.REGISTERED_DEVICE_ERROR' }); 
          return;
        }

        // DEBUG
        console.log("Response = " + JSON.stringify(response, undefined, 2));

        // Check current device info exist or not
        var isDeviceInfoExist = false;
        for (const device of DeviceManageDeviceListComponent.deviceList) {
          if (device["DeviceId"] == this.device.getDeviceInfo('uuid')) {
            isDeviceInfoExist = true;
            break;
          }
        }

        // Add new device info if not exist
        if (!isDeviceInfoExist) {
          DeviceManageDeviceListComponent.deviceList[DeviceManageDeviceListComponent.deviceList.length] = {
            "AppId": "MPASS",
            "Manufacturer": this.device.getDeviceInfo('manufacturer'),
            "Model": this.device.getDeviceInfo('model'),
            "DeviceId": this.device.getDeviceInfo('uuid'),
            "AccountData": "string",
            "SystemId": "string",
            "Country": this.storage.get("UserCountry"),
            "CompanyId": this.storage.get("CompanyID"),
            "UserId": this.storage.get("UserAccount"),
            "NotificationToken": "string",
            "CustSeq": "string",
            "InitialData": "string",
            "Persofile": "string",
            "Status": "0",
            "UserName": this.storage.get("userName"),
            "RegTime": this.dateTime.datetimeFormat(new Date().getTime(), "yyyy-MM-dd"),
            "OtpDevice": "1",
            "LastModifyTime": "string",
          };
        }
        
        // Update device info OTP device property
        for (const device of DeviceManageDeviceListComponent.deviceList) {
          device["OtpDevice"] = device["DeviceId"] == this.device.getDeviceInfo('uuid') ? 1 : 0;
        }

        // Update OTP device
        this.updateOtpDevice();
        //畫面動態效果
        this.isClicked = true;
        // Display successful popup
        // Message: 設備註冊OTP成功
        this.popup.setConfirm({ content: 'DEVICE_MANAGE.REGISTERED_DEVICE_SUCCESS' }); 
      },
      (error) => {
        // Display error popup
        // Message: 設備註冊OTP失敗
        this.popup.setConfirm({ content: 'DEVICE_MANAGE.REGISTERED_DEVICE_ERROR' }); 
      });
  }
}
