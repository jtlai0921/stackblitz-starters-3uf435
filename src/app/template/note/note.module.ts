/**
 * [樣版] 注意事項
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NoteComponent } from '@template/note/note.component';
import { FormateModule } from '@template/formate/formate.module';
import { NotePopupModule } from '@template/msg/note-popup/note-popup.module';

// == 其他template清單 == //
const TemplateList = [
  NoteComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    NotePopupModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: []
})
export class NoteModule { }
