import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
<<<<<<< HEAD
import { User } from '../shared/models/user.model';
import { Congregation, Literature, Publisher } from '../shared/models/congregation.model';
import { HttpClient } from '@angular/common/http';
=======
import { HttpClient } from '@angular/common/http';
import { Console } from '@angular/core/src/console';


interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}
>>>>>>> ba3ec955853ae3ae3aa5bdfb68208b2f1c3dd60e

@Injectable({
  providedIn:  'root'
})
export class AuthService {
  user: Observable<User>;
  congregation: Observable<Congregation>;
  msgdialog: string;
  authState: any = null;
  pubs: any;
<<<<<<< HEAD
=======

>>>>>>> ba3ec955853ae3ae3aa5bdfb68208b2f1c3dd60e
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
<<<<<<< HEAD
    console.log(this.pubs);
=======

    this.http.get('assets/literature.json').subscribe((results: Array<any>) => {
      this.pubs = JSON.parse(JSON.stringify(results));
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < results.length; i++) {
      console.log(JSON.parse(JSON.stringify(results[i])));
      }
    });
>>>>>>> ba3ec955853ae3ae3aa5bdfb68208b2f1c3dd60e
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserObservable(): any {
    return this.afAuth.auth;
  }

  get firebaseFireStore() {
    return this.afs;
  }

  stateChanged(): any {
    return this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
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
    return this.authenticated ? this.authState.uid : null;
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => console.log('you have successfully signed in'))
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error.message));
  }

  testApi() {
    return this.http.get('assets/literature.json').subscribe(results => console.log(JSON.stringify(results)));
  }


  emailSignUp(email: string, password: string, displayName?: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(credential =>
      this.afAuth.auth.currentUser.updateProfile({displayName: `${displayName}`, photoURL: ''})
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

    return this.socialLogin(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Google'))
    .catch(error => this.msgdialog = error.message);
  }
  microsoftLogin() {

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
    .then((result: any) => {
      return this.updateUserData(result.user); })
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
    .then(() => console.log('You are logged-in with Facebook'))
    .catch(error =>
      this.msgdialog = error.message);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialLogin(provider);
  }

  private socialLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential: any) => {
        return this.updateUserData(credential.user);
      })
      .catch(error => console.log(error.message));
  }

<<<<<<< HEAD
addPublications(publication) {

}

  updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const literatureRef: AngularFirestoreCollection<any> = this.afs.doc(`users/${user.uid}`).collection('literature');
    let publisherID = this.afs.createId();
    let congregationID = this.afs.createId();

const data: User = {
=======


  updateUserData(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const litRef: AngularFirestoreCollection<any> = this.afs.collection('publications');
    const data: User = {
>>>>>>> ba3ec955853ae3ae3aa5bdfb68208b2f1c3dd60e
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      congregation: {
        id: publisherID,
        name: null,
        publishers: {
          id: congregationID,
          name: null,
          role: null,
          photoUrl: null,
          orderCount: null,
          order: null
        },
        dateCreated: null,
        literature: null
      }
    };
<<<<<<< HEAD

const publications = [
  {
        id: 5000,
        name: "Watchtower Library",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5001,
        name: "Examining the Scriptures ",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5112,
        name: "New Word Translations Hardcover",
        pubId: "Hbi12",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5140,
        name: "New World Translation",
        pubId: "nwt",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5141,
        name: "New World Translation Large",
        pubId: "nwtls",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5142,
        name: "New World Translation Small",
        pubId: "nwtpkt",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5108,
        name: "New World Translation References",
        pubId: "Rbi8",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5414,
        name: "Ministry School Book",
        pubId: "be",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5334,
        name: "Bible Teach Book",
        pubId: "bh",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5340,
        name: "Teach us Book",
        pubId: "bhs",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5416,
        name: "Bearing Witness",
        pubId: "bt",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5231,
        name: "My Follower",
        pubId: "cf",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5331,
        name: "Draw Close to Jehovah",
        pubId: "cl",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5228,
        name: "Creator",
        pubId: "ct",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5328,
        name: "Daniel’s Prophecy ",
        pubId: "dp",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5227,
        name: "Family Happiness",
        pubId: "fy",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5225,
        name: "God’s Word",
        pubId: "gm",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5327,
        name: "Greatest Man",
        pubId: "gt",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5419,
        name: "Imitate",
        pubId: "ia",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5329,
        name: "Isaiah’s Prophecy I",
        pubId: "ip-1",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5330,
        name: "Isaiah’s Prophecy II",
        pubId: "ip-1",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5411,
        name: "Insight",
        pubId: "it",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5230,
        name: "Jehovah’s Day",
        pubId: "jd",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5232,
        name: "Jeremiah",
        pubId: "jr",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5425,
        name: "Jesus—The Way",
        pubId: "jy",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5425,
        name: "Jesus—The Way",
        pubId: "jy",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5422,
        name: "God’s Kingdom Rules!",
        pubId: "kr",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5427,
        name: "Learn From the Bible",
        pubId: "lfb",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5415,
        name: "Teacher",
        pubId: "lr",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5335,
        name: "“God’s Love”",
        pubId: "lv",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5343,
        name: "Remain in God’s Love",
        pubId: "lvs",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5407,
        name: "Bible Stories",
        pubId: "my",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5332,
        name: "Organized",
        pubId: "od",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5332,
        name: "Organized",
        pubId: "od",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5410,
        name: "Revelation Climax",
        pubId: "re",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5323,
        name: "Reasoning",
        pubId: "rs",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5324,
        name: "Creation—Small Size",
        pubId: "Sce",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5326,
        name: "Mankind’s Search for God",
        pubId: "sh",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5403,
        name: "“All Scripture”",
        pubId: "si",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5341,
        name: "“Sing Out Joyfully”",
        pubId: "sjj",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5442,
        name: "“Sing Out Joyfully”—Lyrics Only",
        pubId: "sjjyls",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5322,
        name: "Bible Stories—Small Size",
        pubId: "Smy",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5339,
        name: "Young People Ask, Volume 1",
        pubId: "yp1",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5336,
        name: "Young People Ask, Volume 2",
        pubId: "yp2",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 5200,
        name: "Other books",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6200,
        name: "All large-print books",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6618,
        name: "Reading and Writing",
        pubId: "ay",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6641,
        name: "Book for All",
        pubId: "ba",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6652,
        name: "Bible’s Message",
        pubId: "bm",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6632,
        name: "Does God Care",
        pubId: "dg",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6638,
        name: "Education",
        pubId: "ed",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6659,
        name: "Good News",
        pubId: "fg",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6645,
        name: "God’s Friend",
        pubId: "gf",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6650,
        name: "“Good Land”",
        pubId: "gl",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6643,
        name: "Guidance of God",
        pubId: "gu",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6628,
        name: "Blood",
        pubId: "hb",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6665,
        name: "Happy Family",
        pubId: "hf",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6662,
        name: "Happy Life",
        pubId: "hl",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6642,
        name: "When We Die",
        pubId: "ie",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6660,
        name: "Jehovah’s Will",
        pubId: "jl",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6647,
        name: "Satisfying Life",
        pubId: "la",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6654,
        name: "Was Life Created?",
        pubId: "lc",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6658,
        name: "Listen to God",
        pubId: "ld",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6655,
        name: "Origin of Life",
        pubId: "lf",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6657,
        name: "Listen and Live",
        pubId: "ll",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6625,
        name: "“Look!” brochure",
        pubId: "Lmn",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6663,
        name: "My Bible Lessons",
        pubId: "mb",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6663,
        name: "My Bible Lessons",
        pubId: "mb",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6622,
        name: "Divine Name",
        pubId: "na",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6674,
        name: "Nations",
        pubId: "np",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6648,
        name: "Road to Life",
        pubId: "ol",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6629,
        name: "Our Problems",
        pubId: "op",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6639,
        name: "Lasting Peace",
        pubId: "pc",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6653,
        name: "Pathway",
        pubId: "ph",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6636,
        name: "Purpose of Life",
        pubId: "pr",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6671,
        name: "Return to Jehovah",
        pubId: "rj",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6656,
        name: "Real Faith",
        pubId: "rk",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6630,
        name: "Spirits of the Dead",
        pubId: "sp",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6637,
        name: "When Someone Dies",
        pubId: "we",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6634,
        name: "World Without War",
        pubId: "wi",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6635,
        name: "Why Worship God",
        pubId: "wj",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6664,
        name: "Teach Your Children",
        pubId: "yc",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6684,
        name: "10 Questions",
        pubId: "ypq",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 6600,
        name: "Other brochures and booklets",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7305,
        name: "Invitation to congregation meetings",
        pubId: "inv",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7074,
        name: "Know the Truth",
        pubId: "kt",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7071,
        name: "Road to Paradise",
        pubId: "rp",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7130,
        name: "View the Bible",
        pubId: "T-30",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7131,
        name: "View the Future",
        pubId: "T-31",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7132,
        name: "Happy Family Life",
        pubId: "T-32",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7133,
        name: "Who Controls the World?",
        pubId: "T-33",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7134,
        name: "Will Suffering End?",
        pubId: "T-34",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7135,
        name: "Live Again",
        pubId: "T-35",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7136,
        name: "Kingdom",
        pubId: "T-36",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7137,
        name: "Web site tract",
        pubId: "T-37",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7182,
        name: "Trust the Creator!",
        pubId: "T-82",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 7100,
        name: "Other tracts",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 9200,
        name: "DVDs",
        pubId: "",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 9305,
        name: "Teach Us—On DVD",
        pubId: "T-82",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 9280,
        name: "Good News—On DVD",
        pubId: "dvfg",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 9270,
        name: "Listen and Live—On DVD",
        pubId: "dvll",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 1540,
        name: "Matthew—On DV",
        pubId: "dvMt",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 8724,
        name: "Receipt ",
        pubId: "S-24",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 9295,
        name: "Questions Answered—On DVD",
        pubId: "dvqua7",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 8704,
        name: "Field Service Report Form",
        pubId: "S-4",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      },
      {
        id: 8708,
        name: "House-to-House Record",
        pubId: "S-8",
        contextTitle: "",
        cover: "",
        quantity: {
          in: 0,
          onHand: 0,
          out: 0
        }
      }
    ]


    return userRef.set(data, { merge: true })
    .then(() => {
      
      publications.forEach((publication) => {
      return literatureRef.doc(`${publication.id}`).set(publication)
      })
    }).catch(error => console.log(error));
  }
}
=======
    return userRef.set(data, { merge: true });
 }
}
>>>>>>> ba3ec955853ae3ae3aa5bdfb68208b2f1c3dd60e
