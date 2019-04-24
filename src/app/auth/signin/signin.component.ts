import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/auth.service';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import {MatDialog} from '@angular/material';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
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

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    public dialog: MatDialog
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
    const dialogRef = this.dialog.open(ResetPasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  signIn() {
    return this.auth.emailSignIn(this.email.value, this.password.value)
    .then(user => {
      if (this.signInForm.valid) {
        this.router.navigate(['/home']);
      }
    });
  }
}
@Component({
  selector: 'reset-password',
  templateUrl: './../reset-password/reset-password.component.html',
})
export class ResetPasswordDialog {} 