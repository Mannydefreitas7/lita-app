import { Component, OnInit, AfterViewInit } from '@angular/core';

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
export class DashboardComponent implements OnInit, AfterViewInit {
  userRef: any = this.auth.authState;
  userDoc: any;
  currentUserName: string;
  currentUserImage: any;
  loading = true;
  displayName: string;
  user: User = this.userRef;
  creationTime: any = this.auth.currentUserObservable.currentUser.metadata.creationTime;
  lastSigned: any = this.auth.currentUserObservable.currentUser.metadata.creationTime;

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog, private afs: AngularFirestore) {
 
  }

  ngOnInit() {


    const userId = this.auth.currentUserId
    this.afs.doc(`users/${userId}`).valueChanges()
    // tslint:disable-next-line:no-shadowed-variable
    .subscribe(user => {
      console.log(user);
      this.userDoc = user;
      }
    );


    if (this.userRef.photoURL != null) {
      this.currentUserImage = this.userRef.photoURL;
    } else {
      // tslint:disable-next-line:max-line-length
      this.currentUserImage = 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/profile.png?alt=media&token=6aa1a87c-1d1e-4e0e-ae34-bb1ea8b34a06';
    }
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.creationTime == this.lastSigned) {
      setTimeout(() => 
      this.dialog.open(TutorialComponent));
      console.log('Tutorial Started... :)');

    } else {
      setTimeout(() => 
      this.dialog.open(TutorialComponent).close());
      console.log('No Tutorial...');
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
