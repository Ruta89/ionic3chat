import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class GroupsProvider {
  fireGroup = firebase.database().ref('/groups');
  myGroups: Array<any> = [];
  currentGroup: Array<any> = [];

  constructor(public events: Events) {
    console.log('Hello GroupsProvider Provider');
  }

  addGroup(newGroup) {
    var promise = new Promise((resolve, reject) => {
      this.fireGroup
        .child(firebase.auth().currentUser.uid)
        .child(newGroup.groupName)
        .set({
          groupImage: newGroup.groupPic,
          msgboard: '',
          owner: firebase.auth().currentUser.uid
        })
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }

  getMyGroups() {
    this.fireGroup
      .child(firebase.auth().currentUser.uid)
      .once('value', snapshot => {
        this.myGroups = [];
        if (snapshot.val() != null) {
          var temp = snapshot.val();
          for (var key in temp) {
            var newGroup = {
              groupName: key,
              groupImage: temp[key].groupImage
            };
            this.myGroups.push(newGroup);
          }
        }
        this.events.publish('allMyGroups');
      });
  }

  getIntoGroup(groupName) {
    if (groupName != null) {
      this.fireGroup
        .child(firebase.auth().currentUser.uid)
        .child(groupName)
        .once('value', snapshot => {
          if (snapshot.val() != null) {
            var temp = snapshot.val().members;
            this.currentGroup = [];
            for (var key in temp) {
              this.currentGroup.push(temp[key]);
            }
          }
        });
    }
  }

  getOwnerShip(groupName) {
    var promise = new Promise((resolve, reject) => {
      this.fireGroup
        .child(firebase.auth().currentUser.uid)
        .child(groupName)
        .once('value', snapshot => {
          var temp = snapshot.val().owner;
          if (temp == firebase.auth().currentUser.uid) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    return promise;
  }
}
