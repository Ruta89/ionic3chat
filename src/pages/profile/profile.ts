import { Component, NgZone } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/img-handler/img-handler';
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  avatar: string;
  displayName: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userService: UserProvider,
    public imghandler: ImghandlerProvider,
    public zone: NgZone) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.loaduserservice();
  }
  loaduserservice() {
    this.userService.getuserdetails().then((res: any) => {
      this.displayName = res.displayName;
      this.zone.run(() => {
        this.avatar = res.photoURL;
      })
    })
  }

  editimage() {
    console.log('editimage');
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    this.imghandler.uploadimage().then((url: any) => {
      this.userService.updateimage(url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Uaktualniono');
          statusalert.setSubTitle('Twoje profilowe zdjecie zostalo zmienione');
          statusalert.present();
          this.zone.run(() => {
            this.avatar = url;
          })
        }
      }).catch((err) => {
        statusalert.setTitle('Failed');
        statusalert.setSubTitle('Your profile pic was not changed');
        statusalert.present();
      })
    })
  }

  editname() {
    console.log('editname');
    let statusalert = this.alertCtrl.create({
      buttons: ['ok']
    });
    let alert = this.alertCtrl.create({
      title: 'Edytuj Nick',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Anuluj',
        role: 'cancel',
        handler: data => {

        }
      },
      {
        text: 'Edycja',
        handler: data => {
          if (data.nickname) {
            this.userService.updatedisplayname(data.nickname).then((res: any) => {
              if (res.success) {
                statusalert.setTitle('updated');
                statusalert.setSubTitle('Twoj nick zostal zmieniony');
                statusalert.present();
                this.zone.run(() => {
                  this.displayName = data.nickname;
                })
              }

              else {
                statusalert.setTitle('blsd');
                statusalert.setSubTitle('Twoj nick nie zostal zmieniony');
                statusalert.present();
              }
            })
          }
        }
      }]
    });
    alert.present();
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.parent.parent.setRoot('LoginPage');
    })
  }

}
