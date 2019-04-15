import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeModule } from '../home/home.module';

const routes: Routes = [
  { path: '', component: SigninComponent, outlet: 'login' },
  { path: 'signup', component: SignupComponent, outlet: 'login' },
  { path: 'reset-password', component: ResetPasswordComponent, outlet: 'login' },
  { path: 'home', loadChildren: '../home/home.module#HomeModule'  }
];

@NgModule({
  declarations: [SigninComponent, SignupComponent, ResetPasswordComponent],
  imports: [RouterModule.forChild(routes), SharedModule, HomeModule]
})
export class AuthModule { }
