import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  temparr = [];
  filteredusers = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserProvider) {
                this.userService.getAllUsers().then((res: any) =>{
                  this.filteredusers = res;
                  this.temparr = res;
                })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }

  searchuser(searchbar){
    this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == ''){
      return;
    }
    this.filteredusers = this.filteredusers.filter((v) =>{
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

}
