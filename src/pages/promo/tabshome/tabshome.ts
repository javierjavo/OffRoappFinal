import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'tabshome.html'
})
export class TabsHomePage {

  tab1Root = HomePage;
  tab3Root = ContactPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

  }

  ionViewWillEnter(){
    this.storage.get("sesion").then(data=>{
      if(!data)
        this.navCtrl.setRoot(LoginPage);
    });
    //console.log(this.afAuth.authState);
    //if(this.afAuth.auth.currentUser.email!=null)
    //  this.navCtrl.setRoot('TabsHomePage');
  }

}
