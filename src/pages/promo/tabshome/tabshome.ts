import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'tabshome.html'
})
export class TabsHomePage {

  tab1Root = HomePage;
  tab3Root = ContactPage;

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, private toast: ToastController, public navParams: NavParams) {

  }
  
}
