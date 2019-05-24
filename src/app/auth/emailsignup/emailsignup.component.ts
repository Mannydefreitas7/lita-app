import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

import { PublisherService } from 'src/app/home/publishers/publisher.service';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { User } from 'src/app/shared/models/user.model';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'lita-emailsignup',
  templateUrl: './emailsignup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class EmailsignupComponent implements OnInit {

  signUpForm: FormGroup;
  hide = true;
  empty = true;
  emailMessage = false;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faMicrosoft = faMicrosoft;

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      password: ['',
        [
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25)
        ],
      ]
    });
  }

  get password() {
    return this.signUpForm.get('password');
  }

  confirmSignIn() {
    this.route.params.subscribe(uri => {
   
      this.publisherService.publisherDocument(uri['cid'], uri['id']).valueChanges().subscribe(user => {

          return this.auth.afAuth.auth.createUserWithEmailAndPassword(user.email, this.password.value)
            .then(credential => {
              this.auth.afAuth.auth.currentUser.updateProfile({
                displayName: `${user.fname}` + `${user.lname}`,
                photoURL: `${user.photoUrl}`
              });
              console.log(credential.user.uid)
                  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${credential.user.uid}`);
                  const data: User = {
                    uid: credential.user.uid,
                    email: user.email,
                    congregation: uri['cid'],
                    displayName: `${user.fname}` + `${user.lname}`,
                    photoURL: user.photoUrl,
                    homeView: {
                      publishers: true,
                      report: true,
                      order: true,
                      firstLog: false
                    }
                  };
                  return userRef.set(data, { merge: true })
                .then(() => {
                  this.publisherService.publisherDocument(uri['cid'], credential.user.uid).set({
                    id: credential.user.uid,
                    fname: user.fname,
                    lname: user.fname,
                    email: user.email,
                    role: 'admin',
                    photoUrl: user.photoUrl,
                    orderCount: 0
                  })
                })
                .then(() => {
                  this.publisherService.publisherDocument(uri['cid'], uri['id']).delete()
                })
                .then(() => this.router.navigateByUrl('/home'))
                .then(() => this.snackBar.open('Welcome, your account has been created', '', { duration: 3000 }))
                .catch(error => this.snackBar.open(error.message, '', { duration: 3000 }));
            })
      })
    })
  }

}
