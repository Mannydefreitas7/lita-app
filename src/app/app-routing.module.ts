import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { PublishersComponent } from './home/publishers/publishers.component';
import { PublisherComponent } from './home/publishers/publisher.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LiteratureComponent } from './home/literature/literature.component';
import { OrderComponent } from './home/order/order.component';
import { InventoryComponent } from './home/inventory/inventory.component';
import { ReportComponent } from './home/report/report.component';
import { HelpComponent } from './home/help/help.component';
import { HomeComponent } from './home/home/home.component';
import { SettingsComponent } from './home/dashboard/settings.component';
import { AddpublisherComponent } from './home/publishers/addpublisher.component';
import { UsersComponent } from './home/admin/users/users.component';
import { CongregationsComponent } from './home/admin/congregations/congregations.component';
import { NewsComponent } from './home/admin/news/news.component';
import { OrderPublicationComponent } from './home/order/order-publication/order-publication.component';
import { AddcongregationComponent } from './home/dashboard/addcongregation.component';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'literature', component: LiteratureComponent, canActivate: [AuthGuard] },
      { path: 'publishers', component: PublishersComponent, canActivate: [AuthGuard] },
      { path: 'publishers/:id', component: PublisherComponent, canActivate: [AuthGuard] },
      { path: 'order' , component: OrderComponent, canActivate: [AuthGuard] },
      { path: 'inventory' , component: InventoryComponent, canActivate: [AuthGuard] },
      { path: 'add-publication/:id/:pubid' , component: OrderPublicationComponent, canActivate: [AuthGuard] },
      { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
      { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'add-congregation', component: AddcongregationComponent, canActivate: [AuthGuard] },
      { path: 'congregations', component: CongregationsComponent, canActivate: [AuthGuard] },
      { path: 'news', component: NewsComponent, canActivate: [AuthGuard] }
    ]
  }
  
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
