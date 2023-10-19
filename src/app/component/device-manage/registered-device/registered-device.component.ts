import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../../shared/service/global/popup.service';
import { DoRemoveDeviceService } from '../../../shared/service/customize/do-remove-device.service';
import { DeviceManageDeviceListComponent } from '../device-mange-device-list';
import { DeviceService } from '../../../shared/service/cordova/device.service';
import { LangTransService } from '../../../shared/pipe/langTransPipe/lang-trans.service';

@Component({
  selector: 'app-registered-device',
  templateUrl: './registered-device.component.html',
  styleUrls: ['./registered-device.component.css']
})
export class RegisteredDeviceComponent implements OnInit {

  public deviceList = []
  public registerDate = "";
  public registerDeviceName = "";

  constructor(
    private popup: PopupService,
    private device: DeviceService,
    private langTransService: LangTransService,
    private doRemoveDeviceService: DoRemoveDeviceService,
  ) {

  }

  ngOnInit() {
    // Update device list
    this.updateDeviceList();
  }

  /**
   * Update device list with DeviceManageDeviceListComponent.deviceList
   */
  updateDeviceList() {
    // Update device list
    this.deviceList = DeviceManageDeviceListComponent.deviceList
    
    // Convert status/OTPDevice property, find current device info in list
    var isCurrentDeviceFound = false;
    if (this.deviceList != null) {
      for (const device of this.deviceList) {
        // Convert display time
        // TODO : convert yyyyMMddHHmmss to yyyy-MM-dd format
        var regTime = device["RegTime"];
        device["DisplayTime"] = regTime;

        // Convert display status
        var status = device["Status"];
        if (status == 0) {
          device["DisplayStatus"] = "DEVICE_MANAGE.NORMAL"; // 正常
        } else if (status == 1) {
          device["DisplayStatus"] = "DEVICE_MANAGE.TEMPORARY"; // 暫禁
        } else if (status == 2) {
          device["DisplayStatus"] = "DEVICE_MANAGE.PERMANENT_DISABLE"; // 永久停用
        } else if (status == 3) {
          device["DisplayStatus"] = "DEVICE_MANAGE.REGISTERED_DELETE"; // 註記刪除
        } else if (status == 4) {
          device["DisplayStatus"] = "DEVICE_MANAGE.WAIT_VERIFICATION"; // 等待驗證
        } else {
          device["DisplayStatus"] = "DEVICE_MANAGE.UNKNOWN"; // Unknown
        }

        // Convert display OtpDevice
        if (device["OtpDevice"] == 1) {
          // OTP設備
          device["IsOtpDevice"] = true;
          device["DisplayOtpDevice"] = "DEVICE_MANAGE.OTP_DEVICE";      
        } else {
          // 非OTP設備
          device["IsOtpDevice"] = false;
          device["DisplayOtpDevice"] = "DEVICE_MANAGE.NON_OTP_DEVICE";  
        }

        // Discover current device
        device["IsCurrentDevice"] = (device["DeviceId"] == this.device.getDeviceInfo("uuid"));
        if (!isCurrentDeviceFound && device["IsCurrentDevice"]) {
          this.registerDate = device["DisplayTime"];
          this.registerDeviceName = device["Model"];
          isCurrentDeviceFound = true;
        }
      }
    }

    // If current device info not in list
    if (!isCurrentDeviceFound) {
      this.registerDate = "-";
      this.registerDeviceName = "-";
    }
  }

  /**
   * On display device type clicked
   * @param index Device info index
   */
  onDeviceTypeClick(index: number) {
    // Get clicked device info
    var device = this.deviceList[index]
    if (device == null) {
      return
    }

    var popShowDateTime = (device["DisplayTime"].toString().length == 14) ? (device["DisplayTime"].substring(0,4) + '/' + device["DisplayTime"].substring(4,6) + '/' +device["DisplayTime"].substring(6,8) + ' ' + device["DisplayTime"].substring(8,10) + ':' + device["DisplayTime"].substring(10,12) + ':' + device["DisplayTime"].substring(12,14))  : device["DisplayTime"];

    // Display device id popup
    this.popup.setConfirm({ 
      content: device["DeviceId"] + '<br/>( ' + this.langTransService.instant('DEVICE_MANAGE.POP_REGISTERED_DATE') + ' ' +popShowDateTime + ' )',
      checkTxt: this.langTransService.instant('DEVICE_MANAGE.POP_COPY'),      // 複製
      cancelTxt: this.langTransService.instant('DEVICE_MANAGE.POP_CLOSE'), // 暫時保留
      event: () => {
        this.fallbackCopyTextToClipboard(device["DeviceId"]);
      }
    });
  }

  /**
   * On delete button clicked
   * @param index Device info index
   */
  onDeleteClick(index: number) {
    // Get clicked device info
    var device = this.deviceList[index]
    if (device == null) {
      return
    }

    // Display confirm popup
    this.popup.setConfirm({
      content: this.langTransService.instant('DEVICE_MANAGE.WHETHER_UNREGISTERED_DEVICE') + ":" + device["Model"], // 是否解除註冊此設備
      checkTxt: "BTN.YES",    // 是
      cancelTxt: "BTN.NO",    // 否
      event: () => {
        this.doRemoveDeviceService.doRemoveDevice(device["DeviceData"], device["Manufacturer"], device["Model"], device["DeviceId"], "MPASS").then(
          (response) => {
            // Check response
            // Message: 設備刪除失敗
            if (response == null) {
              this.popup.setConfirm({ content: "DEVICE_MANAGE.DEVICE_DELETE_ERROR" });
              return;
            }

            // Check result
            // Message: 設備刪除失敗
            if (response["Result"] != 4001) {
              this.popup.setConfirm({ content: "DEVICE_MANAGE.DEVICE_DELETE_ERROR" });
              return;
            }

            // DEBUG
            console.log("Response = " + JSON.stringify(response, undefined, 2));

            // Remove device info if exist
            var index = DeviceManageDeviceListComponent.deviceList.indexOf(device, 0);
            if (index > -1) {
              DeviceManageDeviceListComponent.deviceList.splice(index, 1);
            }

            // Update device list
            this.updateDeviceList();

            // Display successfult popup
            // Message: 設備刪除成功
            this.popup.setConfirm({ content: "DEVICE_MANAGE.DEVICE_DELETE_SUCCESS" });
          },
          (error) => {
            // Display error popup
            // Message: 設備刪除失敗
            this.popup.setConfirm({ content: "DEVICE_MANAGE.DEVICE_DELETE_ERROR" });
          })
      }
    });
  }

  // 裝置序號複製進剪貼簿
  fallbackCopyTextToClipboard(text) {    

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';

      //20180829 成功失敗都不用處理 By BigLeo
    } catch (err) {
      
    }
  }
}
