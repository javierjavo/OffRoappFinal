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

  constructor(private afAuth: AngularFireAuth, platform: Platform,private toast: ToastController, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      NavController;
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  
  go_promo(){
    this.nav.setRoot(TabsHomePage);
  }

  go_grup(){
    this.nav.setRoot(GruposPage);  
  }

  go_logout(){
    this.afAuth.auth.signOut();
    this.toast.create({
      message: "logout susses",
      duration: 1000,
    }).present();
    this.nav.setRoot('LoginPage');
  }
}
