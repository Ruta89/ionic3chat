import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserProvider } from "../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  newUser = {
    email: '',
    password: '',
    displayName: ''
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public userService: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signUp() {
    var toaster = this.toastCtrl.create({
      duration: 3000,
      position: 'bottom'
    });
    if (this.newUser.email == '' || this.newUser.password == '' || this.newUser.displayName == '') {
      toaster.setMessage('Wszystkie pola sa wymagane');
      toaster.present();
    } else if (this.newUser.password.length < 6) {
      toaster.setMessage('haslo musi posiadac przynajmniej 6 znakow');
      toaster.present();
    } else {
      let loader = this.loadingCtrl.create({
        content: 'Prosze czekac'
      });
      loader.present();
      this.userService.addUser(this.newUser).then((res: any) => {
        loader.dismiss();
        if (res.success) {
          this.navCtrl.push('ProfilePicPage');
        } else {
          alert('Error' + res);
        }
      })
    }
  }

  goBack() {
    this.navCtrl.setRoot('LoginPage');
  }

}
