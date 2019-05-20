import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatSlideToggleChange, MatSlideToggle, MatDialog } from '@angular/material'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Publisher, Congregation } from 'src/app/shared/models/congregation.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AddpublisherComponent  } from '../publishers/addpublisher.component';
import { Observable } from 'rxjs';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  publisherCard: boolean = true;
  orderCard: boolean = true;
  reportCard: boolean = true;
  cards: any;
  totalPublishers: number;
  totalRequests: number;
  orderCount: number = 0

  constructor(private auth: AuthService, private afs: AngularFirestore, private fb: FormBuilder, private dialog: MatDialog) {}

addPublisher() {
  this.dialog.open(AddpublisherComponent);
}
 
  togglePub() {
    this.publisherCard = !this.publisherCard;
  }

  toggleOrder() {
    this.orderCard = !this.orderCard;
   }

  toggleReport() {
    this.reportCard = !this.reportCard
  }


  ngOnInit() {
    const user = this.auth.currentUserObservable.currentUser;
    this.afs.doc(`users/${user.uid}`).collection('publishers')
    .snapshotChanges().subscribe(total => {
      this.totalPublishers = total.length;
    })
    this.afs.doc(`users/${user.uid}`).collection('publishers').valueChanges()
    .subscribe(total => {
      total.forEach(publisher => {
        
        this.orderCount += publisher.orderCount
 
      })
      console.log(this.totalRequests = this.orderCount)
    })
  }


}
