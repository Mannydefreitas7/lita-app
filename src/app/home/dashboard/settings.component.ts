import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'lita-update-profile',
  	template:`
    <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">settings</mat-icon>Update Your Profile</h2>
<form [formGroup]="updateForm" (ngSubmit)="updateProfile()" class="settings">
  <mat-dialog-content class="mat-typography" fxLayoutAlign="center center" fxLayout="column">
    <div class="dashboard-toolbar--image settings--image">
      <img [src]="currentUserImage" alt="">
    </div>
    <mat-form-field fxFill>
      <input matInput placeholder="Your Name" formControlName="displayName" value="{{currentUserName}}">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>
  </mat-dialog-content>
  <mat-divider></mat-divider>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Cancel</button>
    <button mat-raised-button color="primary">Save</button>
  </mat-dialog-actions>
</form>
  `,
  styleUrls: ['./dashboard.component.scss']
  })
export class SettingsComponent {
  currentUser: any = this.auth.currentUserObservable.currentUser;
  currentUserName: string = this.currentUser.displayName;
  currentUserImage: any = this.currentUser.photoURL;
  updateForm: FormGroup;
  user: any;
  constructor(private fb: FormBuilder, private auth: AuthService) {
   const user =  this.auth.updateUserData;

    this.updateForm = this.fb.group({
      displayName : [''],
      photoURL : ['']
    });
    console.log(user)
  }
} 