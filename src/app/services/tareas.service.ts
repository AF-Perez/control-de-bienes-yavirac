import { Injectable } from '@angular/core';
import { switchMap, flatMap, map } from 'rxjs/operators';
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
  private _tareas  =  new BehaviorSubject([]);

  get tareas() {
    return this._tareas.asObservable();
  }

  obtenerTareas() {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          console.log('por la buena');
          return this.authService.getHeaders().pipe(
            switchMap(headers => {
              return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, {headers});
            })
          );
        }
        console.log('por la mala');
        return from(this.servicioBDD.cargarTareas());
      })
    );
  }

  obtenerUbicacionesPorTarea(tipoTarea) {
    return this.obtenerTareas().pipe(
      switchMap(tareas => {
        return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
          map(ubicaciones => {
            const ubicacionesArr = [];
            for (const key in ubicaciones) {
              ubicacionesArr.push(ubicaciones[key]);
            }
            return {tareas, ubicacionesArr};
          })
        );
      }),
      map(({tareas, ubicacionesArr}) => {
        let ubicacionesValidas = [];
        tareas.forEach(tarea => {
          ubicacionesArr.forEach(ubicacion => {
            if (ubicacion.id === tarea.id_ubicacion && tarea.tipo === tipoTarea && tarea.completada === 0) {
              ubicacionesValidas.push(ubicacion);
            }
          })
        });
        return ubicacionesValidas;
      }),
    );
  }

  ingresarConteos(conteos) {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        let data = JSON.stringify(conteos);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/evaluarConteo`, data, {headers});
      })
    );
  }

  solicitarBajaBien(idBien, observaciones) {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        let data = {observaciones: observaciones};
        //JSON.stringify(data);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/bienes/${idBien}/solicitarBaja`, data, {headers});
      }),
    );
  }
}
