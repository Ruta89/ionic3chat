import { ImghandlerProvider } from './../../providers/img-handler/img-handler';
import { ChatProvider } from './../../providers/chat/chat';
import { Component, ViewChild, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  Content,
  LoadingController
} from 'ionic-angular';
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-buddy-chat',
  templateUrl: 'buddy-chat.html'
})
export class BuddyChatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newMessage;
  allMessages = [];
  photoURL;
  imgornot;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatService: ChatProvider,
    public events: Events,
    public zone: NgZone,
    public loadingCtrl: LoadingController,
    public imgStore: ImghandlerProvider
  ) {
    this.buddy = this.chatService.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollTo();
    this.events.subscribe('newMessage', () => {
      this.allMessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allMessages = this.chatService.buddyMessages;
        for (var key in this.allMessages) {
          if (this.allMessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else this.imgornot.push(false);
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddyChatPage');
  }

  ionViewDidEnter() {
    this.chatService.getBuddyMessages();
  }

  addMessage() {
    this.chatService.addNewMessage(this.newMessage).then(() => {
      this.content.scrollToBottom();
      this.newMessage = '';
    });
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let loader = this.loadingCtrl.create({
      content: 'Proszę czekac'
    });
    loader.present();
    this.imgStore
      .picmsgstore()
      .then(imgUrl => {
        loader.dismiss();
        this.chatService.addNewMessage(imgUrl).then(() => {
          this.scrollTo();
          this.newMessage = '';
        });
      })
      .catch(err => {
        alert(err);
        loader.dismiss();
      });
  }
}
