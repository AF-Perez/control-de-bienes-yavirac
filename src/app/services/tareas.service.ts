import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, catchError, take, switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(
    private  clienteHttp: HttpClient,
    private almacenamiento: NativeStorage,
    private authService: AuthService,
    private variablesGlobales: GlobalsService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;

  getTareas() {
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
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/misTareas`, {headers});
      }),
      tap(token => {
        // console.warn(token);
      })
    );
  }
}
