import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { PublishersComponent } from './home/publishers/publishers.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LiteratureComponent } from './home/literature/literature.component';
import { OrderComponent } from './home/order/order.component';
import { ReportComponent } from './home/report/report.component';
import { HelpComponent } from './home/help/help.component';
import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent  },
      { path: 'literature', component: LiteratureComponent },
      { path: 'publishers', component: PublishersComponent },
      { path: 'order' , component: OrderComponent },
      { path: 'report', component: ReportComponent },
      { path: 'help', component: HelpComponent }
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
