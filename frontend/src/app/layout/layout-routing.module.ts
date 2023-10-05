import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { WsComponent } from './pages/ws/ws.component';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children: [
    {path: '', pathMatch: 'full', component: WsComponent},
    {path:'ws', component:WsComponent}
  ]
}];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
    
  ],
  exports: [ RouterModule]
})
export class LayoutRoutingModule { }
