/**
 * swpier套件
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSwiperDirective } from './card-swiper.directive';

/**
 * 模組清單
 */
const Modules = [
  CommonModule
];
const Provider = [
];
const DIRECTIVES = [
  CardSwiperDirective
];

@NgModule({
  imports: [
    ...Modules
  ],
  providers: [
    ...Provider
  ],
  declarations: [
    ...DIRECTIVES
  ],
  exports: [
    ...DIRECTIVES
  ]
})
export class CardSwiperModule { }
