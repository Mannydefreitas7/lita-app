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


@NgModule({
  declarations: [
    AddpublisherComponent,
    PublisherComponent,
    DeletepublisherComponent,
    SettingsComponent
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
  entryComponents: [AddpublisherComponent, DeletepublisherComponent],
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
  providers: [PublisherService, DashboardService]
})
export class SharedModule { }
