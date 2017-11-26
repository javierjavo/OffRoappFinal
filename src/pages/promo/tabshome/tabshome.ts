import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'tabshome.html'
})
export class TabsHomePage {

  tab1Root = HomePage;
  tab3Root = ContactPage;

  constructor() {

  }
}
