import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lita-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private afs: AuthService, private router: Router) { }

  ngOnInit() {
    const currentUser = this.afs.isAuth;
    console.log(currentUser);
      if (currentUser) {
        this.afs.stateChanged();
      } else {
        this.router.navigate(['/']);
    }
  }
}