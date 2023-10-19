
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Route Module
import { AppUpdateRoutingModule } from './appUpdate-routing.module';
// Service Module
import { ContentVerInqService } from '../../shared/service/customize/contentVerInq.service';
import { ContentDownloadService } from '../../shared/service/customize/contentDownload.service';
// Component Module
import { AppUpdateComponent } from './appUpdate.component';
// Cordova Plugin Module
import { FileService } from '../../shared/service/cordova/file.service';
import { WbcService } from '../../shared/service/cordova/wbc.service';
import { ZipService } from '../../shared/service/cordova/zip.service';
// Pipe Module
import { LangTransModule } from '../../shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';
// Directive Module
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules';

@NgModule({
  imports: [
    CommonModule,
    AppUpdateRoutingModule,
    FormsModule,
    LangTransModule,
    DirectiveShareModule,
    PipeShareModule
  ],
  declarations: [
    AppUpdateComponent
  ],
  providers: [
    ContentDownloadService,
    ContentVerInqService,
    FileService,
    WbcService,
    ZipService
  ]
})
export class AppUpdateModule {}
