import { UbicacionesService } from '../../../../servicios/ubicaciones.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from './../../../../services/tareas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit {

  constructor(
    private router: Router,
    private servicioTareas: TareasService,
    
  ){ }

  // todas estas variables estan accesibles en el html
  ubicaciones: any = [];
  tipoTarea = 'CONTEO';
  tareas: any = [];
  private tareasIcompSubs: Subscription;


  // este metode se va a llamar una vez que se termine de cargar la pantalla
  ngOnInit() {
    this.obtenerTareas();

    this.tareasIcompSubs = this.servicioTareas.tareasIncompletas.subscribe(ti => {
      this.obtenerTareas();
    });
  }

  irAConteoDeBienes(tarea){
    let navigationExtras: NavigationExtras = {
      state: {
        user: 1,
        ubicacion: tarea.id_ubicacion,
        idAsignacion: tarea.id,
      }
    };
    this.router.navigate(['contar-bienes'], navigationExtras);
  }

  obtenerTareas() {
    return this.servicioTareas.obtenerTareasUsuario(this.tipoTarea).subscribe(tareas => {
      this.tareas = tareas;
      console.log('tareas', this.tareas);
    });
  }

  ngOnDestroy() {
    if (this.tareasIcompSubs) {
      this.tareasIcompSubs.unsubscribe();
    }
  }

}
