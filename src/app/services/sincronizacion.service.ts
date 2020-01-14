import { UbicacionesService } from './../servicios/ubicaciones.service';
import { DatabaseService } from './database.service';
import { TareasService } from './tareas.service';
import { Injectable } from '@angular/core';
import { map, flatMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  constructor(
    private servicioTareas: TareasService,
    private servicioUbicaciones: UbicacionesService,
    private db: DatabaseService,
  ) { }

  sincronizarTareas() {
    // traer las tareas desde el servidor
    return this.servicioTareas.obtenerTareas().pipe(
      map(tareas => {
        const tareasArr = [];
        for (const key in tareas) {
          tareasArr.push(tareas[key]);
        }
        return tareasArr;
      }),
      // vaciar tabla tareas
      map(tareasArr => {
        this.db.vaciarTareas().then(res => console.log(res));
        return tareasArr;
      }),
      map(tareasArr => {
        // insertar en la base de datos local
        tareasArr.forEach(tarea => {
          this.db.agregarTarea(
            tarea.id_ubicacion,
            tarea.id_usuario,
            tarea.fecha_asignacion,
            tarea.fecha_asignacion,
            tarea.completada,
            tarea.tipo,
          );
        });
        return tareasArr;
      })
    );
  }

  sincronizarApp() {
    // traer las tareas desde el servidor
    return this.servicioTareas.obtenerTareas().pipe(
      map(tareas => {
        const tareasArr = [];
        for (const key in tareas) {
          tareasArr.push(tareas[key]);
        }
        return tareasArr;
      }),
      // vaciar tabla tareas
      map(tareasArr => {
        this.db.vaciarTareas().then(res => console.log(res));
        return tareasArr;
      }),
      map(tareasArr => {
        // insertar en la base de datos local
        tareasArr.forEach(tarea => {
          this.db.agregarTarea(
            tarea.id_ubicacion,
            tarea.id_usuario,
            tarea.fecha_asignacion,
            tarea.fecha_asignacion,
            tarea.completada,
            tarea.tipo,
          );
        });
        return tareasArr;
      })
    );
  }

  sincronizarUbicaciones() {
    // revisar si es prudente la insercion en la tabla

    // traer ubicaciones desde servidor
    return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
      flatMap(ubicaciones => {
        // insertar las ubicaciones en ls bdd local
        return this.db.insertarUbicaciones(ubicaciones);
      }),
    );
  }

  obtenerUbicacionesPorTarea(tipoTarea) {
    return this.servicioTareas.obtenerTareas().pipe(
      map(tareas => {
        const tareasArr = [];
        for (const key in tareas) {
          tareasArr.push(tareas[key]);
        }
        return tareasArr;
      }),
      flatMap(tareasArr => {
        return this.servicioUbicaciones.obtenerUbicaciones5().pipe(
          map(ubicaciones => {
            const ubicacionesArr = [];
            for (const key in ubicaciones) {
              ubicacionesArr.push(ubicaciones[key]);
            }
            return {tareasArr, ubicacionesArr};
          })
        );
      }),
      map(({tareasArr, ubicacionesArr}) => {
        let ubicacionesValidas = [];
        tareasArr.forEach(tarea => {
          ubicacionesArr.forEach(ubicacion => {
            if (ubicacion.id === tarea.id_ubicacion && tarea.tipo === tipoTarea && tarea.completada === 0) {
              ubicacionesValidas.push(ubicacion);
            }
          })
        });
        return ubicacionesValidas;
      }),
    );
  }
  
}
