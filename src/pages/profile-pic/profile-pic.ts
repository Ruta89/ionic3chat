import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/img-handler/img-handler';
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase/app';
import 'firebase/storage';
@IonicPage()
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html',
})
export class ProfilePicPage {
  imgurl = 'https://firebasestorage.googleapis.com/v0/b/mojabaza1-958ea.appspot.com/o/chatterplace.png?alt=media&token=8337737f-428d-4159-9d29-c706a71f4858';
  moveon: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public imgservice: ImghandlerProvider,
    public zone: NgZone,
    public userservice: UserProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProfilepicPage');
  }

  chooseimage() {
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