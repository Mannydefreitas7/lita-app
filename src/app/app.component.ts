import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

import { AngularFirestore } from 'angularfire2/firestore';
import { ThrowStmt } from '@angular/compiler';
import { DashboardService } from './home/dashboard/dashboard.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lita';
  firstlog: boolean;
  loading = false;


  constructor(
    public router: Router,
    private auth: AuthService, 
    private afs: AngularFirestore,
    private dash: DashboardService
    ) {
   
  }

  ngOnInit() {
console.log(this.auth.authenticated)
    
  }
 
}

