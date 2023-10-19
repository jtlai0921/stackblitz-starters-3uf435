import { Component, OnInit, NgZone } from '@angular/core';
import { PopupService } from '../../service/global/popup.service'
import { LocalStorageService } from '../../service/global/localStorage.service';

declare let $;

@Component({
  selector: 'app-pop-keyboard',
  templateUrl: './pop-keyboard.component.html',
  styleUrls: ['./pop-keyboard.component.css']
})
export class PopKeyboardComponent implements OnInit {
  private _subscribe;
  IsOpen = false;
  private isUppercase = false;
  private isKeyboardActive = false;
  private password = "";
  private upperCaseStatus = 0;
  arr1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
  arr3 = [];
  arr2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  arr4 = ['a', 's', 'd', 'f', 'g', 'h', 'j', '!', 'k','l']
  arr5 = ['uppercase', 'z', 'x', 'c','b','v', '!', 'n', 'm','delete']

  constructor(
    private pop: PopupService,
    private zone: NgZone,
    private storage: LocalStorageService
  ) {
    this._subscribe = this.pop.keyboardStatus.subscribe(
      (status) => {
        this.IsOpen = status;
        if (status) {
          this.randomKeyboard();
          this.pushArr3();

          //初始化密碼
          if ($('#password')[0]) {
            if ($('#password')[0].value == undefined || $('#password')[0].value == "") {
              this.password = "";
            }
          } else {
            this.password = "";
          }
          this.openKeyboard();
        }
      }
    );

  }

  ngOnInit() { }

  //設置鍵盤按鍵
  pushArr3() {
    this.arr3 = [];
    let temp =  Math.random() > 0.5? [2,3]:[3,2]
    if(this.randomSort() == -1){
      temp.splice(0,0,1);
    }else{
      temp.splice(2,0,1);
    }
    temp.forEach((item) =>{
      if(item == 1){
        this.arr3 = this.arr3.concat(this.arr1);
      }
      else if(item == 2){
        this.arr3 = this.arr3.concat(this.arr2);
      }
      else if(item == 3){
        this.arr3 = this.arr3.concat(this.arr4);
        this.arr3 = this.arr3.concat(this.arr5);
      }

    })
  }


  //打亂按鍵
  randomKeyboard() {
    this.arr4 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k','l']
    this.arr5 = ['uppercase', 'z', 'x', 'c','b','v', 'n', 'm','delete']
    let temp = Math.floor((Math.random() * 8)+1);
    let temp2 = Math.floor(Math.random() * 10)
    this.arr4.splice(temp2 , 0 ,'!');
    this.arr5.splice(temp , 0 ,'!')
  }

  randomSort() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  /**
   * 開啟鍵盤
   * pwd_forKeyBoard => 要再<input>裡設id="pwd_forKeyBoard"
   */
  openKeyboard() {

    /**
     * 找到畫面中要移動的區塊的最外層tag加上 id="outsideBlock_forKeyBoard"
     */
    if (document.getElementById('outsideBlock_forKeyBoard') != null) {
      document.getElementById('outsideBlock_forKeyBoard').style.height = '57vh';
      document.getElementById('outsideBlock_forKeyBoard').style.overflow = 'scroll';
    }
    // else {
    document.getElementById('mainboad').style.height = '57vh';
    document.getElementById('mainboad').style.overflow = 'scroll';
    // }

    setTimeout(() => {
      this.isKeyboardActive = true;

    }, 0)

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        let x = document.getElementById("pwd_forKeyBoard");
        x.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center"
        });
      }, 400);
    })
  }

  // 關閉鍵盤
  closeKeyboard() {
    this.isKeyboardActive = false;

    if (document.getElementById('outsideBlock_forKeyBoard') != null) {
      document.getElementById('outsideBlock_forKeyBoard').style.height = '';
      setTimeout(() => {
        document.getElementById('outsideBlock_forKeyBoard').style.overflow = '';
      }, 100);
    }

    document.getElementById('mainboad').style.height = '';
    setTimeout(() => {
      document.getElementById('mainboad').style.overflow = '';
    }, 100);

    setTimeout(() => {
      this.IsOpen = false;
    }, 100);
  }

  upperCaseButton() {
    this.zone.runOutsideAngular(() => {
      this.upperCaseStatus+= 1;
      //轉為大寫
      if(this.upperCaseStatus == 1){
        this.arr3 = this.arr3.map(word => word.toUpperCase());
      }
      //按第三次則轉為小寫
      else if(this.upperCaseStatus == 3){
        this.arr3 = this.arr3.map(word => word.toLowerCase());
        this.upperCaseStatus = 0;
      }
    })
  }

  clickButton(value) {
    this.zone.runOutsideAngular(() => {
    //若大寫鍵未鎖定則轉為小寫
    if(this.upperCaseStatus == 1){
      this.arr3 = this.arr3.map(word => word.toLowerCase());
      this.upperCaseStatus = 0;
    }
    this.password += value;

    $('#password').val(this.password);
    $("#password")[0].dispatchEvent(new Event("input", { bubbles: true }));
    })
  }

  //刪除鍵
  deleteButton() {
    this.zone.runOutsideAngular(() => {
      this.password = this.password.substr(0, this.password.length - 1)
      $('#password').val(this.password)
      $("#password")[0].dispatchEvent(new Event("input", { bubbles: true }))
    })
  }
}
