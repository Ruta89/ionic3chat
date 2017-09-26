import { GroupsProvider } from './../../providers/groups/groups';
import { RequestsProvider } from './../../providers/requests/requests';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-groupbuddies',
  templateUrl: 'groupbuddies.html'
})
export class GroupbuddiesPage {
  myFriends = [];
  groupMembers = [];
  searchString;
  tempMyFriends = [];
  newBuddy;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public requestService: RequestsProvider,
    public events: Events,
    public groupService: GroupsProvider
  ) {}

  ionViewWillEnter() {
    this.requestService.getMyFriends();
    this.events.subscribe('gotIntoGroup', () => {
      this.myFriends.splice(this.myFriends.indexOf(this.newBuddy.uid), 1);
      this.tempMyFriends = this.myFriends;
    });
    this.events.subscribe('friends', () => {
      this.myFriends = [];
      this.myFriends = this.requestService.myFriends;
      this.groupMembers = this.groupService.currentGroup;
      for (var key in this.groupMembers)
        for (var friend in this.myFriends) {
          if (this.groupMembers[key].uid === this.myFriends[friend].uid)
            this.myFriends.splice(
              this.myFriends.indexOf(this.myFriends[friend]),
              1
            );
        }
      this.tempMyFriends = this.myFriends;
    });
  }

  searchUser(searchbar) {
    let tempFriends = this.tempMyFriends;

    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.myFriends = this.tempMyFriends;
      return;
    }

    tempFriends = tempFriends.filter(v => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });

    this.myFriends = tempFriends;
  }

  addBuddy(buddy) {
    this.newBuddy = buddy;
    this.groupService.addMember(buddy);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupbuddiesPage');
  }
}
