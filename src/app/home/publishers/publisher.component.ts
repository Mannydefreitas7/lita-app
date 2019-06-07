import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Publisher, Orders } from 'src/app/shared/models/congregation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeletepublisherComponent } from './deletepublisher.component';
import { AuthService } from 'src/app/core/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { OrderService } from '../order/order.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-publisher',
  templateUrl: './html/publisher.component.html',
  styleUrls: ['./scss/publishers.component.scss']
})
export class PublisherComponent implements OnInit {
  sub: any;
  uid: any;
  user;
  edit: boolean = false;
  publisher: Observable<Publisher>;
  pubRoute: any;
  publisherForm: FormGroup;
  email: string;
  emailSent = false;
  errorMessage: string;
  admin: boolean;
  pub: any;
  orders: any;
  orderCount: any[];
  total:any[];



  constructor(
    public publisherService: PublisherService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private orderService: OrderService,
    private dashService: DashboardService
  ) { }

  editField() {
    this.publisherForm.enable();
    this.edit = true;
  }

  cancelEdit() {
    this.publisherForm.disable();
    this.edit = false;
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
          if (this.publisherForm.valid) {
            this.publisherService.publisherDocument(congID, params['id']).valueChanges().subscribe(pub => {
              return this.publisherService.publisherDocument(congID, params['id']).update(
                {
                  fname: fname.value || pub.fname,
                  lname: lname.value || pub.lname,
                  email: email.value || pub.email,
                  role: pub.role
                }).then(() => {
                  this.publisherForm.disable();
                  this.edit = false
                })
            });

          }
        });
      });
    });
  }


  openDeleteModal() {
    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
        const congID = res.congregation
        this.route.params.subscribe(params => {
          this.publisher = this.publisherService.publisherDocument(congID, params['id']).valueChanges();
          return this.publisherService.openDialog.open(DeletepublisherComponent, {
            data: this.publisher
          });
        });
      });
    });
  }

  ngOnInit() {
    this.publisherForm = this.publisherService.publisherForm;
    this.publisherForm.disable();
    this.user = this.auth.afAuth.authState;
    this.orderCount = [];
    this.total = []

    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
        const congID = res.congregation
        this.route.params.subscribe(params => {

          this.orders =  this.publisherService.publisherDocument(congID, params['id']).collection('orders').valueChanges();

          this.publisherService.publisherDocument(congID, params['id']).collection('orders').snapshotChanges().subscribe(s => {
              s.forEach(item => {
  
                 this.publisherService.publisherDocument(congID, params['id']).collection('orders').doc<Orders>(`${item.payload.doc.id}`).valueChanges().subscribe(d => {
                 this.total.push(JSON.parse(JSON.stringify(d.quantity)))
                })
                 })
              })

              

               console.log(this.total)
          this.publisher = this.publisherService.publisherDocument(congID, params['id']).valueChanges();
          this.publisherService.publisherDocument(congID, params['id']).valueChanges().subscribe(pub => {
              this.pub = pub;
            if (pub.role === 'publisher') {

              this.admin = false;
            } else {
              this.admin = true;
            }
          })
        });
      });
    });


  }

  adminInvite() {
    this.auth.user.subscribe(user => {

      this.route.params.subscribe(params => {

        this.publisherService.publisherDocument(user.congregation, params['id']).valueChanges().subscribe(pub => {

          const actionCodeSettings = {
            // Your redirect URL
            url: 'http://localhost:4200/signup/' + user.congregation + '/' + params['id'],
            handleCodeInApp: true
          };

          return this.auth.afAuth.auth.sendSignInLinkToEmail(pub.email, actionCodeSettings).then(() => {

            this.publisherService.snackBar.open('Admin Invitation Email Sent', '', { duration: 3000 })

          }).then(() => {

            this.publisherService.publisherDocument(user.congregation, params['id']).update({
              role: 'admin'
            })
          })
        })
      })
    })
  }

  cancelAdmin() {
    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
        const congID = res.congregation
        this.route.params.subscribe(params => {
          return this.publisherService.publisherDocument(congID, params['id']).update({
            role: 'publisher'
          }).then(() => {
            this.publisherService.snackBar.open('Admin privileges revoked', '', { duration: 3000 })
          }).then(() => {
            this.dashService.fireStore.collection('users').doc(`${params['id']}`).delete();
          }).then(() => {
            if (user.uid == params['id']) {
              this.auth.afAuth.auth.currentUser.delete();
            } else {
              this.router.navigateByUrl('/home');
            }
          })
        })
      })
    })
  }

}