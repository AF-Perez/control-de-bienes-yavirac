import { Injectable } from '@angular/core';
import { switchMap, flatMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { AuthService } from '../auth/auth.service';
import { UbicacionesService } from '../servicios/ubicaciones.service';


@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(
    private clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
    private authService: AuthService,
    private servicioUbicaciones: UbicacionesService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;

  obtenerTareas() {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/misTareas`, {headers});
      })
    );
  }

  obtenerUbicacionesPorTarea(tipoTarea) {
    return this.obtenerTareas().pipe(
      map(tareas => {
        const tareasArr = [];
        for (const key in tareas) {
          tareasArr.push(tareas[key]);
        }
        return tareasArr;
      }),
      flatMap(tareasArr => {
        return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
          map(ubicaciones => {
            const ubicacionesArr = [];
            for (const key in ubicaciones) {
              ubicacionesArr.push(ubicaciones[key]);
            }
            return {tareasArr, ubicacionesArr};
          })
        );
      }),
      map(({tareasArr, ubicacionesArr}) => {
        let ubicacionesValidas = [];
        tareasArr.forEach(tarea => {
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
        console.log(data);
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
