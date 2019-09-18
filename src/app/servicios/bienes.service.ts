import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';




@Injectable({
  providedIn: 'root'
})
export class BienesService {

  constructor(

    private authService: AuthService,
    private  clienteHttp: HttpClient,

    
  ) { }

  NOMBRE_SERVIDOR = 'http://localhost:8000';
  authSubject = new  BehaviorSubject(false);
  bienes: any = [];

  // PENDIENTE coger desde api
  
  traerBienesDeUbicacion(idUbicacion) {
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
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones/${idUbicacion}/bienes`, {headers});
      }),
      tap(token => {
        console.warn(token);
      })
    );
  }

}
