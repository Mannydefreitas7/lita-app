import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';


import { AuthService } from '../../core/auth.service';
import { map } from 'rxjs/operator/map';
import { Congregation, Literature, Publisher } from '../../shared/models/congregation.model';
import { User } from 'src/app/shared/models/user.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { finalize, merge } from 'rxjs/operators';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'lita-update-profile',
  	template: `
    <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">settings</mat-icon>Update My Profile</h2>
<form [formGroup]="updateForm" class="settings">

  
    <div *ngIf="!photoEdit" class="dashboard-toolbar--image settings--image">
      <img [src]="( userDoc | async)?.photoURL" alt="">
      <button mat-button (click)="fileInput.click()" for="fileUpload"><mat-icon>edit</mat-icon></button>
    </div>
    <div *ngIf="photoEdit" class="dashboard-toolbar--image settings--image">
      <img [src]="uploadUrl" alt="">
      <button mat-button (click)="fileInput.click()" for="fileUpload"><mat-icon>edit</mat-icon></button>
    </div>
    <mat-progress-bar *ngIf="photoEdit" mode="determinate" [value]="(uploadProgress | async)"></mat-progress-bar>
    <input hidden (change)="upload($event)" id="fileUpload" type="file" accept=".png,.jpg" #fileInput />
  
    <mat-form-field fxFill appearance="fill">
    <mat-label>Full Name</mat-label>
      <input matInput placeholder="My Name" formControlName="displayName" [value]="( userDoc | async )?.displayName">
      <mat-icon matSuffix>person</mat-icon>
    </mat-form-field>

    <h3>Congregation</h3>

    <mat-form-field fxFill appearance="fill" disabled>
    <mat-label>Congregation ID</mat-label>
    <input matInput placeholder="Congregation ID" disabled [value]="( congregation | async )?.id">
    <mat-icon matSuffix>account_balance</mat-icon>
  </mat-form-field>

    <mat-form-field fxFill appearance="fill">
      <mat-label>Congregation Name</mat-label>
      <input matInput placeholder="Congregation Name" formControlName="congregationName" [value]="( congregation | async )?.name">
      <mat-icon matSuffix>account_balance</mat-icon>
    </mat-form-field>

    <mat-form-field fxFill appearance="fill">
    <mat-label>Congregation Language</mat-label>
    <input matInput placeholder="Congregation Language" formControlName="congregationLanguage" [value]="( congregation | async )?.language">
    <mat-icon matSuffix>language</mat-icon>
  </mat-form-field>

    <button mat-button (click)="load.goBack()"><mat-icon class="lita-icon">clear</mat-icon>CANCEL</button>
    <button mat-button color="primary" (click)="updateProfile()"><mat-icon class="lita-icon" color="primary">done</mat-icon>SAVE</button>

</form>
  `,
  styleUrls: ['./dashboard.component.scss']
  })
export class SettingsComponent implements OnInit {
  userDoc: Observable<User>;
  updateForm: FormGroup;
  congregationRef: any;
  congregation: Observable<Congregation>;
  user: any;
  ref: any;
  task: any;
  photo: Observable<any>;
  photoEdit = false;


  uploadProgress: Observable<number>;
  uploadUrl: Observable<string>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    private _formBuilder: FormBuilder,
    private ngZone: NgZone,
    private load: DashboardService,
    private afStorage: AngularFireStorage) {}


  ngOnInit() {

    this.auth.currentUser.subscribe(user => {

        this.user = user;
        this.userDoc = this.afs.doc<User>(`users/${user.uid}`).valueChanges();

        this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => {
          console.log(userDoc.congregation);
          this.congregationRef = userDoc.congregation;
          this.congregation = this.afs.doc<Congregation>(`congregations/${userDoc.congregation}`).valueChanges();
          console.log(this.congregation);
        });
        });

    this.updateForm = this._formBuilder.group({
      photoURL: '',
      displayName: '',
      congregationName: '',
      congregationLanguage: ''
      });

  }


upload(event) {
  const file = event.target.files[0];
  const filePath = this.auth.currentUserObservable.currentUser.uid;
  const fileRef = this.afStorage.ref(filePath);
  const fileTask = fileRef.put(file)
  this.photoEdit = true;
  this.uploadProgress = fileTask.percentageChanges();
  fileTask.snapshotChanges().pipe(
  finalize(() => {
    fileRef.getDownloadURL().subscribe(url => {
      this.uploadUrl = url
      console.log(url)
    });
  })
).subscribe();
  }

  updateProfile() {
    const fullName = this.updateForm.get('displayName');
    const congName = this.updateForm.get('congregationName');
    const congLang = this.updateForm.get('congregationLanguage');
    const filePath = this.auth.currentUserObservable.currentUser.uid;
    const fileRef = this.afStorage.ref(filePath);

    const user = this.auth.currentUserObservable.currentUser;

    const currentUser = this.afs.doc(`users/${user.uid}`);

    const congregation: AngularFirestoreDocument<Congregation> = this.afs.collection('congregations').doc(`${this.congregationRef}`);

    congregation.valueChanges().subscribe(congregationData => {

      this.load.loading = true;
      fileRef.getDownloadURL().subscribe(url => {
      return currentUser.update(
        {
          displayName: fullName.value || user.displayName,
          photoURL: url || user.photoURL
        })
        .then(() => {
        return congregation.update({
          name: congName.value || congregationData.name,
          language: congLang.value || congregationData.language
        });
      })
      .then(() => {
        this.load.loading = false;
        this.ngZone.run(() => this.router.navigate(['/']));
      });
  });
})
}
}

