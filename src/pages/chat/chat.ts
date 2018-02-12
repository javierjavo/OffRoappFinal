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
      if(this.user.auth.currentUser==null)
        this.navCtrl.setRoot('LoginPage');
      if(navParams.get('semilla') == undefined)
        this.navCtrl.setRoot('TabsHomePage');
      this.sender = this.user.auth.currentUser.email;
      this.message="";
      this.semilla = navParams.get('semilla');
      this.name = navParams.get('name');
  }
  
  ngOnInit(){  //a quí se manda el username para consultar los chat
    if(this.semilla){
      this.postCol = this.db.collection('chats').doc(this.semilla).collection("messages");
      this.postCol.snapshotChanges(['added', 'modified']).subscribe( (mesages)=>{
        let newmsgs = mesages.map(ms=>{
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
          return s;
        });
      
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
      this.db.collection('chats').doc(this.semilla).collection("messages").doc(hora+":"+d.getMilliseconds()).set({ sender, message, hora, type}).then(item=>{
      }).catch(e=>{ });
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
    this.db.doc('ListaChats/'+user+'/codes/'+it.id_chat).update({ status:1 }).then(()=>{
      this.db.doc('chats/'+this.semilla+"/messages/"+it.id).update({
        message:user+" aceptado por "+  this.sender,
        type:"sys"
      }).then(()=>{});
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
