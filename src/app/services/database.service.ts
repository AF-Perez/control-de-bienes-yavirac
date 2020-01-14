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
        name: 'yavirac0.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
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

  addBien(codigo, nombre, tipo, idUbicacion, precioEstimado, observaciones) {
    let data = [codigo, nombre, tipo, idUbicacion, precioEstimado, observaciones];
    return this.database.executeSql('INSERT INTO bienes (codigo, nombre, tipo, idUbicacion, precioEstimado, observaciones) VALUES (?, ?, ?, ?, ?, ?)', data).then(data => {
      this.cargarBienes();
    });
  }

  agregarTarea(idUbicacion, idUsuario, fechaHoraInicio, fechaHoraFin, completada, tipo) {
    let data = [idUbicacion, idUsuario, fechaHoraInicio, fechaHoraFin, completada, tipo];
    return this.database.executeSql(`
      INSERT INTO tareas (
        idUbicacion,
        idUsuario,
        fechaHoraInicio,
        fechaHoraFin,
        completada,
        tipo)
        VALUES (?, ?, ?, ?, ?, ?)`
      , data)
      .then(res => {
        this.cargarTareas();
      });
  }

  cargarBienes() {
    return this.database.executeSql('SELECT * FROM bienes', []).then(data => {
      let bienes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          bienes.push({ 
            codigo: data.rows.item(i).codigo,
            nombre: data.rows.item(i).nombre,
            tipo: data.rows.item(i).tipo, 
            idUbicacion: data.rows.item(i).idUbicacion,
            precio: data.rows.item(i).precioEstimado,
            observaciones: data.rows.item(i).observaciones,
           });
        }
        return bienes;
      }
    }).catch(e => {
      console.log(e);
    });
  }

  cargarTareas() {
    return this.database.executeSql('SELECT * FROM tareas', []).then(data => {
      let tareas = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tareas.push({ 
            idUbicacion: data.rows.item(i).idUbicacion,
            idUsuario: data.rows.item(i).idUsuario,
            fechaHoraInicio: data.rows.item(i).fechaHoraInicio, 
            fechaHoraFin: data.rows.item(i).fechaHoraFin,
            completada: data.rows.item(i).completada,
            tipo: data.rows.item(i).tipo,
           });
        }
        return tareas;
      }
    });
  }

  cargarUbicaciones() {
    return this.database.executeSql('SELECT * FROM ubicaciones', []).then(data => {
      let ubicaciones = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          ubicaciones.push({ 
            idUbicacion: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
           });
        }
        return ubicaciones;
      }
    });
  }

  vaciarTareas() {
    return this.database.executeSql('DELETE FROM tareas', []).then(data => {
      
    });
  }

  insertarUbicaciones(ubicaciones) {
    // console.warn(typeof ubicaciones);
    // // const ubicacionesArr = [];
    // // for (const u in ubicaciones) {
    // //   ubicacionesArr.push(ubicaciones[u]);
    // // }

    return this.database.transaction(trsc => {
      trsc.executeSql('DELETE FROM ubicaciones', []);
      trsc.executeSql('CREATE TABLE IF NOT EXISTS ubicaciones (id, nombre)', []);
      ubicaciones.forEach(ubicacion => {
        let data = [ubicacion.id, ubicacion.nombre];
        trsc.executeSql(
          'INSERT INTO ubicaciones VALUES (?, ?)',
          data,
        );
      });
    });
  }
}
