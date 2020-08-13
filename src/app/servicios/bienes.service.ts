import { DatabaseService } from './../services/database.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { tap, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { Bien } from '../models/bien.model';
import { OfflineService } from '../services/offline.service';
import { FilesService } from '../services/files.service';

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
    private filesService: FilesService,
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
              return this.clienteHttp.get<[]>(`${this.NOMBRE_SERVIDOR}/api/ubicaciones/${idUbicacion}/bienes`, {headers});
            }),
          );
        }
        return from(this.servicioBDD.cargarBienesPorUbicacion(idUbicacion));
      })
    );
    
  }

  // guardar un bien en el servidor
  guardarBien(bien: Bien) {


    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        const formData = new FormData();
        formData.append('nombre', bien.nombre);
        formData.append('clase', "CONTROL ADMINISTRATIVO");
        formData.append('observaciones', bien.observaciones);
        formData.append('valor_unitario', bien.precio.toString());
        formData.append('id_ubicacion', bien.idUbicacion);
        formData.append('codigo', bien.codigo);
        formData.append('id_padre', bien.codigoPadre);
        formData.append('imagen_bien', bien.imagenBien.blob, bien.imagenBien.name);

        // let postDataBien = {
        //   'nombre': datosBien.nombre,
        //   'clase': "CONTROL ADMINISTRATIVO",
        //   'observaciones': datosBien.observaciones,
        //   'valor_unitario': datosBien.precio,
        //   'id_ubicacion': datosBien.idUbicacion,
        //   'codigo': datosBien.codigo,
        //   'tipo_de_bien': datosBien.tipo,
        // }
        console.log(bien);
        // estudiar switch map porque por eso retorno correctamente, asi que es crucial entender
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/bienes`, formData, {headers});
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
        bien.sincronizado == 0;
      });
    }));
  }
}
