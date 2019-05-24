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
  <section class="lita-section" [className]="url ? 'lita-section lita-add-publisher' : 'lita-section'">
  <h2 fxLayout="row" mat-dialog-title fxLayoutAlign="left center"><mat-icon class="lita-icon">person</mat-icon>Add Publisher</h2>
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

   <mat-form-field fxFill appearance="fill">
    <mat-label>Publisher Role</mat-label>
    <mat-select formControlName="role" [value]='selected'>
      <mat-option autofilled value="publisher">Publisher</mat-option>
      <mat-option *ngFor="let role of roles" [value]="role.value">
        {{role.valueView}}
      </mat-option>
    </mat-select>
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
  selected = 'publisher';
  roles = [
    {value: 'admin', valueView: 'Admin'},
    {value: 'editor', valueView: 'Editor'}
  ];

  // tslint:disable-next-line:max-line-length
  constructor(private publisherService: PublisherService, private route: Router) {}

  ngOnInit() {
    if (this.route.url === '/home/add-publisher')  {
      this.url = true;
    } else {
      this.url = false;
    }
  }
}
