import { Component, OnInit, Input, Output } from '@angular/core';
import { MatTableDataSource, MatButtonToggleChange, MatDialog } from '@angular/material';
import { PublisherService } from './publisher.service';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { AddpublisherComponent } from './addpublisher.component';
import { OrderComponent } from '../order/order.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-publishers',
  templateUrl: './html/publishers.component.html',
  styleUrls: ['./scss/publishers.component.scss']
})
export class PublishersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'orderBtn'];
  dataSource: any;
  pubSource: any;
  toggle = true;
  title = 'Publishers';
  loading = true;
  empty: boolean;
  searchText: string = '';
  pubs: any;

  constructor(
    public publisherService: PublisherService,
    private auth: AuthService,
    private dialog: MatDialog
  ) { this.loading = true; }

  applyFilter(filterValue: string) {
    if (!this.toggle) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

  addPublisher() {
    this.dialog.open(AddpublisherComponent, { width: '400px' });
  }

  order(id) {
          this.dialog.open(OrderComponent, {
            width: '95%', data: {
              id: id
            }
          })
  }

  ngOnInit() {
    setTimeout(() => {
      this.auth.user.subscribe(user => {
        this.publisherService.publishersCollection(user.congregation).valueChanges().subscribe(publishers => {
          this.pubs = JSON.parse(JSON.stringify(publishers));
          this.dataSource = new MatTableDataSource(this.pubs)
          this.loading = false;
          console.log(this.pubs)
        });
      });
    }, 1000)
  }
}