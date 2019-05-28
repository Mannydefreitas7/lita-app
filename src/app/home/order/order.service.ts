import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { Publisher, Congregation, Literature, CongLiterature } from 'src/app/shared/models/congregation.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  publication: Observable<Literature>
  publications: Observable<Literature[]>
  congLiterature: Observable<CongLiterature>
  congLiteratures: Observable<CongLiterature[]>
  month: any;
  months: any[];

  publiForm: FormGroup

  constructor(
    public auth: AuthService,
    private dashService: DashboardService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public location: Location,
    public route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  get publicationFormGroup() {
    return this.fb.group({
      in: [''],
      onHand: [''],
      Out: ['']
    })
  }

  get publicationsCollection() {
    return this.dashService.fireStore.collection('literature')
  }

  publicationDocument(id: any): AngularFirestoreDocument<Literature> {
    return this.publicationsCollection.doc(id);
  }

  addInventory() {
    return this.router.navigateByUrl(`/addinventory/${this.month}`);
  }

  updatePublication() {

  }
}
