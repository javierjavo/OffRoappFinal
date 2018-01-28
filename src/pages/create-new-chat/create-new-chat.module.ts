import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateNewChatPage } from './create-new-chat';

@NgModule({
  declarations: [
    CreateNewChatPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateNewChatPage),
  ],
})
export class CreateNewChatPageModule {}
