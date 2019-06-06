import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-addpublisher',
  template: `
  <header class="lita-modal-title" fxLayout="row" fxLayoutAlign="space-between center">
    <h2 mat-dialog-title>Add Publisher</h2>
    <button mat-icon-button matSuffix mat-dialog-close><mat-icon style="color: #fff;">clear</mat-icon></button>
  </header>
  <section class="lita-modal">
    <form [formGroup]="publisherService.newPublisher" class="settings">
      <mat-dialog-content class="mat-typography" fxLayoutAlign="center center" fxLayout="column">
        <mat-form-field fxFill appearance="fill">
        <mat-label>First Name</mat-label>
          <input matInput required placeholder="Charles" formControlName="fname">
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <mat-form-field fxFill appearance="fill">
        <mat-label>Last Name</mat-label>
          <input matInput placeholder="Russell" formControlName="lname">
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <mat-form-field fxFill appearance="fill">
        <mat-label>Email</mat-label>
          <input matInput placeholder="charlesrussell@jw.org" formControlName="email">
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>

      </mat-dialog-content>
      <mat-dialog-actions align="end">

        <button mat-button mat-dialog-close *ngIf="!url"><mat-icon class="lita-icon">clear</mat-icon>CANCEL</button>
        <button mat-button (click)="dash.goBack()" *ngIf="url"><mat-icon class="lita-icon">clear</mat-icon>CANCEL</button>
        <button mat-button color="primary" (click)="publisherService.addPub()"><mat-icon class="lita-icon" color="primary">done</mat-icon>SAVE</button>
      </mat-dialog-actions>
    </form>
</section>
  `,
  styleUrls: ['./scss/publishers.component.scss']
})
export class AddpublisherComponent implements OnInit {
  url: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(private route: Router, public publisherService: PublisherService, private dash: DashboardService) { }

  ngOnInit() {
    if (this.route.url === '/home/add-publisher') {
      this.url = true;
    } else {
      this.url = false;
    }
  }
}
