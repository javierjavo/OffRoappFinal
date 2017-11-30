import { Component,ViewChild } from '@angular/core';
import { Platform,Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RedicPage } from '../pages/redic/redic';
import { GruposPage } from '../pages/grupos/grupos';
import { TabsHomePage } from '../pages/promo/tabshome/tabshome';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = RedicPage;
  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      NavController;
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  
  go_promo(Page){
    this.nav.setRoot(TabsHomePage);
  }

  go_grup(){
    this.nav.setRoot(GruposPage);  
  }

  go_logout(){
    this.nav.setRoot(LoginPage);
  }
}
