import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PublishersComponent } from './core/publishers/publishers.component';
import { LiteratureComponent } from './core/literature/literature.component';
import { OrderComponent } from './core/order/order.component';
import { ReportComponent } from './core/report/report.component';
import { HelpComponent } from './core/help/help.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, 
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'publishers',
    component: PublishersComponent
  },
  {
    path: 'literature',
    component: LiteratureComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
  {
    path: 'help',
    component: HelpComponent
  }
];

@NgModule({

  imports: [
    AuthModule,
    CoreModule,
    RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
    AuthModule,
    CoreModule
  ]
})
export class AppRoutingModule { }
