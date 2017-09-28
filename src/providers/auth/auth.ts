import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { usercreds } from '../../models/interfaces/usercreds';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {
  authState: Observable<firebase.User>;
  user: firebase.User;

  constructor(private afireauth: AngularFireAuth) {
    this.authState = afireauth.authState;

    this.authState.subscribe(user => {
      this.user = user;
    });
  }

  login(credentials: usercreds) {
    return this.afireauth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
}
