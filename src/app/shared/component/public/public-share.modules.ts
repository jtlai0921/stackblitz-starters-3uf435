import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangTransModule } from '../../pipe/langTransPipe/lang-trans.module';
import { SearchComponent } from './search.component';
import { OptionComponent } from './option.component';
import { QuickSelectComponent } from './quickSelect.component';
import { DateFilterComponent } from './dateFilter.component';
import { NoDataComponent } from './noData.component';
import { SearchFilterService } from './search-filter.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LangTransModule
  ],
  declarations: [
    SearchComponent,
    OptionComponent,
    QuickSelectComponent,
    DateFilterComponent,
    NoDataComponent
  ],
  providers: [
    SearchFilterService
  ],
  exports: [
    SearchComponent,
    OptionComponent,
    QuickSelectComponent,
    DateFilterComponent,
    NoDataComponent
  ]
})

export class PublicShareComponentModule {
  constructor() {
    console.log('PublicShareComponentModule Start >>');
  }
}
