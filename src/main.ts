import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
declare var PushNotification;
declare var hitrust;
declare var MobileAccessibility;
declare var cordova;
declare var FastClick;
FastClick.attach(document.body);

if (environment.production) {
  enableProdMode();
  //window.console.log = function(){};
}
console.log('app start');

const bootstrap = function () {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};

if (typeof window['cordova'] !== 'undefined') {

  document.addEventListener('deviceready', () => {
    console.log('cordova deviceready');
    //android 屏蔽 backevent
    document.addEventListener('backbutton', function (event) {
      if (hitrust && hitrust.device.platform.toLowerCase() == 'android') {
        //
        event.preventDefault()
        return false;
      }
    });

    // 啟動APP背景模式持續運作設定
    cordova.plugins.backgroundMode.disable();
    // 鎖定系統字體大小設定
    MobileAccessibility.usePreferredTextZoom(false);

    bootstrap();
  }, false);
} else {
  bootstrap();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));
