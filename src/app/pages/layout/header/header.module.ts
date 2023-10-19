/**
 * header功能選單
 */
import { NgModule } from '@angular/core';
// ---------------- Model Start ---------------- //
import { SharedModule } from '@systems/shared.module';
// ---------------- Pages Start ---------------- //
import { HeaderComponent } from './header.component';
// ---------------- API Start ---------------- //
// ---------------- Service Start ---------------- //
// ---------------- Shared Start ---------------- //
import { GreetingsModule } from '@template/greetings/greetings.module';

@NgModule({
  imports: [
    SharedModule,
    GreetingsModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [
    HeaderComponent
  ]
})
export class HeaderModule { }
