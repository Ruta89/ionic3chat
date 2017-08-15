import { ChatProvider } from './../../providers/chat/chat';
import { RequestsProvider } from './../../providers/requests/requests';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  myRequests;
  myFriends;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public requestService: RequestsProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public chatService: ChatProvider) {
  }

  ionViewWillEnter() {
    this.requestService.getMyRequest();
    this.requestService.getMyFriends();
    this.myFriends = [];

    this.events.subscribe('gotrequests', () => {
      this.myRequests = [];
      this.myRequests = this.requestService.userDetails;
    })
    this.events.subscribe('friends', () => {
      this.myFriends = [];
      this.myFriends = this.requestService.myFriends;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }
  accept(item) {
    this.requestService.acceptRequest(item)
      .then(() => {
        let newalert = this.alertCtrl.create({
          title: 'Przyjaciel dodany',
          subTitle: 'Nacisnij na przyjaciela aby wejsc z nim w czat',
          buttons: ['ok']
        });
        newalert.present();
      }).catch((err) => {
        alert(err)
      })
  }

  ignore(item) {
    console.log('Ignorujesz  ', item.displayName);
    this.requestService.deleteRequest(item)
      .then(() => {
        alert('Ignorujesz  ' + item.displayName)
      }).catch((err) => {
        alert(err)
      })
  }

  buddyChat(buddy) {
    this.chatService.initializebuddy(buddy);
    this.navCtrl.push('BuddyChatPage');
  }

}
