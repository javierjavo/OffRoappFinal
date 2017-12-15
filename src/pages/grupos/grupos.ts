import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  MSGS: detalles con la mensajeria en db local
*/ 

interface Icodes{
  semilla:string;
}

interface Ichats{
  semilla:string;
  url:string;
  name:string;
  msgs:number;
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

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, 
    public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad(){ //obtengo los chats de cada persona pero los debe consultar de otra parte en consulta estatica
    this.reloadChangesChat();
    /* MSGS
    hay que actualizar la db local aqui, guardando los codigos de chat y poniendo los eventos
    de escucha en el app component ya que ahí mantendra de manera glogal en control de si ya leyo o no
    los mensajes entrantes*/
  }

  reloadChangesChat(){
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
              name:li_item.payload.doc.data().name,
              msgs:-1 // MSGS aqui se recupera la lista de la db local de los mensajes leidos o no
            }
            return auxli;
            //this.lichats.push(auxli);
          }));
          //console.log(it);
          
          it.forEach(y=>{
            this.lichats.forEach(x=>{
              if(x.semilla == y.semilla){
                y.msgs = x.msgs;// MSGS la asignacion es en tiempo de ejecucion pero tiene que ser local tambien
                this.lichats.splice(this.lichats.indexOf(x),1);
              }
            });
            this.lichats.push(y);
          });
        });
        let messageadvisor:AngularFirestoreCollection<any> = this.db.collection('chats').doc(item.semilla).collection("messages");
        messageadvisor.snapshotChanges(['added']).subscribe(messageadvisor=>{
          this.lichats.forEach(x=>{
            if(x.semilla == item.semilla){
              x.msgs = x.msgs+1;
            }
          });
        });
      });
    });
  }

  addChat(){
    //aqui se registra el chat en tu lista de chats usando la semilla
  }

  go_chat(item){
    this.lichats.forEach(x=>{
      if(x.semilla == item.semilla){
        x.msgs = 0;
        //MSGS aqui borramos la info de los mensajes de la db local
      }
    });
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
