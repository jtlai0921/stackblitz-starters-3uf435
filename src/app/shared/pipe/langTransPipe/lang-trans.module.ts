import { NgModule } from '@angular/core';
import { LangTransPipe } from './lang-trans.pipe';
import { LangTransService } from './lang-trans.service';
@NgModule({
  declarations: [LangTransPipe],
  exports: [LangTransPipe],
  providers: [
    LangTransService
  ]
})
export class LangTransModule {
  constructor(
  ) {
    console.log('LangTransModule Start >>');
  }
}
