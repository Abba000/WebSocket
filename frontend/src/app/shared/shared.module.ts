import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NgxChartsModule
  ],
})
export class SharedModule { }
