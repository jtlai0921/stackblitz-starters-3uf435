import { OtpDeviceComponent } from './otp-device/otp-device.component';
import { RegisteredDeviceComponent } from './registered-device/registered-device.component';
import { Injectable } from '@angular/core';

@Injectable()
export class DeviceManageDynamicComponentService {
  private components = {
    OtpDevice: OtpDeviceComponent,
    RegisteredDevice: RegisteredDeviceComponent,
  }
  constructor() { }

  getComponent(componentName) {
    return this.components[componentName];
  }
}