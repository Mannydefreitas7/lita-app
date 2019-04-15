import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeModule } from '../home/home.module';

const routes: Routes = [
  { path: '', component: SigninComponent, data: { title: 'Sign In'} },
  { path: 'signup', component: SignupComponent, data: { title: 'Sign Up'} },
  { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password'}},
  { path: 'home', loadChildren: './home/home.module#HomeModule' }
];

@NgModule({
  declarations: [SigninComponent, SignupComponent, ResetPasswordComponent],
  imports: [RouterModule.forChild(routes), SharedModule, HomeModule]
})
export class AuthModule { }
