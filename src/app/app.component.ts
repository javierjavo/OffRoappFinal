import { Component,ViewChild } from '@angular/core';
import { Platform,Nav, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RedicPage } from '../pages/redic/redic';
import { GruposPage } from '../pages/grupos/grupos';
import { TabsHomePage } from '../pages/promo/tabshome/tabshome';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = RedicPage;
  @ViewChild(Nav) nav: Nav;
  username:string = "";
  userpick:string = "";
  
  constructor(private afAuth: AngularFireAuth, platform: Platform,private toast: ToastController, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      NavController;
      statusBar.styleDefault();
      splashScreen.hide();
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
        }         
      });
    });
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
    this.nav.setRoot('LoginPage');
  }
}
