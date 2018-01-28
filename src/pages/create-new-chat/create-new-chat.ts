import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateNewChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-new-chat',
  templateUrl: 'create-new-chat.html',
})
export class CreateNewChatPage {
  terminos:boolean;
  semilla:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.semilla="codigo: "+navParams.get('semilla');
  }

  ionViewDidLoad() {

  }

}
