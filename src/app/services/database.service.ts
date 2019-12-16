import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private http: HttpClient,
  ) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'control_bienes_yavirac.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

  initDatabase() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
    
    
        db.executeSql('create table danceMoves(name VARCHAR(32))', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
    
    
      })
      .catch(e => console.log(e));
  }

  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  addBien(codigo, tipo, idUbicacion, precioEstimado, observaciones) {
    let data = [codigo, tipo, idUbicacion, precioEstimado, observaciones];
    return this.database.executeSql('INSERT INTO bienes (codigo, tipo, idUbicacion, precioEstimado, observaciones) VALUES (?, ?, ?, ?, ?)', data).then(data => {
      console.log('insertado');
    });
  }
}
