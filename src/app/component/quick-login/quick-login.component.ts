declare var PatternLock: any;

import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../shared/service/global/layout.service';
import { PopupService } from '../../shared/service/global/popup.service';
import { LocalStorageService } from '../../shared/service/global/localStorage.service';
import { HiBiometricAuthService } from '../../shared/service/cordova/HiBiometricAuth.service';
import { QuickLoginService } from '../../shared/service/customize/quickLogin.service';
import { QUICK_LOGIN_CONFIGURATIONS } from '../../../assets/configuration/quickLoginConfiguration';
import { Config } from '../../../assets/configuration/config';
import { LangTransService } from '../../shared/pipe/langTransPipe/lang-trans.service';
import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { DoLoginService } from '../../shared/service/customize/doLogin.service';
import { AgreementAddService } from '../../shared/service/customize/agreementAdd.service';

@Component({
  selector: 'app-quick-login',
  templateUrl: './quick-login.component.html',
  styleUrls: ['./quick-login.component.css']
})

export class QuickLoginComponent implements OnInit {

  public groups = [];
  public popupCheckboxItems = [];
  public isAgreementShown = false;
  public isAgreementChecked = false;
  public isChangeDefaultShown = false;
  public isPatternLockShown = false;
  public patternLockMessage = "";
  public selectedGroup;
  public selectedGroupIndex = 0;
  public defaultKey = "";

  //使用者條款
  public Term_Content = "";

  private modifyItem = null;
  private patternLock = null;
  private patternLockNumber = null;
  private isModifyPatternLock = false;
  private patternLockNewNumber = null;

  private quickLoginShowStatus = true;
  private biometricStatus = "";    //紀錄生物鎖狀態

  //控制條款同意POP
  private showTerm = true;

  constructor(
    public router: Router,
    private popup: PopupService,
    private layout: LayoutService,
    private storage: LocalStorageService,
    private biometric: HiBiometricAuthService,
    private quickLogin: QuickLoginService,
    private doLogin: DoLoginService,
    private lang: LangTransService,
    private zone: NgZone,
    private agreement: AgreementAddService
  ) {
    this.layout.setHeaderStatus({
      status: true,
      title: 'QUICKLOGIN.TITLE' // 快速登入與交易驗證
    })
  }

  ngOnInit() {
    this.updateConfiguration();
    this.popup.setLoading(false);
    
  }

  ngAfterViewInit() {
    this.patternLock = new PatternLock('#patternHolder', {
      onDraw: (pattern) => {
        this.zone.run(() => {
          if (pattern.length < 6) {
            this.popup.setConfirm({
              content: "QUICKLOGIN.PATTERN_LENGTH", //不可少於六碼
              event: () => {
                this.patternLock.reset();
              }
            });
            return;
          }
          //如果圖形鎖的更新
          if (this.isModifyPatternLock) {
            this.doLogin.QuickLoginEncrypt(pattern).then(
              (res) => {
                pattern = res;
                // Modify pattern lock
                if (this.patternLockNumber && this.patternLockNumber != pattern) {
                  // Verify original failed
                  this.popup.setConfirm({
                    content: 'QUICKLOGIN.VERIFY_PATTERN_LOCK_ERROR'
                  });
                } else if (this.patternLockNumber && this.patternLockNumber == pattern) {
                  // Verify original success
                  this.patternLockNumber = null;
                  this.patternLockMessage = "QUICKLOGIN.DRAW_NEW_PATTERN_LOCK"; // 請輸入新圖形鎖
                } else if (!this.patternLockNewNumber) {
                  // Modify first draw
                  this.patternLockNewNumber = pattern;
                  this.patternLockMessage = "QUICKLOGIN.DRAW_NEW_PATTERN_LOCK_AGAIN"; // 請再次輸入新圖形鎖
                } else if (this.patternLockNewNumber && this.patternLockNewNumber == pattern) {
                  // Modify second draw - match
                  // Storage new pattern number
                  this.quickLogin.setConfigurations(this.modifyItem.passwordKey, this.patternLockNewNumber);

                  // Disappear pattern lock
                  this.patternLockMessage = "";
                  this.patternLockNewNumber = null;
                  this.isPatternLockShown = false;

                  this.popup.setConfirm({
                    content: 'QUICKLOGIN.MODIFY_PATTERN_LOCK_SUCCESS'
                  });

                } else {
                  // Modify second draw - error
                  this.patternLockNewNumber = null;
                  this.patternLockMessage = "QUICKLOGIN.MODIFY_PATTERN_LOCK_ERROR_NO_MATCH"; // 兩次圖形不符合，請重新輸入新圖形鎖
                }

                this.patternLock.reset();
              }, (err) => {

              })

          }
          else {
            // Create pattern lock
            if (this.patternLockNumber == null) {
              // First time
              this.patternLockNumber = pattern;
              this.patternLockMessage = "QUICKLOGIN.DRAW_PATTERN_LOCK_AGAIN"; // 請再次繪製圖型鎖

            } else if (this.patternLockNumber == pattern) {


              // Second time - match
              // Storage pattern number
              this.doLogin.QuickLoginEncrypt(this.patternLockNumber).then(
                (res) => {
                  this.quickLogin.setConfigurations(this.modifyItem.passwordKey, res);

                  // Dismiss pattern lock
                  this.patternLockMessage = "";
                  this.patternLockNumber = null;
                  this.isPatternLockShown = false;

                  // Update values
                  this.updateConfiguration();

                  // Modify configuration again
                  this.onCheckboxClick(this.modifyItem);

                  //圖形鎖設定成功後將showTerm設定為true讓下次開啟時能開啟POP
                  this.showTerm = true;
                }
                , (err) => {

                })
            } else {
              // Second time - error
              this.patternLockNumber = null;
              this.patternLockMessage = "QUICKLOGIN.PATTERN_LOCK_ERROR_AGAIN"; // 兩次圖型不符合，請重新繪製圖型
            }

            this.patternLock.reset();
          }
        });

      }
    });
  }


  /**
   * Update configurations
   * Update quick login and order login with storage data
   */
  private updateConfiguration() {
    this.zone.run(() => {
      //檢查生物辨識的狀態
      this.biometric.getBiometricStatus().then(
        (response) => {
          if(this.storage.get("isAllowQuick") == true){
            // 如果是true ，生物辨識走正常程序
            this.updateConfigurationWithBiometric("T");
          }else{
            // APP鎖死生物辨識
            this.quickLoginShowStatus = false;
            this.biometricStatus = "lock";
            this.updateConfigurationWithBiometric("T");
          }
          
        },
        (error) => {
          if (error.ret_code == 13 || error.ret_code == 12) {
            //系統鎖死生物辨識
            this.updateConfigurationWithBiometric("T");
            return;
          }
          // 無生物辨識
          this.quickLoginShowStatus = false;
          this.biometricStatus = "none";
          this.updateConfigurationWithBiometric("T");
          
        });
    })

  }

  /**
   * Update configurations with plugin result
   * T = 
   * S =
   * @param biometricType Biometric plugin result
   */
  private updateConfigurationWithBiometric(biometricType) {
    // Initialize UI data
    this.groups = [];

    // Get storage data
    var userConfiguration = this.quickLogin.getConfigurations();

    // Update all group
    for (const group of QUICK_LOGIN_CONFIGURATIONS) {
      // [CHECK BIOMETRIC]
      // Get biometric supported childs
      var supportChilds = [];
      for (const child of group.childs) {
        if (child.type == biometricType) {
          // Child type equals supported biometric type
          supportChilds[supportChilds.length] = child;
        } else if (child.type == "P") {
          // All device support pattern lock
          supportChilds[supportChilds.length] = child;
        }
      }

      // Uncheck not support childs
      for (const child of group.childs) {
        //檢查是否支援，沒支援則將狀態設為false
        if (supportChilds.indexOf(child) < 0) {
          if (userConfiguration[child.key] == true) {
            userConfiguration[child.key] = false;
          }
        }
      }

      // [UPDATE DEFAULT VALUE]
      // Get default value
      var defaultValue = userConfiguration[group.key];
      // Check default value exist or not
      if (defaultValue != null) {
        var isExist = false;
        for (const child of supportChilds) {
          if (child.key == defaultValue) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          defaultValue = null;
        }
      }

      // Check default value check status
      if (defaultValue != null) {
        if (userConfiguration[defaultValue] != true) {
          defaultValue = null;
        }
      }

      // Loop for all child items
      var checkedConfigurationCount = 0
      for (const child of supportChilds) {
        if (userConfiguration[child.key] == true) {
          // Set default value = first checked item if default value == null
          if (defaultValue == null) {
            defaultValue = child.key;
          }

          // Count checked child
          checkedConfigurationCount++;
        }
      }

      // Update default value
      userConfiguration[group.key] = defaultValue;

      // [UPDATE UI]
      // Construct checkbox items
      var checkboxList = [];
      for (const child of supportChilds) {
        if(child.type == "T"){
            checkboxList[checkboxList.length] = {
            key: child.key,
            agreeKey: child.agreeKey,
            agreeKeyVersion: child.agreeKeyVersion,
            defaultKey: group.key,
            passwordKey: child.passwordKey,
            type: child.type,
            title: child.title,
            isChecked: userConfiguration[child.key] == true,
            isDefault: userConfiguration[group.key] == child.key,
            //決定生物辨識能不能使用
            isWork : this.quickLoginShowStatus,
            biometricStatus : this.biometricStatus
          };
        }else{
            checkboxList[checkboxList.length] = {
            key: child.key,
            agreeKey: child.agreeKey,
            agreeKeyVersion: child.agreeKeyVersion,
            defaultKey: group.key,
            passwordKey: child.passwordKey,
            type: child.type,
            title: child.title,
            isChecked: userConfiguration[child.key] == true,
            isDefault: userConfiguration[group.key] == child.key,
            //圖形鎖永遠可以使用
            isWork : true,
            biometricStatus: ""
          };
        }
      }

      console.log("group.key = " + 
      group.key + "header=" + group.header + "isMultipleChecked=" + checkedConfigurationCount
    + "description="+ group.description + "checkboxList=" + checkboxList + "defaultKey=" + defaultValue)

        //change 
        let tempListIndex = checkboxList[0];
        checkboxList[0] = checkboxList[1];
        checkboxList[1] = tempListIndex;

      // Construct group item
      this.groups[this.groups.length] = {
        key: group.key,
        header: group.header,
        isMultipleChecked: checkedConfigurationCount > 1,
        description: group.description,
        checkboxList: checkboxList,
        defaultKey: defaultValue
      }
    }
    this.selectedGroup = this.groups[this.selectedGroupIndex];

    // Stroage user configuration(maybe default value changed)
    this.quickLogin.updateConfigurations(userConfiguration);
  }


  changeGroups(index) {
    this.selectedGroup = this.groups[index];
    this.selectedGroupIndex = index;
  }

  /**
   * On checkbox click
   * @param checkbox Clicked checkbox
   */
  onCheckboxClick(checkbox) {

    
    // Storage checkbox item
    this.modifyItem = checkbox;
    
    // Get user configurations
    var userConfigurations = this.quickLogin.getConfigurations();
    
    //判斷是否點擊啟用快登，用變數showTerm控制，且快登為開啟的狀態
    if (this.showTerm && checkbox.isChecked) {
      this.isAgreementChecked = false;
      if (checkbox.type == "P") {
        this.Term_Content = this.lang.instant("QUICKLOGIN.PATTERN_TERMS");
      }else{
        this.Term_Content = this.lang.instant("QUICKLOGIN.QUICK_TERMS");
      }
      
      this.isAgreementShown = true;
      return;
    }

    // Define target check value
    var targetCheckValue = userConfigurations[checkbox.key] == true ? false : true;

    // Update value
    if (checkbox.type == "P") {
      // Pattern lock
      // Check target check value
      if (targetCheckValue == true) {
        // Target: checked
        // Draw pattern lock if needed
        if (userConfigurations[checkbox.passwordKey] == null) {
          this.patternLockNumber = null;
          this.patternLockMessage = "QUICKLOGIN.DRAW_PATTERN_LOCK"; // 請繪製圖型鎖
          this.isPatternLockShown = true;

          return;
        }
      } else {
        // Target: Unchecked
        // Clear patttern number
        userConfigurations[checkbox.passwordKey] = null;
      }
    }
    else if (checkbox.type == "T" || checkbox.type == "F") {
      // Face & finger
      // Check target check value
      if (targetCheckValue == true) {
        // Target: checked
        // Call biometric plugin if needed
        if (userConfigurations[checkbox.passwordKey] == null) {
          // 啟動生物辨識
          this.biometric.identifyByBiometric(this.lang.instant("QUICKLOGIN.OPEN_BIO")).then(() => {
            userConfigurations[checkbox.passwordKey] = "CONFIRMED";
            this.quickLogin.updateConfigurations(userConfigurations);
            this.onCheckboxClick(checkbox);

            //生物鎖設定成功後將showTerm設定為true讓下次開啟時能開啟POP
            this.showTerm = true;
          },
            () => {
              this.popup.setConfirm({ content: "QUICKLOGIN.BIO_ERROR" }); // 生物辨識驗證失敗
              this.updateConfiguration();

              //生物鎖設定失敗也要將showTerm設定為true讓下次開啟時能開啟POP
              this.showTerm = true;
            });
          return;
        }
      }
      else {
        // Target: Unchecked
        // Clear confrimed toggle
        userConfigurations[checkbox.passwordKey] = null;
      }
    }

    // Storage & update check value
    userConfigurations[checkbox.key] = targetCheckValue;
    if (targetCheckValue == false)
      userConfigurations[checkbox.agreeKey] = false;

    this.quickLogin.updateConfigurations(userConfigurations);
    this.updateConfiguration();

    // Check if multiple checked
    if (targetCheckValue == true) {
      var checkedCount = 0;
      for (const group of QUICK_LOGIN_CONFIGURATIONS) {
        if (group.key == checkbox.defaultKey) {
          for (const child of group.childs) {
            if (userConfigurations[child.key] == true) {
              checkedCount++;
            }
          }
        }
      }
      if (checkedCount > 1 && userConfigurations[checkbox.defaultKey] != checkbox.key) {
        this.popup.setConfirm({
          content: this.lang.instant("QUICKLOGIN.CHANGE_DEFAULT_TO") + this.lang.instant(checkbox.title) + "?", // 是否將預設之快速登入方式，變更為
          checkTxt: "BTN.YES",    // 是
          cancelTxt: "BTN.NO",    // 否
          event: () => {
            userConfigurations[checkbox.defaultKey] = checkbox.key;
            this.quickLogin.updateConfigurations(userConfigurations);
            this.updateConfiguration();
          }
        });
      }
    }

  }

  /**
   * On agreement popup back button click
   */
  onBackClick() {
    // Dismiss agreement popup
    this.isAgreementShown = false

    // Uncheck 
    this.modifyItem.isChecked = false;

    // Update default value
    for (const item of this.popupCheckboxItems) {
      if (item.isChecked) {
        this.quickLogin.setConfigurations(item.defaultKey, item.key);
        break;
      }
    }

    // Update configuration
    this.updateConfiguration();
  }

  /**
   * On agreement popup confirm button click
   */
  onAgreeClick() {
    console.log("[快登設定頁] onAgreeClick type =", this.modifyItem.type);
    let date = new Date();
    //紀錄同意快速登入與交易驗證條款時間，登入與交易、圖形鎖與生物驗證分開記，共四種 ex:lastAgree_MENU.QUICK_LOGIN_P
    this.storage.set("lastAgree" + "_"+ this.selectedGroup.header +"_"+ this.modifyItem.type , date);

    // Check if checkbox checked or not
    if (!this.isAgreementChecked) {
      this.popup.setConfirm({ content: "QUICKLOGIN.READ_AND_AGREE_TERMS" }); // 請審閱並同意使用條款
      return;
    }

    // Sotrage agree status
    this.quickLogin.setConfigurations(this.modifyItem.agreeKey, true);
    this.quickLogin.setConfigurations(this.modifyItem.agreeKeyVersion, Config[this.modifyItem.agreeKeyVersion]);

    // Dismiss agreement popup
    this.isAgreementChecked = false;
    this.isAgreementShown = false;

    // 發送同意紀錄至中台
    let agreementType = this.modifyItem.type == "P" ? 1 : 2;
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(this.Term_Content));
    let content = div.innerHTML;
    this.agreement.agreemnetAdd(agreementType, content);

    //按下同意鈕關閉條款pop
    this.showTerm = false;

    // Update values
    this.updateConfiguration();

    // Modify configuration again
    this.onCheckboxClick(this.modifyItem);

  }

  /**
   * On default popup window outbound click
   */
  onPopupOutboundClick() {
    // Dismiss default popup window
    this.isChangeDefaultShown = false;
  }

  /**
   * On default popup window cancel click
   */
  onPopupCancelClick() {
    // Dismiss default popup window
    this.isChangeDefaultShown = false;
  }

  /**
   * On default popup window confirm button click
   */
  onPopupConfirmClick() {
    // Update default value
    for (const item of this.popupCheckboxItems) {
      if (item.isChecked) {
        this.quickLogin.setConfigurations(item.defaultKey, item.key);
        break;
      }
    }

    // Update configuration
    this.updateConfiguration();

    // Dismiss default popup window
    this.isChangeDefaultShown = false;
  }

  /**
   * On default popup window item click
   * @param index Configuration item index
   */
  onPoupCheckboxClick(index) {
    // Check selected index
    for (let i = 0; i < this.popupCheckboxItems.length; i++) {
      this.popupCheckboxItems[i]["isChecked"] = i == index;
    }
  }

  /**
   * On change default clicked
   * @param defaultKey Default key
   * @param supportChilds Support child items
   */
  onChangeDefaultClick() {
    var defaultKey = this.selectedGroup.key;
    var supportChilds = this.selectedGroup.checkboxList;

    // Get user configurations
    var userConfigurations = this.quickLogin.getConfigurations();

    // Define childs
    this.popupCheckboxItems = [];
    for (const child of supportChilds) {
      if (child.isChecked) {
        this.popupCheckboxItems.push({
          defaultKey: defaultKey,
          key: child.key,
          title: child.title,
          isChecked: userConfigurations[defaultKey] == child.key
        });
      }
    }
    // Display popup
    this.isChangeDefaultShown = this.popupCheckboxItems.length > 0;
  }

  /**
   * On cancel setting pattern lock number
   */
  onPatternCancelClick() {
    this.patternLockNumber = null;
    this.patternLockMessage = "";
    this.isPatternLockShown = false;
    this.isModifyPatternLock = false;
    this.patternLockNewNumber = null;
    this.updateConfiguration();

    //取消圖形鎖設定要將showTerm設為true，讓下次開啟時能跳條約pop
    this.showTerm = true;
  }

  getDefaultQuickValue(value) {
    if (this.selectedGroup == undefined) {
      return "";
    }

    var userConfigurations = this.quickLogin.getConfigurations();
    if (userConfigurations == undefined) {
      return "";
    }

    for (const checkbox of this.selectedGroup.checkboxList) {
      if (value == checkbox.key) {
        return checkbox.title;
      }
    }
    return "";
  }


  /**
   * Modify user pattern lock number
   * @param patternLock Pattern lock checkbox
   */
  onPatternModify(patternLock) {
    this.isModifyPatternLock = true;
    this.modifyItem = patternLock;

    // Get user configurations
    var userConfigurations = this.quickLogin.getConfigurations();
    // Get original pattern lock number
    this.patternLockNumber = userConfigurations[patternLock.passwordKey];
    this.patternLockNewNumber = null;
    this.patternLockMessage = "QUICKLOGIN.DRAW_ORIGINAL_PATTERN_LOCK"; // 請輸入原圖形鎖
    this.isPatternLockShown = true;
  }

  /**
   * On modify pattern lock clicked
   */
  onPatternModifyClick() {
    for (const checkbox of this.selectedGroup.checkboxList) {
      if (checkbox.type == "P" && checkbox.isChecked) {
        this.onPatternModify(checkbox);
        return;
      }
    }
    this.popup.setConfirm({
      content: "QUICKLOGIN.NO_PATTERN", //請先請用圖形鎖
      event: () => {
      }
    });
  }
}
