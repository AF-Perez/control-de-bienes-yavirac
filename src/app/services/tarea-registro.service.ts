import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { Bien } from '../models/bien.model';
import { take, delay, tap, map } from 'rxjs/operators';
import { BienesService } from '../servicios/bienes.service';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { OfflineService } from '../services/offline.service';

@Injectable({
  providedIn: 'root'
})
export class TareaRegistroService implements OnDestroy {

  constructor(
    private servicioBienes: BienesService,
    private authService: AuthService,
    private clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
    private offlineService: OfflineService,
  ) {}

  private _bienes = new BehaviorSubject<Bien[]>([]);
  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  guardarBienSub: Subscription;

  // usar esta variable mara mantener una referencia glbal a los bienes en memoria
  get bienes() {
    return this._bienes.asObservable();
  }

  agregarBien(
    codigo: string,
    tipo: string,
    nombre: string,
    estado: string,
    precio: number,
    idUbicacion: string,
    observaciones: string,
  ) {
    const nuevoBien = new Bien(
      codigo,
      tipo,
      nombre,
      estado,
      precio,
      idUbicacion,
      observaciones,
    );
    return this.bienes.pipe(
      delay(500),
      tap(bienes => {
        this._bienes.next(bienes.concat(nuevoBien));
      })
    );
  }

  // recibe un array con elementos de tipo Bien
  // guarda en el servidor los elementos del array
  guardarBienes(bienes: Bien[]) {
    return this.offlineService.tieneConexion.pipe(
      take(1),
      switchMap(online => {
        if (online) {
          let requests = [];
          bienes.forEach(bien => {
            requests.push(this.servicioBienes.guardarBien(bien));
          });
          forkJoin(requests).subscribe(res => {
            console.log(res);
          });
          return this.bienes;
        }
        else  {
          // guarda en el dispositivo
          this.servicioBienes.guardarBienEnDispositivo(bienes[0]);
          return this.bienes;
        }
      }),
      take(1),
      tap(res =>  {
        console.log("bienesnexts");
          this._bienes.next([]);
      }),
    )
  }

  vaciarBienes() {
    this._bienes.next([]);
  }

  guardarDetallesTarea(detallesTarea) {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        let data = JSON.stringify(detallesTarea);
        console.log(data);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/asignacionTarea/${detallesTarea.id}/detalleTarea`, data, {headers});
      })
    );
  }

  ngOnDestroy() {

  }

  removerBien(idBien) {
    return this.bienes.pipe(
      take(1),
      tap(bienes => {
      this._bienes.next(bienes.filter(b => b.codigo !== idBien));
    }));
  }

}
