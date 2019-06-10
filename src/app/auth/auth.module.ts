import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { EmailsignupComponent } from './emailsignup/emailsignup.component';
import { AddcongregationComponent } from '../home/dashboard/addcongregation.component';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'add-congregation', component: AddcongregationComponent },
  { path: 'signup/:cid/:id', component: EmailsignupComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [SigninComponent, SignupComponent, ResetPasswordComponent, LoginComponent, EmailsignupComponent, AddcongregationComponent],
  imports: [RouterModule.forRoot(routes), SharedModule]
})
export class AuthModule { }
