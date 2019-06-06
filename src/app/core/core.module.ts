import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthModule } from '../auth/auth.module';
import { AuthService } from './auth.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    AuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [AuthService]
})
export class CoreModule { }
