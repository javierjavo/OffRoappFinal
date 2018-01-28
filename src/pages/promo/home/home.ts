import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  listBanner=[];
  limiteAnunciosCache = 1;

  tab3Root = ContactPage;
  constructor(public navCtrl: NavController) {
    this.listBanner=[];
  }

  ionViewDidLoad(){

    let i = 0;
    while(i<10){
      this.listBanner.push({ejemplo:this.limiteAnunciosCache++});
      i++;
    }
  }
  

  select(item){
    alert(item.ejemplo);
  }
  
  isElementInViewPort() {
    var sc = document.getElementById('scrollArea') as HTMLElement;
    var bottom = sc.scrollHeight - (sc.scrollTop+screen.height);
    if(this.limiteAnunciosCache==32){}
    else if(this.limiteAnunciosCache==31){
      this.listBanner.push({ejemplo:"mamaste basta"});
      this.listBanner.push({ejemplo:"dame mas anuncios"});
      this.limiteAnunciosCache++;
    }
    else if(bottom<=50){
      this.listBanner.push({ejemplo:this.limiteAnunciosCache});
      this.limiteAnunciosCache++;
    }
 }

/*
  ionViewDidLoad(){
    //https://www.youtube.com/watch?v=4wXSAtSc0go
    if(this.platform.is('cordova')){
      const bannerConfig: AdMobFreeBannerConfig = {
          id:'ca-app-pub-7267843627016122/6549901022',
        isTesting: false,
        autoShow: true
      };
      
      this.adMob.banner.config(bannerConfig);
      
      this.adMob.banner.prepare()
        .then(() => {
          // banner Ad is ready
          // if we set autoShow to false, then we will need to call the show method here
        })
        .catch(e => console.log(e));
    }
  }
*/
}
