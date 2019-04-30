import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import {MatPaginator, MatTableDataSource, MatButtonToggleChange } from '@angular/material';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pubs: any;
  displayedColumns: string[] = ['id', 'name', 'pubId', 'contextTitle', 'quantityIn', 'quantityOut', 'quantityOnHand', 'quantityOut'];
  dataSource:any;
  toggle: boolean = true;
  constructor(auth: AuthService) {
    this.pubs = auth.pubs;
    this.dataSource = new MatTableDataSource(this.pubs);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  toggleView(change: MatButtonToggleChange){
    this.toggle = change.value;
  }
  

}
