import { Injectable } from '@angular/core';
import { switchMap, flatMap, map, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { AuthService } from '../auth/auth.service';
import { UbicacionesService } from '../servicios/ubicaciones.service';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { OfflineService } from './offline.service';
import { DatabaseService } from './database.service';
import { Baja } from '../models/baja.model';
import { ConnectionStatus, NetworkService } from './network.service';
import { Conteo } from '../models/conteo.model';


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
    private networkService: NetworkService,
    private offlineService: OfflineService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  private _tareas = new BehaviorSubject([]);
  private _tareasIncompletas = new BehaviorSubject([]);
  private _bajasTarea = new BehaviorSubject<Baja[]>([]);
  private _conteosTarea = new BehaviorSubject<Conteo[]>([]);

  get tareas() {
    return this._tareas.asObservable();
  }

  get tareasIncompletas() {
    return this._tareasIncompletas.asObservable();
  }

  get bajasTarea() {
    return this._bajasTarea.asObservable();
  }

  get conteosTarea() {
    return this._conteosTarea.asObservable();
  }

  obtenerTareas() {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          return this.authService.getHeaders().pipe(
            take(1),
            switchMap(headers => {
              return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, { headers });
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
              return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, { headers });
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
        return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/misTareas`, { headers });
      })
    );
  }

  obtenerUbicacionesPorTarea(tipoTarea) {
    return this.obtenerTareas().pipe(
      switchMap(tareas => {
        return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
          map(ubicaciones => {
            return { tareas, ubicaciones };
          })
        );
      }),
      map(({ tareas, ubicaciones }) => {
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

  obtenerTareasUsuario(tipoTarea) {
    return this.tareasIncompletas.pipe(
      switchMap(tareas => {
        return this.servicioUbicaciones.ubicaciones.pipe(
          map(ubicaciones => {
            return { tareas, ubicaciones };
          })
        );
      }),
      map(({ tareas, ubicaciones }) => {
        let tareasConUbicaciones = [];
        tareas.forEach(tarea => {
          ubicaciones.forEach(ubicacion => {
            if (ubicacion.id === tarea.id_ubicacion && tarea.tipo === tipoTarea && tarea.completada === 0) {
              tarea.ubicacionNombre = ubicacion.nombre;
              tareasConUbicaciones.push(tarea);
            }
          })
        });
        return tareasConUbicaciones;
      }),
    );
  }

  obtenerTareasIncompletas() {
    return this.obtenerTareas().pipe(
      map(tareas => {
        let tareasIncompletas = tareas.filter(tarea => {
          return tarea.completada === 0;
        });
        return tareasIncompletas;
      }),
    );
  }

  cargarTareasIncompletas() {
    return this.obtenerTareas().pipe(
      tap(tareas => {
        let tareasIncompletas = tareas.filter(tarea => {
          return tarea.completada === 0;
        });
        this._tareasIncompletas.next(tareasIncompletas);
      }),
    );
  }

  ingresarConteos(conteos, idTarea) {
    const url = `${this.NOMBRE_SERVIDOR}/api/evaluarConteo`;
    const data = {
      conteos: conteos,
      id_asignacion_tarea: idTarea,
    };
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineService.storeRequest(url, 'POST', data));
    } else {
      return this.authService.getHeaders().pipe(
        take(1),
        switchMap(headers => {
          return this.clienteHttp.post(url, data, {headers});
        })
      );
    }
  }

  solicitarBajaBien(idBien, observaciones) {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        let data = { observaciones: observaciones };
        //JSON.stringify(data);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/bienes/${idBien}/solicitarBaja`, data, { headers });
      }),
    );
  }

  submitBaja(codigoBien, idTarea, motivo, imagen): Observable<any> {

    let url = `${this.NOMBRE_SERVIDOR}/api/dar_baja_bien/`;
    const formData = new FormData();
    formData.append('codigo_bien', codigoBien);
    formData.append('id_asignacion_tarea', idTarea);
    formData.append('motivo', motivo);
    formData.append('imagen', imagen.blob, imagen.name);
    console.log(':(', formData);

    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineService.storeRequest(url, 'POST', formData));
    } else {
      return this.authService.getHeaders().pipe(
        take(1),
        switchMap(headers => {
          console.log(':(', formData);
          return this.clienteHttp.post(url, formData, { headers });
        }),
      );
    }
  }

  agregarBaja(baja: Baja) {
    let bajas = [...this._bajasTarea.getValue(), baja]
    this._bajasTarea.next(bajas);
  }

  removerBaja(codigoBien) {
    let bajas = this._bajasTarea.getValue().filter(t => t.codigoBien !== codigoBien);
    this._bajasTarea.next(bajas);
  }

  agregarConteo(conteo: Conteo) {
    let conteos = [...this._conteosTarea.getValue(), conteo]
    this._conteosTarea.next(conteos);
  }

  removerConteo(codigoBien) {
    let conteos = this._conteosTarea.getValue().filter(t => t.codigoBien !== codigoBien);
    this._conteosTarea.next(conteos);
  }

  vaciarConteos() {
    this._conteosTarea.next([]);
  }

  completarTarea(idTarea) {
    let url = `${this.NOMBRE_SERVIDOR}/api/completarTarea/${idTarea}`;

    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineService.storeRequest(url, 'POST', []));
    } else {
      return this.authService.getHeaders().pipe(
        take(1),
        switchMap((headers) => {
          return this.clienteHttp.post(url, [], { headers });
        }),
      );
    }
  }

  removerTarea(idTarea) {
    let tareasIncompletas = this._tareasIncompletas.getValue().filter(t => t.id !== idTarea);
    this._tareasIncompletas.next(tareasIncompletas);
  }

}
