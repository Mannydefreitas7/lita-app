import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSelectChange } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { Publisher, Congregation, Literature, CongLiterature } from 'src/app/shared/models/congregation.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'src/app/shared/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  publication: Observable<Literature>
  publications: Observable<Literature[]>
  congLiterature: Observable<CongLiterature>
  congLiteratures: Observable<CongLiterature[]>
  month: any;
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ]

  updated_month: any;

  selected: MatSelectChange

  publiForm: FormGroup

  constructor(
    public auth: AuthService,
    private dashService: DashboardService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public location: Location,
    public route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  get publicationFormGroup() {
    return this.fb.group({
      in: [''],
      onHand: [''],
      Out: ['']
    })
  }

  get publicationsCollection() {
    return this.dashService.fireStore.collection('literature')
  }

  publicationDocument(id: any): AngularFirestoreDocument<Literature> {
    return this.publicationsCollection.doc(id);
  }

  addInventory() {
    return this.router.navigateByUrl(`/addinventory/${this.month}`);
  }


  deleteOrder(id) {
    let order = { name: '', id: '', uid: '', oid: '' }

    this.auth.user.subscribe(user => {

      this.dashService.fireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => {

        this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').valueChanges().subscribe(data => {
          this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').snapshotChanges().subscribe(d => {
            d.forEach(c => {
              data.forEach(i => {

                order = {
                  name: i.user,
                  id: c.payload.doc.id,
                  uid: i.uid,
                  oid: i.oid
                }
             
                this.dashService.getCongregationDoc(`${userDoc.congregation}`).valueChanges().subscribe(cong => {
                 
                  const cong_name = cong.name.trim().toLowerCase() + ' ' + cong.language.trim().toLowerCase();

                  this.route.params.subscribe(par => {

                  if (order.name.trim().toLowerCase() !== cong_name) {

                    this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('publishers').doc(`${order.oid}`).collection('orders').doc(`${id}`).delete()
                    this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').doc(`${id}`).delete()

                  } else if (order.oid == par['id']) {
                     this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('publishers').doc(`${order.oid}`).collection('orders').doc(`${id}`).delete()
                     this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').doc(`${id}`).delete()
                  } else {
                    this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').doc(`${id}`).delete()
                  }
                })
                })
              })
            })
          })

        })
      })
    })
  }

  completeOrder(id) {
    let order = { name: '', id: '', uid: '', oid: '', quantity: '' }

    this.auth.user.subscribe(user => {

      this.dashService.fireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => {

        this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').valueChanges().subscribe(data => {
          this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').snapshotChanges().subscribe(d => {
            d.forEach(c => {
              data.forEach(i => {

                order = {
                  name: i.user,
                  id: c.payload.doc.id,
                  uid: i.uid,
                  oid: i.oid,
                  quantity: i.quantity
                }

                this.dashService.getCongregationDoc(`${userDoc.congregation}`).valueChanges().subscribe(cong => {
                
                  const cong_name = cong.name.trim().toLowerCase() + ' ' + cong.language.trim().toLowerCase();
                  
                  const month = {
                      months: [{
                        in: 4
                      }]
                    }
                  this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('literature').doc('5326').set(month)
                  this.route.params.subscribe(par => {

                  if (order.name.trim().toLowerCase() !== cong_name) {

                    this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('publishers').doc(`${order.oid}`).collection('orders').doc(`${id}`).delete()

                  } else if (order.oid == par['id']) {

                        return this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('publishers').doc(`${order.oid}`).collection('orders').doc(`${id}`).delete()
                  }
                })
                })
              })
            })
          })

        })
      })
    })
  }

}
