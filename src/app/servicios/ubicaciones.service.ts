import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from  '@angular/common/http';
import { Observable, BehaviorSubject } from  'rxjs';
import { tap } from  'rxjs/operators';
import { map } from 'rxjs/operators';





@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(private  clienteHttp:  HttpClient) { }


  NOMBRE_SERVIDOR:  string  =  'http://localhost:8000';
  authSubject  =  new  BehaviorSubject(false);
  

  /*
  private ubicaciones: {id: number, nombre: string}[] = [
    { "id": 0, "nombre": "biblioteca"},
    { "id": 1, "nombre": "aula 1"},
    { "id": 2, "nombre": "aula 2"},
    { "id": 3, "nombre": "oficina 1"},
    { "id": 4, "nombre": "rectorado"},
  ];
  */

  private ubicaciones: any;

  // PENDIENTE coger desde api
  obtenerUbicaciones() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "*"
    });
  
    this.ubicaciones = this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/ubicaciones`, {headers, responseType: 'json'}).pipe(
      map(data => {
      //console.log(data.status);
      console.log(data); // data received by server
      console.log("dsflkjdskdkl"); // data received by server

      //console.log(data.headers);
      return data;
    },
    (error: any) => {
        console.log(error);
    }));
    return this.ubicaciones;
  }


}
