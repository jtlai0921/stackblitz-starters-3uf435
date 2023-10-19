/**
 * [樣版] 廣告
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@template/formate/formate.module';
// == 其他template清單 == //
import { StartHomeAdComponent } from './start-home-ad.component';

// == 其他template清單 == //
const TemplateList = [
  StartHomeAdComponent
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
export class StartHomeAdModule { }
