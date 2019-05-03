import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { User } from '../shared/models/user.model';
import { Congregation, Literature, Publisher } from '../shared/models/congregation.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn:  'root'
})
export class AuthService {
  user: Observable<User>;
  congregation: Observable<Congregation>;
  msgdialog: string;
  authState: any;
  authStateChanged: any;
  pubs: any;
  pub: any;
  userRefreshed: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
    private form: FormBuilder,
    private http: HttpClient
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

    this.http.get('assets/literature.json').subscribe(results => {
      // tslint:disable-next-line:prefer-for-of
    this.pubs = JSON.parse(JSON.stringify(results));
  });

  }


  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserObservable() {
    return this.afAuth.auth;
  }

  get firebaseFireStore() {
    return this.afs;
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
    return this.authenticated ? this.userRefreshed.uid : null;
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => console.log('you have successfully signed in'))
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error.message));
  }


  emailSignUp(email: string, password: string, displayName?: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(credential =>
      // tslint:disable-next-line:max-line-length
      this.afAuth.auth.currentUser.updateProfile({displayName: `${displayName}`, photoURL: 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/profile.png?alt=media&token=6aa1a87c-1d1e-4e0e-ae34-bb1ea8b34a06'})
      .then(() => console.log('name added succesfully'))
      .then(() => this.updateUserData(credential.user))
      .then(() => console.log('welcome, your account has been created'))
      .then(user =>
        this.afAuth.auth.currentUser.sendEmailVerification()
          .then(() => console.log('We sent you an email verification'))
          .catch(error => console.log(error.message)
          )
      .catch(error => this.msgdialog = error.message)));
  }



  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => console.log('We\'ve sent you a password reset link'))
      .catch(error => console.log(error.message));
  }

  signOut() {
    return this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
  }


  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return this.afAuth.auth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Google'))
    .catch(error => this.msgdialog = error.message);
  }

  googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return this.socialLogin(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Google'))
    .catch(error => this.msgdialog = error.message);
  }

  microsoftLogin() {

    const provider = new firebase.auth.OAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Microsoft'))
    .catch(error => console.log(error.message));
  }

  microsoftSignup() {

    const provider = new firebase.auth.OAuthProvider();
    return this.socialLogin(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Microsoft'))
    .catch(error => console.log(error.message));
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Facebook'))
    .catch(error =>
      this.msgdialog = error.message);
  }

  facebookSignup() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result: any) => {
      return this.updateUserData(result.user); })
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Facebook'))
    .catch(error =>
      this.msgdialog = error.message);
  }

  private socialLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential: any) => {
        return this.updateUserData(credential.user);
      })
      .catch(error => console.log(error.message));
  }


  createUserData(user) {

    const publisherID = this.afs.createId();
    const congregationID = this.afs.createId();

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const literatureRef: AngularFirestoreCollection<any> = this.afs.doc(`users/${user.uid}`).collection('literature');

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      homeView: {
        publishers: true,
        report: true,
        order: true
      },
      congregation: {
        id: congregationID,
        name: null,
        language: 'English',
        publishers: {
          id: publisherID,
          name: null,
          role: null,
          photoUrl: null,
          orderCount: null,
          order: null
        }
      }
    };

    return userRef.set(data, { merge: true })
    .then(() => {
      this.pubs.forEach(pub => {
       literatureRef.doc(`${pub.id}`).set(pub);
      });
    });
}
  updateUserData(user) {

  const publisherID = this.afs.createId();
  const congregationID = this.afs.createId();

  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
  const literatureRef: AngularFirestoreCollection<any> = this.afs.doc(`users/${user.uid}`).collection('literature');

  const data: User = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    homeView: {
      publishers: true,
      report: true,
      order: true
    },
    congregation: {
      id: congregationID,
      name: null,
      language: 'English',
      publishers: {
        id: publisherID,
        name: null,
        role: null,
        photoUrl: null,
        orderCount: null,
        order: null
      }
    }
  };

  return userRef.set(data, { merge: true })
  .then(() => {
    this.pubs.forEach(pub => {
     literatureRef.doc(`${pub.id}`).set(pub);
    });
  });
}
}
