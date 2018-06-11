import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
//AngularFirestoreCollection
@IonicPage()
@Component({
  selector: 'page-create-new-chat',
  templateUrl: 'create-new-chat.html',
})
export class CreateNewChatPage {
  private semilla:string;
  public terminos:boolean;
  public pic: string;
  public nombre:string;
  public codigo:string;
  constructor(public navCtrl: NavController, private db: AngularFirestore, public navParams: NavParams,private afAuth: AngularFireAuth) {
    this.semilla = navParams.get('semilla');
    this.codigo=navParams.get('semilla');
    this.nombre="";
    this.pic="";
  }

  ionViewDidLoad() {

  }
  
  validate(){
    if(this.semilla == this.codigo && this.terminos && this.nombre.length>0){
      this.crearGrupo(this.nombre,this.codigo);
      this.navCtrl.pop();
    }else{
      alert("por favor rellene todos los campos para continuar");
    }
  }

  crearGrupo(name,semilla){
    let url = this.pic;
    let administrador = this.afAuth.auth.currentUser.email;
    let usuarios:Array<string> = [];
    usuarios.push(administrador);
    this.db.collection('ListaChats').doc("DomChats").collection(this.codigo).add({ administrador, name, semilla, url, usuarios}).then(item=>{
      this.db.collection('ListaChats').doc(this.afAuth.auth.currentUser.email).collection("codes")
      .add({ semilla, statis:1 }).then(data=>{
      //  alert("listo");
      }).catch(error=>{  });
    }).catch(e=>{ });
  }
  

}
