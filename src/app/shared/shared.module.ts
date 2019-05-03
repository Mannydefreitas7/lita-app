import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SettingsComponent } from '../home/dashboard/settings.component';
import { User } from './models/user.model';
import { TutorialComponent } from '../home/dashboard/tutorial.component';
import { AddpublisherComponent } from '../home/home/addpublisher.component';


@NgModule({
  declarations: [
    SettingsComponent,
    TutorialComponent,
    AddpublisherComponent
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
  entryComponents: [SettingsComponent, TutorialComponent, AddpublisherComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularSvgIconModule,
    FlexLayoutModule,
    HttpClientModule
  ]
})
export class SharedModule { }
