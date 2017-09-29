import { GroupsProvider } from './../../providers/groups/groups';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-groupmembers',
  templateUrl: 'groupmembers.html'
})
export class GroupmembersPage {
  groupMembers;
  tempGroupMembers;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupService: GroupsProvider,
    public events: Events
  ) {}

  ionViewWillEnter() {
    this.groupMembers = this.groupService.currentGroup;
    this.tempGroupMembers = this.groupMembers;
    this.events.subscribe('gotIntoGroup', () => {
      this.groupMembers = this.groupService.currentGroup;
      this.tempGroupMembers = this.groupMembers;
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('gotIntoGroups'); // W tutorialu jest 'gotIntoGroups'
  }

  searchUser(searchbar) {
    let tempMembers = this.tempGroupMembers;

    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.groupMembers = this.tempGroupMembers;
      return;
    }

    tempMembers = tempMembers.filter(v => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    });

    this.groupMembers = tempMembers;
  }

  removeMember(member) {
    this.groupService.deleteMember(member);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupmembersPage');
  }
}
