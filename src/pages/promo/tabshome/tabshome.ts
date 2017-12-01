import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'tabshome.html'
})
export class TabsHomePage {

  tab1Root = HomePage;
  tab3Root = ContactPage;

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, private toast: ToastController, public navParams: NavParams) {

  }
  
  ionViewWillLoad(){
    try{
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.uid){
        this.toast.create({
            message: 'Let\'s roll, '+data.email,
            duration: 1000,
        }).present();
        //this.afAuth.auth.signOut(); // cierra la sesion
      }
      else{
        this.toast.create({
          message: 'error al iniciar sesion intente de nuevo',
          duration: 5000,
        }).present();
        this.navCtrl.setRoot('LoginPage');
        //aqui regresar al inincio pero da un error so hay que ver que
        }
    });
    }catch(e){

    }
  }
}
