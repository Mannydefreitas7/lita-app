import { NgModule } from '@angular/core';
import { MatListModule, MatIconModule, MatButtonModule, MatInputModule } from '@angular/material';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';



@NgModule({
  declarations: [
  ],
  imports: [
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule
  ],
  exports: [
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule
  ]
})
export class MaterialModule { }
