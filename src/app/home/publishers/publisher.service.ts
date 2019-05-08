import { Injectable } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  pubs: any;
  uid: any;
  publisher: any;
  newPublisher: FormGroup;
  publisherForm: FormGroup;
  publisherDoc: any;
  pubRoute: any;
  edit: boolean;
  publishers: any;


  constructor(
    public auth: AuthService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public location: Location,
    public route: ActivatedRoute
    ) {

    // -- Grab current Authenticated User Data Object ----- //
    const user = this.auth.currentUserObservable.currentUser;

    // -- Grab current Publishers Object Collection --- //
    this.publishers = this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers').valueChanges();

// --- Edit or update Form Group for existing Publisher ---- //
    this.publisherForm = this.fb.group({
      fname : [''],
      lname : [''],
      email: ['', Validators.email]
    });

// --------- Create new Publisher Form Group ---------------- //
    this.newPublisher = this.fb.group({
        id: ['', Validators.required],
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        photoUrl: [''],
        orderCount: [''],
        order: ['']
    });

    this.pubRoute = this.route.params.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      this.uid = params['uid'];
    });


  }

  get publishersData() {
    const user = this.auth.currentUserObservable.currentUser;
    return this.publishers = this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers');
  }

  // Go back to previous page //
  public goBack() {
    this.location.back();
  }

  // Add new publisher functon //
  get addPub() {

    const user = this.auth.currentUserObservable.currentUser;
    const fname = this.newPublisher.get('fname').value;
    const lname = this.newPublisher.get('lname').value;
    const email = this.newPublisher.get('email').value;
    const role = this.newPublisher.get('role').value;
    const id = this.auth.firebaseFireStore.createId();
    const congregation = this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers').doc(`${id}`);

   // tslint:disable:object-literal-shorthand
    return congregation.set(
        {
            uid: id,
            fname: fname,
            lname: lname,
            email: email,
            role: role,
            photoUrl: null,
            orderCount: 0,
            order: null
        }).then(() => {
          this.dialog.closeAll();
        });
    }

// -- Delete Publisher Open Modal -- //
   get openDialog() {
    return this.dialog;
    }
// -- Delete Publisher function -- //
   get deletePub() {
      return this.publishersData.doc(`${this.uid}`).delete()
      .then(() => console.log('publisher Deleted'))
      .then(() => {
        this.goBack();
      });
    }

    // -- Update current Publisher -- //
    public updatePublisher() {
      const fname = this.publisherForm.get('fname');
      const lname = this.publisherForm.get('lname');
      const email = this.publisherForm.get('email');

      return this.publisherDoc.update(
        {
          fname: fname.value,
          lname: lname.value,
          email: email.value
        }).then(() => this.edit = false);
    }

}
