import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicComponent]'
})
export class DeviceManageDynamicComponentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}