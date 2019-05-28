import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatButtonToggleChange, MatTableDataSource } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { OrderService } from './order.service';
import { map, flatMap, publish, mergeMap } from 'rxjs/operators';
import { Observable, concat } from 'rxjs';
import { CongLiterature, Literature } from 'src/app/shared/models/congregation.model';
import { listenToElementOutputs } from '@angular/core/src/view/element';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'lita-order',
  templateUrl: './order.component.html',
  styleUrls: ['../publishers/scss/publishers.component.scss']
})
export class OrderComponent implements OnInit {
  loading: boolean;
  toggle: boolean  = true;
  publications:any = [];
  month: number;
  dataSource: any;
  searchText: string = '';
  displayedColumns: string[] = ['id', 'name', 'pubId', 'contextTitle', 'quantityIn', 'quantityOnHand', 'quantityOut'];
  congLiteratures: Observable<any>
  literature: Observable<any>;
  pubData: any;

  constructor(
    private auth: AuthService,
    private dash: DashboardService,
    private order: OrderService,
    private afs: AngularFirestore
    ) {this.loading = true;}

  ngOnInit() {
    const date = new Date()
    this.month = date.getMonth();
    this.afs.collection<Literature>('literature').valueChanges().subscribe(lits => {

        this.auth.user.subscribe(user => {
        lits.forEach(lit => {
        this.pubData = this.dash.getCongregationDoc(user.congregation).collection(`${5}`).doc<CongLiterature>(`${lit.id}`).valueChanges()
          .pipe(map(pubs => { 
                 return {
                 id: pubs.id,
                 cover: lit.cover,
                 contextTitle: lit.contextTitle,
                 name: lit.name,
                 pubId: lit.pubId,
                 in: pubs.months[this.month].in,
                 onHand: pubs.months[this.month].onHand,
                 out: pubs.months[this.month].out
               }
            })).subscribe(data => {
              this.publications.push(data)
              this.dataSource = new MatTableDataSource(this.publications)
              console.log(this.publications)
              this.loading = false;
              })
          })
        })
    })
  }

  applyFilter(filterValue: string) {
    if (!this.toggle) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

}
