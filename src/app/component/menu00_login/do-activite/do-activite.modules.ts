
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Route Module
import { DoActiviteComponent } from './do-activite.component';
import { DoActiviteRoutingModule } from './do-activite-routing.module';

import { LangTransModule } from '../../../shared/pipe/langTransPipe/lang-trans.module'
import {LocalStorageService} from '../../../shared/service/global/localStorage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LangTransModule,
    DoActiviteRoutingModule
  ],
  declarations: [
    DoActiviteComponent,
  ],
  providers: [
    LocalStorageService
  ]
})
export class DoActiviteModule { }
