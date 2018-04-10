import { Component,ViewChild } from '@angular/core';
import { Platform,Nav, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { RedicPage } from '../pages/redic/redic';
import { ProfilePage } from '../pages/profile/profile';
import { GruposPage } from '../pages/grupos/grupos';
import { TabsHomePage } from '../pages/promo/tabshome/tabshome';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Storage } from '@ionic/storage';
import { Flogin, UserName } from '../models/Flogin';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = "LoginPage";
  @ViewChild(Nav) nav: Nav;
  username = {} as UserName;
  userpick:string = "";
  FLogList = {} as Flogin;
  
  constructor(private afAuth: AngularFireAuth, platform: Platform,private toast: ToastController,
    statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      NavController;
      statusBar.styleDefault();
      splashScreen.hide();
      this.readLoginInfo();
      this.afAuth.authState.subscribe(data => {
        if(data && data.email.length>0 && data.uid.length>0){
          if(data.photoURL!=null)
            this.userpick = data.photoURL;
          else
            this.userpick = "../assets/imgs/final.jpg";
          
          let sc = document.getElementById('menuUser') as HTMLElement;
          let mp = document.getElementById('menuPrincipal') as HTMLElement;
          sc.style.display="block";
          mp.style.display="none";
        }else{
          let sc = document.getElementById('menuUser') as HTMLElement;
          let mp = document.getElementById('menuPrincipal') as HTMLElement;
          sc.style.display="none";
          mp.style.display="block";
        }     
      });
    });
  }

  readLoginInfo(){
    this.storage.get('cuentas').then((data) => {
      if(data){
        this.FLogList.data = data;
      }
    });
  }
  
  async flogin(mail,pass){
    try {
      this.afAuth.auth.signInWithEmailAndPassword(mail, pass);
      this.afAuth.authState.subscribe(datal => {
        if(datal && datal.email.length>0 && datal.uid.length>0){
          this.toast.create({
              message: 'Let\'s roll, '+datal.email,
              duration: 1000,
          }).present();
          this.storage.get(datal.email).then(data => {
            this.username.data = (data)?data:datal.email;
            this.storage.set("mail",datal.email);
            this.storage.set("sesion",this.username.data);
            return;
          });

          let a = setInterval(() => { 
            this.storage.get(datal.email).then(data => {
              this.username.data = (this.username.data==data)?this.username.data:data;
              this.storage.get("sesion").then(x=>{
                if(!x) clearInterval(a);
              });
              return;
            });
          }, 5000);
         
          this.nav.setRoot('TabsHomePage');
        }
        return;          
      });
    } catch (e) {
      this.nav.push('RegisterPage');
    }
  }

  go_promo(){
    this.nav.setRoot(TabsHomePage);
  }

  go_grup(){
    this.nav.setRoot(GruposPage);  
  }

  go_profile(){
    this.nav.push(ProfilePage);
  }

  go_logout(){
    this.userpick ="";
    this.username.data ="";
    this.afAuth.auth.signOut();
    this.toast.create({
      message: "logout susses",
      duration: 1000,
    }).present();
    this.storage.remove("sesion");
    this.storage.remove("mail");
    this.readLoginInfo();
    this.nav.setRoot('LoginPage');
  }

  revmove(a){
    var accou:any=[];
    var newacu:any=[];
    this.storage.get('cuentas').then((data) => {
      if(data){
        accou = data;
      }
      accou.map((item)=>{
        if(item.user!=a.user)
          newacu.push(item);
      });
      this.FLogList.data = newacu;
      this.storage.set('cuentas', newacu);
    })
  }
  //sql
  //tasks: any[] = [];
}
