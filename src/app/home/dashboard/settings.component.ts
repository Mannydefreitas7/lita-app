import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { User } from '../../shared/models/user.model';
import { MatDialog} from '@angular/material';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'lita-update-profile',
  	template:`
    <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">settings</mat-icon>Update Your Profile</h2>
<form [formGroup]="updateForm" class="settings">
  <mat-dialog-content class="mat-typography" fxLayoutAlign="center center" fxLayout="column">
    <div class="dashboard-toolbar--image settings--image">
      <img [src]="currentUserImage" alt="">
    </div>
    <mat-form-field fxFill>
      <input matInput placeholder="Your Name" formControlName="displayName" value="{{userDoc.displayName}}">
      <mat-icon matSuffix>person</mat-icon>
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
export class SettingsComponent {
  userRef: any = this.auth.authState;
  currentUser: any = this.auth.currentUserObservable.currentUser;
  currentUserImage: any = this.currentUser.photoURL;
  updateForm: FormGroup;
  userDoc: any;
  constructor(private fb: FormBuilder, private auth: AuthService, private dialog: MatDialog) {
    const user: User = this.userRef;

    this.auth.firebaseFireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(user => this.userDoc = user)
    this.updateForm = this.fb.group({
      displayName : ['', Validators.required],
      photoURL : ['']
    });
  }


  updateName() {
    const user =  this.auth.authState;
    const fullName = this.updateForm.get('displayName');
    return this.auth.firebaseFireStore.doc<User>(`users/${user.uid}`).update({displayName: fullName.value})
    .then(() => {
      this.dialog.closeAll();
    })
  }

} 