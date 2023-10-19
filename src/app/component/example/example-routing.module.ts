import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ExampleComponent} from './example.component';
//子頁
import {RouteExampleComponent} from './route_example/route_example.component';

const routes: Routes = [
  {  path: '', component : ExampleComponent},
  {  path: 'child', component : RouteExampleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule]
})
export class ExampleRoutingModule {}
