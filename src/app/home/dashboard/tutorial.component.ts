import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

import { Congregation, Literature, Publisher } from '../../shared/models/congregation.model';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-tutorial',
  template: `
  <mat-horizontal-stepper linear #stepper>
  <form [formGroup]="setupGroup">
  <mat-step [stepControl]="setupGroup" errorMessage="Congregation ID Number is required.">

      <ng-template matStepLabel>Congregation Number</ng-template>
      <mat-form-field>
        <input matInput placeholder="90001" formControlName="congID" required>
      </mat-form-field>
      <div>
        <button mat-button matStepperNext>Next</button>
      </div>
  </mat-step>
  <mat-step [stepControl]="setupGroup" errorMessage="Congregation Name is required.">
      <ng-template matStepLabel>Congregation Name</ng-template>
      <mat-form-field>
        <input matInput placeholder="Long Meadow Congregation" formControlName="congName" required>
      </mat-form-field>
      <div>
        <button mat-button matStepperPrevious>Back</button>
        <button mat-button matStepperNext>Next</button>
      </div>
  </mat-step>
  <mat-step [stepControl]="setupGroup" errorMessage="Congregation Name is required.">
  <ng-template matStepLabel>Congregation Language</ng-template>
  <mat-form-field>
    <input matInput placeholder="English" formControlName="congLanguage" required>
  </mat-form-field>
  <div>
    <button mat-button matStepperPrevious>Back</button>
    <button mat-button matStepperNext>Next</button>
  </div>
</mat-step>
  <mat-step>
    <ng-template matStepLabel>Done</ng-template>
    You are now done.
    <div>
      <button mat-button matStepperPrevious>Back</button>
      <button mat-button (click)="createCongregation()">Submit</button>
    </div>
  </mat-step>
  </form>
</mat-horizontal-stepper>
  `,
  styleUrls: ['./dashboard.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class TutorialComponent  {
  setupGroup: FormGroup;
  congregation: Observable<Congregation>;
  pubs: any = [];

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private afs: AngularFirestore, private auth: AuthService) {}

  ngOnInit() {
    this.http.get('assets/literature.json').subscribe(results => {
      // tslint:disable-next-line:prefer-for-of
    this.pubs = JSON.parse(JSON.stringify(results));
  });

    this.setupGroup = this._formBuilder.group({
      congID: ['', Validators.required],
      congName: ['', Validators.required],
      congLanguage: ''
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
  
    return congregation.doc(`${congID.value}`).set(
      {
        id: congID.value,
        name: congName.value,
        language: congLanguage.value || "english"
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
      return currentUser.set({
        congregation: congID.value
      })
    });
  }

}
