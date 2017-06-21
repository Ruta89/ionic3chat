import { UserProvider } from '../../providers/user/user';

import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {
  email: string;
  constructor(public userService: UserProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordResetPage');
  }

  reset(){
    let alert = this.alertCtrl.create({
      buttons: ['Ok']
    });
    this.userService.passwordReset(this.email).then((res: any) => {
      if (res.success) {
        alert.setTitle('Email wyslany');
        alert.setSubTitle('Podazaj za instrukcjami podanymi w emailu, aby zresetować haslo');
      } else {
        alert.setTitle('Blad');
      }
    })
  }

  goBack() {
    this.navCtrl.setRoot('LoginPage');
  }

}
