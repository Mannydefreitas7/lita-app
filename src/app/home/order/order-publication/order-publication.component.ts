import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { Congregation, Publisher, Literature, CongLiterature, Orders } from 'src/app/shared/models/congregation.model';
import { MatSliderChange, MatSelect, MatSelectChange } from '@angular/material';
import { merge } from 'rxjs/operators';
import { PublisherService } from '../../publishers/publisher.service';

@Component({
  selector: 'lita-order-publication',
  templateUrl: './order-publication.component.html',
  styleUrls: ['./../../dashboard/dashboard.component.scss']
})
export class OrderPublicationComponent implements OnInit {

  id: any;
  pubId: number;
  name: any;
  quantity: any;
  pub: Observable<any>;
  collection:any;
  orderForm: FormGroup;
  slider: MatSliderChange;
  selected: any;
  publishers: any;
  currentQuantity: any;
  select: MatSelect;

  constructor(
    private auth: AuthService,
    private router: ActivatedRoute,
    private url: Router,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private load: DashboardService,
    private service: PublisherService
    ) { }

  ngOnInit() {

   this.orderForm = this.formBuilder.group({
      quantity: ['', Validators.max(3)],
      order: ['']
    })

    this.router.params.subscribe(par => {

      this.id = par['id'];
      this.pubId = par['pubid']
      console.log(this.id, this.pubId)

      this.load.fireStore.collection('congregations').doc(`${par['id']}`).collection('orders').doc<Orders>(`${par['pubid']}`).valueChanges().subscribe(c => {
        this.currentQuantity = c.quantity;
      })
    

      if (par['id'].length > 6) {
        this.auth.user.subscribe(user => {
          this.load.fireStore.collection('congregations').doc(`${user.congregation}`).collection('publishers').doc<Publisher>(`${par['id']}`).valueChanges().subscribe(res => {
            this.name = res.fname + ' ' + res.lname;
          })
        })
     
      } else {

        this.load.fireStore.collection('congregations').doc<Congregation>(`${this.id}`).valueChanges().subscribe(res => {
          this.name = res.name + ` ` + res.language;
    
       })

      }
      this.auth.user.subscribe(user => { 
        this.load.fireStore.collection('congregations').doc(`${user.congregation}`).collection('publishers').valueChanges().subscribe(publis => {
          this.publishers = publis;
        })
      })
      

      this.pub = this.load.fireStore.collection('literature').doc<Literature>(`${this.pubId}`).valueChanges();

   
    })

    if (this.orderForm.get('quantity').touched) {
      this.quantity = this.orderForm.get('quantity').value;
    } else {
      this.quantity = 0;
      
    }
   
  }

  onSelectChange() {
    this.router.params.subscribe(par => {
      if (this.orderForm.get('order').value != par['id']) {
        return this.url.navigateByUrl(`/home/add-publication/${this.orderForm.get('order').value}/${par['pubid']}`)
      }
    })
  }

  orderPub() {
    this.load.fireStore.collection('literature').doc<Literature>(`${this.pubId}`).valueChanges().subscribe(pub => {
      this.router.params.subscribe(par => { 
        if (par['id'].length == 6) {
         
            this.load.fireStore.collection('congregations').doc(`${par['id']}`).collection('orders').doc(`${par['pubid']}`).set({
              id: par['pubid'],
              name: pub.name,
              quantity: this.currentQuantity + this.orderForm.get('quantity').value || this.orderForm.get('quantity').value
            }, {merge: false })
        } else {
          this.auth.user.subscribe(user => { 
            this.load.fireStore.collection('congregations').doc(`${user.congregation}`).collection('publishers').doc<Publisher>(`${par['id']}`).collection('orders').doc(`${par['pubid']}`).set({
              order: [{
                id: par['pubid'],
                name: pub.name,
                quantity: this.orderForm.get('quantity').value
              }],
              orderCount: this.orderForm.get('quantity').value
            })
          })
        }
      })
    })
    this.load.goBack();
    return this.service.snackBar.open('Publication order is added successfully','', { duration: 5000 })
  }

}
