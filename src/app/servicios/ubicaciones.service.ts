import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from  '@angular/common/http';
import { Observable, BehaviorSubject } from  'rxjs';
import { tap, catchError } from  'rxjs/operators';
import { map } from 'rxjs/operators';
import { Storage } from  '@ionic/storage';
import { AuthService } from  '../auth/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Institution } from '../models/institutions';


@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(
    private  clienteHttp:  HttpClient,
    private almacenamiento: Storage,
    private authService: AuthService,
  ) { }

  token:any;

  NOMBRE_SERVIDOR:  string  =  'http://localhost:8000';
  authSubject  =  new  BehaviorSubject(false);


  
  ubicaciones : any = [];

  

  // PENDIENTE coger desde api
  obtenerUbicaciones1(){

    
    return this.almacenamiento.get("ACCESS_TOKEN")
    .then(val => {
      return val.access_token;
    })
    .then(token => {
      const headers = new HttpHeaders({
        Authorization: "Bearer " + token,
        Accept: "application/json"
      });
      return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones`, {headers});
    });

  }

  obtenerUbicaciones(): Observable<Institution[]> {
    return this.clienteHttp.get<Institution[]>(`${this.NOMBRE_SERVIDOR}/api/ubicaciones`)
      .pipe(
        tap(_ => console.log('fetched books')),
        // catchError(this.handleError('getBooks', []))
      );
  }

  sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }
}
