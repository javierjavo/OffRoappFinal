import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
//import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { Storage } from '@ionic/storage';
import { Flogin } from '../../models/Flogin';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  FLogList = {} as Flogin;
  user = {} as User;
  userName = "";
  userPass = "";
  remember;

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController,
    private toast: ToastController, public navParams: NavParams, public storage: Storage) {
      //storage.clear();
      /*this.storage.set('prueba', 10);
      this.storage.get('prueba').then((data) => {
        console.log(data);
      })*/
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

  login(user: User) {
    try {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      let a = this.afAuth.authState.subscribe(data => {
        if(data && data.email.length>0 && data.uid.length>0){
          this.toast.create({
              message: 'Let\'s roll, '+data.email,
              duration: 1000,
          }).present();
          if(this.remember){
            this.userName = this.user.email;
            this.userPass = this.user.password;
            this.saveLoginInfo(this.userName, this.userPass);
          }else{
            this.removeLoginInfo();
          }
          this.navCtrl.setRoot('TabsHomePage');
        }
        a.unsubscribe();
        return;          
      });
    } catch (e) {
      this.navCtrl.push('RegisterPage');
    }
  }


  saveLoginInfo(userName, userPass){
    var a = {
      user: userName,
      pass: userPass
    }
    var accou:any=[];
    this.storage.get('cuentas').then((data) => {
      if(data){
        accou = data;
      }
      let bol = true;
      accou.map((item)=>{
        if(item.user==a.user)
          bol = false;
      });
      if(bol){
        accou.push(a);
        this.storage.set('cuentas', accou);
        window.location.reload();
      }
    })
  }

  removeLoginInfo(){
    this.storage.remove('user');
    this.storage.remove('password');
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

}
