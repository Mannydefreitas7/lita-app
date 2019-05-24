import { Component, OnInit, Inject } from '@angular/core';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { Observable } from 'rxjs';
import {MAT_DIALOG_DATA, MatSnackBar} from '@angular/material'
import { PublisherService } from './publisher.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { PublisherComponent } from './publisher.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'lita-delete-publisher',
    template: `
    <mat-dialog-content class="mat-typography">
      <h2>Are you sure?</h2>
      <p>All data associated with: <br>
       <strong>{{ (publisher | async)?.fname }} {{ (publisher | async)?.lname }}</strong>
       will deleted.
       </p>
      </mat-dialog-content>
      <mat-divider></mat-divider>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close><mat-icon class="lita-icon">clear</mat-icon>CANCEL</button>

        <button mat-button color="accent" (click)="deletePub()"><mat-icon class="lita-icon" color="accent">delete</mat-icon>DELETE PUBLISHER</button>
      </mat-dialog-actions>
    `,
    styleUrls: ['./scss/publishers.component.scss']
  })

export class DeletepublisherComponent implements OnInit {
  publisher: Observable<Publisher>;
  pubDoc: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Observable<Publisher>, 
    private publisherService: PublisherService
    ) {}

  ngOnInit() {
    this.publisher = this.data;
   this.data.subscribe(res => this.pubDoc = res.id)
  }
  // -- Delete Publisher function -- //
  deletePub() {
    console.log(this.pubDoc)
     return this.publisherService.deletePub(this.pubDoc)
    }
  }

