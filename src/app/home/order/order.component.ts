import { Component, OnInit, Inject} from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatButtonToggleChange, MatTableDataSource, MatSelectChange, MatButtonToggleGroup, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DashboardService } from '../dashboard/dashboard.service';
import { OrderService } from './order.service';
import { map } from 'rxjs/operators';
import { CongLiterature, Literature, Congregation } from 'src/app/shared/models/congregation.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'lita-order',
  templateUrl: './order.component.html',
  styleUrls: ['../publishers/scss/publishers.component.scss', './order.component.scss']
})
export class OrderComponent implements OnInit {
  loading: boolean;
  publications:any = [];
  currentMonth: number;
  month: number; 
  pubText:string;
  routed_id: any;

  title = 'ORDER';
  constructor(
    private auth: AuthService,
    private dash: DashboardService,
    private order: OrderService,
    private dialog: MatDialog,
    private afs: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit() {
    this.loading = true;
    const date = new Date()
    this.routed_id = this.data.id
    this.currentMonth = date.getMonth();
    this.month = this.currentMonth;
      this.showInventory(this.currentMonth)
      this.pubText = ' ';

setTimeout(() => {
  this.pubText = '';
  this.loading = false;
}, 3000);
    console.log(this.publications);
  }

  close() {
    return this.dialog.closeAll();
  }

 mapInventory(congID: number, litID) {
    return this.dash.getCongregationDoc(congID).collection('literature').doc<CongLiterature>(`${litID}`).valueChanges()
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
            this.publications.push(JSON.parse(JSON.stringify(data)));
          })
        })
      })
  })

}

}
