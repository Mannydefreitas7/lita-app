import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatButtonToggleChange, MatTableDataSource, MatMonthView, MatSelectChange } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { OrderService } from './order.service';
import { map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CongLiterature, Literature } from 'src/app/shared/models/congregation.model';
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
  currentMonth: number;
  month: number;
  dataSource: any;
  searchText: string = "";
  displayedColumns: string[] = ['id', 'name', 'pubId', 'contextTitle', 'quantityIn', 'quantityOnHand', 'quantityOut'];
  congLiteratures: Observable<any>
  literature: Observable<any>;
  pubData: any;

  title = "Inventory";
  constructor(
    private auth: AuthService,
    private dash: DashboardService,
    private order: OrderService,
    private afs: AngularFirestore
    ) {}

  ngOnInit() {
    this.loading = true;
    const date = new Date()
    this.currentMonth = date.getMonth();
    // this.afs.collection<Literature>('literature').valueChanges().subscribe(lits => {

    //     this.auth.user.subscribe(user => {
    //     lits.forEach(lit => {
    //     this.dash.getCongregationDoc(user.congregation).collection(`${5}`).doc<CongLiterature>(`${lit.id}`).valueChanges()
    //       .pipe(map(pubs => { 
    //              return {
    //              id: pubs.id,
    //              cover: lit.cover,
    //              contextTitle: lit.contextTitle,
    //              name: lit.name,
    //              pubId: lit.pubId,
    //              in: pubs.months[this.month].in,
    //              onHand: pubs.months[this.month].onHand,
    //              out: pubs.months[this.month].out
    //            }
    //         })).subscribe(data => {
    //           this.publications.push(data)
    //           this.dataSource = new MatTableDataSource(this.publications)
    //           this.loading = false;
    //           })
    //       })
    //     })
    // })
    this.month = this.currentMonth;

    this.showInventory(this.currentMonth)

  }

  applyFilter(filterValue: string) {
    if (!this.toggle) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  showInventory(selected: number) {
    this.afs.collection<Literature>('literature').valueChanges().subscribe(lits => {
      this.auth.user.subscribe(user => {
      lits.forEach(lit => {
      this.dash.getCongregationDoc(user.congregation).collection(`${5}`).doc<CongLiterature>(`${lit.id}`).valueChanges()
        .pipe(map(pubs => { 
               return {
               id: pubs.id,
               cover: lit.cover,
               contextTitle: lit.contextTitle,
               name: lit.name,
               pubId: lit.pubId,
               in: pubs.months[selected].in,
               onHand: pubs.months[selected].onHand,
               out: pubs.months[selected].out
             }
          })).subscribe(data => {
            this.publications.push(data)
            this.dataSource = new MatTableDataSource(this.publications)
            this.loading = false;
            })
        })
      })
  })
  }

  monthDisplay(event: MatSelectChange) {
    this.loading = true;
    this.showInventory(event.value);
    console.log(event.value)
  }

  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

}
