import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the TasksServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TasksServiceProvider {
  // public properties
  constructor(public storage: Storage) {}

  get(skey){
    let a:any = [];
    this.storage.get(skey).then((data) => {
      if(data){
        a = data;
      }
    });
    return a;
  }

  set(skey,valor){
    let arreglo = this.get(skey);

    this.storage.get(skey).then((data) => {
      if(!data){
        data=[];
      }
      let bol = true;
      data.map((s)=>{
        if(s.semilla==valor.semilla)
          bol = false;
      });
      if(bol){
        data.push(valor);
        arreglo = data;
        this.storage.set(skey, data);
      }
    });
  }

}
