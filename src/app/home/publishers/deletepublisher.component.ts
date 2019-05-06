import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatDialog} from '@angular/material';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'lita-delete-publisher',
  	template:`
  <mat-dialog-content class="mat-typography">
    <h3 fxFill>Are you sure?</h3>
    <p fxFill>All data associated with: <br>
     <strong>{{ publisher.fname }} | {{ publisher.lname }}</strong>
     will de deleted.
     </p>
    </mat-dialog-content>
    <mat-divider></mat-divider>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="accent" (click)="delete()">Delete Publisher</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./publishers.component.scss']
  })

export class DeletepublisherComponent implements OnInit {

  publisherDoc: AngularFirestoreDocument<any>;
  sub: any;
  uid: any;
  publisher: any;
  pubs: any;

  constructor(private auth: AuthService, private dialog: MatDialog, private afs: AngularFirestore, private  route: ActivatedRoute) {

    const user = this.auth.currentUserObservable.currentUser;
    this.publisherDoc = this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers').doc(`${this.uid}`)
    this.publisherDoc.valueChanges()
    .subscribe(result => {
      this.publisher = result
      console.log(this.publisher)
    })

    this.sub = this.route.params.subscribe(params => {
      this.uid = params['uid'];
    })
  }

  delete() {
    this.publisherDoc.delete();
  }

  ngOnInit() {

    
  }

}
