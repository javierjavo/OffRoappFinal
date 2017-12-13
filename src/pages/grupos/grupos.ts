import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';


interface Icodes{
  semilla:string;
}

interface Ichats{
  semilla:string;
  url:string;
  name:string;
}

@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  codeschatcolection:AngularFirestoreCollection<Icodes>;
  codeschats:Icodes[];
  
  lichatcolection:AngularFirestoreCollection<Ichats>;
  lichats:Ichats[]=[];

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidEnter(){ //obtengo los chats de cada persona pero los debe consultar de otra parte en consulta estatica
    this.codeschatcolection = this.db.collection('ListaChats').doc(this.afAuth.auth.currentUser.email).collection("codes");
    this.codeschatcolection.snapshotChanges().subscribe(chatList => {
      this.lichats = [];
      this.codeschats = chatList.map(item=>{
        return {semilla:item.payload.doc.data().semilla,}
      });
      //console.log(this.codeschats );
      this.codeschats.forEach(item=>{
        this.lichats = [];
        this.lichatcolection = this.db.collection('ListaChats').doc("DomChats").collection(item.semilla);
        this.lichatcolection.snapshotChanges().subscribe(itemchat => {
          let it:Ichats[] = (itemchat.map(li_item=>{
            let auxli:Ichats={
              semilla:li_item.payload.doc.data().semilla,
              url:li_item.payload.doc.data().url,
              name:li_item.payload.doc.data().name
            }
            return auxli;
            //this.lichats.push(auxli);
          }));
          //console.log(it);
          /*falta revicion si el item ya lo contiene 
          (usando la semilla como id) eliminar el anterior y agregar el nuevo para evitar
          el bug de doble chat cuando se actualiza*/
          this.lichats = it.concat(this.lichats);
        });
        
      });
    });
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
