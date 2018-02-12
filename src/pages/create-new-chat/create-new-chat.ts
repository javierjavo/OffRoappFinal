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
  private semilla:string;
  public terminos:boolean;
  public pic: any;
  public nombre:string;
  public codigo:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.semilla = navParams.get('semilla');
    this.codigo="";
    this.nombre="";
  }

  ionViewDidLoad() {

  }
  validate(){
    if(this.semilla == this.codigo && this.terminos && this.nombre.length>0){
      
      alert("validando");
    }else{
      
      alert("nel");
    }
    
  }
}
