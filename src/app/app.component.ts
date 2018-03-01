import { Component,ViewChild } from '@angular/core';
import { Platform,Nav, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { RedicPage } from '../pages/redic/redic';
import { GruposPage } from '../pages/grupos/grupos';
import { TabsHomePage } from '../pages/promo/tabshome/tabshome';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Storage } from '@ionic/storage';
import { Flogin } from '../models/Flogin';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = "LoginPage";
  @ViewChild(Nav) nav: Nav;
  username:string = "";
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
          if(data.displayName!=null)
            this.username = data.displayName;
          else
            this.username = data.email;
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
      let a = this.afAuth.authState.subscribe(data => {
        if(data && data.email.length>0 && data.uid.length>0){
          this.toast.create({
              message: 'Let\'s roll, '+data.email,
              duration: 1000,
          }).present();
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
    //this.nav.push(ProfilePage);
    alert("Editar Perfil");
  }

  go_logout(){
    this.userpick ="";
    this.username ="";
    this.afAuth.auth.signOut();
    this.toast.create({
      message: "logout susses",
      duration: 1000,
    }).present();
    this.storage.remove("sesion");
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
