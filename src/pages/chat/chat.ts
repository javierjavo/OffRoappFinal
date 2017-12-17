import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface Post{
  sender:string;
  message:string;
  hora:string;
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
  postCol: AngularFirestoreCollection<Post>;
  post: Post[]=[];

  constructor(private user:AngularFireAuth,private db: AngularFirestore, 
    public navCtrl: NavController, public navParams: NavParams) {
      if(navParams.get('semilla') == undefined)
        this.navCtrl.setRoot('TabsHomePage');
      if(!this.user.auth.currentUser)
        this.navCtrl.setRoot('LoginPage');
  
      this.sender = this.user.auth.currentUser.email;
      this.message="";
      this.semilla = navParams.get('semilla');
      this.name = navParams.get('name');
  }
  
  ngOnInit(){                                   //a quí se manda el username para consultar los chat
    
    if(this.semilla){
      this.postCol = this.db.collection('chats').doc(this.semilla).collection("messages");
      this.postCol.snapshotChanges().subscribe(mesages=>{
        let newmsgs = mesages.map(ms=>{
          let s = {
            sender : ms.payload.doc.data().sender,
            message : ms.payload.doc.data().message,
            hora : ms.payload.doc.data().hora
          };
          return s;
        });
        newmsgs.forEach(y=>{
          let exist = false;
          this.post.map(x=>{
            if(x.hora==y.hora){
              exist=true;
            }
          });
          if(!exist)
            this.post.push(y);
        });
      });
    }
  
  }

  sendMessage(){
    let sender = this.sender;
    let message = this.message;
    let hora = Date();
    this.db.collection('chats').doc(this.semilla).collection("messages").add({ sender, message, hora}).then(item=>{
      console.log(item.id);
    }).catch(e=>{
    });
    
  }

}
