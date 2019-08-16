import { UbicacionesService } from './../../../servicios/ubicaciones.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit {

  constructor(
    private servicioUbicaciones: UbicacionesService,

  ){
  }

  ubicaciones: any[];

  // este metode se va a llamar una vez que se termine de cargar la pantalla
  ngOnInit() {

    // ejecutar el metodo del servicio que trae las ubicaciones
      this.servicioUbicaciones.obtenerUbicaciones();
    // y guardarle en una variable ubicaciones
      this.ubicaciones = this.servicioUbicaciones.obtenerUbicaciones();
     
  }

}
