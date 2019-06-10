import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { User } from './models/user.model';
import { AddpublisherComponent } from '../home/publishers/addpublisher.component';
import { PublisherComponent } from '../home/publishers/publisher.component';
import { DeletepublisherComponent } from '../home/publishers/deletepublisher.component';
import { PublisherService } from '../home/publishers/publisher.service';
import { SettingsComponent } from '../home/dashboard/settings.component';
import { DashboardService } from '../home/dashboard/dashboard.service';
import { CongregationsComponent } from '../home/admin/congregations/congregations.component';
import { UsersComponent } from '../home/admin/users/users.component';
import { NewsComponent } from '../home/admin/news/news.component';
import { AddcongregationComponent } from '../home/dashboard/addcongregation.component';
import { OrderPublicationComponent } from '../home/order/order-publication/order-publication.component';
import { OrderComponent } from '../home/order/order.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@NgModule({
  declarations: [
    AddpublisherComponent,
    PublisherComponent,
    DeletepublisherComponent,
    SettingsComponent,
    CongregationsComponent,
    UsersComponent,
    NewsComponent,
    OrderPublicationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularSvgIconModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  entryComponents: [DeletepublisherComponent, AddpublisherComponent, OrderComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularSvgIconModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [DashboardService, 
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class SharedModule { }
