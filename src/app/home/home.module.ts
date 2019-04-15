import { NgModule } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { OrderComponent } from './order/order.component';
import { PublishersComponent } from './publishers/publishers.component';
import { LiteratureComponent } from './literature/literature.component';
import { ReportComponent } from './report/report.component';
import { HelpComponent } from './help/help.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HeaderComponent, OrderComponent, PublishersComponent, LiteratureComponent, ReportComponent, HelpComponent, HomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
