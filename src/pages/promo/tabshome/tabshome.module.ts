import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsHomePage } from './tabshome';

@NgModule({
  declarations: [
    TabsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(TabsHomePage),
  ],
})
export class RegisterPageModule {}