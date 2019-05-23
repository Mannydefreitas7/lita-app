import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import {MatPaginator, MatTableDataSource, MatButtonToggleChange } from '@angular/material';
@Component({
  selector: 'lita-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  title = 'Report'
  pubs: any;
  displayedColumns: string[] = ['id', 'name', 'pubId', 'contextTitle', 'quantityIn', 'quantityOnHand', 'quantityOut'];
  dataSource:any;
  toggle: boolean = true;
  constructor(auth: AuthService) {
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