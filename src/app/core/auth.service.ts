import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


interface User {
  uid: string;
  email: string;
  name?: string;
}

@Injectable()
export class AuthService {
  user: Observable<User>;

  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
       } else {
          return Observable.of(null);
        }
      });
    this.afAuth.authState.subscribe(data => this.authState = data);
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : null;
  }

    emailSignIn(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(() => console.log('You have successfully signed in'))
        .catch(error => console.log(error.message));
      }

      emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(user => this.updateUserData(user))
        .then(() => console.log('Welcome, Your Account has been created!'))
        .catch(error => console.log(error.message))
        .then(user => {
          this.afAuth.auth.currentUser.sendEmailVerification()
          .then(() => console.log('We sent you an email verification'))
          .catch(error => console.log(error.message));
        });
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
  return this.socialLogin(provider);
}

githubLogin() {
  const provider = new firebase.auth.GithubAuthProvider();
  return this.socialLogin(provider);
}

FacebookLogin() {
  const provider = new firebase.auth.FacebookAuthProvider();
  return this.socialLogin(provider);
}


    private socialLogin(provider) {
      return this.afAuth.auth.signInWithRedirect(provider)
      .then(credential => {
        return this.updateUserData(this.user);
      })
      .catch(error => console.log(error.message));
    }

 private updateUserData(user) {
  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

  const data: User = {
    uid: user.uid,
    email: user.email || null
  };
  return userRef.set(data, { merge: true });
    }
  }
