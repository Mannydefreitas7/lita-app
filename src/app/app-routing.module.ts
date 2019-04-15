import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: ' ',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'home',
    component: HomeComponent
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
