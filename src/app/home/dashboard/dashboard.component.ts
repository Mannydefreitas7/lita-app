import { Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { map } from 'rxjs/operator/map';
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
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userRef: AngularFirestoreDocument<any>;
  userDoc: AngularFirestoreDocument<any>;
  congregationRef: any;
  congregation: Observable<any>;
  currentUserName: string;
  currentUserImage: any;
  loading = false;
  user: Observable<any>;
  creationTime: any;
  lastSigned: any;
  userId = this.auth.currentUserObservable.currentUser.uid;

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog, private afs: AngularFirestore) {

    this.userId = this.userId;

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
    this.userDoc = this.afs.doc(`users/${this.userId}`);
    this.user = this.userDoc.valueChanges();
  }

  ngAfterViewInit() {

    this.auth.currentUserObservable.onAuthStateChanged(user => {
      this.congregationRef = this.afs.doc(`users/${user.uid}`).collection('congregation').doc('publishers');
      this.congregation = this.congregationRef.valueChanges();

      this.userDoc = this.afs.doc(`users/${user.uid}`);
      this.user = this.userDoc.valueChanges();

      if (user.photoURL != null) {
      this.currentUserImage = user.photoURL;
    } else {
      // tslint:disable-next-line:max-line-length
      this.currentUserImage = 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/profile.png?alt=media&token=6aa1a87c-1d1e-4e0e-ae34-bb1ea8b34a06';
    }

      if (this.auth.currentUserObservable.currentUser.metadata.creationTime === this.auth.currentUserObservable.currentUser.metadata.lastSignInTime) {
      setTimeout(() =>
      this.dialog.open(TutorialComponent));
      console.log('Tutorial Started... :)');

    } else
      this.dialog.closeAll()
    }
  );
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
