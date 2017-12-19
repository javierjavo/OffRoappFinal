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
  dysplaysedner:string;
  message:string;
  hora:string;
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
      this.postCol.snapshotChanges(['added']).subscribe(mesages=>{
        let newmsgs = mesages.map(ms=>{
          let s = {
            sender : ms.payload.doc.data().sender,
            message : ms.payload.doc.data().message,
            hora : ms.payload.doc.data().hora,
            dysplaysedner:ms.payload.doc.data().sender,
            id:ms.payload.doc.id,
            id_chat:ms.payload.doc.data().id_chat
          };
          if(this.ActualS != s.dysplaysedner){
            this.ActualS=s.dysplaysedner;
          }else{
            s.dysplaysedner = "";
          }
          return s;
        });
        newmsgs.forEach(y=>{
          let exist = false;
          this.post.map(x=>{
            if(x.hora==y.hora){
              exist=true;
            }
          });
          if(!exist){
            this.post.push(y);
          }
        });
      });
    }
  
  }

  sendMessage(){
    if(this.message.length > 0){
      let sender = this.sender;
      let message = this.message;
      let d = new Date();
      let hora:string = d.getFullYear()+":"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      this.db.collection('chats').doc(this.semilla).collection("messages").add({ sender, message, hora}).then(item=>{
        this.message="";
      }).catch(e=>{ });
    }
  }

  sendMedia(){
    // se manda la imagen a el servidor y responde con la ruta de copiado la cual se almacena como texto
    // en formato %ruta la cual se imprime en imagen
  }

  onChangeMessage(){
    let x = Math.round((this.message.length/30));
    switch(x){
      case 0:
      case 1:
        this.longmsg = "1";
      break;
      case 2:
        this.longmsg = "2";
      break;
      case 3:
        this.longmsg = "3";
      break;
      case 4:
        this.longmsg = "4";
      break;
      case 5:
        this.longmsg = "5";
      break;
      default:
        this.longmsg = "5";
      break;
    }
  }

  mine(it){
    return it.sender == this.sender;
  }

  requestAcept(it){
    let user = it.message.split(", ")[0].substring(7);
    console.log('ListaChats/'+user+'/codes/'+it.id_chat);

    this.db.doc('ListaChats/'+user+'/codes/'+it.id_chat).update({ status:1 }).then(()=>{
      this.db.doc('chats/'+this.semilla+"/messages/"+it.id).delete().then(()=>{
        this.removeView(it);
      });
    });;
  }

  requestDecline(it){
    let user = it.message.split(", ")[0].substring(7);
    console.log('ListaChats/'+user+'/codes/'+it.id_chat);
    this.db.doc('ListaChats/'+user+'/codes/'+it.id_chat).delete().then(()=>{
      this.db.doc('chats/'+this.semilla+"/messages/"+it.id).delete().then(()=>{
        this.removeView(it);
      });
    });;
  }

  removeView(it){
    this.post.forEach(x=>{
      if(x.message==it.message){
        this.post.splice(this.post.indexOf(x),1);
      }
    });
  }

}
