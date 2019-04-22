import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any = this.auth.currentUserObservable.currentUser;
  currentUserName: string;
  currentUserImage: any;
  constructor(private auth: AuthService) {

      if (this.currentUser.displayName != null) {
        this.currentUserName = this.currentUser.displayName;
      } else {
        this.currentUserName = 'to Lita';
      }

      if (this.currentUser.photoURL != null) {
        this.currentUserImage = this.currentUser.photoURL;
      } else {
        this.currentUserImage = '../../assets/images/profile.png';
      }
      console.log(this.currentUser, this.currentUserImage, this.currentUserName);
   }

  ngOnInit() {
  }



  logOut() {
    return this.auth.signOut();
  }

}
