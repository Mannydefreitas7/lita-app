import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';

import { MatDialog} from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

import { SettingsComponent } from './settings.component';
import { TutorialComponent } from './tutorial.component';

import { User } from '../../shared/models/user.model';


import 'rxjs/operator/map';
import { Congregation } from 'src/app/shared/models/congregation.model';

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
  dateCreated: number;
  today: number;
  loading = true;
  displayName: string;
  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog, private afs: AngularFirestore) {
      const d = new Date().toLocaleDateString().split('/');
      const day = '0' + d[0];
      const month = d[1];
      const year = d[2];

      const todayAll = day + month + year;
      this.today = Number(todayAll);
      console.log(this.today);
      const user: User = this.userRef;
      // tslint:disable-next-line:no-shadowed-variable
      this.afs.doc(`users/${user.uid}`).valueChanges()
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(user => {
        console.log(user);
        this.userDoc = user;
        this.dateCreated  = user.congregation.dateCreated;
        console.log(this.dateCreated);
        }
      );


      if (this.userRef.photoURL != null) {
        this.currentUserImage = this.userRef.photoURL;
      } else {
        // tslint:disable-next-line:max-line-length
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
    if (this.dateCreated !== this.today) {
      console.log('No Tutorial...');
      } else {
        this.dialog.open(TutorialComponent);
        console.log('Tutorial Started... :)');
      }
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
