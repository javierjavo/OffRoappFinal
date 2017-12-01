import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

/**
 * Generated class for the GruposPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.mchat();
  }

  go_chat(txt){
    this.navCtrl.setRoot('ChatPage',{semilla:txt});
  }


  mchat() {
    
  }
  

}
