import { RequestsProvider } from './../../providers/requests/requests';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myRequests;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public requestService: RequestsProvider,
    public events: Events) {
  }

  ionViewWillEnter() {
    this.requestService.getMyRequest();
    this.events.subscribe('gotrequests', () => {
      this.myRequests = [];
      this.myRequests = this.requestService.userDetails;
      //  console.log('his.events.subscribe(gotRequests this.requestService.userDetails  ', this.requestService.userDetails);
    })
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave  this.events.unsubscribe( gotrequests );  ', this.requestService.userDetails);
    this.events.unsubscribe('gotrequests');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }
  accept(item){
    console.log('Zaakceptowales: ', item.displayName);
  }

  ignore(item){
    console.log('Ignorujesz  ', item.displayName);
    alert('Ignorujesz  ' + item.displayName)
  }

}
