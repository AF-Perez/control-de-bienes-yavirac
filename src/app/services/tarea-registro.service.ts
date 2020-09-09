import { DatabaseService } from './database.service';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { Bien } from '../models/bien.model';
import { take, delay, tap, map, catchError } from 'rxjs/operators';
import { BienesService } from '../servicios/bienes.service';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from '../services/globals.service';
import { OfflineService } from '../services/offline.service';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Observable, from } from 'rxjs';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';


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
    private db: DatabaseService,
    private networkService: NetworkService,
    private storage: Storage,
  ) {}

  NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  guardarBienSub: Subscription;

  // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject 
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addBien, removeBien, etc)
  // - Create one BehaviorSubject per store entity, for example if you have TodoGroups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _bienes = new BehaviorSubject<Bien[]>([]);
  
  // Exponer la parte observable$ del subject _bienes
  readonly bienes$ = this._bienes.asObservable();

  // Este getter retornara el ultimo valor emitido en el subject _bienes
  get bienes(): Bien[] {
    return this._bienes.getValue();
  }

  // al asignar un valor a this.bienes se lo incluira en el obsrevable 
  // y se esparsira a todos sus subscriptores (ex: this.bienes = [])
  set bienes(val: Bien[]) {
    this._bienes.next(val);
  }


  agregarBien(
    codigo: string,
    tipo: string,
    nombre: string,
    estado: string,
    precio: number,
    idUbicacion: string,
    observaciones: string,
    codigoPadre: string,
    imgUrl: any,
  ) {
    const nuevoBien = new Bien(
      codigo,
      tipo,
      nombre,
      estado,
      precio,
      idUbicacion,
      observaciones,
      codigoPadre,
      imgUrl,
    );

    this.bienes = [
      ...this.bienes,
      nuevoBien,
    ];
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
          let bienesModific = [];
          bienes.forEach(bien => {
            bienesModific.push({...bien, id_ubicacion: bien.idUbicacion});
          });
          console.log(bienesModific);
          // guarda en el dispositivo
          this.db.insertarBienes(bienesModific, false);
          return this.bienes;
        }
      }),
      take(1),
      tap(res =>  {
          this._bienes.next([]);
      }),
    )
  }

  guardarBienes2(data): Observable<any> {
    console.log('mmmmm', data);
    let url = `${this.NOMBRE_SERVIDOR}/users/`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineService.storeRequest(url, 'POST', data));
    } else {
      return this.clienteHttp.put(url, data).pipe(
        catchError(err => {
          this.offlineService.storeRequest(url, 'POST', data);
          throw new Error(err);
        })
      );
    }
  }

  vaciarBienes() {
    this._bienes.next([]);
  }

  guardarDetallesTarea(detallesTarea) {
    return this.authService.getHeaders().pipe(
      take(1),
      switchMap(headers => {
        let data = JSON.stringify(detallesTarea);
        return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/asignacionTarea/${detallesTarea.id}/detalleTarea`, data, {headers});
      })
    );
  }

  removerBien(idBien) {
    this.bienes = this.bienes.filter(b => b.codigo !== idBien);
  }

  ngOnDestroy() {

  }
}
