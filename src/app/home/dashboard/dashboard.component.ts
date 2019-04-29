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
import { User } from '../../shared/models/user.model';
import 'rxjs/operator/map';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userRef: any = this.auth.authState;
  userDoc: any;
  currentUserName: string;
  currentUserImage: any;
  loading = true;
  displayName: string;
  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) {

      const user: User = this.userRef;

      this.auth.firebaseFireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(user => this.userDoc = user)

      if (this.userRef.photoURL != null) {
        this.currentUserImage = this.userRef.photoURL;
      } else {
        this.currentUserImage = 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/profile.png?alt=media&token=6aa1a87c-1d1e-4e0e-ae34-bb1ea8b34a06';
      }
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
