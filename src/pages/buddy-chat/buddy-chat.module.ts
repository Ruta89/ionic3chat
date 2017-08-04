import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuddyChatPage } from './buddy-chat';

@NgModule({
  declarations: [
    BuddyChatPage,
  ],
  imports: [
    IonicPageModule.forChild(BuddyChatPage),
  ],
})
export class BuddyChatPageModule {}
