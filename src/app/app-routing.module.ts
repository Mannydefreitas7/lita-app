import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './auth/auth.module#AuthModule'
  }
];

@NgModule({

  imports: [
    AuthModule,
    CoreModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    AuthModule,
    CoreModule,
    RouterModule
  ]
})
export class AppRoutingModule { }
