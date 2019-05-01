import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(private afs: AuthService, private router: Router) { 
    const currentUser = this.afs.authenticated;
    console.log(currentUser);
    if (currentUser) {
      this.afs.stateChanged();
    } else {
      this.router.navigate(['/']);
  }
  }
  

  ngOnInit() {

  }

  ngAfterViewInit() {}
   
}
