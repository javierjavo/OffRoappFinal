import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface Post{
  sender:string;
  message:string;
}
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  semilla = "";
  name = "";
  postCol: AngularFirestoreCollection<Post>;
  post: Observable<Post[]>;

  constructor(private db: AngularFirestore, public navCtrl: NavController, 
    public navParams: NavParams) {
    this.semilla = navParams.get('semilla');
    this.name = navParams.get('name');
  }
  
  ngOnInit(){                                   //a quí se manda el username para consultar los chat
    this.postCol = this.db.collection('chats').doc(this.semilla).collection("messages");
    this.post = this.postCol.valueChanges();
  }

}
