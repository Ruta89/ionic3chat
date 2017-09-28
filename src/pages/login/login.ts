import { AuthProvider } from '../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { usercreds } from '../../models/interfaces/usercreds';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  credentials = {} as usercreds;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl : AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn() {
    this.loading = this.loadingCtrl.create({
      content: 'Logowanie ...'
    });
    this.loading.present();

    this.authService.login(this.credentials).then(data => {
      this.loading.dismiss();
    }),
      error => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: 'Blad logowania',
            message: error.message,
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      };
  }

  passwordReset() {
     this.navCtrl.push('PasswordResetPage');
  }

  signUp() {
    this.navCtrl.push('SignupPage');
  }


}
