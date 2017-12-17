import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  MSGS: detalles con la mensajeria en db local
*/ 

interface Icodes{
  semilla:string;
  msgs:number;
  id:string;
}

interface Ichats{
  semilla:string;
  url:string;
  name:string;
  msgs:number;
  id:string;
}

@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  codeschatcolection:AngularFirestoreCollection<Icodes>;
  codeschats:Icodes[];
  commitsussess:boolean = false;
  
  lichatcolection:AngularFirestoreCollection<Ichats>;
  lichats:Ichats[]=[];

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, 
    public navCtrl: NavController, public navParams: NavParams,private alertc: AlertController) {

  }

  showmsg(i:Ichats){
    return (i.msgs>0);
  }
  //inicializacion de componentes y demas elementos
  ionViewDidLoad(){
    this.reloadChangesChat();
    /* MSGS
    hay que actualizar la db local aqui, guardando los codigos de chat y poniendo los eventos
    de escucha en el app component ya que ahí mantendra de manera glogal en control de si ya leyo o no
    los mensajes entrantes
    */
  }

  reloadChangesChat(){
    this.codeschatcolection = this.db.collection('ListaChats').doc(this.afAuth.auth.currentUser.email).collection("codes");
    this.codeschatcolection.snapshotChanges().subscribe(chatList => {
      this.lichats = [];
      this.codeschats = chatList.map(item=>{
        return {
          semilla:item.payload.doc.data().semilla,
          msgs:item.payload.doc.data().msgs,
          id:item.payload.doc.ref.id,
        }
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
              msgs: -1,// MSGS aqui se recupera la lista de la db local de los mensajes leidos o no
              id: item.id
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
        messageadvisor.snapshotChanges().subscribe(s=>{
          if(this.commitsussess){
            //this.commitsussess = false;
            //return;
          }
          //let batch = this.db.firestore.batch();
          this.lichats.forEach(x=>{
            if(x.semilla == item.semilla){
              x.msgs = x.msgs+1;
              //let ref = this.db.doc('ListaChats/'+this.afAuth.auth.currentUser.email+"/codes/"+x.id).ref;
              //batch.update(ref,{msgs:x.msgs+1});  
            }
          });
        });
      });
    });
  }

  addChat(){
    //aqui se registra el chat en tu lista de chats usando la semilla
    //step 0 crear id y verificar disponibilidad
    let val = Math.round(Math.random()*(99999 - 10000)+1);
    let lpos = val.toString().split("");
    let name = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+<>@$%&/()123456789".split("");
    let lval:string[]=[];
    lpos.forEach(x=>{
      let p = parseInt(x);
      lval.push(name[p]);
    });
    
    let codigo:string="";
    for(let i=0;i<lpos.length ;i++){
      codigo+=lpos[i]+lval[i];
    }
    this.alertc.create({
      title: codigo,
      subTitle: "Share your code",
      buttons: ['Dismiss']
    }).present();

    //step 1 añadir a la lista dom general
    //step 2 añadir a la lista de el usuario
    //step 3 crear el chat con el mensaje inicial
  }

  Share(item){
    //alert respondiendo la semilla del chat y opciones para compartir
    this.alertc.create({
      title: "code: "+item.semilla,
      subTitle: 'Share your Group code whith your friends and lets roll',
      buttons: ['Dismiss']
    }).present();
  }

  Mute(){
    //alert preguntando por cuanto tiempo
  }

  Delete(item){
    //elimina de firestore en la referencia listachats/"USER_NAME"/"SEMILLA"
    this.db.doc('ListaChats/'+this.afAuth.auth.currentUser.email+"/codes/"+item.id).delete().then(()=>{
      console.log("todo okis");
    });
  }

  go_chat(item){
    this.lichats.forEach(x=>{
      if(x.semilla == item.semilla){
        x.msgs = 0;
        //MSGS aqui borramos la info de los mensajes de la db local
        //let ref = this.db.doc('ListaChats/'+this.afAuth.auth.currentUser.email+"/codes/"+x.id).ref;
        //this.db.firestore.batch().update(ref,{msgs:x.msgs}).commit().then(()=>{
        //  this.commitsussess = true;
        //});
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
