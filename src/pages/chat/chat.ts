import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface Post{
  sender:string;
  displaysedner:string;
  message:string;
  hora:string;
  type:string;
  id;
  id_chat?;
}
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  semilla = "";
  name = "";
  message="";
  sender="";
  longmsg="5";
  ActualS="";

  postCol: AngularFirestoreCollection<Post>;
  post: Post[]=[];

  constructor(public user:AngularFireAuth,private db: AngularFirestore, 
    public navCtrl: NavController, public navParams: NavParams) {
      if(this.user.auth.currentUser==null){
        this.navCtrl.setRoot('TabsHomePage');
        return;
      }
      if(navParams.get('semilla') == undefined){
        this.navCtrl.setRoot('TabsHomePage');
        return;
      }      
      this.sender = this.user.auth.currentUser.email;
      this.message="";
      this.semilla = navParams.get('semilla');
      this.name = navParams.get('name');
  }
  
  ngOnInit(){  //a quí se manda el username para consultar los chat
    if(this.semilla){
      this.postCol = this.db.collection('chats').doc(this.semilla).collection("messages");
      this.postCol.snapshotChanges(['added', 'modified']).subscribe( (mesages)=>{
        let newmsgs:any = mesages.map(ms=>{
          let leido = true;
          let user = [];
          user = ms.payload.doc.data().usuarios;
          user.forEach(x=>{
            if(x == this.sender ){
              leido = false;
            }
          });
          //si todas las personas en la lista ya leyeron el mensaje se borra de la nuve
          if(user.length==0){
            //elimino el mensaje
            this.db.collection('chats').doc(this.semilla).collection("messages").doc(ms.payload.doc.id).delete().then(()=>{
            });
          }
            //si ya leeí el mensaje ya no lo vuelvo a guardar
          if(leido){
            return 0;
          }
          let s = {
            sender : ms.payload.doc.data().sender,
            message : ms.payload.doc.data().message,
            type: ms.payload.doc.data().type,
            hora : ms.payload.doc.data().hora,
            displaysedner:ms.payload.doc.data().sender,
            id:ms.payload.doc.id,
            id_chat:ms.payload.doc.data().id_chat
          };
          if(this.ActualS != s.displaysedner){
            this.ActualS=s.displaysedner;
          }else{
            s.displaysedner = "";
          }
          
          //actualiza la lista de personas que leyeron el mensaje
          let us=[];
          user.forEach(x=>{
            if(x!=this.sender){
              us.push(x);
            }
          });
          let batch = this.db.firestore.batch();
          let ref = this.db.collection('chats').doc(this.semilla).collection("messages").doc(s.id).ref;
          batch.update(ref,{
            usuarios:us
          });
          batch.commit().then(()=>{ }).catch(e=>{ 
            console.log(e);
          });

          //aqui debe guardarse una copia local de los mensajes y listo
          /*
          db = this.storage.get(this.semilla);
          //hay que ver si ya existe si ya existe hay que editarlo no solo guardarlo de nuevo
          db.push(s);
          this.storage.set(this.semilla,db);
          return db;
          */
          return s;
        });
        if(newmsgs != 0){
          newmsgs.forEach(y=>{
            let exist = false;
            this.post.map(x=>{
              if(x.hora==y.hora){
                exist=true;
                if(x.message != y.message){
                  x.message = y.message;
                  x.type = "sys";
                }
              }
            });
            if(!exist){
              this.post.push(y);
              //let sc = document.getElementById('scrollArea') as HTMLElement;
              //sc.scrollTop = sc.scrollHeight;
              //sc.scrollTo(0,sc.scrollHeight);
              //id="scrollArea"
            }
          });
        }
      });
    }
  
  }

  sendMessage(){
    if(this.message.length > 0){
      let sender = this.sender;
      let message = this.message;
      this.message="";
      let d = new Date();
      let hora:string = d.getFullYear()+":"+d.getMonth()+":"+d.getDay()+":"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      let type = "msg";
      let conect = this.db.collection('ListaChats').doc("DomChats").collection(this.semilla).snapshotChanges().subscribe(x=>{
        x.map(i=>{
          let usuarios = i.payload.doc.data().usuarios;
          this.db.collection('chats').doc(this.semilla).collection("messages").doc(hora+":"+d.getMilliseconds()).set({ sender, message, hora, type, usuarios}).then(item=>{
            conect.unsubscribe();
          }).catch(e=>{ });
        });
      });
    }
  }

  sendMedia(){
    // se manda la imagen a el servidor y responde con la ruta de copiado la cual se almacena como texto
    // en formato %ruta la cual se imprime en imagen
  }

  mine(it){
    return it.sender == this.sender;
  }

  requestAcept(it){
    let user = it.message.split(", ")[0].substring(7);

    let c = this.db.collection('ListaChats').doc("DomChats").collection(this.semilla).snapshotChanges().subscribe( (mesages)=>{
      let us=[];
      let id;
      mesages.map(s=>{
        id= s.payload.doc.id;
        us = s.payload.doc.data().usuarios;
        us.push(user);
        let batch = this.db.firestore.batch();
        let ref = this.db.collection('ListaChats').doc("DomChats").collection(this.semilla).doc(id).ref;
        batch.update(ref,{
          usuarios:us
        });
        batch.commit().then(()=>{ }).catch(e=>{ 
          console.log(e);
        });
        console.log(id);
      }); 
      this.db.doc('ListaChats/'+user+'/codes/'+it.id_chat).update({ status:1 }).then(()=>{
        //test
        let sender = "system";
        let message = user+" aceptado por "+  this.sender;
        let d = new Date();
        let hora:string = d.getFullYear()+":"+d.getMonth()+":"+d.getDay()+":"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        let type = "sys";
        this.db.collection('chats').doc(this.semilla).collection("messages").doc(hora+":"+d.getMilliseconds()+":sys").set({ sender, message, hora, type, usuarios:us}).then(item=>{
        }).catch(e=>{ });
        //
        this.db.doc('chats/'+this.semilla+"/messages/"+it.id).delete().then(()=>{});
      });
      c.unsubscribe();
    });
    
  }

  requestDecline(it){
    let user = it.message.split(", ")[0].substring(7);
    this.db.doc('ListaChats/'+user+'/codes/'+it.id_chat).delete().then(()=>{
      this.db.doc('chats/'+this.semilla+"/messages/"+it.id).update({
        message: user+" rechazado por "+  this.sender,
        type:"sys"
      }).then(()=>{});
    });;
  }

}
