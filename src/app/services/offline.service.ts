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

  comprobarConexion() {
    if (this.network.type === 'wifi') {
      console.log('online');
      this._tieneConexion.next(true);
    }
    if (this.network.type === 'none') {
      console.log('offline');
      this._tieneConexion.next(false);
    }
  }
  
  get tieneConexion() {
    return this._tieneConexion.asObservable();
  }

}
