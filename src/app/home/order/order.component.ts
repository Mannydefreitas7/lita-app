import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatButtonToggleChange, MatTableDataSource, MatMonthView, MatSelectChange } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { OrderService } from './order.service';
import { map, publish} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CongLiterature, Literature } from 'src/app/shared/models/congregation.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'lita-order',
  templateUrl: './order.component.html',
  styleUrls: ['../publishers/scss/publishers.component.scss']
})
export class OrderComponent implements OnInit, AfterViewInit {
  loading: boolean;
  toggle: boolean = true;
  publications:any = [];
  currentMonth: number;
  month: number;
  dataSource: any;
  searchText: string = '';
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
    this.month = this.currentMonth;
    setTimeout(() => {
      this.showInventory(this.currentMonth)
    }, 1000)
  }
  

  ngAfterViewInit() {
  // this.showInventory(this.month).unsubscribe();
  }

  applyFilter(filterValue: string) {
    if (!this.toggle) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

 mapInventory(congID: number, litID) {
    return this.dash.getCongregationDoc(congID).collection(`${5}`).doc<CongLiterature>(`${litID}`).valueChanges()
  }

showInventory(selected: number) {
 this.afs.collection<Literature>('literature').valueChanges().subscribe(lits => {
      this.auth.user.subscribe(user => {
      lits.forEach(lit => {
      return this.mapInventory(user.congregation, `${lit.id}`)
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
            this.dataSource = new MatTableDataSource(this.publications);
            this.loading = false;
          })
        })
      })
  })

}

monthDisplay(event: MatSelectChange) {
    this.publications = [];
    this.loading = true;
    console.log(event.value)
    setTimeout(() => {
      this.showInventory(event.value) 
    }, 3000)
}

  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

}
