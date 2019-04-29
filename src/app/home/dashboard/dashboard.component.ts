import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatDialog} from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { SettingsComponent } from './settings.component';
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
  loading = true;
  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {

      if (this.currentUser.displayName !== null) {
        this.currentUserName = this.currentUser.displayName;
      } else {
        this.currentUserName = 'to Lita';
      }

      if (this.currentUser.photoURL !== null) {
        this.currentUserImage = this.currentUser.photoURL;
      } else {
        this.currentUserImage = '../../assets/images/profile.png';
      }
      console.log(this.currentUser, this.currentUserImage, this.currentUserName);
      this.router.events.subscribe((event: Event) => {
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.loading = false;
            break;
          }
          default: {
            break;
          }
        }
      });
   }

  ngOnInit() {
  }
  logOut() {
    return this.auth.signOut();
  }

  updateProfile() {
    const dialogRef = this.dialog.open(SettingsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
