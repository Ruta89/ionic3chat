import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class GroupsProvider {
  fireGroup = firebase.database().ref('/groups');
  myGroups: Array<any> = [];
  currentGroup: Array<any> = [];
  currentGroupName;
  groupPic;

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
        .once('value', (snapshot) => {
          if (snapshot.val() != null) {
            var temp = snapshot.val().members;
            this.currentGroup = [];
            for (var key in temp) {
              this.currentGroup.push(temp[key]);
            }
            this.currentGroupName = groupName;
            this.events.publish('gotIntoGroup');
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

  getGroupImage() {
    return new Promise((resolve, reject) => {
      this.fireGroup
        .child(firebase.auth().currentUser.uid)
        .child(this.currentGroupName)
        .once('value', (snapshot) => {
          this.groupPic = snapshot.val().groupImage;
          resolve(true);
        });
    });
  }

  addMember(newMember) {
    this.fireGroup
      .child(firebase.auth().currentUser.uid)
      .child(this.currentGroupName)
      .child('members')
      .push(newMember)
      .then(() => {
        this.getGroupImage().then(() => {
          this.fireGroup
            .child(newMember.uid)
            .child(this.currentGroupName)
            .set({
              groupImage: this.groupPic,
              owner: firebase.auth().currentUser.uid,
              msgboard: ''
            })
            .catch(err => {
              console.log(err);
            });
        });
        this.getIntoGroup(this.currentGroupName);
      });
  }
}
