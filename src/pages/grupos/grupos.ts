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

  chats: Array<any> = [
    {
      semilla: "1010",
      url:"../../assets/imgs/pick.jpg",
      name:"prueba1",
      hora:"nunca"
    },
    {
      semilla: "1011",
      url:"../../assets/imgs/pick1.jpg",
      name:"prueba2",
      hora:"nunca"
    },
    {
      semilla: "1012",
      url:"../../assets/imgs/pick4.jpg",
      name:"prueba3",
      hora:"nunca"
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {


  }

  go_chat(item){
    this.navCtrl.setRoot('ChatPage',{semilla:item.semilla});
  }


  zoom(item){
    let fondo = document.getElementById("image_zoom");
    let image = document.getElementById("ima_zoom") as HTMLImageElement;
    fondo.style.visibility = "visible";
    image.src = item.url;
  }
  
  zoom_out(){
    let fondo = document.getElementById("image_zoom");
    let image = document.getElementById("ima_zoom") as HTMLImageElement;
    fondo.style.visibility = "hidden";
    image.src = "";
  }

}
