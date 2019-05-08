import { Component, OnInit, AfterContentInit, AfterViewInit, AfterContentChecked } from '@angular/core';
import { MatTableDataSource, MatButtonToggleChange } from '@angular/material';
import { PublisherService } from './publisher.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-publishers',
  templateUrl: './html/publishers.component.html',
  styleUrls: ['./scss/publishers.component.scss']
})
export class PublishersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'orderBtn'];
  dataSource: any;
  toggle = true;
  title = 'Publishers';
  loading = true;
  pubs: any;


  constructor(
    public publisherService: PublisherService
    ) {
    }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

  ngOnInit() {
    this.publisherService.publishersData.valueChanges().subscribe(publishers => {
      this.pubs = JSON.parse(JSON.stringify(publishers));
      this.dataSource = new MatTableDataSource(this.pubs);
      this.loading = false;
      });
  }
}

