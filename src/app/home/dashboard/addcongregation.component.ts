import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Publisher, Month } from 'src/app/shared/models/congregation.model';

@Component({
  selector: 'lita-addcongregation',
  templateUrl: './addcongregation.component.html',
  styleUrls: ['./addcongregation.component.scss']
})
export class AddcongregationComponent implements OnInit {
  setupGroup: FormGroup;
  pubs: any;
  date = new Date();
  month = this.date.getMonth()+1;
  constructor(
    private auth: AuthService,
    public dash: DashboardService,
    private router: Router,
    private afs: AngularFirestore,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.pubs = {}
    this.setupGroup = this._formBuilder.group({
      congID: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      congName: ['', [Validators.required, Validators.min(3)]],
      congLanguage: ['', [Validators.required, Validators.min(3)]]
    });


  }

  createCongregation() {
    const congID = this.setupGroup.get('congID');
    const congName = this.setupGroup.get('congName');
    const congLanguage = this.setupGroup.get('congLanguage');

    this.auth.user.subscribe(user => {

    const currentUser = this.dash.getUserDoc(user.uid);

    const publishersRef: AngularFirestoreCollection<any> = this.dash.getCongregationDoc(congID.value).collection('publishers');
    this.dash.loading = true;

    return this.dash.getCongregationDoc(congID.value).set(
      {
        id: congID.value,
        name: congName.value,
        language: congLanguage.value,
        inventory: false
      }, { merge: true }
    )
    .then(() => {
      return publishersRef.doc<Publisher>(`${user.uid}`).set({
        id: user.uid,
        fname: user.displayName.split(' ')[0],
        lname: user.displayName.split(' ')[1] || user.displayName.split(' ')[1] + user.displayName.split(' ')[2] || '',
        email: user.email,
        role: 'editor',
        photoUrl: user.photoURL || 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/publications%2Fprofile.png?alt=media&token=86287c07-526f-447a-acbf-7161c007ff1e',
        orderCount: 0
      })
    })
    .then(() => {
      this.http.get('assets/literature-quantity.json').subscribe(results => {
        this.pubs = JSON.parse(JSON.stringify(results))
          const literatureRef: AngularFirestoreCollection<any> = this.dash.getCongregationDoc(congID.value).collection('literature');
          this.pubs.forEach(pub => {
            literatureRef.doc(`${pub.id}`).set({id: pub.id});
            for (let i = 1; i < 13; i++) {
            literatureRef.doc(`${pub.id}`).collection<Month[]>('months').doc(`${i}`).set({
                in: 0,
                onHand: 0,
                out: 0,
              })
            }
           
           });
        })
      })
    .then(() => {
      return currentUser.set(
        {
        congregation: congID.value,
        homeView: {
          firstLog: false
        }
      }, {merge: true})
    })
    .then(() => {
      this.router.navigateByUrl('/home')
      this.snackBar.open('Congregation Created Successfully','', {duration: 2000})
    })
    .catch(error => this.snackBar.open(error.message,'', {duration: 2000}))
    .then(() => this.dash.loading = false)
  })
  }
  

}
