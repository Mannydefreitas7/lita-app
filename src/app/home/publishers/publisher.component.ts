import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeletepublisherComponent } from './deletepublisher.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-publisher',
  templateUrl: './html/publisher.component.html',
  styleUrls: ['./scss/publishers.component.scss']
})
export class PublisherComponent implements OnInit {
  sub: any;
  uid: any;
  edit: boolean;
  publisher: any;
  pubRoute: any;


  constructor(private ps: PublisherService, private route: ActivatedRoute, private dialog: MatDialog) {
    this.pubRoute = this.route.params.subscribe(params => {
      // tslint:disable-next-line:no-string-literal
      this.uid = params['uid'];
    });
  }

  editField() {
    this.edit = true;
  }

  cancelEdit() {
    this.edit = false;
  }

  openDeleteModal() {
  return this.ps.openDialog.open(DeletepublisherComponent);
  }

  ngOnInit() {
    this.ps.publishersData.doc(`${this.uid}`).valueChanges()
    .subscribe(publisher => this.publisher = publisher);
  }
}

