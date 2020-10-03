import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UbicacionesService } from '../../../../servicios/ubicaciones.service';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from 'src/app/services/tareas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit {

  constructor(
    private servicioTareas: TareasService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.obtenerTareas();

    this.tareasIcompSubs = this.servicioTareas.tareasIncompletas.subscribe(ti => {
      this.obtenerTareas();
    });

  }

  private tipoTarea = 'BAJAS';
  public tareas: any = [];
  private tareasIcompSubs: Subscription;


  irAGestionDeBajas(tarea) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: 1,
        ubicacion: tarea.id_ubicacion,
        idAsignacion: tarea.id,
      }
    };
    this.router.navigate(['gestionar-bajas'], navigationExtras);
  }

  obtenerTareas() {
    return this.servicioTareas.obtenerTareasUsuario(this.tipoTarea).subscribe(tareas => {
      this.tareas = tareas;
    });
  }

  ngOnDestroy() {
    if (this.tareasIcompSubs) {
      this.tareasIcompSubs.unsubscribe();
    }
  }
}
