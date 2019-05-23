import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
import { AuthService } from 'src/app/core/auth.service';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { Observable } from 'rxjs';
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
        <button mat-raised-button color="accent" (click)="publisherService.deletePub">Delete Publisher</button>
      </mat-dialog-actions>
    `,
    styleUrls: ['./scss/publishers.component.scss']
  })

export class DeletepublisherComponent implements OnInit {
  publisher: Observable<Publisher>;
  constructor(private publisherService: PublisherService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.publisher
       
     
    })

  }

  }
