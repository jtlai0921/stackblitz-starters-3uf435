declare var window;
declare var htrust;

export const CTBC_PlugIn = {
 //取得裝置資訊
 Device:()=>{
   return htrust.device;
 },
 //是否Root
 Rootdetection:(successCallback,errorCallback)=>{
  window.rootdetection.isDeviceRooted(successCallback,errorCallback);
 },
 //確認是否連接網路
 checkConnection:()=>{
  var networkState = window.navigator.connection.type;
  if(networkState == window.Connection.NONE || networkState == window.Connection.UNKNOWN){
    return false;
  }else{
    return true;
  }
 },
 ConnectStatus:()=>{
  return window.navigator.connection.type;
 },
 // get local lang
 getPreferredLanguage:(successCallback,errorCallback)=>{
   return window.navigator.globalization.getPreferredLanguage(successCallback,errorCallback);
 },
 // 加解密演算
 Cipher:{
  // 3DES解密
  decryptBy3DES:(successCallback,errorCallback,Param,SessionKey)=>{
    window.cipher.decryptBy3DES(successCallback,errorCallback,Param,SessionKey);
  },
  // 3DES加密
  encryptBy3DES:(successCallback,errorCallback,Param,SessionKey)=>{
    window.cipher.encryptBy3DES(successCallback,errorCallback,Param,SessionKey);
  },
  // AES256-GCM解密
  decryptByAESGCM:(successCallback,errorCallback,CipherText,SessionKey,Aad)=>{
    window.cipher.decryptByAESGCM(successCallback,errorCallback,CipherText,SessionKey,Aad);
  },
  // AES256-GCM加密
  encryptByAESGCM:(successCallback,errorCallback,PlainText,SessionKey,Aad)=>{
    window.cipher.encryptByAESGCM(successCallback,errorCallback,PlainText,SessionKey,Aad);
  }
 },
 //IDGate
 IDGate:{
  init:function(success,error){window.IdGate.init(success,error);},
  hasPersonFile:(success,error) => {window.IdGate.hasPersoFile(success,error);},
  generateSignatureOTP:(Data, successCallback, errorCallback)=>{
    window.IdGate.generateSignatureOTP(Data, successCallback, errorCallback);
  }
 },
 //WBC加解密
 Wbc:{
  aesEncrypt:(successCallback, errorCallback, Param)=>{
    window.CTBCWBC.aesEncrypt(successCallback, errorCallback, Param);
  },
  aesDecrypt:(successCallback, errorCallback, Param)=>{
    window.CTBCWBC.aesDecrypt(successCallback, errorCallback, Param);
  }
 },
 //伺服器驗證
 VerifyServer:{
  verifyServer:(successCallback, errorCallback, URL,certsInfo)=>{
    window.plugin.verifyServer.check(URL,certsInfo,successCallback, errorCallback);
  }
 },
 //解壓縮
 Zip:{
   unzip:(fileName, outputDirectory, callback, progressCallback)=>{
    window.zip.unzip(fileName, outputDirectory, callback, progressCallback);
   },
   unzipDividedFiles:(filesName, outputDirectory, password, isDeleteSourceFiles, callback, progressCallback)=>{
    window.zip.unzipDividedFiles(filesName, outputDirectory, password, isDeleteSourceFiles, callback, progressCallback);
   },
   deleteFiles:(filesPath)=>{
    return window.plugins.update.deleteFiles(filesPath);
   }
 },
 //APP社群功能分享
 SocialShare:{
   shareWithOptions:(options, successCallback, errorCallback)=>{
    window.plugins.socialsharing.shareWithOptions(options, successCallback, errorCallback);
   }
 },
 //SecurityProviderPlugin
 SecurityProviderPlugin:{
  update:(successCallback, errorCallback)=>{
    window.plugins.updateSecurityProviderPlugin.update(successCallback, errorCallback);
  }
 }
}