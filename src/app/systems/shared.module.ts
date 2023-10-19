/**
 * 共用模組，所有功能模組都需要各別import的模組
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@template/formate/formate.module';
import { NoteModule } from '@template/note/note.module';
import { SortModule } from '@template/sort/sort.module'; // 排序按鈕控制
import { ErrorBoxModule } from '@template/msg/error-box/error-box.module';

// // UI-Content
// import { UiContentModule } from '@shared/layout/ui-content/ui-content.module';

// // Formate Pipe
// import { UppercaseDirective } from './directive/uppercase.directive';
// import { OverAmountStyleModule } from '@shared/layout/over-amount-style/over-amount-style.module'; // 長度樣式處理
// import { InputDateComponentModule } from '@shared/template/text/input-date/input-date-component.module'; // 日期input
// import { PatternLockComponent } from './pattern-lock/pattern-lock.component';

// import { StepBarModule } from '@shared/template/stepbar/step-bar.module'; // 步驟列
// import { ResultTempModule } from '@shared/template/result/result-temp.module'; // 結果頁
// import { SelectCheckModule } from '@shared/template/select/select-check/select-check.module';


/**
 * 模組清單
 */
const Modules = [
  CommonModule,
  FormsModule,
  TranslateModule,
//   UiContentModule,
  FormateModule,
//   OverAmountStyleModule,
//   InputDateComponentModule,
//   StepBarModule,
//   ResultTempModule
//   , SelectCheckModule
  NoteModule,
  SortModule,
  ErrorBoxModule
];

@NgModule({
  imports: [
    ...Modules
  ],
  exports: [
    ...Modules,
    // UppercaseDirective,
    // PatternLockComponent
  ],
  declarations: [
    // UppercaseDirective,
    // PatternLockComponent
  ]
})
export class SharedModule { }