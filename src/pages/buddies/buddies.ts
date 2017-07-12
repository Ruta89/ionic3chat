import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RequestsProvider } from './../../providers/requests/requests';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';
import { connreq } from './../../models/interfaces/request';

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  newrequest = {} as connreq;
  temparr = [];
  filteredusers = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserProvider,
    public authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public requestService: RequestsProvider) {
    this.userService.getAllUsers().then((res: any) => {
      this.filteredusers = res;
      this.temparr = res;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
    // console.log('user.uid  ', this.authProvider.user.uid);
  }

  searchuser(searchbar) {
    this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.filteredusers = this.filteredusers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  sendreq(recipient) {
    this.newrequest.sender = this.authProvider.user.uid;
    this.newrequest.recipient = recipient.uid;
    if (this.newrequest.sender == this.newrequest.recipient) {
      return alert('You are your friend always');
    } else {
      let successAlert = this.alertCtrl.create({
        title: 'Request sent',
        subTitle: 'Your request was sent to ' + recipient.displayName,
        buttons: ['ok']
      });

      this.requestService.sendrequest(this.newrequest).then((res: any) => {
        if (res.success) {
          successAlert.present();
          let sentuser = this.filteredusers.indexOf(recipient);
          this.filteredusers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      });


    }
  }

}
