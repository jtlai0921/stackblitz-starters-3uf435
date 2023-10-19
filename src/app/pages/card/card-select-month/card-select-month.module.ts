/**
 * 
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSelectMonthComponent } from './card-select-month.component';
import { CardSelectMonthService } from './card-select-month.service';
import { SPEC12010301ApiService } from '@api/spec12/spec12010301/spec12010301-api.service';


const TemplateList = [
  CardSelectMonthComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ...TemplateList
  ],
  declarations: [
    ...TemplateList
  ],
  providers: [
    CardSelectMonthService,
    SPEC12010301ApiService
  ]
})
export class CardSelectMonthModule { }
