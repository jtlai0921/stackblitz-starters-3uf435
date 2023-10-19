/**
 * 首頁上選單
 */
import {Injectable, NgZone,EventEmitter} from '@angular/core';
@Injectable()
export class PopupService {
 public loadingStatus:EventEmitter<boolean> = new EventEmitter();
 public keyboardStatus:EventEmitter<boolean> = new EventEmitter();
 public confirnSetting:EventEmitter<object> = new EventEmitter();
 public inputSetting:EventEmitter<object> = new EventEmitter();
 public selectSetting:EventEmitter<object> = new EventEmitter();    
 public checkListSetting:EventEmitter<object> = new EventEmitter();
 public gesturesSetting:EventEmitter<object> = new EventEmitter();
 public percentSetting:EventEmitter<object> = new EventEmitter();
 public datepickerSetting:EventEmitter<object> = new EventEmitter();
 public transquerySetting:EventEmitter<object> = new EventEmitter();
 public depositSummarySetting:EventEmitter<object> = new EventEmitter();
 public depositDetialSetting:EventEmitter<object> = new EventEmitter();
 public patternLockSetting:EventEmitter<object> = new EventEmitter();
 public quickLoginTermsSetting:EventEmitter<object> = new EventEmitter();
 //上一次Loading狀態
 private _oldLoadingStatus:boolean = false;
 constructor() {
  
 }
  setLoading(Isopen:boolean) {
    //如果跟上一次相同直接return
   if(Isopen && this._oldLoadingStatus)
   {
     return;
   }
   this.loadingStatus.emit(Isopen);
   this._oldLoadingStatus = Isopen;
  }
  setKeyboard(Isopen:boolean) {
    this.keyboardStatus.emit(Isopen);
  }
  setConfirm(Setting:object) {
      this.confirnSetting.emit(Setting);
  }
  //Input
  setInput(Setting:object){
    this.inputSetting.emit(Setting);
  }
  //下拉選單
  setSelect(Setting:object){
    this.selectSetting.emit(Setting);
  }
  //確認選單
  setCheckList(Setting:object){
    this.checkListSetting.emit(Setting);
  }
  //確認選單
  setGestures(Setting:object){
    this.gesturesSetting.emit(Setting);
  }
  //百分比
  setPercentage(Setting:object){
    this.percentSetting.emit(Setting);
  }
  //DatePicker
  setDatePicker(Setting:object){
    this.datepickerSetting.emit(Setting);
  }
  //TransQuery
  setTransQuery(Setting:object){
    this.transquerySetting.emit(Setting);
  }
  //DepositDetial
  setDepositDetial(Setting:object){
    this.depositDetialSetting.emit(Setting);
  }
  //DepositSummary
  setDepositSummary(Setting:object){
    this.depositSummarySetting.emit(Setting);
  }
  //DepositSummary
  setPatternLock(Setting:object){
      this.patternLockSetting.emit(Setting);
  }
  //QuickLoginTerms
  setQuickLoginTerms(Setting:object){
    this.quickLoginTermsSetting.emit(Setting);
  }
}