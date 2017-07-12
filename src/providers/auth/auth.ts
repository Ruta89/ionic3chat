import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { usercreds } from '../../models/interfaces/usercreds';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {
  authState: Observable<firebase.User>;
  user: firebase.User;
  
  constructor(public afireauth: AngularFireAuth) {
    this.authState = afireauth.authState;

    this.authState.subscribe(user =>{
      this.user = user;
    })
  }

  /*
      For logging in a particular user. Called from the login.ts file.
    
  */

  login(credentials: usercreds) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })

    return promise;

  }

}