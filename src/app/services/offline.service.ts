import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(
    private sqlite: SQLite,
  ) { }

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

}
