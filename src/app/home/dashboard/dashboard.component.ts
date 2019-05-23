import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import { AuthService } from '../../core/auth.service';
import { map } from 'rxjs/operator/map';
import { Congregation, Literature, Publisher } from '../../shared/models/congregation.model';

import { Router } from '@angular/router';

import { User } from '../../shared/models/user.model';

import 'rxjs/operator/map';

import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';

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
  firstLog: boolean;
  setupGroup: FormGroup;
  pubs: any = [];

  constructor(
    private auth: AuthService,
    public dash: DashboardService,
    private router: Router,
    private afs: AngularFirestore,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
    ) {  }

  ngOnInit() {
    this.http.get('assets/literature.json').subscribe(results => {
      // tslint:disable-next-line:prefer-for-of
    this.pubs = JSON.parse(JSON.stringify(results));
  });

    this.setupGroup = this._formBuilder.group({
      congID: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      congName: ['', [Validators.required, Validators.min(3)]],
      congLanguage: ['', [Validators.required, Validators.min(3)]]
    });

      this.auth.user.subscribe(user => {
        
        this.userDoc = this.dash.getUserDoc(user.uid).valueChanges();
        this.userDoc.subscribe(user => {
          if (user.homeView.firstLog == true) {
            this.firstLog = true;
          } else {
            this.firstLog = false;
          }
          this.congregation = this.dash.getCongregationDoc(user.congregation).valueChanges();
        });
      })

  }



  logOut() {
    return this.auth.signOut();
  }


  createCongregation() {
    const congID = this.setupGroup.get('congID');
    const congName = this.setupGroup.get('congName');
    const congLanguage = this.setupGroup.get('congLanguage');
    const user = this.auth.currentUserObservable.currentUser;
    const currentUser = this.dash.getUserDoc(user.uid);
    let date = new Date();
    const month = date.getMonth()+1;
    console.log(month);
    const publishersRef: AngularFirestoreCollection<any> = this.dash.getCongregationDoc(congID.value).collection('publishers');
    this.dash.loading = true;

    return this.dash.getCongregationDoc(congID.value).set(
      {
        id: congID.value,
        name: congName.value,
        language: congLanguage.value
      }, { merge: true }
    )
    .then(() => {
      return publishersRef.doc<Publisher>(`${user.uid}`).set({
        id: user.uid,
        fname: user.displayName.split(' ')[0],
        lname: user.displayName.split(' ')[1] || '',
        email: user.email,
        role: 'Admin',
        photoUrl: user.photoURL,
        orderCount: 0
      })
    })
    .then(() => {
          const literatureRef: AngularFirestoreCollection<any> = this.dash.getCongregationDoc(congID.value).collection(`${month}`);
          this.pubs.forEach(pub => {
            literatureRef.doc(`${pub.id}`).set(pub);
           });
      })
    .then(() => {
      return currentUser.set(
        {
        congregation: congID.value,
        homeView: {
          firstLog: false
        }
      }, {merge: true})
    })
    .then(() => {
      this.snackBar.open('Congregation Created Successfully','', {duration: 2000})
    })
    .catch(error => this.snackBar.open(error.message,'', {duration: 2000})).then(() => this.dash.loading = false)
  }
}
