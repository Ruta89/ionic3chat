import { AuthProvider } from './../auth/auth';
import { Events } from 'ionic-angular';
import { UserProvider } from './../user/user';
import { connreq } from './../../models/interfaces/request';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  fireFriends = firebase.database().ref('/friends');

  userDetails;
  myFriends;
  constructor(public userService: UserProvider,
    public events: Events,
    public authService: AuthProvider) {
    console.log('Hello RequestsProvider Provider');
  }

  sendrequest(req: connreq) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(req.recipient).push({
        sender: req.sender
      }).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getMyRequest() {
    let allMyRequests;
    var myRequests = [];
    this.firereq.child(this.authService.user.uid).on('value', (snapshot) => {
      allMyRequests = snapshot.val();
      myRequests = [];
      for (var i in allMyRequests) {
        myRequests.push(allMyRequests[i].sender);
      }
      this.userService.getAllUsers().then((res) => {
        var allUsers = res;
        this.userDetails = [];
        for (var j in myRequests) {
          for (var key in allUsers) {
            if (myRequests[j] === allUsers[key].uid) {
              this.userDetails.push(allUsers[key]);
            }
          }
        }
        this.events.publish('gotrequests');
      }).catch((err) => {
        console.log('getAllUsers() err:', err);
      })
    })
  }

  acceptRequest(buddy) {
    var myFriends = [];
    var promise = new Promise((resolve, reject) => {
      this.fireFriends.child(firebase.auth().currentUser.uid).push({
        uid: buddy.uid
      }).then(() => {
        this.fireFriends.child(buddy.uid).push({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.deleteRequest(buddy)
            .then(() => {
              resolve(true);
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

  deleteRequest(buddy) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
        let someKey;
        for (var key in snapshot.val())
          someKey = key;
        this.firereq.child(firebase.auth().currentUser.uid).child(someKey).remove()
          .then(() => {
            resolve(true);
          })
      }).then(() => {
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getMyFriends() {
    let friendsUid = [];
    this.fireFriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allFriends = snapshot.val();
      this.myFriends = [];
      for (var i in allFriends)
        friendsUid.push(allFriends[i].uid);

      this.userService.getAllUsers().then((users) => {
        this.myFriends = [];
        for (var j in friendsUid)
          for (var key in users) {
            if (friendsUid[j] === users[key].uid) {
              this.myFriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      })
    })
  }

}
