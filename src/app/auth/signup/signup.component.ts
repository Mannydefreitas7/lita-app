import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/auth.service';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { MustMatch } from '../../components/helpers/must-match.validator';
import { PublisherService } from 'src/app/home/publishers/publisher.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./../login/login.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  hide = true;
  empty = true;
  emailMessage = false;
  emailOne: string;
  emailTwo: string;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faMicrosoft = faMicrosoft;
  emailCheck: boolean;


  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private pub: PublisherService
  ) {}





  ngOnInit() {

    
    this.signUpForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        emailTwo: ['', [Validators.required]],
      password: ['',
      [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ],
    ], displayName: ['', Validators.required]
    }, { updateOn: 'blur', validators: MustMatch('email', 'emailTwo')});

  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
   return this.signUpForm.get('password');
  }
  get name() {
    return this.signUpForm.get('displayName');
   }

  // convenience getter for easy access to form fields
  get f() { return this.signUpForm.controls; }

  signUp() {

    if (this.signUpForm.get('email').value === this.signUpForm.get( 'emailTwo').value) {
      this.emailCheck = true;
      return this.auth.emailSignUp(this.email.value, this.password.value, this.name.value)
      .then(user => {
        if (this.signUpForm.valid) {
          this.router.navigate(['/home/add-congregation']);
        }
      }).catch(err => {
        this.pub.snackBar.open(err.message, '', { duration: 3000 })
      })
    } else {
      this.emailCheck = false;
      this.signUpForm.get('emails').status == 'INVALID'
      
    }
   
  }
}
