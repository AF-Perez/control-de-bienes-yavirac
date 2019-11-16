import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bien } from '../models/bien.model';
import { take, delay, tap } from 'rxjs/operators';
import { BienesService } from '../servicios/bienes.service';

@Injectable({
  providedIn: 'root'
})
export class TareaRegistroService {

  constructor(
    private servicioBienes: BienesService,
  ) { }

  private _bienes = new BehaviorSubject<Bien[]>([]);

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

  guardarBienes(bienes: Bien[]) {
    bienes.forEach(element => {
      this.servicioBienes.guardarBien(element).subscribe(resp => {
        console.log(resp);
      });
    });
    return this.bienes;
  }

}
