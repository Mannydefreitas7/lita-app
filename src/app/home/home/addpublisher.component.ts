import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatDialog } from '@angular/material'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'lita-addpublisher',
  template: `
  <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">person</mat-icon>Add Publisher</h2>
<form [formGroup]="newPublisher" class="settings">
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
    <button mat-raised-button color="primary" (click)="add()">Save</button>
  </mat-dialog-actions>
</form>
  `,
  styleUrls: ['./home.component.scss']
})
export class AddpublisherComponent implements OnInit {

  publisher: Publisher
  newPublisher: FormGroup


  private add() {
    const user = this.auth.currentUserObservable.currentUser;
    const name = this.newPublisher.get('name').value
    const role = this.newPublisher.get('role').value
    const photoUrl = this.newPublisher.get('photoUrl').value
    const id = this.afs.createId()
  
    if (this.newPublisher.status === 'VALID') {
      return this.auth.firebaseFireStore.doc(`users/${user.uid}/congregation`).set(
        {
          id: id,
          name: name,
          role: role,
          photoUrl: photoUrl,
          orderCount: 0,
          order: null
        }).then(() => {
          this.dialog.closeAll();
        });
      }
  }
  constructor(private auth: AuthService, private afs: AngularFirestore, private fb: FormBuilder, private dialog: MatDialog) {
 
    this.newPublisher = this.fb.group({
     id: ['', Validators.required],
     name: ['', Validators.required],
     role: [''],
     photoUrl: [''],
     orderCount: [''],
     order: ['']  
 });
   }

  ngOnInit() {
  }

}
