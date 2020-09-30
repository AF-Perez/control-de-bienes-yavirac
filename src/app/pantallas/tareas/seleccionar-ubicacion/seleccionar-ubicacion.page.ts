import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from './../../../services/tareas.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private servicioTareas: TareasService,
  ){
  }

  ubicaciones: any = [];
  tipoTarea = 'REGISTRO';
  private ubicacionesSub: Subscription;
  tareas: any = [];
  private tareasIcompSubs: Subscription;

  ngOnInit() {
    this.obtenerTareas();

    this.tareasIcompSubs = this.servicioTareas.tareasIncompletas.subscribe(ti => {
      this.tareas = ti.filter(tarea => {
        return tarea === this.tipoTarea;
      });
    });
  }

  irAGestionarBienes(tarea){
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
    if (this.ubicacionesSub) {
      this.ubicacionesSub.unsubscribe();
    }
    if (this.tareasIcompSubs) {
      this.tareasIcompSubs.unsubscribe();
    }
  }
}
