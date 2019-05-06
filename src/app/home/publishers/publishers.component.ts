import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatPaginator, MatTableDataSource, MatButtonToggleChange, MatList, MatDialog } from '@angular/material';
import { AddpublisherComponent } from '../home/addpublisher.component';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { DeletepublisherComponent } from './deletepublisher.component';

@Component({
  selector: 'lita-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent {
  displayedColumns: string[] = ['name', 'orderBtn', 'deleteBtn'];
  dataSource:any;
  toggle: boolean = true;
  pubs: any;
  title: string = 'Publishers'
  uid: any;
  publisher: any;
  publisherDoc: AngularFirestoreDocument;

  constructor(public auth: AuthService, private dialog: MatDialog) {

    const user = this.auth.currentUserObservable.currentUser
    this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers').valueChanges()
    .subscribe(publishers => {
      this.pubs = JSON.parse(JSON.stringify(publishers))
      this.dataSource = new MatTableDataSource(this.pubs)
    })

   
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addPublisher() {
    this.dialog.open(AddpublisherComponent);
  }

  deletePublisher() {
    this.dialog.open(DeletepublisherComponent);
  }

  ngOnInit() {

    const user = this.auth.currentUserObservable.currentUser;
    this.publisherDoc = this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers').doc(`${this.uid}`)
    this.publisherDoc.valueChanges()
    .subscribe(result => {
      this.publisher = result
      console.log(this.publisher)
    })
  }
  toggleView(change: MatButtonToggleChange){
    this.toggle = change.value;
  }
  

}