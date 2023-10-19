// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Pipe
import { CurrencyPipe } from './currency.pipe';
import { DateTimePipe } from './datetime.pipe';
import { CustomPipe } from './custom/custom.pipe';
import { CustomCodeService } from './custom/custom.service';
@NgModule({
  declarations: [
    CurrencyPipe,
    DateTimePipe,
    CustomPipe
  ],
  providers: [
    CustomCodeService
  ],
  exports: [
    CurrencyPipe,
    DateTimePipe,
    CustomPipe
  ]
})
export class PipeShareModule { }
