import { GroupsProvider } from './../../providers/groups/groups';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html'
})
export class GroupchatPage {
  owner: boolean = false;
  groupName;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public groupService: GroupsProvider,
    public actionSheet: ActionSheetController
  ) {
    this.groupName = this.navParams.get('groupName');
    this.groupService
      .getOwnerShip(this.groupName)
      .then(res => {
        if (res) {
          this.owner = true;
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupchatPage');
  }

  presentOwnerSheet() {
    let sheet = this.actionSheet.create({
      title: 'Dzialania grupowe',
      buttons: [
        {
          text: 'Dodaj członka',
          icon: 'person-add',
          handler: () => {
            this.navCtrl.push('GroupbuddiesPage');
          }
        },
        {
          text: 'Usun członka',
          icon: 'remove-circle',
          handler: () => {
            this.navCtrl.push('GroupmembersPage');
          }
        },
        {
          text: 'Info Grupy',
          icon: 'person',
          handler: () => {
            this.navCtrl.push('GroupinfoPage', { groupName: this.groupName });
          }
        },
        {
          text: 'Usun Grupe',
          icon: 'trash',
          handler: () => {
            // this.groupsService.deleteGroup();
          }
        },
        {
          text: 'Anuluj',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Anulowales');
          }
        }
      ]
    });
    sheet.present();
  }

  presentMemberSheet() {
    let sheet = this.actionSheet.create({
      title: 'Dzialania grupowe',
      buttons: [
        {
          text: 'Oposc grupe',
          icon: 'log-out',
          handler: () => {
            //this.groupsService.leaveGroup();
          }
        },
        {
          text: 'Info Grupy',
          icon: 'person',
          handler: () => {
            this.navCtrl.push('GroupinfoPage', { groupName: this.groupName });
          }
        },
        {
          text: 'Anuluj',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Anulowales');
          }
        }
      ]
    });
    sheet.present();
  }
}
