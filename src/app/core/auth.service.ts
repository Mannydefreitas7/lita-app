import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { User } from '../shared/models/user.model';
import { MatSnackBar } from '@angular/material';


@Injectable({
  providedIn:  'root'
})
export class AuthService {
  user: Observable<User>;
  authState: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
    private form: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));

    this.afAuth.authState.subscribe(data => this.authState = data);

  }


  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserObservable() {
    return this.afAuth.auth;
  }

  get currentUser() {
    return this.afAuth.user;
  }

  get currentUserID() {
    return this.currentUser.subscribe(user => user.uid);
  }



  stateChanged(): any {
    return this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.ngZone.run(() => this.router.navigate(['/home']));
      } else {
        this.ngZone.run(() => this.router.navigate(['/']));
      }
    });
  }

  get isAuth(): boolean {
    return this.user !== null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.currentUserObservable.currentUser.uid : null;
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .then(() => this.snackBar.open('you have successfully signed in','', { duration: 3000}))
      .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }


  emailSignUp(email: string, password: string, displayName?: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(credential =>
      // tslint:disable-next-line:max-line-length
      this.afAuth.auth.currentUser.updateProfile({displayName: `${displayName}`, photoURL: 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/profile.png?alt=media&token=6aa1a87c-1d1e-4e0e-ae34-bb1ea8b34a06'})
      .then(() => this.createUserData(credential.user))
      .then(() => this.snackBar.open('welcome, your account has been created','', { duration: 3000}))
      .catch(error => this.snackBar.open(error.message,'', { duration: 3000})));
  }



  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => this.snackBar.open('We\'ve sent you a password reset link','', { duration: 3000}))
      .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }

  signOut() {
    return this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
        this.snackBar.open('Logged Out Succesfully','', { duration: 3000})
      });
  }


  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return this.afAuth.auth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']))
      this.snackBar.open('You are logged-in with Google','', { duration: 3000})
    })
    .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }

  googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return this.socialLogin(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => this.snackBar.open('You are logged-in with Google','', { duration: 3000}))
    .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }

  microsoftLogin() {

    const provider = new firebase.auth.OAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => this.snackBar.open('You are logged-in with Microsoft','', { duration: 3000}))
    .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }

  microsoftSignup() {

    const provider = new firebase.auth.OAuthProvider();
    return this.socialLogin(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => this.snackBar.open('You signed up with Microsoft successfully','', { duration: 3000}))
    .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => this.snackBar.open('You are logged-in with Facebook','', { duration: 3000}))
    .catch(error =>
      this.snackBar.open(error.message,'', { duration: 3000}));
  }


  facebookSignup() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result: any) => {
      return this.createUserData(result.user); })
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => this.snackBar.open('You signed up with Facebook successfully','', { duration: 3000}))
    .catch(error =>
      this.snackBar.open(error.message,'', { duration: 3000}));
  }

  private socialLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential: any) => {
        return this.createUserData(credential.user);
      })
      .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }


  createUserData(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      congregation: null,
      displayName: user.displayName,
      photoURL: user.photoURL,
      homeView: {
        publishers: true,
        report: true,
        order: true,
        firstLog: true
      }
    };
    return userRef.set(data, { merge: true })
}


}
