import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatSlideToggleChange, MatSlideToggle, MatDialog, MatTableDataSource } from '@angular/material'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Publisher, Congregation } from 'src/app/shared/models/congregation.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AddpublisherComponent } from '../publishers/addpublisher.component';
import { Observable } from 'rxjs';
import { DashboardService } from '../dashboard/dashboard.service';
import { User } from 'src/app/shared/models/user.model';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  publisherCard: boolean = true;
  orderCard: boolean = true;
  reportCard: boolean = true;
  calendarCard: boolean = true;
  orderSource: any;
  cards: any;
  totalPublishers: number;
  totalRequests: number;
  orderCount: number = 0;
  loading: boolean;
  displayedColumns: string[] = ['user', 'pub','quantity', 'actions']

  constructor(private auth: AuthService, private afs: AngularFirestore, private fb: FormBuilder, private dialog: MatDialog, private dash: DashboardService) { }

  addPublisher() {
    this.dialog.open(AddpublisherComponent);
  }

  togglePub() {
    this.publisherCard = !this.publisherCard;
  }
  toggleCal() {
    this.calendarCard = !this.calendarCard
  }


  toggleOrder() {
    this.orderCard = !this.orderCard;
  }

  toggleReport() {
    this.reportCard = !this.reportCard
  }


  ngOnInit() {
    this.loading = true;
    setTimeout(() => {

      this.auth.user.subscribe(user => {
        this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userDoc => {

          this.dash.getCongregationDoc(`${userDoc.congregation}`).collection('orders').valueChanges().subscribe(data => {
            this.orderSource = new MatTableDataSource(JSON.parse(JSON.stringify(data)));
          })


          this.afs.doc<Congregation>(`congregations/${userDoc.congregation}`).collection('publishers')
            .snapshotChanges().subscribe(total => {
              this.totalPublishers = total.length;
            })
          this.afs.doc<Congregation>(`congregations/${userDoc.congregation}`).collection('publishers').valueChanges()
            .subscribe(total => {
              total.forEach(publisher => {
                this.orderCount += publisher.orderCount
              })
              console.log(this.totalRequests = this.orderCount)
            })
        })
      })
      this.loading = false;
    }, 1000);


  }
}
