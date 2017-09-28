import { GroupsProvider } from './../../providers/groups/groups';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html'
})
export class GroupinfoPage {
  groupMembers;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupService: GroupsProvider,
    public events: Events
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupinfoPage');
    this.groupService
      .getOwnerShip(this.groupService.currentGroupName)
      .then(res => {
        if (res) this.groupMembers = this.groupService.currentGroup;
        else {
          this.groupService.getGroupMembers();
        }
      });

    this.events.subscribe('gotMembers', () => {
      this.groupMembers = this.groupService.currentGroup;
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('gotMembers');
  }
}
