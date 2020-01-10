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

}
