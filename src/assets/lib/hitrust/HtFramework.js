/**
 * Interface for Front-End easy to use mobile methods by cordova plugins
 * @class HtFramework
 * @version 1.0.0
 */

HtFramework = {
  // com-hitrust-plugin-device
  DeviceInfo: function () {
    return hitrust.device;
  },
  // com-taipeifubon-plugin-crypto
  InitPhoneData: function (successCallback, errorCallback) {
    plugin.crypto.InitPhoneData(hitrust.device, successCallback, errorCallback);
  },
  ExchangeKey: function (publickey, successCallback, errorCallback) {
    plugin.crypto.ExchangeKey(publickey, successCallback, errorCallback)
  },
  SHA256: function (text, successCallback, errorCallback) {
    plugin.crypto.SHA256(text, successCallback, errorCallback)
  },
  Encrypt: function (text, successCallback, errorCallback) {
    plugin.crypto.Encrypt("session", text, successCallback, errorCallback)
  },
  Decrypt: function (text, successCallback, errorCallback) {
    plugin.crypto.Decrypt("session", text, successCallback, errorCallback)
  },
  // local crypto method
  FileEncrypt: function (text, successCallback, errorCallback) {
    plugin.crypto.Encrypt("lb_fubon", text, successCallback, errorCallback)
  },
  FileDecrypt: function (text, successCallback, errorCallback) {
    plugin.crypto.Decrypt("lb_fubon", text, successCallback, errorCallback)
  },
  // server verify
  verifyServer: function (serverUrl, serverCertInfo, successCallback, errorCallback) {
    plugin.verifyServer.check(serverUrl, serverCertInfo, successCallback, errorCallback);
  },
  // cordova-plugin-root-detection, cordova-plugin-jailbreak-detection
  CheckRootJB: function (checkSuccessCallback, checkErrorCallback) {
    if (device.platform === "Android") { 
      // if (typeof trustedDevice !== 'undefined' && typeof trustedDevice.isTrusted === 'function' ) {
        // 避免提升JB沒有載入
        trustedDevice.isTrusted(function (result) {
          var isRoot = !result;
          checkSuccessCallback(isRoot);
        }, checkErrorCallback);
    } else if (device.platform === "iOS") { 
      jailbreakdetection.isJailbroken(checkSuccessCallback, checkErrorCallback);
    } else { // other platform
      var errorMsg = "platform error!!!"
      checkErrorCallback(errorMsg);
    }
  },
  // cordova-plugin-geolocation
  GetCurrentPosition: function (successCallback, errorCallback,option) {
    navigator.geolocation.getCurrentPosition(successCallback,errorCallback,option);
  },
  // MD5
  cryptoMD5: function (text, successCallback, errorCallback) {
    plugin.crypto.MD5(text, successCallback, errorCallback);
  },
  // 偵測gps有沒有打開
  isLocationAvailable: function (successCallback, errorCallback) {
    // 防呆 若沒有PLugIn
    if (typeof cordova.plugins.diagnostic !== 'undefined' && typeof cordova.plugins.diagnostic['isLocationAvailable'] !== 'undefined') {
      cordova.plugins.diagnostic.isLocationAvailable(successCallback, errorCallback);
    } else {
      console.log('Error IN Htframework isLocationAvailable undefined!(檢查gps是否開關的PLugIn未定義)')
      if (typeof successCallback === 'function') {
        successCallback(false);
      }
    }

  },
  // Diable OS Text Zoom
  disableTextZoom: function () {
    if (MobileAccessibility) {
      MobileAccessibility.usePreferredTextZoom(false);
    }
  }

};