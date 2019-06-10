import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { Congregation } from 'src/app/shared/models/congregation.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  loading: boolean = true;

  constructor(
    private router: Router,
    private location: Location,
    private afs: AngularFirestore,
    private auth: AuthService
    ) {
  }

  public goBack() {
    this.location.back();
  }

  get fireStore() {
    return this.afs;
  }



  getUserDoc(id: string) {
    return this.afs.doc<User>(`users/${id}`);
  }
  getCongregationDoc(congID) {
    return this.afs.doc<Congregation>(`congregations/${congID}`);
  }

}
