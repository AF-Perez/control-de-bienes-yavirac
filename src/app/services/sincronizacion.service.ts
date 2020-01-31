import { UbicacionesService } from './../servicios/ubicaciones.service';
import { DatabaseService } from './database.service';
import { TareasService } from './tareas.service';
import { Injectable } from '@angular/core';
import { map, flatMap, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  constructor(
    private servicioTareas: TareasService,
    private servicioUbicaciones: UbicacionesService,
    private db: DatabaseService,
  ) { }
  
  sincronizarApp() {
    // limpiar base de datos antes de sincronizar
    return this.db.vaciarBase().pipe(
      // coger los datos desde el servidor e insertar en la bdd
      tap(res => {
        this.sincronizarUbicaciones().subscribe();
        this.sincronizarTareas().subscribe();
      }),
    );
  }
    
  sincronizarTareas() {
    // traer las tareas desde el servidor
    return this.servicioTareas.obtenerTareas().pipe(
      map(tareas => {
        // insertar en la base de datos local
        tareas.forEach(tarea => {
          this.db.agregarTarea(
            tarea.id_ubicacion,
            tarea.id_usuario,
            tarea.fecha_asignacion,
            tarea.fecha_asignacion,
            tarea.completada,
            tarea.tipo,
            tarea.observaciones,
          );
        });
        return tareas;
      })
    );
  }

  sincronizarUbicaciones() {
    // traer ubicaciones desde servidor
    return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
      flatMap(ubicaciones => {
        // insertar las ubicaciones en ls bdd local
        return this.db.insertarUbicaciones(ubicaciones);
      }),
    );
  }

}
