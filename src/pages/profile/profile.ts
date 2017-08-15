import { Component, NgZone } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/img-handler/img-handler';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  avatar: string;
  displayName: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userService: UserProvider,
    public imghandler: ImghandlerProvider,
    public zone: NgZone,
    public platform: Platform
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
    this.loaduserservice();
  }
  loaduserservice() {
    this.userService.getuserdetails().then((res: any) => {
      this.displayName = res.displayName;
      this.zone.run(() => {
        this.avatar = res.photoURL;
      });
    });
  }

  editimage() {
    if (this.platform.is('android')) {
      console.log('jestes android editimage()');
      let statusalert = this.alertCtrl.create({
        buttons: ['OK']
      });
      this.imghandler.uploadimage().then((url: any) => {
        this.userService
          .updateimage(url)
          .then((res: any) => {
            if (res.success) {
              statusalert.setTitle('Uaktualniono');
              statusalert.setSubTitle(
                'Twoje profilowe zdjecie zostalo zmienione'
              );
              statusalert.present();
              this.zone.run(() => {
                this.avatar = url;
              });
            }
          })
          .catch(err => {
            statusalert.setTitle('Blad');
            statusalert.setSubTitle(
              'Twoje profilowe zdjecie nie zostalo zmienione'
            );
            statusalert.present();
          });
      });
    } else if (this.platform.is('core')) {
      console.log('jestes core destkop  NIE jestes android - editimage');
      let statusalert = this.alertCtrl.create({
        buttons: ['ok']
      });
      let alert = this.alertCtrl.create({
        title: 'Dodaj adres URL avatara',
        inputs: [
          {
            name: 'avatarURL',
            placeholder: 'Adres do avatara http://www...'
          }
        ],
        buttons: [
          {
            text: 'Anuluj',
            role: 'cancel',
            handler: data => {}
          },
          {
            text: 'Dodaj',
            handler: data => {
              if (data.avatarURL) {
                this.userService
                  .updateAvatar(data.avatarURL)
                  .then((res: any) => {
                    if (res.success) {
                      statusalert.setTitle('Uaktualniono');
                      statusalert.setSubTitle('Twoj avatar zostal zmieniony');
                      statusalert.present();
                      this.zone.run(() => {
                        this.avatar = data.avatarURL;
                      });
                    } else {
                      statusalert.setTitle('blad');
                      statusalert.setSubTitle(
                        'Twoj avatar nie zostal zmieniony'
                      );
                      statusalert.present();
                    }
                  });
              }
            }
          }
        ]
      });
      alert.present();
    }
  }

  editname() {
    console.log('editname()');
    let statusalert = this.alertCtrl.create({
      buttons: ['OK']
    });
    let alert = this.alertCtrl.create({
      title: 'Edytuj nazwe',
      inputs: [
        {
          name: 'nickname',
          placeholder: 'Nazwa'
        }
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Edycja',
          handler: data => {
            if (data.nickname) {
              this.userService
                .updatedisplayname(data.nickname)
                .then((res: any) => {
                  if (res.success) {
                    statusalert.setTitle('uaktualniono');
                    statusalert.setSubTitle('Twoj nick zostal zmieniony');
                    statusalert.present();
                    this.zone.run(() => {
                      this.displayName = data.nickname;
                    });
                  } else {
                    statusalert.setTitle('blad');
                    statusalert.setSubTitle('Twoj nick nie zostal zmieniony');
                    statusalert.present();
                  }
                });
            }
          }
        }
      ]
    });
    alert.present();
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('Wylogowano');
      })
      .catch(err => {
        console.log('Blad wylogowywania', err);
      });
  }
}
