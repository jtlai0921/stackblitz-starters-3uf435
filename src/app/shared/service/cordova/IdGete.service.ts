/**
 * 裝置資料
 */
import { Injectable } from '@angular/core';
import { CTBC_PlugIn } from './_interface';
import { DeviceService } from './device.service';
import { Config } from '../../../../assets/configuration/config';
declare var window: any; // HiTrust Cordova Plugin：com-hitrust-plugin-devic

@Injectable()
export class IDGateService {
    /**
     * 參數設定
     */
    constructor(public device : DeviceService) {}

    /**
     * 是否連線
     */
    public hasPersoFile() {
       return new Promise((resolve,reject)=>{
        if(!Config.NATIVE_OPEN){
            resolve(true)
            return;
        }
        const success = (res)=>{resolve(res)}; 
        const error = (err)=>{reject(err)}; 
        CTBC_PlugIn.IDGate.hasPersonFile(success,error);
       });
    }

     /**
     * 取得快登密碼
     */
    public generateSignatureOTP() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve("12345678")
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         var id = this.device.getDeviceInfo('uuid');
         window.IdGate.generateSignatureOTP(id,success,error);
        });
     }

     /**
     * 取得InitValue
     */
    public getInitValue() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve("12345678")
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         window.IdGate.getInitValue(success,error);
        });
     }

      /**
     * 設定PersoFiles
     * * @param persoFile persoFile
     * * @param custSeq custSeq
     */
    public setPersoFiles(persoFile,custSeq) {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve(true)
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         window.IdGate.setPersoFile(persoFile,custSeq,success,error);
        });
     }

     /**
     * 檢查PersoFiles
     */
    public checkSumPersoFile() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve(true)
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         window.IdGate.checkSumPersoFile(success,error);
        });
     }

    /**
     * 取得使用者編號
     */
    public getCustSeq() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve("12345678")
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         window.IdGate.getCustSeq(success,error);
        });
     }

    /**
     * 產生OTP號碼
     */
    public generateOTP() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve("123456")
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         window.IdGate.generateOTP(success,error);
        });
     }

    /**
     * 取得OTP效期
     */
    public getOTPSec() {
        return new Promise((resolve,reject)=>{
            if(!Config.NATIVE_OPEN){
                resolve(30)
                return;
            }
         const success = (res)=>{resolve(res)}; 
         const error = (err)=>{reject(err)}; 
         window.IdGate.getOTPSec(success,error);
        });
     }
    
    /**
     * 產生Time-Based簽章OTP值
     * @param data 原始簽章數據字串
     * @returns OTP,ESN,UTC
     */
    public genSignatureOTP(data:string) {
        return new Promise((resolve, reject) => {
            if (!Config.NATIVE_OPEN) {
                resolve("0000000,000000,20180814120000");
                return;
            }
            const success = (res) => {resolve(res)};
            const error = (err) => {reject(err)};
            CTBC_PlugIn.IDGate.generateSignatureOTP(data, success, error);
        });
    }
}
