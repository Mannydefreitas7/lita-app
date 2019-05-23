import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeletepublisherComponent } from './deletepublisher.component';
import { AuthService } from 'src/app/core/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-publisher',
  templateUrl: './html/publisher.component.html',
  styleUrls: ['./scss/publishers.component.scss']
})
export class PublisherComponent implements OnInit {
  sub: any;
  uid: any;
  edit: boolean;
  publisher: Observable<Publisher>;
  pubRoute: any;


  constructor(
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private auth: AuthService, 
    private dashService: DashboardService 
    ) {}

  editField() {
    this.edit = true;
  }

  cancelEdit() {
    this.edit = false;
  }

  openDeleteModal() {
  return this.publisherService.openDialog.open(DeletepublisherComponent);
  }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
       const congID = res.congregation
       this.route.params.subscribe(params => { 
      this.publisher = this.publisherService.publisherDocument(congID, params['id']).valueChanges();
        });
      });
    });
  }
}