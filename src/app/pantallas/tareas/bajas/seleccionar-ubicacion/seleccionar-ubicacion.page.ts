import { Component, OnInit } from '@angular/core';
import { UbicacionesService } from '../../../../servicios/ubicaciones.service';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit {

  constructor(
    private servicioUbicaciones: UbicacionesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.obtenerUbicaciones();
  }

  // todas estas variables estan accesibles en el html
  ubicaciones: any = [];

  irAGestionDeBajas(ubicacion){
    let navigationExtras: NavigationExtras = {
      state: {
        // aqui todo lo que se va a pasar a las sig pantalla
        user: 1,
        ubicacion: ubicacion,
        // ...
      }
    };
    this.router.navigate(['gestionar-bajas'], navigationExtras);
  }

  obtenerUbicaciones() {
    this.servicioUbicaciones.obtenerUbicaciones5()
      .subscribe(ubicaciones => {
        console.log(ubicaciones);
        this.ubicaciones = ubicaciones;
      });
  }

}
