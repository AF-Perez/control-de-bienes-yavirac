import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, catchError, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GlobalsService } from '../services/globals.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(
    private  clienteHttp: HttpClient,
    private almacenamiento: NativeStorage,
    private authService: AuthService,
    private variablesGlobales: GlobalsService,
  ) { }

  token: any;

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  authSubject = new  BehaviorSubject(false);
  ubicaciones: any = [];

  obtenerUbicaciones5() {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones`, {headers});
      }),
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
