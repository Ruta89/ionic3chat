import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/buddychat');
  buddy: any;
  buddyMessages = [];
  constructor(public events: Events) {
    console.log('Hello ChatProvider Provider');
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  addNewMessage(msg) {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        this.firebuddychats
          .child(firebase.auth().currentUser.uid)
          .child(this.buddy.uid)
          .push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
          .then(() => {
            this.firebuddychats
              .child(this.buddy.uid)
              .child(firebase.auth().currentUser.uid)
              .push({
                sentby: firebase.auth().currentUser.uid,
                message: msg,
                timestamp: firebase.database.ServerValue.TIMESTAMP
              })
              .then(() => {
                resolve(true);
              })
              .catch(err => {
                reject(err);
              });
          });
      });
      return promise;
    }
  }

  getBuddyMessages() {
    let temp;
    this.firebuddychats
      .child(firebase.auth().currentUser.uid)
      .child(this.buddy.uid)
      .on('value', snapshot => {
        this.buddyMessages = [];
        temp = snapshot.val();
        for (var tempKey in temp) {
          this.buddyMessages.push(temp[tempKey]);
        }
        this.events.publish('newMessage');
      });
  }
}
