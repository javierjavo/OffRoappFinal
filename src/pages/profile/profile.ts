import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserName } from '../../models/Flogin';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  canvas:HTMLCanvasElement;
  ctx;
  nivel=1;
  username = {} as UserName;
  email;
  limitAnimation=0;
  limitLoad = 6000;
  xp=6000;
  animation;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get("mail").then(x=>{
      this.email = x;
    });
  }

  degToRad(deg:number){
    return deg*(Math.PI/180);
  }

  roundedImage(x,y,width,height,radius){
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  ionViewDidLeave(){
    clearInterval(this.animation);
  }

  ionViewDidLoad() {
    this.storage.get("sesion").then(data => {
      if(data)
        this.username.data = data;
      else
        this.username.data = "error";
      return;
    });
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');   
    this.ctx.beginPath();
    this.animation = setInterval(() => { 
      this.ipaint(); // Now the "this" still references the component
    }, 40);

    /**/
  }

  ipaint(){
    let ancho = (window.innerWidth/100);
    var image = document.getElementById('source'); 
    let step = (this.xp.toString().length-1);
    let s="1";
    for(let x =1;step>x;x++)
      s+=0;
    step=parseInt(s);
    this.limitAnimation += step;
    if(this.limitAnimation > this.xp) 
      this.limitAnimation = this.xp;
    
    this.ctx.strokeStyle = '#28d1fa';
    this.ctx.lineWidth = 17;
    this.ctx.lineCap = 'round';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#000000';
    let x = (this.xp*360)/this.limitLoad;
    this.ctx.arc(ancho*35, ancho*35, ancho*30 , this.degToRad(180) , this.degToRad(x+180));
    this.ctx.stroke();

    this.roundedImage(ancho*10,ancho*10,ancho*50,ancho*50, ancho*29);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 0;
    this.ctx.clip();
    this.ctx.drawImage(image,ancho*10,ancho*10,ancho*50,ancho*50);
    this.ctx.stroke();
    
    this.ctx.clip();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '40px Helvetica';
    this.ctx.fillText('XP '+this.limitAnimation, ancho*13, ancho*40);
    this.ctx.stroke();
    
    if(this.limitAnimation == this.xp)
      clearInterval(this.animation);
  }

  actualizar(){
    this.storage.set("sesion",this.username.data);
    this.storage.set(this.email,this.username.data);
    
  }

  /* doble buffer a tomar por culo
    roundedImage(x,y,width,height,radius,ctx){
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  ionViewDidLoad() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');   
    var image = document.getElementById('source');
    let ancho = (window.innerWidth/100);
    // this.ctx.clip();
    this.ctx.beginPath();
    this.animacion = setInterval(() => { 
      this.ipaint(); // Now the "this" still references the component
    }, 100);
  }

  ipaint(){
    this.fondo = document.getElementById("canvas2") as HTMLCanvasElement;
    let ctxf = this.fondo.getContext('2d');
    ctxf.beginPath();

    let ancho = (window.innerWidth/100);
    var image = document.getElementById('source');
    
    ctxf.strokeStyle = '#28d1fa';
    ctxf.lineWidth = 17;
    ctxf.lineCap = 'round';
    ctxf.shadowBlur = 15;
    ctxf.shadowColor = '#000000';
    ctxf.arc(ancho*35, ancho*35, ancho*30 , this.degToRad(180) , this.degToRad(this.limit+180));
    ctxf.stroke();

    this.roundedImage(ancho*10,ancho*10,ancho*50,ancho*50, ancho*29,ctxf);
    ctxf.strokeStyle = '#000000';
    ctxf.lineWidth = 1;
    ctxf.shadowBlur = 0;
    ctxf.clip();
    ctxf.drawImage(image,ancho*10,ancho*10,ancho*50,ancho*50);
    ctxf.stroke();
    
    this.ctx.drawImage(this.fondo,0,0,500,500);
    this.ctx.clip();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '50px Helvetica';
    this.ctx.fillText('XP '+this.limit, ancho*13, ancho*40);
    this.ctx.stroke();

    this.limit+=10;
    console.log(this.limit);
    
    if(this.limit > 360){
      clearInterval(this.animacion);
    }
  }
  */
}
