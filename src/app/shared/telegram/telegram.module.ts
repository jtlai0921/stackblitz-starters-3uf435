/**
 * Telegram模組
 */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SystemApiService } from './sys_api.service'
import { TelegramService } from './telegram.service';

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    HttpModule
  ],
  providers: [
    SystemApiService,
    TelegramService
  ]
})
export class TelegramModule {
  constructor(
  ) {
    console.log('TelegramModule Class Start >>');
  }
}
