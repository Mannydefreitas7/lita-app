import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSelectChange } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { Publisher, Congregation, Literature, CongLiterature, Month, Order } from 'src/app/shared/models/congregation.model';
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
  date = new Date();
  selected: MatSelectChange
  currentMonth = this.date.getMonth();
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

  completeOrder(id, uid) {
  
   this.auth.user.subscribe(user => {

      this.dashService.fireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => {

        this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').doc<Order>(`${uid}`).valueChanges().subscribe(o => {
          console.log(o.user)

                  this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('literature').doc(`${id}`).collection('months').doc<Month>(`${this.currentMonth}`).valueChanges().subscribe(m => {

                      let totalOnHand = Number(o.quantity);
                      let totalIn = Number(o.quantity);
                      let totalOut = Number(o.quantity);

                      console.log(totalIn, totalOnHand, totalOut)
                     

                      if (o.oid == userDoc.congregation) {

                        console.log('Its congregation literature update')

                        this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('literature').doc(`${id}`).collection('months').doc(`${this.currentMonth}`).update({

                            in: Number(o.quantity),
                            onHand: totalOnHand
                            
                          })

                          .then(() => {
                         //   this.snackBar.open('Order Completed Successfully','', { duration: 3000 })
                          })
                          .catch(err => {
                            this.snackBar.open(err.message)
                          })
                     //     this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').doc(`${uid}`).delete()

                      } else {

                        if (m.onHand == 0 || m.onHand < Number(o.quantity)) {
                          console.log('Its publisher literature update')
                           this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('literature').doc(`${id}`).collection('months').doc(`${this.currentMonth}`).update({
                            in: totalIn + Number(o.quantity),
                            out: totalOut + Number(o.quantity)
                          })
                          .then(() => {
                          //  this.snackBar.open('Order Completed Successfully','', { duration: 3000 })
                          })
                          .catch(err => {
                            this.snackBar.open(err.message)
                          })

                        } else {
                          let totalOnHand = m.onHand - Number(o.quantity);
                          console.log('Its publisher literature update')
                           this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('literature').doc(`${id}`).collection('months').doc(`${this.currentMonth}`).update({
                            in: Number(o.quantity),
                            onHand: totalOnHand
                          })
                          .then(() => {
                          //  this.snackBar.open('Order Completed Successfully','', { duration: 3000 })
                          })
                          .catch(err => {
                            this.snackBar.open(err.message)
                          })
                        }
                     //   this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('publishers').doc(`${o.oid}`).collection('orders').doc(`${uid}`).delete()
                     //   this.dashService.getCongregationDoc(`${userDoc.congregation}`).collection('orders').doc(`${uid}`).delete()
                   
                      }
                    })
                  })
                })
            })

  }

}
