import { Component } from '@angular/core';
import { PublisherService } from './publisher.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-addpublisher',
  template: `
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
    <mat-select formControlName="role">
      <mat-option value="General" selected>General</mat-option>
      <mat-option *ngFor="let role of roles" [value]="role.value" >
        {{role.valueView}}
      </mat-option>
    </mat-select>
  </mat-form-field>

  </mat-dialog-content>
  <mat-divider></mat-divider>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Cancel</button>
    <button mat-raised-button color="primary" (click)="publisherService.addPub">Save</button>
  </mat-dialog-actions>
</form>
  `,
  styleUrls: ['./scss/publishers.component.scss']
})
export class AddpublisherComponent {

  roles = [
    {value: 'admin', valueView: 'Admin'},
    {value: 'editor', valueView: 'Editor'},
    {value: 'view', valueView: 'View Only'}
  ];

  // tslint:disable-next-line:max-line-length
  constructor(private publisherService: PublisherService) {}

}
