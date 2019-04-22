import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email: string;
  successMessage: string;
  close: boolean = false;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  resetPassword(email) {
    return this.auth.resetPassword(this.email)
    .then(() => this.successMessage = "We sent you a email." )
    .then(() => this.close = true);
  }


}
