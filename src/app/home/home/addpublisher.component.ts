import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatDialog } from '@angular/material';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-addpublisher',
  template: `
  <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">person</mat-icon>Add Publisher</h2>
<form [formGroup]="newPublisher" class="settings">
  <mat-dialog-content class="mat-typography" fxLayoutAlign="center center" fxLayout="column">

    <mat-form-field fxFill appearance="fill">
    <mat-label>Publisher Name</mat-label>
      <input matInput required placeholder="Charles Russell" formControlName="name">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>

   <mat-form-field fxFill appearance="fill">
    <mat-label>Publisher Role</mat-label>
    <mat-select>
      <mat-option *ngFor="let role of roles" [value]="role.value">
        {{role.valueView}}
      </mat-option>
    </mat-select>
  </mat-form-field>

  </mat-dialog-content>
  <mat-divider></mat-divider>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Cancel</button>
    <button mat-raised-button color="primary" (click)="addPub()">Save</button>
  </mat-dialog-actions>
</form>
  `,
  styleUrls: ['./home.component.scss']
})
export class AddpublisherComponent implements OnInit {

  publisher: Publisher;
  newPublisher: FormGroup;
  roles = [
    {value: 'admin', valueView: 'Admin'},
    {value: 'editor', valueView: 'Editor'},
    {value: 'view', valueView: 'View Only'}
  ];


  // tslint:disable-next-line:max-line-length
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

   addPub() {
    const user = this.auth.currentUserObservable.currentUser;
    const name = this.newPublisher.get('name').value;
    const role = this.newPublisher.get('role').value;
    const id = this.afs.createId();
    const congregation = this.afs.doc(`users/${user.uid}`).collection('congregation').doc('publishers');

    return congregation.set(
        {
              id: id,
              name: name,
              role: role,
              photoUrl: null,
              orderCount: 0,
              order: null
        }).then(() => {
          this.dialog.closeAll();
        });
    }

  ngOnInit() {
  }

}
