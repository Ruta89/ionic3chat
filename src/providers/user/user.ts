import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/chatusers');
  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello UserProvider Provider');
  }

  addUser(newUser) {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(() => {
          this.afAuth.auth.currentUser.updateProfile({
            displayName: newUser.displayName,
            photoURL: ''
          }).then(() => {
            this.firedata.child(this.afAuth.auth.currentUser.uid)
              .set({
                uid: this.afAuth.auth.currentUser.uid,
                displayName: newUser.displayName,
                photoURL: 'give a dummy placeholder url here'
              }).then(() => {
                resolve({ success: true });
              }).catch((err) => {
                reject(err);
              })
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
    })
    return promise;
  }

}
