import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { AuthService } from '../../core/auth.service';
import { map } from 'rxjs/operator/map';
import { Congregation, Literature, Publisher } from '../../shared/models/congregation.model';

import { Router } from '@angular/router';

import { User } from '../../shared/models/user.model';

import 'rxjs/operator/map';

import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class DashboardComponent implements OnInit, OnDestroy {
  userDoc: Observable<User>;
  user: any;
  congregationRef: any;
  congregation: Observable<Congregation>;
  currentUserName: string;
  currentUserImage: any;
  firstLog: boolean;
  setupGroup: FormGroup;
  pubs: any = [];
  date = new Date();
  month = this.date.getMonth() + 1;

  constructor(
    private auth: AuthService,
    public dash: DashboardService,
    private router: Router,
    private afs: AngularFirestore,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    this.http.get('assets/literature-quantity.json').subscribe(results => {

      this.pubs = JSON.parse(JSON.stringify(results));
    });

    this.userDoc = this.auth.afAuth.user;

    if (this.auth.authenticated) {
      
      this.auth.user.subscribe(user => {
        this.dash.getUserDoc(`${user.uid}`).valueChanges().subscribe(d => {
          if (d.homeView.firstLog) {
            this.router.navigateByUrl('/add-congregation')
          } else {
            this.router.navigateByUrl('/home')
          }
        })
       this.congregation = this.dash.getCongregationDoc(`${user.congregation}`).valueChanges()
      })

      
    }

    this.setupGroup = this._formBuilder.group({
      congID: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      congName: ['', [Validators.required, Validators.min(3)]],
      congLanguage: ['', [Validators.required, Validators.min(3)]]
    });

  }

  ngOnDestroy() {
    this.congregation.subscribe().unsubscribe();
    this.auth.afAuth.user.subscribe().unsubscribe()
  }


  logOut() {
    this.auth.signOut();
   return this.router.navigate(['login'])
  }


}
