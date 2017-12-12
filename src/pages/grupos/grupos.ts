import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the GruposPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Ichats{
  semilla:string;
  url:string;
  name:string;
  hora:string;
}

@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  postCol: AngularFirestoreCollection<Ichats>;
  chats:Observable<Ichats[]>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {

  }

  ngOnInit(){                                   //a quí se manda el username para consultar los chat
    this.postCol = this.db.collection('ListaChats').doc("javierjavo@live.com.mx").collection("codes");
    this.chats = this.postCol.valueChanges();
  }

  addChat(){
    //aqui se registra el chat en tu lista de chats usando la semilla
  }

  go_chat(item){
    this.navCtrl.push('ChatPage',{semilla:item.semilla,name:item.name});
  }

  zoom(item){
    let fondo = document.getElementById("image_zoom");
    let image = document.getElementById("ima_zoom") as HTMLImageElement;
    let name = document.getElementById("displayName") as HTMLImageElement;
    fondo.style.visibility = "visible";
    image.src = item.url;
    name.innerText = item.name;
  }
  
  zoom_out(){
    let fondo = document.getElementById("image_zoom");
    let image = document.getElementById("ima_zoom") as HTMLImageElement;
    let name = document.getElementById("displayName") as HTMLImageElement;
    fondo.style.visibility = "hidden";
    image.src = "";
    name.innerText = "";
  }

}
