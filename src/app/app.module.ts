import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AngularFireModule } from 'angularfire2';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './/app-routing.module';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from './core/auth.service';
import { PublishersComponent } from './home/publishers/publishers.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LiteratureComponent } from './home/literature/literature.component';
import { HelpComponent } from './home/help/help.component';
import { OrderComponent } from './home/order/order.component';
import { ReportComponent } from './home/report/report.component';
import { HomeComponent } from './home/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    PublishersComponent,
    HeaderComponent,
    DashboardComponent,
    LiteratureComponent,
    HelpComponent,
    OrderComponent,
    ReportComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularSvgIconModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    AppRoutingModule,
    FontAwesomeModule,
    FlexLayoutModule,
    SharedModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
