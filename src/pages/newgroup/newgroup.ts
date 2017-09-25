import { ImghandlerProvider } from './../../providers/img-handler/img-handler';
import { GroupsProvider } from './../../providers/groups/groups';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html'
})
export class NewgroupPage {
  newGroup = {
    groupName: 'GroupName',
    groupPic:
      'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public groupService: GroupsProvider,
    public imgHangler: ImghandlerProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewgroupPage');
  }

  chooseImage() {
    if (this.newGroup.groupName == 'groupName') {
      let nameAlert = this.alertCtrl.create({
        buttons: ['ok'],
        message: 'Proszę najpierw wprowadz nazwe grupy. Dzieki'
      });
      nameAlert.present();
    } else {
      let loader = this.loadingCtrl.create({
        content: 'Ladowanie, prosze czekac..'
      });
      loader.present();
      this.imgHangler
        .groupPicStore(this.newGroup.groupName)
        .then((res: any) => {
          loader.dismiss();
          if (res) this.newGroup.groupPic = res;
        })
        .catch(err => {
          alert(err);
        });
    }
  }

  createGroup() {
    this.groupService
      .addGroup(this.newGroup)
      .then(() => {
        this.navCtrl.pop();
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  }

  editGroupName() {
    let alert = this.alertCtrl.create({
      title: 'Edycja nazwy grupy',
      inputs: [
        {
          name: 'groupName',
          placeholder: 'Daj nowa nazwe grupy'
        }
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Ustaw',
          handler: data => {
            if (data.groupName) {
              this.newGroup.groupName = data.groupName;
            } else {
              this.newGroup.groupName = 'groupName';
            }
          }
        }
      ]
    });
    alert.present();
  }
}
