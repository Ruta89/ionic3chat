import { AuthProvider } from './../auth/auth';
import { Events } from 'ionic-angular';
import { UserProvider } from './../user/user';
import { connreq } from './../../models/interfaces/request';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  userDetails;
  constructor(public userService: UserProvider,
    public events: Events,
    public authService: AuthProvider) {
    console.log('Hello RequestsProvider Provider');
  //   console.log('firebase.auth().currentUser.uid  ', firebase.auth().currentUser.uid);
  //   console.log('this.authService.user.uid', this.authService.user.uid);
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
      }).catch((err) =>{
        console.log('getAllUsers() err:', err );
      })
    })
  }

}
