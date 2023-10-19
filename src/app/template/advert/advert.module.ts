/**
 * [樣版] 廣告輪播牆
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormateModule } from '@template/formate/formate.module';
import { AdvertComponent } from './advert.component';
import { AdvertService } from './advert.service';
import { CardSwiperModule } from '@template/card-swiper/card-swiper.module';

// == 其他template清單 == //
const TemplateList = [
  AdvertComponent,
//   CardSwiperDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FormateModule,
    CardSwiperModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [AdvertService]
})
export class AdvertModule { }
