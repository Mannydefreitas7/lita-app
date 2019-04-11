import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '.',
    loadChildren: './auth/auth.module#AuthModule'
  }
];

@NgModule({

  imports: [
    AuthModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    AuthModule,
    RouterModule
  ]
})
export class AppRoutingModule { }
