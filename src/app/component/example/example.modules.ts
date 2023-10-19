
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Route Module
import { ExampleRoutingModule } from './example-routing.module';

import { ExampleComponent } from './example.component';
import { ChildExampleComponent } from './child_example/child_example.component';
import { RouteExampleComponent } from './route_example/route_example.component';
import { LangTransModule} from '../../shared/pipe/langTransPipe/lang-trans.module';
import { PipeShareModule } from '../../shared/pipe/publicPipe/pipe.module';
import { PublicShareComponentModule } from '../../shared/component/public/public-share.modules';
import { DirectiveShareModule } from '../../shared/directive/directive.share.modules'
@NgModule({
  imports: [
    CommonModule,
    ExampleRoutingModule,
    FormsModule,
    LangTransModule,
    PipeShareModule,
    PublicShareComponentModule,
    DirectiveShareModule
  ],
  declarations: [
    ExampleComponent,
    ChildExampleComponent,
    RouteExampleComponent
  ],
  providers:[
    
  ]
})
export class ExampleModule { }
