import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  LoadingController
} from 'ionic-angular';
import { GroupsProvider } from './../../providers/groups/groups';
@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {
  allMyGroups;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public events: Events,
    public groupService: GroupsProvider
  ) {}

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Pobieranie grup, czekaj ...'
    });
    loader.present();
    this.groupService.getMyGroups();
    loader.dismiss();
    this.events.subscribe('allMyGroups', () => {
      this.allMyGroups = this.groupService.myGroups;
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('allMyGroups');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

  addGroup() {
    this.navCtrl.push('NewgroupPage');
  }

  openChat(group) {
    this.groupService.getIntoGroup(group.groupName);
    this.navCtrl.push('GroupchatPage', { groupName: group.groupName });
  }
}
