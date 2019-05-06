import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'lita-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublisherComponent implements OnInit {
  sub: any;
  uid: any;
  publisher: any;
  orderCount: number;
  publisherForm: FormGroup;
  edit: boolean = false;
  pubData: any;

  publisherDoc: AngularFirestoreDocument
 
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auth: AuthService, private location: Location) {

  this.publisherForm = this.fb.group({
    fname : [''],
    lname : [''],
    email: ['', Validators.email]
  });

    this.sub = this.route.params.subscribe(params => {
      this.uid = params['uid'];
    })
   }
   goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  editField() {
    this.edit = true;
  }

  cancelEdit() {
    this.edit = false;
  }

  updatePublisher() {
    const fname = this.publisherForm.get('fname');
    const lname = this.publisherForm.get('lname');
    const email = this.publisherForm.get('email');
    
    return this.publisherDoc.update(
      {
        fname: fname.value,
        lname: lname.value,
        email: email.value
      }).then(() => this.edit = false)
  }

  ngOnInit() {

    const user = this.auth.currentUserObservable.currentUser;
    this.publisherDoc = this.auth.firebaseFireStore.doc(`users/${user.uid}`).collection('publishers').doc(`${this.uid}`)
    this.publisherDoc.valueChanges()
    .subscribe(result => {
      this.publisher = result
      console.log(this.publisher)
    })
  }

}
