
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Route Module
import { NotificationRoutingModule } from './notification-routing.module';

// Service Module
import { GetNotificationService } from '../../shared/service/customize/getNotification.service';

// Component Module
import { NotificationComponent } from './notification.component';
import { NotificationTypeComponent } from './notification-type/notification-type.component';

// Shared Module
import { PublicShareComponentModule } from '../../shared/component/public/public-share.modules';
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules';
import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';

//Pipe
import { DateTimePipe } from '../../shared/pipe/publicPipe/datetime.pipe';
import { CurrencyPipe } from '../../shared/pipe/publicPipe/currency.pipe';

@NgModule({
  imports: [
    CommonModule,
    NotificationRoutingModule,
    FormsModule,
    LangTransModule,
    PipeShareModule,
    PublicShareComponentModule,
    DirectiveShareModule
  ],
  declarations: [
    NotificationComponent, 
    NotificationTypeComponent
  ],
  providers: [
    GetNotificationService,
    DateTimePipe,
    CurrencyPipe
  ]
})
export class NotificationModule { }
