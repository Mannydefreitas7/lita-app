import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { PublishersComponent } from './home/publishers/publishers.component';
import { PublisherComponent } from './home/publishers/publisher.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LiteratureComponent } from './home/literature/literature.component';
import { OrderComponent } from './home/order/order.component';
import { ReportComponent } from './home/report/report.component';
import { HelpComponent } from './home/help/help.component';
import { HomeComponent } from './home/home/home.component';
import { SettingsComponent } from './home/dashboard/settings.component';
import { AddpublisherComponent } from './home/publishers/addpublisher.component';
import { UsersComponent } from './home/admin/users/users.component';
import { CongregationsComponent } from './home/admin/congregations/congregations.component';
import { NewsComponent } from './home/admin/news/news.component';
import { OrderPublicationComponent } from './home/order/order-publication/order-publication.component';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent  },
      { path: 'settings', component: SettingsComponent },
      { path: 'literature', component: LiteratureComponent },
      { path: 'publishers', component: PublishersComponent },
      { path: 'publishers/:id', component: PublisherComponent },
      { path: 'add-publisher', component: AddpublisherComponent },
      { path: 'order' , component: OrderComponent },
      { path: 'add-publication/:id/:pubid' , component: OrderPublicationComponent },
      { path: 'report', component: ReportComponent },
      { path: 'help', component: HelpComponent }
    ]
  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'congregations', component: CongregationsComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] }
  
];

@NgModule({

  imports: [
    AuthModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    AuthModule,
    RouterModule
  ],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
