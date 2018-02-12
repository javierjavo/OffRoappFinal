import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  listBanner=[];
  limiteAnunciosCache = 1;

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

}
