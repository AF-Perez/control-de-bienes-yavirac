import { UbicacionesService } from '../../../../servicios/ubicaciones.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from './../../../../services/tareas.service';

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

  // este metode se va a llamar una vez que se termine de cargar la pantalla
  ngOnInit() {
    this.obtenerUbicaciones();
  }

  irAConteoDeBienes(ubicacion){
    let navigationExtras: NavigationExtras = {
      state: {
        // aqui todo lo que se va a pasar a las sig pantalla
        user: 1,
        ubicacion: ubicacion,
        // ...
      }
    };
    this.router.navigate(['contar-bienes'], navigationExtras);
  }

  obtenerUbicaciones() {
    this.servicioTareas.obtenerUbicacionesPorTarea(this.tipoTarea).subscribe(ubicaciones => {
      this.ubicaciones = ubicaciones;
    });
  }

}
