import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User; 
  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController,
              private toast: ToastController, public navParams: NavParams) {

  }

  ionViewDidEnter(){
    if(this.afAuth.auth.currentUser != null)
      this.navCtrl.setRoot('TabsHomePage');
  }

  goback(){
    var sc = document.getElementById('scrollArea') as HTMLElement;
    sc.scrollTo(0,0);
  }
  nStep(){
    
    var sc = document.getElementById('scrollArea') as HTMLElement;
    sc.scrollTo(screen.width,0);
  }

  async login(user: User) {
    try {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      let a = this.afAuth.authState.subscribe(data => {
        if(data && data.email.length>0 && data.uid.length>0){
          this.toast.create({
              message: 'Let\'s roll, '+data.email,
              duration: 1000,
          }).present();
          this.navCtrl.setRoot('TabsHomePage');
        }
        a.unsubscribe();
        return;          
      });
    } catch (e) {
      this.navCtrl.push('RegisterPage');
    }
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

}
