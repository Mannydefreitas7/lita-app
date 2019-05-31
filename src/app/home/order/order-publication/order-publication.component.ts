import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { Congregation, Publisher, Literature } from 'src/app/shared/models/congregation.model';

@Component({
  selector: 'lita-order-publication',
  templateUrl: './order-publication.component.html',
  styleUrls: ['./../../dashboard/dashboard.component.scss']
})
export class OrderPublicationComponent implements OnInit {

  id: any;
  pubId: number;
  name: any;
  quantity: any;
  pub: any;
  collection:any;

  constructor(
    private auth: AuthService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private load: DashboardService
    ) { }

  ngOnInit() {

    this.router.params.subscribe(par => {

      this.id = par['id'];
      this.pubId = par['pubid']
      console.log(this.id, this.pubId)

      if (par['id'].length == 6) {

        this.load.fireStore.collection('congregations').doc<Congregation>(`${this.id}`).valueChanges().subscribe(res => {
          this.name = res.name + ` ` + res.language;
       })

      } else {
        this.auth.user.subscribe(user => {
          this.load.fireStore.collection('congregations').doc(`${user.congregation}`).collection('publishers').doc<Publisher>(`${par['id']}`).valueChanges().subscribe(res => {
            this.name = res.fname + ' <strong>' + res.lname + '</strong>';
          })
        })
       
      }

       this.load.fireStore.collection('literature').doc<Literature>(`${this.pubId}`).valueChanges().subscribe(pub => {
        this.pub = pub.cover;
      })

    
    })

  }

}
