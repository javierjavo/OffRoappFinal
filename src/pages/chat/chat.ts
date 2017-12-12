import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface Post{
  id:string;
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

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, public navCtrl: NavController, 
    public navParams: NavParams) {
    this.semilla = navParams.get('semilla');
    this.name = navParams.get('name');

  }
  
  ngOnInit(){                                   //a quí se manda el username para consultar los chat
    this.postCol = this.db.collection('ListaChats').doc("javierjavo@live.com.mx").collection("codes");
    this.post = this.postCol.valueChanges();
  }

}
