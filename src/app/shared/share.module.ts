import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ==langTransPipe== //
//import {LangTransModule} from './pipe/langTransPipe/lang-trans.module';

// == providersList ==///
const providersList = [
];


// == importList ==///
const importList = [
  FormsModule,
  //LangTransModule
];

// == exportsList ==///
const exportsList = [
];


@NgModule({
  imports: importList,
  exports: exportsList,
  providers: providersList,
  declarations: []
})
export class ShareModule {
  constructor(
    //private _logger: Logger
  ) {
   // this._logger.error('ShareModule Start >>');
  }
}
