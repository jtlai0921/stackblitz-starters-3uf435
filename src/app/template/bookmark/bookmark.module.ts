/**
 * [樣版] 頁籤選單
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BookmarkComponent } from '@template/bookmark/bookmark.component';
import { FormateModule } from '@template/formate/formate.module';

// == 其他template清單 == //
const TemplateList = [
  BookmarkComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: []
})
export class BookmarkModule { }
