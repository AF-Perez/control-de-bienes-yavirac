import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalsService } from '../services/globals.service';

@Injectable({
  providedIn: 'root'
})
export class BienesService {

  constructor(

    private authService: AuthService,
    private clienteHttp: HttpClient,
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private variablesGlobales: GlobalsService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  authSubject = new BehaviorSubject(false);
  bienes: any = [];
  idUbicacion = null;


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
        // console.warn(token);
      })
    );
  }

  // guardar un bien en el servidor
  guardarBien(datosBien) {
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
        let postDataBien = {
          'nombre': datosBien.nombre,
          'clase': "CONTROL ADMINISTRATIVO",
          'observaciones': datosBien.observaciones,
          'valor_unitario': datosBien.precio,
          'id_ubicacion': datosBien.idUbicacion,
          'codigo': datosBien.codigo,
          'tipo_de_bien': datosBien.tiposDeBien,
        }


        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/bienes`, postDataBien, {headers});
      }),
      tap(token => {
        console.warn(token);
      })
    );
  }

  traerBienes() {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/bienes`, {headers});
      }),
      tap(token => {
        // console.warn(token);
      })
    );
  }



}
