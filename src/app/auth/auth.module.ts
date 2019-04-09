import { NgModule } from '@angular/core';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [SigninComponent, SignupComponent, ResetPasswordComponent],
  imports: []
})
export class AuthModule { }
