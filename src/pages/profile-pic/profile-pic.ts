import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/img-handler/img-handler';
import { UserProvider } from '../../providers/user/user';
// import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html',
})
export class ProfilePicPage {
  avatar;
  imgurl = 'https://firebasestorage.googleapis.com/v0/b/mojabaza1-958ea.appspot.com/o/chatterplace.png?alt=media&token=8337737f-428d-4159-9d29-c706a71f4858';
  moveon: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public imgservice: ImghandlerProvider,
    public zone: NgZone,
    public userservice: UserProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public userService: UserProvider, ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProfilepicPage');
  }

  chooseimage() {
    if (this.platform.is('android')) {
      let loader = this.loadingCtrl.create({
        content: 'Prosze czekac'
      })
      loader.present();
      this.imgservice.uploadimage().then((uploadedurl: any) => {
        loader.dismiss();
        this.zone.run(() => {
          this.imgurl = uploadedurl;
          this.moveon = false;
        })
      })
    } else if (this.platform.is('core')) {
      console.log('jestes core destkop  NIE jestes android - editimage');
      let statusalert = this.alertCtrl.create({
        buttons: ['ok']
      });
      let alert = this.alertCtrl.create({
        title: 'Dodaj adres URL avatara',
        inputs: [{
          name: 'avatarURL',
          placeholder: 'avatarURL'
        }],
        buttons: [{
          text: 'Anuluj',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Dodaj',
          handler: data => {
            if (data.avatarURL) {
              this.userService.updateAvatar(data.avatarURL).then((res: any) => {
                if (res.success) {
                  statusalert.setTitle('updated');
                  statusalert.setSubTitle('Twoj avatar zostal zmieniony');
                  statusalert.present();
                  this.zone.run(() => {
                    this.avatar = data.avatarURL;
                  })
                   this.navCtrl.push('TabsPage');
                }

                else {
                  statusalert.setTitle('blad');
                  statusalert.setSubTitle('Twoj avatar nie zostal zmieniony');
                  statusalert.present();
                }
              })
            }
          }
        }]
      });
      alert.present();



     


    }
  }

  updateproceed() {
    let loader = this.loadingCtrl.create({
      content: 'Prosze czekac'
    })
    loader.present();
    this.userservice.updateimage(this.imgurl).then((res: any) => {
      loader.dismiss();
      if (res.success) {
        this.navCtrl.setRoot('TabsPage');
      }
      else {
        alert(res);
      }
    })
  }

  proceed() {
    this.navCtrl.setRoot('TabsPage');
  }

}