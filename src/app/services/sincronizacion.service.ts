import { UbicacionesService } from './../servicios/ubicaciones.service';
import { DatabaseService } from './database.service';
import { TareasService } from './tareas.service';
import { Injectable } from '@angular/core';
import { map, flatMap, switchMap, tap, mergeMap } from 'rxjs/operators';
import { BienesService } from '../servicios/bienes.service';
import { forkJoin, from } from 'rxjs';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  constructor(
    private servicioTareas: TareasService,
    private servicioUbicaciones: UbicacionesService,
    private servicioBienes: BienesService,
    private db: DatabaseService,
  ) { }
  
  // el objetivo de este metodo es obtener data desde el servidor e insertarlos
  // en la base de datos local
  sincronizarApp() {
    // limpiar base de datos antes de sincronizar
    return this.db.vaciarBase().pipe(
      // coger los datos desde el servidor e insertar en la bdd
      tap(res => {
        console.log('base reseteada');
        // ubicaciones
        this.sincronizarUbicaciones().subscribe();
        // tareas
        this.sincronizarTareas().subscribe();
        // bienes
        this.sincronizarBienes().subscribe();
        // bajas
        // conteos
        // registros

      }),
    );
  }
   
  // insertar en la bdd local datos de las tareas desde el servidor
  sincronizarTareas() {
    // traer las tareas desde el servidor
    return this.servicioTareas.obtenerTareasAPI().pipe(
      flatMap(tareas => {
        // insertar en la base de datos local
        return this.db.insertarTareas(tareas);
      })
    );
  }

  // insertar en la bdd local datos de las ubicaciones desde el servidor
  sincronizarUbicaciones() {
    // traer ubicaciones desde servidor
    return this.servicioUbicaciones.obtenerUbicacionesAPI().pipe(
      flatMap(ubicaciones => {
        // insertar las ubicaciones en ls bdd local
        return this.db.insertarUbicaciones(ubicaciones);
      }),
    );
  }

  // se comprueba si existe bienes locales que aun no se han almacenado en el servidor
  // de ser asi se los envia, luego se iguala las 2 fuentes de datos
  sincronizarBienes() {
    return this.sincronizarBienesPendientes().pipe(
      switchMap(() => {
        return this.servicioBienes.obtenerBienesAPI();
      }),
      switchMap(bienes => {
        return this.db.insertarBienes(bienes, true);
      }),
    );
  }

  sincronizarBienesPendientes() {
    return from(this.db.cargarBienesPendientes()).pipe(
      mergeMap(bienesPend => {
        console.log('bienes pendientes');
        console.log(bienesPend);
        let requests = [];
        bienesPend.forEach(bp => {
          let bien = new Bien(bp.codigo, bp.clase, bp.nombre, bp.estado, bp.valor, bp.id_ubicacion, bp.observaciones, bp.codigoPadre, 'dummy_url_to_image');
          console.log('sincronizar bienes pendientes');
          console.log(bien);
          requests.push(this.servicioBienes.guardarBien(bien));
        });
        forkJoin(requests).subscribe(res => {
          console.log('resultado requests');
          console.log(res);
        });
        return bienesPend;
      }),
    );
  }

}
