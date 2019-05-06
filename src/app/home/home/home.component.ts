import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatSlideToggleChange, MatSlideToggle, MatDialog } from '@angular/material'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AddpublisherComponent  } from './addpublisher.component';
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
  publisher: Publisher;
  newPublisher: FormGroup;


  constructor(private auth: AuthService, private afs: AngularFirestore, private fb: FormBuilder, private dialog: MatDialog) {
 
   this.newPublisher = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    role: [''],
    photoUrl: [''],
    orderCount: [''],
    order: ['']
});
  }

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
  }


}
