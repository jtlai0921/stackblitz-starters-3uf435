import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangTransModule} from '../../shared/pipe/langTransPipe/lang-trans.module'
import {
    HomeComponent
    ,FooterComponent
    ,MenuComponent
    ,HeaderComponent
    ,TourSwiperComponent
  } from '.';
  import { DirectiveShareModule } from '../../shared/directive/directive.share.modules'
  //Pipe
  import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LangTransModule,
    DirectiveShareModule,
    PipeShareModule
  ],
  declarations: [ 
    HomeComponent
    , FooterComponent
    , MenuComponent
    , HeaderComponent
    , TourSwiperComponent
  ],
  exports: [
     HomeComponent
    , FooterComponent
    , MenuComponent
    , HeaderComponent
    , TourSwiperComponent
  ]
})

export class LayoutModule { }
