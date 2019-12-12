import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { take, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(
    private sqlite: SQLite,
    private network: Network,
  ) { }

  private _tieneConexion = new BehaviorSubject(null);

  crearBaseDeDatos() {
    this.sqlite.create({
      name: 'offline.db',
      location: 'default',
    })
    // .then(db => {
    //     db.transaction(tx => {
    //       tx.executeSql('CREATE TABLE IF NOT EXISTS bienes (codigo, tipo, nombre, estado, precio, custodio, idUbicacion, observaciones)');
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // })
    // .then(err => {
    //   console.error(err);
    // });
  }

  comprobarConexion() {
    if (this.network.type !== null) 
      this._tieneConexion.next(true);
    this._tieneConexion.next(false);
  }
  
  get tieneConexion() {
    return this._tieneConexion.asObservable();
  }

}
