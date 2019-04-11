import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/auth.service';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  hide = true;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faMicrosoft = faMicrosoft;

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
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
    return this.signUpForm.get('email');
  }
  get password() {
   return this.signUpForm.get('password');
  }


  signUp() {
    return this.auth.emailSignUp(this.email.value, this.password.value)
    .then(user => {
      if (this.signUpForm.valid) {
        this.router.navigate(['/']);
      }
    });
  }
}
