import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SrollTopDirective } from './scrollTop.directive';
import { SrollBottomDirective } from './scrollBottom.directive'
import { DropReloadDirective } from './dropReload.directive';
import { GesturesDirective } from './gestures.directive';
import { SelectForPopDirective  } from './selectForpop.directive';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ 
    SrollTopDirective,
    SrollBottomDirective,
    DropReloadDirective,
    GesturesDirective,
    SelectForPopDirective
  ],
  providers: [
  ],
  exports: [
    SrollTopDirective,
    SrollBottomDirective,
    DropReloadDirective,
    GesturesDirective,
    SelectForPopDirective
  ]
})

export class DirectiveShareModule {
  constructor(){
    console.log('DirectiveShareModule Start >>');
  }
 }
