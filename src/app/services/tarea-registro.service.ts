import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bien } from '../models/bien.model';
import { take, delay, tap } from 'rxjs/operators';
import { BienesService } from '../servicios/bienes.service';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';

@Injectable({
  providedIn: 'root'
})
export class TareaRegistroService {

  constructor(
    private servicioBienes: BienesService,
    private authService: AuthService,
    private clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
  ) { }

  private _bienes = new BehaviorSubject<Bien[]>([]);
  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;

  get bienes() {
    return this._bienes.asObservable();
  }

  agregarBien(
    codigo: string,
    tipo: string,
    nombre: string,
    estado: string,
    precio: number,
    custodio: string,
    idUbicacion: string,
    observaciones: string,
  ) {
    const nuevoBien = new Bien(
      codigo,
      tipo,
      nombre,
      estado,
      precio,
      custodio,
      idUbicacion,
      observaciones,
    );
    return this.bienes.pipe(
      take(1),
      delay(500),
      tap(bienes => {
        this._bienes.next(bienes.concat(nuevoBien));
      })
    );
  }

  // recibe un array con elementos de tipo Bien
  // guarda en el servidor los elementos del array
  guardarBienes(bienes: Bien[]) {
    bienes.forEach(element => {
      this.servicioBienes.guardarBien(element).subscribe(resp => {
        console.log(resp);
      });
    });
    return this.bienes;
  }

  guardarDetallesTarea(detallesTarea) {
    return this.authService.getHeaders().pipe(
      switchMap(headers => {
        let data = JSON.stringify(detallesTarea);
        console.log(data);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/asignacionTarea/${detallesTarea.id}/detalleTarea`, data, {headers});
      })
    );
  }

}
