import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class BienesService {

  constructor(

    private authService: AuthService,
    private clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  authSubject = new BehaviorSubject(false);
  bienes: any = [];
  idUbicacion = null;


  traerBienesDeUbicacion(idUbicacion) {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones/${idUbicacion}/bienes`, {headers});
      }),
    );
  }

  // guardar un bien en el servidor
  guardarBien(datosBien: Bien) {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        let postDataBien = {
          'nombre': datosBien.nombre,
          'clase': "CONTROL ADMINISTRATIVO",
          'observaciones': datosBien.observaciones,
          'valor_unitario': datosBien.precio,
          'id_ubicacion': datosBien.idUbicacion,
          'codigo': datosBien.codigo,
          'tipo_de_bien': datosBien.tipo,
        }
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/bienes`, postDataBien, {headers});
      }),
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
