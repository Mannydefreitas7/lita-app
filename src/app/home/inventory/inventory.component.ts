import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatButtonToggleChange, MatTableDataSource, MatSelectChange, MatButtonToggleGroup } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { OrderService } from '../order/order.service';
import { map } from 'rxjs/operators';
import { CongLiterature, Literature, Congregation, Month } from 'src/app/shared/models/congregation.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'lita-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['../publishers/scss/publishers.component.scss', './inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  loading: boolean;
  inventory: boolean;
  publications:any = [];
  currentMonth: number;
  month: number;
  dataSource: any;
  pubText:string = '';
  displayedColumns: string[] = ['id', 'name', 'pubId', 'contextTitle', 'quantityIn', 'quantityOnHand', 'quantityOut'];
  congregation: any;

  title = "Inventory";
  constructor(
    private auth: AuthService,
    private dash: DashboardService,
    private order: OrderService,
    private afs: AngularFirestore
    ) {}

  ngOnInit() {
    this.publications = [];
    this.loading = true;
    const date = new Date()
    this.auth.user.subscribe(user => {
    this.congregation = user.congregation
    this.dash.getCongregationDoc(`${user.congregation}`).valueChanges().subscribe(cong => {
        this.inventory = cong.inventory;
      })
    })
    this.currentMonth = date.getMonth();
    console.log(this.currentMonth)
    this.month = this.currentMonth;
    setTimeout(() => {
      this.showInventory(this.currentMonth)
    }, 1000)
    console.log(this.publications);


  }
  

  mapInventory(congID: number, litID) {
    return this.dash.getCongregationDoc(congID).collection('literature').doc<CongLiterature>(`${litID}`).collection('months').valueChanges()
  }


showInventory(selected: number) {

 this.afs.collection<Literature>('literature').valueChanges().subscribe(lits => {
      this.auth.user.subscribe(user => { 
      lits.forEach(lit => {
       
      return this.dash.getCongregationDoc(user.congregation).collection('literature').doc<CongLiterature>(`${lit.id}`).collection('months').doc<Month>(`${selected}`).valueChanges()
        .pipe(map(pub => { 
             return {
               id: lit.id,
               cover: lit.cover,
               contextTitle: lit.contextTitle,
               name: lit.name,
               pubId: lit.pubId,
               in: pub.in,
               onHand: pub.onHand,
               out: pub.out
             }
          })).subscribe(data => {
            this.publications.push(JSON.parse(JSON.stringify(data)));
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
    console.log(this.publications)
}


}
