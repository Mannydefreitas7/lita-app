import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  }
    emailSignIn(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(() => console.log('You have successfully signed in'))
        .catch(error => console.log(error.message));
      }

      emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(() => console.log('Welcome, Your Account has been created!'))
        .then(user => this.updateUserData(user))
        .catch(error => console.log(error.message));
      }

    signOut() {
      return this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
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
