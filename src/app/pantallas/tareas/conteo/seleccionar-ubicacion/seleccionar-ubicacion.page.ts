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
    private servicioUbicaciones: UbicacionesService,
    private router: Router,
    private servicioTareas: TareasService,
    
  ){
  }

  // todas estas variables estan accesibles en el html
  ubicaciones: any = [];
  tipoTarea = 'CONTEO';
  private ubicacionesSub: Subscription;
  tareas: any = [];

  // este metode se va a llamar una vez que se termine de cargar la pantalla
  ngOnInit() {
    this.obtenerUbicaciones();
    this.obtenerTareas();
  }

  irAConteoDeBienes(tarea){
    let navigationExtras: NavigationExtras = {
      state: {
        // aqui todo lo que se va a pasar a las sig pantalla
        user: 1,
        ubicacion: tarea.id_ubicacion,
        idAsignacion: tarea.id,
      }
    };
    this.router.navigate(['contar-bienes'], navigationExtras);
  }

  obtenerUbicaciones() {
    this.servicioTareas.obtenerUbicacionesPorTarea(this.tipoTarea).subscribe(ubicaciones => {
      this.ubicaciones = ubicaciones;
    });
  }

  obtenerTareas() {
    return this.servicioTareas.obtenerTareasUsuario(this.tipoTarea).subscribe(tareas => {
      this.tareas = tareas;
      console.log('tareas', this.tareas);
    });
  }

}
