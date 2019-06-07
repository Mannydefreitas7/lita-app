import { Injectable } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { Publisher, Congregation } from 'src/app/shared/models/congregation.model';
import { Observable } from 'rxjs';
import { OrderComponent } from '../order/order.component';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  pubs: any;
  uid: any;
  publisher: Publisher;
  newPublisher: FormGroup;
  publisherForm: FormGroup;
  publisherDoc: any;
  pubRoute: any;
  edit: boolean;
  publishers: any;
  congregation: Observable<Congregation>


  constructor(
    public auth: AuthService,
    private publisherService: PublisherService,
    private dashService: DashboardService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public location: Location,
    public route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
    ) {

// --- Edit or update Form Group for existing Publisher ---- //
    this.publisherForm = this.fb.group({
      fname : [''],
      lname : [''],
      email: ['', Validators.email]
    });


// --------- Create new Publisher Form Group ---------------- //
    this.newPublisher = this.fb.group({
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        photoUrl: [''],
        orderCount: [''],
        order: ['']
    });

    this.pubRoute = this.route.params.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      return this.uid = params['id'];
    });


  }

  publisherDocument(congID, pubID) {
    return this.dashService.getCongregationDoc(congID).collection('publishers').doc<Publisher>(pubID);
  }

  publishersCollection(congID) {
    return this.dashService.getCongregationDoc(congID).collection('publishers');
  }

  // Go back to previous page //
  public goBack() {
    this.location.back();
  }


  public order(id) {
    this.dialog.open(OrderComponent, {
      width: '95%', data: {
        id: id
      }
    })
}


  // Add new publisher functIon //
  addPub() {

    const fname = this.newPublisher.get('fname').value;
    const lname = this.newPublisher.get('lname').value;
    const email = this.newPublisher.get('email').value;
    const newID = this.dashService.fireStore.createId();

    if (this.newPublisher.valid) {
    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
       const congID = res.congregation
       const publisher = this.publisherDocument(congID, newID)
       return publisher.set({
            id: newID,
            fname: fname,
            lname: lname,
            email: email,
            role: 'publisher',
            photoUrl: null,
            orderCount: 0
            }).then(() => {
              this.dialog.closeAll();
              this.router.navigateByUrl('/home/publishers');
              this.newPublisher.reset();
          }).then(() => {
            this.snackBar.open('Publisher Added Successfully!', '', {duration: 2000});
          }).catch(err => this.snackBar.open(err.message, '', {duration: 2000}))
        });
    });
    }
  }

// -- Delete Publisher Open Modal -- //
   get openDialog() {
    return this.dialog;
    }

// -- Delete Publisher function -- //
   deletePub(id:string) {
       this.auth.user.subscribe(user => {
         this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
            return this.publisherDocument(res.congregation, id).delete()
            .then(() => {
              this.goBack();
            })
            .then(() => this.snackBar.open('Publisher Deleted Successfully', '', {duration: 2000}))
       });
    });
  }

    // -- Update current Publisher -- //
    updatePublisher() {
      const fname = this.publisherForm.get('fname');
      const lname = this.publisherForm.get('lname');
      const email = this.publisherForm.get('email');

      this.auth.user.subscribe(user => {
        this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
         const congID = res.congregation
         console.log(congID)
         this.route.params.subscribe(params => { 
          console.log(params)
          return this.publisherDocument(congID, params['id']).set(
            {
              fname: fname.value,
              lname: lname.value,
              email: email.value
            }, { merge: true}).then(() => {
              this.publisherForm.disable();
              this.edit = false
            });
          });
        });    
      });
    }


}
