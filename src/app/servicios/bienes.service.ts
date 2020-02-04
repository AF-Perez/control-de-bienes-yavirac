import { DatabaseService } from './../services/database.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { Bien } from '../models/bien.model';
import { OfflineService } from '../services/offline.service';

@Injectable({
  providedIn: 'root'
})
export class BienesService {

  constructor(
    private db: DatabaseService,
    private authService: AuthService,
    private clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
    private servicioOffline: OfflineService,
    private servicioBDD: DatabaseService,
  ) { }

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  authSubject = new BehaviorSubject(false);
  bienes: any = [];
  idUbicacion = null;

  traerBienesDeUbicacion(idUbicacion) {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          return this.authService.getHeaders().pipe(
            take(1),
            switchMap(headers => {
              return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/ubicaciones/${idUbicacion}/bienes`, {headers});
            }),
          );
        }
        return from(this.servicioBDD.cargarBienesPorUbicacion(idUbicacion));
      })
    );
    
  }

  // guardar un bien en el servidor
  guardarBien(datosBien: Bien) {
    return this.authService.getHeaders().pipe(
      take(1),
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

  // guardar un bien en el dispositivo
  guardarBienEnDispositivo(datosBien: Bien) {
    return this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.addBien(
          datosBien.codigo,
          datosBien.nombre,
          datosBien.tipo,
          datosBien.idUbicacion,
          datosBien.precio,
          datosBien.observaciones,
        ).then((res) => {
          this.db.cargarBienes();
        });
      }
    });
  }

  traerBienes() {
    return this.servicioOffline.tieneConexion.pipe(
      switchMap(tieneConx => {
        if (tieneConx) {
          return this.authService.getHeaders().pipe(
            take(1),
            switchMap(headers => {
              return this.clienteHttp.get(`${this.NOMBRE_SERVIDOR}/api/bienes`, {headers});
            })
          );
        }
        return from(this.servicioBDD.cargarTareas());
      })
    );
  }

  obtenerBienesAPI() {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/bienes`, {headers});
      })
    );
  }

  obtenerBienesPendientes() {
    return from(this.db.cargarBienes().then(bienes => {
      return bienes.filter(bien => {
        bien.sincronizado === false;
      });
    }));
  }
}
