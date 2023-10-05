import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WsComponent } from './pages/ws/ws.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WsComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
