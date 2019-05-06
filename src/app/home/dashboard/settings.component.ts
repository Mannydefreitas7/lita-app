import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { User } from '../../shared/models/user.model';
import { MatDialog} from '@angular/material';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'lita-update-profile',
  	template:`
    <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">settings</mat-icon>Update My Profile</h2>
<form [formGroup]="updateForm" class="settings">
  <mat-dialog-content class="mat-typography" fxLayoutAlign="center center" fxLayout="column">
    <div class="dashboard-toolbar--image settings--image">
      <img [src]="( user | async )?.photoURL" alt="">
    </div>

    <mat-form-field fxFill appearance="fill">
    <mat-label>Full Name</mat-label>
      <input matInput required placeholder="My Name" formControlName="displayName" [value]="( user | async )?.displayName">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>

    <h3>Congregation</h3>

    <mat-form-field fxFill appearance="fill">
      <mat-label>Congregation Name</mat-label>
      <input required matInput placeholder="Congregation Name" formControlName="congregationName" [value]="( user | async )?.congregation.name">
      <mat-icon matSuffix>account_balance</mat-icon>
    </mat-form-field>

    <mat-form-field fxFill appearance="fill">
    <mat-label>Congregation Language</mat-label>
    <input required matInput placeholder="Congregation Language" formControlName="congregationLanguage" [value]="( user | async )?.congregation.language">
    <mat-icon matSuffix>language</mat-icon>
  </mat-form-field>
  </mat-dialog-content>
  <mat-divider></mat-divider>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Cancel</button>
    <button mat-raised-button color="primary" (click)="updateName()">Save</button>
  </mat-dialog-actions>
</form>
  `,
  styleUrls: ['./dashboard.component.scss']
  })
export class SettingsComponent implements OnInit {
  userRef: any;
  currentUser: any = this.auth.currentUserObservable.currentUser;
  currentUserImage: any = this.auth.currentUserObservable.currentUser.photoURL;
  updateForm: FormGroup;
  congID: any;
  user: Observable<any>;
  userDoc: AngularFirestoreDocument<any>;


  constructor(private fb: FormBuilder, private auth: AuthService, private dialog: MatDialog, private afs: AngularFirestore) {

  this.updateForm = this.fb.group({
      displayName : ['', Validators.required],
      photoURL : [''],
      congregationName: ['', Validators.required],
      congregationLanguage: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userDoc = this.afs.doc(`users/${this.currentUser.uid}`);
    this.user = this.userDoc.valueChanges();

    console.log(this.user);
  }

  updateName() {

    const user =  this.auth.authState;
    const fullName = this.updateForm.get('displayName');
    const congName = this.updateForm.get('congregationName');
    const congLang = this.updateForm.get('congregationLanguage');

    if (this.updateForm.status === 'VALID') {
      return this.userDoc.update(
      {
        displayName: fullName.value,
        congregation: {
          name: congName.value,
          language: congLang.value
        }
      })
      .then(() => {
      this.dialog.closeAll();
    });
  }
}

}
