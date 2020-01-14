import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { take, delay, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(
    private sqlite: SQLite,
    private network: Network,
  ) { }

  private _tieneConexion = new BehaviorSubject(null);

  comprobarConexion() {
    if (this.network.type === 'wifi') {
      this._tieneConexion.next(true);
    }
    if (this.network.type === 'none') {
      this._tieneConexion.next(false);
    }
  }
  
  get tieneConexion() {
    return this._tieneConexion.asObservable().pipe(
      map(con => {
        if (this.network.type === 'wifi') {
          return true;
        } else {
          return false;
        }
      })
    );
  }

}
