import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, catchError, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GlobalsService } from '../services/globals.service';
import { OfflineService } from '../services/offline.service';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(
    private  clienteHttp: HttpClient,
    private almacenamiento: NativeStorage,
    private authService: AuthService,
    private variablesGlobales: GlobalsService,
    private servicioOffline: OfflineService,
    private servicioBDD: DatabaseService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  token: any;
  authSubject = new BehaviorSubject(false);
  private _ubicaciones = new BehaviorSubject([]);
  
  get ubicaciones() {
    return this._ubicaciones.asObservable();
  }

  setUbicaciones(ubicaciones) {
    this._ubicaciones.next(ubicaciones);
  }

  obtenerUbicaciones5() {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          console.log('por la buena ubicaciones');
          return this.authService.getHeaders().pipe(
            switchMap(headers => {
              return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones`, {headers});
            }),
          );
        }
        console.log('por la mala ubicaciones');
        return from(this.servicioBDD.cargarUbicaciones());
      })
      
    );
  }

  obtenerUbicacion(idUbicacion) {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones/${idUbicacion}`, {headers});
      }),
    );
  }

}
