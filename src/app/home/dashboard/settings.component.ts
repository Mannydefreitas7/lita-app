import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { User } from '../../shared/models/user.model';
import { MatDialog} from '@angular/material';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'lita-update-profile',
  	template:`
    <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">settings</mat-icon>Update My Profile</h2>
<form [formGroup]="updateForm" class="settings">
  <mat-dialog-content class="mat-typography" fxLayoutAlign="center center" fxLayout="column">
    <div class="dashboard-toolbar--image settings--image">
      <img [src]="currentUserImage" alt="">
    </div>

    <mat-form-field fxFill appearance="fill">
    <mat-label>Full Name</mat-label>
      <input matInput required placeholder="My Name" formControlName="displayName" value="{{userDoc.displayName}}">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>

    <h3>Congregation</h3>

    <mat-form-field fxFill appearance="fill">
      <mat-label>Congregation Name</mat-label>
      <input required matInput placeholder="Congregation Name" formControlName="congregationName" value="{{userDoc.congregation.name}}">
      <mat-icon matSuffix>account_balance</mat-icon>
    </mat-form-field>

    <mat-form-field fxFill appearance="fill">
    <mat-label>Congregation Language</mat-label>
    <input required matInput placeholder="Congregation Language" formControlName="congregationLanguage" value="{{userDoc.congregation.language}}">
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
export class SettingsComponent implements OnInit, AfterViewInit {
  userRef: any = this.auth.authState;
  currentUser: any = this.auth.currentUserObservable.currentUser;
  currentUserImage: any = this.currentUser.photoURL;
  updateForm: FormGroup;
  userDoc: any;
  constructor(private fb: FormBuilder, private auth: AuthService, private dialog: MatDialog) {
 
  this.updateForm = this.fb.group({
      displayName : ['', Validators.required],
      photoURL : [''],
      congregationName: ['', Validators.required],
      congregationLanguage: ['', Validators.required]
    });
  }

  

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const user: User = this.userRef;
    this.auth.firebaseFireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(user => this.userDoc = user)
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const user: User = this.userRef;
    this.auth.firebaseFireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => this.userDoc = userDoc)
  }


  updateName() {
    const user =  this.auth.authState;
    const fullName = this.updateForm.get('displayName');
    const congName = this.updateForm.get('congregationName');
    const congLang = this.updateForm.get('congregationLanguage');

    if (this.updateForm.status == 'VALID') {
    return this.auth.firebaseFireStore.doc<User>(`users/${user.uid}`).update(
      {
        displayName: fullName.value,
        congregation: {
          language: congLang.value,
          name: congName.value
        }
      
      }
      ).then(() => {
      this.dialog.closeAll();
    })
  }
}

} 