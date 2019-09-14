import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, catchError, take, switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthService } from '../auth/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(
    private  clienteHttp: HttpClient,
    private almacenamiento: NativeStorage,
    private authService: AuthService,
  ) { }

  token: any;

  NOMBRE_SERVIDOR = 'http://localhost:8000';
  authSubject = new  BehaviorSubject(false);
  ubicaciones: any = [];

  obtenerUbicaciones() {
    return this.authService.token.pipe(
      switchMap(token => {
        if (token) {
          console.log('el token :v');
        } else {
          throw new Error('No user id found!');
        }

        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + token,
          Accept: 'application/json'
        });
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones`, {headers});
      }),
      tap(token => {
        console.warn(token);
      })
    );
  }

  obtenerUbicaciones5() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      switchMap(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          token: string,
          tokenExpirationDate: string,
          userId: string
        };

        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + parsedData.token,
          Accept: 'application/json'
        });
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones`, {headers});
      }),
      tap(token => {
        console.warn(token);
      })
    );
  }

}
