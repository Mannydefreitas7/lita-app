import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MatDialog} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import { AuthService } from '../../core/auth.service';
import { map } from 'rxjs/operator/map';
import { Congregation, Literature, Publisher } from '../../shared/models/congregation.model';

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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class DashboardComponent implements OnInit {
  userDoc: Observable<User>;
  user: any;
  congregationRef: any;
  congregation: Observable<Congregation>;
  currentUserName: string;
  currentUserImage: any;
  loading = false;
  firstLog: boolean;
  setupGroup: FormGroup;
  pubs: any = [];

  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog, private afs: AngularFirestore, private _formBuilder: FormBuilder, private http: HttpClient, private ngZone: NgZone) {}

  ngOnInit() {

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    

    this.http.get('assets/literature.json').subscribe(results => {
      // tslint:disable-next-line:prefer-for-of
    this.pubs = JSON.parse(JSON.stringify(results));
  });

    this.setupGroup = this._formBuilder.group({
      congID: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      congName: ['', [Validators.required, Validators.min(3)]],
      congLanguage: ['', [Validators.required, Validators.min(3)]]
    });


    this.auth.currentUser.subscribe(user => {

      this.user = user
      console.log(this.user)
      if (user.metadata.creationTime == user.metadata.lastSignInTime) {
        this.firstLog = true;
      } else {
        this.firstLog = false;
      }

      this.userDoc = this.afs.doc<User>(`users/${user.uid}`).valueChanges();

      this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => {
        console.log(userDoc.congregation)
        this.congregationRef = userDoc.congregation;
        this.congregation = this.afs.doc<Congregation>(`congregations/${userDoc.congregation}`).valueChanges();
        console.log(this.congregation)
      });
    });

    // if (this.user.photoURL != null) {
    //   this.user.photoURL = this.user.photoURL;
    // } else {
    //   // tslint:disable-next-line:max-line-length
    //   this.user.photoURL = 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/profile.png?alt=media&token=6aa1a87c-1d1e-4e0e-ae34-bb1ea8b34a06';
    // }


   

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

  createCongregation() {
    const congID = this.setupGroup.get('congID');
    const congName = this.setupGroup.get('congName');
    const congLanguage = this.setupGroup.get('congLanguage');
    const user = this.auth.currentUserObservable.currentUser;
    const currentUser = this.afs.doc(`users/${user.uid}`);
    const congregation: AngularFirestoreCollection<Congregation> = this.afs.collection('congregations');
    const publishersRef: AngularFirestoreCollection<any> = congregation.doc(`${congID.value}`).collection('publishers');
    const literatureRef: AngularFirestoreCollection<any> = congregation.doc(`${congID.value}`).collection('literature');
    this.loading = true;
    return congregation.doc(`${congID.value}`).set(
      {
        id: congID.value,
        name: congName.value,
        language: congLanguage.value
      }, { merge: true }
    ).then(() => {
      return publishersRef
    })
    .then(() => {
      this.pubs.forEach(pub => {
       literatureRef.doc(`${pub.id}`).set(pub);
      });
    })
    .then(() => {
      return currentUser.update({
        congregation: congID.value
      })
    })
    .then(() => this.firstLog = false)
    .then(() => this.loading = false)
  }
}
