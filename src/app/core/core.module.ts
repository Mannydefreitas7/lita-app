import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
  ],
  imports: [
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AuthModule
  ],
  providers: [
    AuthService
  ]
})
export class CoreModule { }
