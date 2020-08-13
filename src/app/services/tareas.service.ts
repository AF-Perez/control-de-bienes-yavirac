import { Injectable } from '@angular/core';
import { switchMap, flatMap, map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { AuthService } from '../auth/auth.service';
import { UbicacionesService } from '../servicios/ubicaciones.service';
import { BehaviorSubject, from } from 'rxjs';
import { OfflineService } from './offline.service';
import { DatabaseService } from './database.service';


@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(
    private clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
    private authService: AuthService,
    private servicioUbicaciones: UbicacionesService,
    private servicioOffline: OfflineService,
    private servicioBDD: DatabaseService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  private _tareas = new BehaviorSubject([]);

  get tareas() {
    return this._tareas.asObservable();
  }

  obtenerTareas() {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          return this.authService.getHeaders().pipe(
            take(1),
            switchMap(headers => {
              return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, {headers});
            })
          );
        }
        return from(this.servicioBDD.cargarTareas());
      })
    );
  }

  obtenerTareasTodo() {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          return this.authService.getHeaders().pipe(
            take(1),
            switchMap(headers => {
              return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, {headers});
            })
          );
        }
        return from(this.servicioBDD.cargarTareas());
      })
    );
  }

  obtenerTareasAPI() {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, {headers});
      })
    );
  }

  obtenerUbicacionesPorTarea(tipoTarea) {
    return this.obtenerTareas().pipe(
      switchMap(tareas => {
        return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
          map(ubicaciones => {
            return {tareas, ubicaciones};
          })
        );
      }),
      map(({tareas, ubicaciones}) => {
        let ubicacionesValidas = [];
        tareas.forEach(tarea => {
          ubicaciones.forEach(ubicacion => {
            if (ubicacion.id === tarea.id_ubicacion && tarea.tipo === tipoTarea && tarea.completada === 0) {
              ubicacionesValidas.push(ubicacion);
            }
          })
        });
        return ubicacionesValidas;
      }),
    );
  }

  obtenerTareasIncompletas() {
    return this.obtenerTareas().pipe(
      map(tareas => {
        let tareasIncompletas = tareas.filter(tarea => {
          return tarea.completada === 0;
        });
        console.log(tareasIncompletas);
        return tareasIncompletas;
      }),
    );
  }

  ingresarConteos(conteos) {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        let data = JSON.stringify(conteos);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/evaluarConteo`, data, {headers});
      })
    );
  }

  solicitarBajaBien(idBien, observaciones) {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        let data = {observaciones: observaciones};
        //JSON.stringify(data);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/bienes/${idBien}/solicitarBaja`, data, {headers});
      }),
    );
  }

}
