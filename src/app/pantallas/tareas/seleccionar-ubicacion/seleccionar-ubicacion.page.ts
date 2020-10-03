import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from './../../../services/tareas.service';
import { forkJoin, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { UbicacionesService } from 'src/app/servicios/ubicaciones.service';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private servicioTareas: TareasService,
    private servicioUbicaciones: UbicacionesService,
  ) {
  }

  ubicacion: any;
  tipoTarea = 'REGISTRO';
  private ubicacionSub: Subscription;
  tareas: any = [];
  private tareasIcompSubs: Subscription;

  ngOnInit() {
    this.obtenerTareas();

    this.tareasIcompSubs = this.servicioTareas.tareasIncompletas.subscribe(ti => {
      // console.log(ti);
      // this.tareas = ti;
      this.obtenerTareas();
    });

    // this.ubicacionSub = this.servicioUbicaciones.ubicaciones.subscribe(ub => {

    // });

    
  }

  irAGestionarBienes(tarea) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: 1,
        idUbicacion: tarea.id_ubicacion,
        idAsignacion: tarea.id,
      }
    };
    this.router.navigate(['gestionar-bien'], navigationExtras);
  }

  obtenerTareas() {
    return this.servicioTareas.obtenerTareasUsuario(this.tipoTarea).subscribe(tareas => {
      this.tareas = tareas;
    });
  }

  ngOnDestroy() {
    if (this.ubicacionSub) {
      this.ubicacionSub.unsubscribe();
    }
    if (this.tareasIcompSubs) {
      this.tareasIcompSubs.unsubscribe();
    }
  }
}
