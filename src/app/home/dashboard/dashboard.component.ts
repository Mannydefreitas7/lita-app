import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser = this.auth.currentUserObservable.currentUser;

  constructor(private auth: AuthService) {
    console.log(this.currentUser);
   }

  ngOnInit() {}


  logOut() {
    return this.auth.signOut();
  }

}
