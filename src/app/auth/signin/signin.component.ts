import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/auth.service';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import {MatDialog, MatTabLink, MatTabNav} from '@angular/material';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { DashboardService } from 'src/app/home/dashboard/dashboard.service';
import { PublisherService } from 'src/app/home/publishers/publisher.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./../login/login.component.scss']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  hide = true;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faMicrosoft = faMicrosoft;
  tab: MatTabNav

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private dash: DashboardService,
    private publisher: PublisherService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['',
      [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
    ]
    });
   }

  ngOnInit() {}
  get email() {
    return this.signInForm.get('email');
  }
  get password() {
   return this.signInForm.get('password');
  }

  openPasswordDialog() {
    return this.dialog.open(ResetPasswordComponent);
  }

  signIn() {
    const email = this.signInForm.get('email');
    const pwd = this.signInForm.get('password');
    return this.auth.emailSignIn(email.value, pwd.value)
    .then(() => {
      this.auth.user.subscribe(user => {
        if (this.signInForm.valid && this.email.value == user.email) {
          this.router.navigate(['/home']);
        } else {
          this.publisher.snackBar.open('User Account Don\'t Exist. Please Sign Up','', {duration: 4000 });
        }
      })
 
    });
  }
}
