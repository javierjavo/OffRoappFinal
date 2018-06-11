import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
/*
  MSGS: detalles con la mensajeria en db local
*/

interface Icodes{
  semilla:string;
  id:string;
  status:number;
}

interface Ichats{
  semilla:string;
  url:string;
  name:string;
  msgs:number;
  id:string;
  status:number;
}

@IonicPage()
@Component({
  selector: 'page-grupos',
  templateUrl: 'grupos.html',
})
export class GruposPage {

  codeschatcolection:AngularFirestoreCollection<Icodes>;
  codeschats:Icodes[];
  commitsussess:boolean = false;
  activatedGroup = "";
  lichatcolection:AngularFirestoreCollection<Ichats>;
  lichats:Ichats[]=[];

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, 
    public navCtrl: NavController, public navParams: NavParams,private alertc: AlertController) {
      
  }

  showmsg(i:Ichats){
    return (i.msgs>0);
  }
  //inicializacion de componentes y demas elementos

  ionViewDidEnter(){
    this.activatedGroup = "";
  }

  ionViewDidLoad(){
    this.reloadChangesChat();
    /* MSGS
    hay que actualizar la db local aqui, guardando los codigos de chat y poniendo los eventos
    de escucha en el app component ya que ahí mantendra de manera glogal en control de si ya leyo o no
    los mensajes entrantes
    */
  }

  reloadChangesChat(){
    this.codeschatcolection = this.db.collection('ListaChats').doc(this.afAuth.auth.currentUser.email).collection("codes");
    this.codeschatcolection.snapshotChanges().subscribe(chatList => {
      this.lichats = [];
      this.codeschats = chatList.map(item=>{
        return {
          semilla:item.payload.doc.data().semilla,
          id:item.payload.doc.ref.id,
          status:item.payload.doc.data().status
        }
      });
      //console.log(this.codeschats );
      this.codeschats.forEach(item=>{
        this.lichats = [];
        this.lichatcolection = this.db.collection('ListaChats').doc("DomChats").collection(item.semilla);
        this.lichatcolection.snapshotChanges( ).subscribe(itemchat => {
          let it:Ichats[] = (itemchat.map(li_item=>{
            let auxli:Ichats={
              semilla:li_item.payload.doc.data().semilla,
              url:li_item.payload.doc.data().url,
              name:li_item.payload.doc.data().name,
              msgs: -1,// MSGS aqui se recupera la lista de la db local de los mensajes leidos o no
              id: item.id,
              status:item.status
            }
            //guardo la lista de chats de los mensajes
            return auxli;
            //this.lichats.push(auxli);
          }));
          //console.log(it);
          
          it.forEach(y=>{
            this.lichats.forEach(x=>{
              if(x.semilla == y.semilla){
                y.msgs = x.msgs;// MSGS la asignacion es en tiempo de ejecucion pero tiene que ser local tambien
                this.lichats.splice(this.lichats.indexOf(x),1);
              }
            });
            this.lichats.push(y);
          });
        });
        let messageadvisor:AngularFirestoreCollection<any> = this.db.collection('chats').doc(item.semilla).collection("messages");
        messageadvisor.snapshotChanges().subscribe(s=>{
          if(this.commitsussess){
            //this.commitsussess = false;
            //return;
          }
          //let batch = this.db.firestore.batch();
          this.lichats.forEach(x=>{
          if(x.semilla == item.semilla && item.semilla != this.activatedGroup){
              x.msgs = x.msgs+1;
              //let ref = this.db.doc('ListaChats/'+this.afAuth.auth.currentUser.email+"/codes/"+x.id).ref;
              //batch.update(ref,{msgs:x.msgs+1});  
            }
          });
        });
      });
    });
  }

  async addChat(){
    //aqui se registra el chat en tu lista de chats usando la semilla
    //step 0 crear id y verificar disponibilidad
    
    //alerta de creacion
    this.alertc.create({
      title: "Introduce el codigo",
      subTitle: "si no tienes uno pidelo a tus amigos o intenta crear tu propio grupo",
      inputs: [
        {
          name: 'CCode',
          placeholder: 'Chat Code'
        }
      ],
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          
        }
      },
      {
        text: 'Agregar grupo',
        handler: DataView => {
          //validate info 
          if(DataView.CCode.length > 0){
            let semilla=DataView.CCode;
            let exist = false;
            this.codeschats.forEach(x=>{
              if(x.semilla == semilla){
                exist=true;
              }
            });
            if(exist){
              this.msg("ups! ya estas registrado en "+semilla,"ó ya mandaste la solicitud, en cuanto alguien te acepte podras entrar en el grupo");
              return;
            }
              
            let docRef = this.db.collection('ListaChats').doc("DomChats").collection(semilla);
            let s2 = docRef.snapshotChanges().subscribe(x=>{
              if(x.length==0){
                //no existe el elemento
                this.msg("not found","El Chat no existe aun, intenta crearlo",this.addChat());
              }else{
                let status = 0;
                
                this.db.collection('ListaChats').doc(this.afAuth.auth.currentUser.email).collection("codes").add({ semilla, status }).then(item=>{
                  let id_chat = item.id;
                  let sender = "system";
                  let message = "hi I'm "+this.afAuth.auth.currentUser.email+", I would like to be part of your group";
                  let d = new Date();
                  let hora:string = d.getFullYear()+":"+d.getMonth()+":"+d.getDay()+":"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                  let type = "buttons";
                  let s = this.db.collection('ListaChats').doc("DomChats").collection(semilla).snapshotChanges().subscribe(x=>{
                    x.map(i=>{
                      let usuarios = [i.payload.doc.data().administrador];
                      
                      this.db.collection('chats').doc(semilla).collection("messages").doc(hora+":"+d.getMilliseconds()+":sys").set({ sender, message, hora, type, id_chat, usuarios}).then(item=>{
                        s.unsubscribe();
                      }).catch(e=>{ });
                    });
                  });

                }).catch(e=>{ });
              }
              s2.unsubscribe();
            });
          }
          else{
            //intenta de nuevo
            this.msg("Algo va mal","inteta llenar el campo semilla",this.addChat());
          }
        }
      },
      {
        text: 'Grupo Nuevo',
        handler: DataView => {
          var codigo:string="";
          do{
            let val = Math.round(Math.random()*(999 - 10)+1);
            let lpos = val.toString().split("");
            let name = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+<>@$%&/()123456789".split("");
            let lval:string[]=[];
            lpos.forEach(x=>{
              let p = parseInt(x);
              lval.push(name[p]);
            });
            
            codigo="";
            for(let i=0;i<lpos.length ;i++){
              codigo+=lpos[i]+lval[i];
            }
            var exist = false;
            this.codeschats.forEach(x=>{
              if(x.semilla == codigo){
                exist=true;
              }
            });
      
          }while(exist);
          this.navCtrl.push('CreateNewChatPage',{semilla:codigo});
          //se usa codigo para crear el nuevo grupo como tu administrador
        }
      }
    ]
    }).present();
    //step 1 añadir a la lista dom general
    //step 2 añadir a la lista de el usuario
    //step 3 crear el chat con el mensaje inicial
  }

  Share(item){
    //alert respondiendo la semilla del chat y opciones para compartir
    this.alertc.create({
      title: "code: "+item.semilla,
      subTitle: 'Share your Group code whith your friends and lets roll',
      buttons: ['Dismiss']
    }).present();
  }

  Mute(){
    //alert preguntando por cuanto tiempo
  }

  Delete(item){
    let itemc = this.db.collection('ListaChats').doc("DomChats").collection(item.semilla).snapshotChanges( ['added'] ).subscribe(x=>{
      let res = x.map(y=>{
        return {
          administrador:y.payload.doc.data().administrador,
          name:y.payload.doc.data().name,
          semilla:y.payload.doc.data().semilla,
          url:y.payload.doc.data().url,
          usuarios:y.payload.doc.data().usuarios,
          id:y.payload.doc.id
        }
      });

      console.log(res[0].usuarios.length);
      
      //si es la ultima persona en el chat se elimina todo sin guardar
      if(res[0].usuarios.length-1==0){
        alert(res[0].usuarios.length+"eliminando permanentemente el grupo");
        this.db.doc('ListaChats/DomChats/'+item.semilla+"/"+res[0].id).delete().then(()=>{
          this.db.doc('chats/'+item.semilla).delete().then(()=>{

          });
        });
        
      }else{
        //si el admin sale asigna a otro admin
        let list=[];
        res[0].usuarios.forEach(element => {
          if(this.afAuth.auth.currentUser.email!=element)
            list.push(element);
        });
        res[0].usuarios = list;
        if(res[0].administrador==this.afAuth.auth.currentUser.email){
          res[0].administrador = list[0];
        }
          let batch = this.db.firestore.batch();
          let ref = this.db.collection('ListaChats').doc("DomChats").collection(item.semilla).doc(res[0].id).ref;
          batch.update(ref,{
            administrador:res[0].administrador,
            name:res[0].name,
            semilla:res[0].semilla,
            url:res[0].url,
            usuarios:res[0].usuarios
          });
          batch.commit().then(()=>{ }).catch(e=>{ 
            console.log(e);
          });

        
        //manda un mensaje al grupo de despedida
        let sender = "system";
        let message = this.afAuth.auth.currentUser.email+" ha abandonado el grupo";
        let d = new Date();
        let hora:string = d.getFullYear()+":"+d.getMonth()+":"+d.getDay()+":"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        let type = "sys";
        
        let conect = this.db.collection('ListaChats').doc("DomChats").collection(item.semilla).snapshotChanges().subscribe(x=>{
          x.map(i=>{
            let usuarios = i.payload.doc.data().usuarios;
            this.db.collection('chats').doc(item.semilla).collection("messages").doc(hora+":"+d.getMilliseconds()).set({ sender, message, hora, type, usuarios}).then(item=>{
              conect.unsubscribe();
            }).catch(e=>{ });
          });
        });
      }
      this.db.doc('ListaChats/'+this.afAuth.auth.currentUser.email+"/codes/"+item.id).delete().then(()=>{
        
      });
      itemc.unsubscribe();
    });

  }

  go_chat(item){
    this.lichats.forEach(x=>{
      if(x.semilla == item.semilla){
        x.msgs = 0;
        //MSGS aqui borramos la info de los mensajes de la db local
        //let ref = this.db.doc('ListaChats/'+this.afAuth.auth.currentUser.email+"/codes/"+x.id).ref;
        //this.db.firestore.batch().update(ref,{msgs:x.msgs}).commit().then(()=>{
        //  this.commitsussess = true;
        //});
      }
    });
    this.activatedGroup = item.semilla;
    this.navCtrl.push('ChatPage',{semilla:item.semilla,name:item.name});
  }

  zoom(item){
    let fondo = document.getElementById("image_zoom");
    let image = document.getElementById("ima_zoom") as HTMLImageElement;
    let name = document.getElementById("displayName") as HTMLImageElement;
    fondo.style.visibility = "visible";
    image.src = item.url;
    name.innerText = item.name;
  }
  
  zoom_out(){
    let fondo = document.getElementById("image_zoom");
    let image = document.getElementById("ima_zoom") as HTMLImageElement;
    let name = document.getElementById("displayName") as HTMLImageElement;
    fondo.style.visibility = "hidden";
    image.src = "";
    name.innerText = "";
  }

  msg(t,mess,a?){
    let alert;
      alert = this.alertc.create({
        title: t,
        message: mess,
        buttons: [
          {
            text: 'acept',
            handler: () => {
              return;
            }
          }
        ]
      });
    alert.present(); 
  }

}
