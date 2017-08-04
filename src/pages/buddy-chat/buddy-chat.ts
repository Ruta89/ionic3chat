import { ChatProvider } from './../../providers/chat/chat';
import { Component, ViewChild, NgZone } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  Content
} from 'ionic-angular';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-buddy-chat',
  templateUrl: 'buddy-chat.html'
})
export class BuddyChatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  message;
  newMessage;
  allMessages = [];
  photoURL;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatService: ChatProvider,
    public events: Events,
    public zone: NgZone
  ) {
    this.buddy = this.chatService.buddy;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollTo();
    this.events.subscribe('newMessage', () => {
      this.allMessages = [];
      this.zone.run(() => {
        this.allMessages = this.chatService.buddyMessages;
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
}
