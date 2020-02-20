import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable, from } from 'rxjs';
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
        name: 'yavirac2.db',
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

  agregarTarea(idUbicacion, idUsuario, fechaHoraInicio, fechaHoraFin, completada, tipo, observaciones) {
    let data = [idUbicacion, idUsuario, fechaHoraInicio, fechaHoraFin, completada, tipo, observaciones];
    return this.database.executeSql(`
      INSERT INTO tareas (
        idUbicacion,
        idUsuario,
        fechaHoraInicio,
        fechaHoraFin,
        completada,
        tipo,
        observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      , data)
      .then(res => {
      });
  }

  cargarBienes() {
    return this.database.executeSql('SELECT * FROM bienes', []).then(data => {
      let bienes = [];
      console.log(data);
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          bienes.push({ 
            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
            codigo: data.rows.item(i).codigo,
            clase: data.rows.item(i).tipo,
            id_ubicacion: data.rows.item(i).idUbicacion,
            valor: data.rows.item(i).precioEstimado,
            observaciones: data.rows.item(i).observaciones,
            sincronizado: data.rows.item(i).sincronizado,
           });
        }
      }
      return bienes;
    })
  }

  cargarBienesPorUbicacion(idUbicacion) {
    return this.database.executeSql('SELECT * FROM bienes WHERE bienes.idUbicacion=' + idUbicacion, []).then(data => {
      let bienes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          bienes.push({ 
            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
            codigo: data.rows.item(i).codigo,
            clase: data.rows.item(i).tipo, 
            id_ubicacion: data.rows.item(i).idUbicacion,
            valor: data.rows.item(i).precioEstimado,
            observaciones: data.rows.item(i).observaciones,
            sincronizado: data.rows.item(i).sincronizado,
           });
        }
      }
      return bienes;
    })
  }

  cargarBienesPendientes() {
    return this.database.executeSql('SELECT * FROM bienes WHERE sincronizado = 0', []).then(data => {
      let bienes = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          bienes.push({ 
            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
            codigo: data.rows.item(i).codigo,
            clase: data.rows.item(i).tipo, 
            id_ubicacion: data.rows.item(i).idUbicacion,
            valor: data.rows.item(i).precioEstimado,
            observaciones: data.rows.item(i).observaciones,
            sincronizado: data.rows.item(i).sincronizado,
           });
        }
      }
      return bienes;
    })
  }

  cargarTareas() {
    return this.database.executeSql('SELECT * FROM tareas', []).then(data => {
      let tareas = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          tareas.push({ 
            id_ubicacion: data.rows.item(i).idUbicacion,
            id_usuario: data.rows.item(i).idUsuario,
            fecha_asignacion: data.rows.item(i).fechaHoraInicio, 
            // fechaHoraFin: data.rows.item(i).fechaHoraFin,
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
            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
           });
        }
        return ubicaciones;
      }
    });
  }

  insertarUbicaciones(ubicaciones) {
    return this.database.transaction(trsc => {
      trsc.executeSql('DELETE FROM ubicaciones', []);
      ubicaciones.forEach(ubicacion => {
        let data = [ubicacion.id, ubicacion.nombre];
        trsc.executeSql(
          'INSERT INTO ubicaciones VALUES (?, ?)',
          data,
        );
      });
    }).then(res => console.log('insertadas ubicaciones'));
  }

  insertarTareas(tareas) {
    return this.database.transaction(trsc => {
      trsc.executeSql('DELETE FROM tareas', []);
      tareas.forEach(tarea => {
        let data = [
          tarea.id,
          tarea.id_ubicacion,
          tarea.id_usuario,
          tarea.fecha_asignacion,
          tarea.fecha_asignacion,
          tarea.completada,
          tarea.tipo,
          tarea.observaciones,
        ];
        trsc.executeSql(
          'INSERT INTO tareas VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          data,
        );
      });
    }).then(res => console.log('insertadas tareas'));
  }

  insertarBienes(bienes, online: boolean) {
    console.warn(bienes);
    return this.database.transaction(trsc => {
      trsc.executeSql('DELETE FROM bienes', []);
      bienes.forEach(bien => {
        let data = [
          bien.id,
          bien.nombre,
          bien.codigo,
          bien.tipo,
          bien.id_ubicacion,
          bien.valor,
          bien.observaciones,
          online ? 1 : 0,
        ];
        trsc.executeSql(
          'INSERT INTO bienes VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          data,
        );
      });
    }).then(res => console.log('insertados bienes'));
  }

  vaciarBase() {
    return from(this.database.transaction(trsc => {
      trsc.executeSql('DELETE FROM bienes', []);
      trsc.executeSql('DELETE FROM ubicaciones', []);
      trsc.executeSql('DELETE FROM tareas', []);
      trsc.executeSql('DELETE FROM bajas', []);
      trsc.executeSql('DELETE FROM conteos', []);
      trsc.executeSql('DELETE FROM bienesContados', []);
      trsc.executeSql('DELETE FROM registros', []);
    }));
  }
}
