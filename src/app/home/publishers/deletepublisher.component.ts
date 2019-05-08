import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'lita-delete-publisher',
    template: `
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
        <button mat-raised-button color="accent" (click)="ps.deletePub">Delete Publisher</button>
      </mat-dialog-actions>
    `,
    styleUrls: ['./scss/publishers.component.scss']
  })

export class DeletepublisherComponent implements OnInit {
  publisher: any;
  constructor(private ps: PublisherService) {
  }

  ngOnInit() {
    this.ps.publishersData.doc(`${this.ps.uid}`).valueChanges()
    .subscribe(publisher => { console.log(publisher); });
  }
  }
