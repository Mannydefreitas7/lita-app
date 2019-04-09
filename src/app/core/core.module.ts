import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishersComponent } from './publishers/publishers.component';
import { LiteratureComponent } from './literature/literature.component';
import { OrderComponent } from './order/order.component';
import { ReportComponent } from './report/report.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    PublishersComponent, 
    LiteratureComponent, 
    OrderComponent, 
    ReportComponent, 
    HelpComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
